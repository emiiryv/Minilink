document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
      window.location.href = 'login.html';
    } else {
      alert(data.message || 'Kayıt sırasında bir hata oluştu.');
    }
  } catch (error) {
    alert('Sunucuya bağlanılamadı.');
    console.error(error);
  }
});
