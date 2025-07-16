


async function fetchUserLinks() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Oturum bulunamadı. Giriş yapmalısınız.');
    window.location.href = 'login.html';
    return;
  }

  try {
    const res = await fetch('http://localhost:3001/api/links/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Bir hata oluştu');
      return;
    }

    const listContainer = document.getElementById('link-list');
    listContainer.innerHTML = '';

    if (data.length === 0) {
      listContainer.innerHTML = '<p>Henüz linkiniz yok.</p>';
      return;
    }

    const baseUrl = 'http://localhost:3001/api/links/';
    data.forEach(link => {
      const el = document.createElement('div');
      el.innerHTML = `
        <p><strong>Original:</strong> <a href="${link.original_url}" target="_blank">${link.original_url}</a></p>
        <p><strong>Short:</strong> <a href="${baseUrl}${link.short_code}" target="_blank">${baseUrl}${link.short_code}</a></p>
        <p><strong>Tıklama:</strong> ${link.click_count}</p>
        <hr/>
      `;
      listContainer.appendChild(el);
    });

  } catch (err) {
    console.error(err);
    alert('Sunucu hatası.');
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

fetchUserLinks();