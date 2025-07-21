import apiRequest from './api.js';

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const data = await apiRequest('http://localhost:3001/api/auth/login', 'POST', { username, password });

    if (data.token) {
      localStorage.setItem('token', data.token);
      alert('Giriş başarılı! Yönlendiriliyorsunuz...');
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Giriş başarısız.');
    }
  } catch (error) {
    alert('Sunucuya ulaşılamadı.');
    console.error(error);
  }
});