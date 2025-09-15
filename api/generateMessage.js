export default async function handler(req, res) {
  const fetch = (await import('node-fetch')).default;
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { context } = req.body;

  if (!context) {
    return res.status(400).json({ error: 'No context provided' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant writing professional LinkedIn connection messages.' },
          { role: 'user', content: `Write a LinkedIn message based on the following context: ${context}` }
        ],
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      res.status(200).json({ message: data.choices[0].message.content });
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error calling OpenAI API' });
  }
}
