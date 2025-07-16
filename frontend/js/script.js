document.getElementById('shorten-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const originalUrl = document.getElementById('original-url').value;
  const resultDiv = document.getElementById('result');

  try {
    const response = await fetch('http://localhost:3001/api/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ originalUrl })
    });

    if (!response.ok) {
      throw new Error('Bir hata oluştu');
    }

    const data = await response.json();
    const shortUrl = `http://localhost:3001/api/links/${data.short_code}`;

    resultDiv.innerHTML = `
      <p><strong>Kısa Link:</strong> <a href="${shortUrl}" target="_blank">${shortUrl}</a></p>
    `;
  } catch (error) {
    console.error('Hata:', error);
    resultDiv.innerHTML = `<p style="color:red;">Bir hata oluştu. Lütfen tekrar deneyin.</p>`;
  }
});