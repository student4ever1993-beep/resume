// Text-to-Speech endpoint used by the 3D avatar.
// POST { text: string, lang?: 'en' | 'ar' }  →  binary audio (audio/wav or audio/mpeg)
//
// The provider is selected with TTS_PROVIDER (gemini | groq | openai). Each provider is a
// small function below; to add another one, write a function with the same signature and
// register it in `providers`.
//
// On any failure the endpoint returns JSON with a non-2xx status and the client falls back
// to the browser's built-in speechSynthesis voice, so the avatar still talks.

const MAX_CHARS = 1000;

// Wrap raw 16-bit PCM in a WAV container so browsers can decode it with decodeAudioData.
function pcmToWav(pcm, sampleRate, channels = 1, bitsPerSample = 16) {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

async function geminiTTS(text, lang) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw Object.assign(new Error('GEMINI_API_KEY is not configured.'), { status: 503 });

  const model = process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts';
  const voice = process.env.TTS_VOICE || 'Kore';
  const style = lang === 'ar' ? 'بصوت ودود ودافئ واحترافي' : 'in a warm, friendly, professional tone';

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey.trim() },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Say ${style}: ${text}` }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw Object.assign(new Error(data?.error?.message || 'Gemini TTS request failed.'), { status: response.status });
  }

  const inline = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData;
  if (!inline?.data) throw Object.assign(new Error('Gemini TTS returned no audio.'), { status: 502 });

  // mimeType looks like "audio/L16;codec=pcm;rate=24000"
  const rate = Number(/rate=(\d+)/.exec(inline.mimeType || '')?.[1]) || 24000;
  return { audio: pcmToWav(Buffer.from(inline.data, 'base64'), rate), contentType: 'audio/wav' };
}

// Groq Orpheus voices. The org admin must accept the model terms once in the Groq console.
async function groqTTS(text, lang) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw Object.assign(new Error('GROQ_API_KEY is not configured.'), { status: 503 });

  const isArabic = lang === 'ar';
  const response = await fetch('https://api.groq.com/openai/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey.trim()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: isArabic ? 'canopylabs/orpheus-arabic-saudi' : 'canopylabs/orpheus-v1-english',
      voice: process.env.TTS_VOICE || (isArabic ? 'fahad' : 'hannah'),
      input: text,
      response_format: 'wav',
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw Object.assign(new Error(err?.error?.message || 'Groq TTS request failed.'), { status: response.status });
  }
  return { audio: Buffer.from(await response.arrayBuffer()), contentType: 'audio/wav' };
}

async function openaiTTS(text) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw Object.assign(new Error('OPENAI_API_KEY is not configured.'), { status: 503 });

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey.trim()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts',
      voice: process.env.TTS_VOICE || 'alloy',
      input: text,
      response_format: 'mp3',
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw Object.assign(new Error(err?.error?.message || 'OpenAI TTS request failed.'), { status: response.status });
  }
  return { audio: Buffer.from(await response.arrayBuffer()), contentType: 'audio/mpeg' };
}

const providers = { gemini: geminiTTS, groq: groqTTS, openai: openaiTTS };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed', message: 'Only POST requests are supported by /api/tts.' });
  }

  const providerName = (process.env.TTS_PROVIDER || 'gemini').toLowerCase();
  const provider = providers[providerName];
  if (!provider) {
    return res.status(500).json({ error: 'Server Configuration Error', message: `Unknown TTS_PROVIDER "${providerName}".` });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const text = typeof body.text === 'string' ? body.text.trim().slice(0, MAX_CHARS) : '';
    const lang = body.lang === 'ar' ? 'ar' : 'en';

    if (!text) {
      return res.status(400).json({ error: 'Bad Request', message: 'Missing "text" in request body.' });
    }

    const { audio, contentType } = await provider(text, lang);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(audio);
  } catch (error) {
    console.error(`TTS Error (/api/tts, provider=${providerName}):`, error.message);
    return res.status(error.status && error.status >= 400 ? error.status : 500).json({
      error: 'TTS Error',
      message: error.message || 'Failed to synthesize speech.',
    });
  }
}
