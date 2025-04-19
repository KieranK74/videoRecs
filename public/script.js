document.getElementById('submit').addEventListener('click', async () => {
  const input = document.getElementById('userInput').value;
  const response = await fetch('/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input })
  });

  const data = await response.json();
  const results = document.getElementById('results');
  // results.innerHTML = `<h2>Keywords: ${data.keywords}</h2>`;
  data.videos.forEach(video => {
    results.innerHTML += `
        <div class="videos">
          <h3>${video.title}</h3>
          <iframe 
            src="https://www.youtube.com/embed/${video.videoId}" allowfullscreen></iframe>
        </div>
      `;
  });
});