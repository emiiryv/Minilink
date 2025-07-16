


document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      alert('Giriş başarılı! Yönlendiriliyorsunuz...');
      window.location.href = 'dashboard.html'; // veya ana sayfa
    } else {
      alert(data.message || 'Giriş başarısız.');
    }
  } catch (error) {
    alert('Sunucuya ulaşılamadı.');
    console.error(error);
  }
});