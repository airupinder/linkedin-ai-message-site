document.getElementById('contextForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const context = document.getElementById('context').value;

  // Show loading texts and hide previous image/download link
  document.getElementById('message').innerText = "Generating LinkedIn message...";
  document.getElementById('post').innerText = "Generating LinkedIn post...";
  document.getElementById('image').src = "";
  document.getElementById('downloadLink').style.display = "none";

  try {
    const response = await fetch('https://linkedin-ai-message-site.vercel.app/api/generateMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context }),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById('message').innerText = data.message;
      document.getElementById('post').innerText = data.post;

      if (data.imageUrl) {
        document.getElementById('image').src = data.imageUrl;
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = data.imageUrl;
        downloadLink.style.display = "inline"; // Show the download link
      } else {
        document.getElementById('image').src = "";
        document.getElementById('downloadLink').style.display = "none"; // Hide if no image
      }
    } else {
      document.getElementById('message').innerText = data.error || 'Error generating message.';
      document.getElementById('post').innerText = '';
      document.getElementById('image').src = "";
      document.getElementById('downloadLink').style.display = "none";
    }
  } catch (error) {
    document.getElementById('message').innerText = 'Error generating message.';
    document.getElementById('post').innerText = '';
    document.getElementById('image').src = "";
    document.getElementById('downloadLink').style.display = "none";
    console.error(error);
  }
});
