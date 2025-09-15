document.getElementById('contextForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const context = document.getElementById('context').value;
    document.getElementById('message').innerText = "Generating LinkedIn message...";
    document.getElementById('image').src = "";
    document.getElementById('downloadLink').style.display = "none";

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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'
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant who writes professional LinkedIn connection messages.' },
                    { role: 'user', content: `Write a LinkedIn message based on the following context: ${context}` }
                ],
                max_tokens: 150
            })
        });

        const data = await response.json();
        const generatedMessage = data.choices[0].message.content;
        document.getElementById('message').innerText = generatedMessage;

        // Next, call image generation API in next step

    } catch (error) {
        document.getElementById('message').innerText = 'Error generating message.';
        console.error(error);
    }
});

