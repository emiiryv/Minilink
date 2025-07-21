import apiRequest from './api.js';

document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const data = await apiRequest('/auth/register', 'POST', { username, password });

    alert('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
    window.location.href = 'login.html';
  } catch (error) {
    alert(error.message || 'Kayıt sırasında bir hata oluştu.');
    console.error(error);
  }
});
