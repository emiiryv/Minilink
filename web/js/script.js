import apiRequest from './api.js';

// Eğer kullanıcı giriş yapmamışsa login sayfasına yönlendir
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
  }
});

document.getElementById('shorten-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const originalUrl = document.getElementById('original-url').value;
  const resultDiv = document.getElementById('result');

  try {
    const data = await apiRequest('/links', 'POST', { originalUrl });
    const shortUrl = data.short_url;

    resultDiv.innerHTML = `
      <p><strong>Kısa Link:</strong> <a href="${shortUrl}" target="_blank">${shortUrl}</a></p>
    `;
  } catch (error) {
    console.error('Hata:', error);
    resultDiv.innerHTML = `<p style="color:red;">Bir hata oluştu. Lütfen tekrar deneyin.</p>`;
  }
});