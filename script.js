document.getElementById('contextForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const context = document.getElementById('context').value;
    document.getElementById('message').innerText = "Generating LinkedIn message for: " + context;
    document.getElementById('image').src = "";
    document.getElementById('downloadLink').style.display = "none";
    // We'll add real API code later
});
