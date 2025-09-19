module.exports = async function handler(req, res) {
  // Handle CORS preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { context } = req.body;

  if (!context) {
    return res.status(400).json({ error: 'No context provided' });
  }

  try {
    // Generate LinkedIn Connection Message
    const messageResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant writing professional LinkedIn connection messages.' },
          { role: 'user', content: `Write a LinkedIn message based on the following context: ${context}` },
        ],
        max_tokens: 150,
      }),
    });

    const messageData = await messageResponse.json();

    if (!messageResponse.ok) {
      return res.status(messageResponse.status).json(messageData);
    }

    const linkedinMessage = messageData.choices[0].message.content;

    // Generate LinkedIn Post
    const postResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that writes engaging LinkedIn posts.' },
          { role: 'user', content: `Write an engaging LinkedIn post suitable for a wide audience on this topic: ${context}` },
        ],
        max_tokens: 150,
      }),
    });

    const postData = await postResponse.json();

    if (!postResponse.ok) {
      return res.status(postResponse.status).json(postData);
    }

    const linkedinPost = postData.choices[0].message.content;

    // Extract first 2-3 key words and create a focused visual prompt
    const keyWords = context.split(' ').slice(0, 3).join(' ');
    const imagePrompt = `Professional minimalist illustration of ${keyWords}, clean modern business design, simple visual style, no text, no words, no letters in the image`;
    // Generate Image URL using Pollinations
    const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(imagePrompt)}`;


    // Final response
    res.status(200).json({
      message: linkedinMessage,
      post: linkedinPost,
      imageUrl: imageUrl
    });
  } catch (error) {
    res.status(500).json({ error: 'Error calling OpenAI API' });
  }
};
