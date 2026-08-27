export default async function handler(req, res) {
  // 1. Ensure method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are supported by /api/groq endpoint.',
    });
  }

  // 2. Read server-side environment variable (GROQ_API_KEY)
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return res.status(500).json({
      error: 'Server Configuration Error',
      message: 'GROQ_API_KEY environment variable is missing on the server.',
    });
  }

  try {
    // 3. Extract parameters from incoming request body
    const body = req.body || {};
    const { model, messages, temperature, max_tokens } = typeof body === 'string' ? JSON.parse(body) : body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing or invalid "messages" array in request body.',
      });
    }

    // 4. Forward payload to Groq API securely from server-side
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'llama-3.1-8b-instant',
        messages,
        temperature: temperature ?? 0.6,
        max_tokens: max_tokens ?? 250,
      }),
    });

    const data = await groqResponse.json();

    if (!groqResponse.ok) {
      return res.status(groqResponse.status).json({
        error: 'Groq API Error',
        details: data,
      });
    }

    // 5. Return Groq response to client
    return res.status(200).json(data);
  } catch (error) {
    console.error('Vercel Serverless Function Error (/api/groq):', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to communicate with Groq API.',
    });
  }
}
