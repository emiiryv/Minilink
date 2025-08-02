const usersTableBody = document.querySelector('#users-table tbody');
const linksTableBody = document.querySelector('#links-table tbody');
const token = localStorage.getItem('token');

window.addEventListener('DOMContentLoaded', async () => {
  await fetchUsers();
  await fetchLinks();
});

async function fetchUsers() {
  try {
    const res = await fetch('http://localhost:3001/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Kullanıcı verisi alınamadı');
    }

    const users = await res.json();
    usersTableBody.innerHTML = '';

    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.is_admin ? '✅' : '❌'}</td>
        <td><a href="UserLinks.html?id=${user.id}">Görüntüle</a></td>
        <td><button onclick="deleteUser(${user.id})">Sil</button></td>
      `;
      usersTableBody.appendChild(row);
    });
  } catch (err) {
    console.error('Kullanıcılar alınamadı:', err.message);
  }
}

async function fetchLinks() {
  try {
    const res = await fetch('http://localhost:3001/api/admin/links', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Link verisi alınamadı');
    }

    const links = await res.json();
    linksTableBody.innerHTML = '';

    links.forEach(link => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${link.id}</td>
        <td><a href="${link.original_url}" target="_blank">${link.original_url}</a></td>
        <td>${link.short_code}</td>
        <td>${link.user ? link.user.username : '-'}</td>
        <td>${link.click_count ?? 0}</td>
        <td>
          <button onclick="deleteLink(${link.id})">Sil</button>
          <button onclick="updateLink(${link.id}, '${link.original_url}', '${link.short_code}', '${link.expires_at || ''}')">Güncelle</button>
        </td>
      `;
      linksTableBody.appendChild(row);
    });
  } catch (err) {
    console.error('Linkler alınamadı:', err.message);
  }
}

async function deleteUser(userId) {
  if (!confirm('Bu kullanıcıyı silmek istediğine emin misin?')) return;

  try {
    const res = await fetch(`http://localhost:3001/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Kullanıcı silinemedi');
      return;
    }

    await fetchUsers();
    await fetchLinks(); // Bu kullanıcıya ait linkler de gidebilir
  } catch (err) {
    console.error('Silme hatası:', err);
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

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Link silinemedi');
      return;
    }

    await fetchLinks();
  } catch (err) {
    console.error('Silme hatası:', err);
  }
}

let selectedLinkId = null;
let updatePayload = {};

async function updateLink(id, currentUrl, currentCode, currentExpires) {
  const original_url = prompt('Yeni URL:', currentUrl);
  if (original_url === null) return;

  const short_code = prompt('Yeni short_code:', currentCode);
  if (short_code === null) return;

  // Expires modal için değerleri sakla
  selectedLinkId = id;
  updatePayload = {
    original_url,
    short_code,
    expires_at: currentExpires || ''
  };

  document.getElementById('expires-date').value =
  currentExpires ? new Date(currentExpires).toISOString().slice(0, 16) : '';
  document.getElementById('date-modal').style.display = 'block';
}

async function confirmDate() {
  const dateInput = document.getElementById('expires-date');
  const clearCheckbox = document.getElementById('clear-expire');

  let expires_at_input = dateInput.value;

  // Eğer checkbox işaretliyse expires_at'i null yap
  if (clearCheckbox.checked) {
    expires_at_input = null;
  } else if (expires_at_input === '') {
    expires_at_input = null;
  } else {
    // Formatı tamamla (örnek: 2025-08-02T20:12 → 2025-08-02T20:12:00)
    if (!expires_at_input.endsWith(':00')) {
      expires_at_input += ':00';
    }
  }

  try {
    const res = await fetch(`http://localhost:3001/api/admin/links/${selectedLinkId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...updatePayload,
        expires_at: expires_at_input
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Güncelleme başarısız');
      return;
    }

    document.getElementById('date-modal').style.display = 'none';
    await fetchLinks();
  } catch (err) {
    console.error('Güncelleme hatası:', err.message);
  }
}

function cancelDate() {
  document.getElementById('date-modal').style.display = 'none';
}