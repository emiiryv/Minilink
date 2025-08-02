const tableBody = document.querySelector('#user-links-table tbody');
const token = localStorage.getItem('token');

// URL parametresinden kullanıcı ID'sini al
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

if (!userId) {
  alert('Kullanıcı ID bulunamadı!');
} else {
  fetchUserLinks(userId);
}

async function fetchUserLinks(id) {
  try {
    const res = await fetch(`http://localhost:3001/api/admin/users/${id}/links`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Linkler alınamadı');
    }

    const links = await res.json();
    tableBody.innerHTML = '';

    links.forEach(link => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${link.id}</td>
        <td><a href="${link.original_url}" target="_blank">${link.original_url}</a></td>
        <td><a href="${link.redirect_url}" target="_blank">${link.short_code}</a></td>
        <td>${link.click_count ?? 0}</td>
        <td>${formatDate(link.created_at)}</td>
        <td>${link.expires_at ? formatDate(link.expires_at) : '-'}</td>
        <td><button onclick="deleteLink(${link.id})">Sil</button></td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error('Linkler çekilirken hata oluştu:', err.message);
    alert('Yetkisiz veya başarısız istek. Lütfen tekrar giriş yapın.');
  }
}

async function deleteLink(linkId) {
  if (!confirm('Bu linki silmek istediğine emin misin?')) return;

  try {
    const res = await fetch(`http://localhost:3001/api/admin/links/${linkId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (res.ok) {
      fetchUserLinks(userId); // listeyi güncelle
    } else {
      const err = await res.json();
      alert(err.error || 'Link silinemedi');
    }
  } catch (err) {
    console.error('Link silme hatası:', err.message);
  }
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('tr-TR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}