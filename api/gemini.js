export default async function handler(req, res) {
  // 1. Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are supported by /api/gemini endpoint.',
    });
  }

  // 2. Read server-side secret key (GEMINI_API_KEY)
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return res.status(500).json({
      error: 'Server Configuration Error',
      message: 'GEMINI_API_KEY environment variable is missing on the server.',
    });
  }

  try {
    const body = req.body || {};
    const { messages, model = 'gemini-2.0-flash' } = typeof body === 'string' ? JSON.parse(body) : body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing or invalid "messages" array in request body.',
      });
    }

    // 3. Separate system instructions and contents for Gemini API
    let systemText = '';
    const contents = [];

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemText += (systemText ? '\n' : '') + msg.content;
      } else {
        contents.push({
          role: msg.role === 'assistant' || msg.role === 'bot' || msg.sender === 'bot' ? 'model' : 'user',
          parts: [{ text: msg.content || msg.text || '' }],
        });
      }
    }

    const payload = {
      contents,
    };

    if (systemText) {
      payload.systemInstruction = {
        parts: [{ text: systemText }],
      };
    }

    // 4. Call Google Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Gemini API Error',
        details: data,
      });
    }

    // 5. Extract text reply from candidate
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      return res.status(500).json({
        error: 'Gemini API Response Error',
        message: 'No text generated in Gemini response candidate.',
      });
    }

    return res.status(200).json({
      choices: [
        {
          message: {
            role: 'assistant',
            content: replyText,
          },
        },
      ],
    });
  } catch (error) {
    console.error('Vercel Serverless Function Error (/api/gemini):', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to communicate with Gemini API.',
    });
  }
}
