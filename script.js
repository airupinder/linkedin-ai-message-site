document.getElementById('contextForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const context = document.getElementById('context').value;
  document.getElementById('message').innerText = "Generating LinkedIn message...";
  document.getElementById('image').src = "";
  document.getElementById('downloadLink').style.display = "none";

  try {
    const response = await fetch('linkedin-ai-message-site.vercel.app/api/generateMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context }),
    });

    const data = await response.json();
    if (response.ok) {
      document.getElementById('message').innerText = data.message;
    } else {
      document.getElementById('message').innerText = data.error || 'Error generating message.';
    }
  } catch (error) {
    document.getElementById('message').innerText = 'Error generating message.';
    console.error(error);
  }
});
