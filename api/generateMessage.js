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
    // Generate LinkedIn Message
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
    
    // Create enriched image prompt using the LinkedIn post text (first 100 characters)
    const imagePrompt = `Visual illustration of: ${linkedinPost.substring(0, 100)}. No text, no words, no letters in the image.`;
    
    // Generate Image using OpenAI Image API with enhanced prompt
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: imagePrompt,
        n: 1,
        size: "512x512"
      }),
    });
    
    const imageData = await imageResponse.json();
    
    if (!imageResponse.ok) {
      return res.status(imageResponse.status).json(imageData);
    }
    
    const imageUrl = imageData.data[0].url;
    
    // Send back all generated data
    res.status(200).json({
      message: linkedinMessage,
      post: linkedinPost,
      imageUrl
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Error calling OpenAI API' });
  }
};
