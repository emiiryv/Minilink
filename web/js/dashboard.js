import apiRequest from './api.js';
import { logout, isLoggedIn } from './auth.js';

const BACKEND_ORIGIN = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', async () => {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  // 🔽 Admin kullanıcıyı yönlendir
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload?.is_admin) {
        window.location.href = 'AdminDashboard.html';
        return;
      }
    } catch (err) {
      console.error('Token çözümleme hatası:', err);
    }
  }

  // Global fonksiyonlar
  window.deleteLink = deleteLink;
  window.logout = logout;

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      fetchUserLinks(e.target.value);
    });
  }

  fetchUserLinks('created_at');
});

async function fetchUserLinks(sort = 'created_at') {
  if (!isLoggedIn()) {
    alert('Oturum bulunamadı. Giriş yapmalısınız.');
    window.location.href = 'login.html';
    return;
  }
  const token = localStorage.getItem('token');

  try {
    const data = await apiRequest(`/links/me?sort=${sort}`, 'GET');

    if (!data) {
      alert('Bir hata oluştu');
      return;
    }

    const listContainer = document.getElementById('link-list');
    listContainer.innerHTML = '';

    if (data.links.length === 0) {
      listContainer.innerHTML = '<p>Henüz linkiniz yok.</p>';
      return;
    }

    // Backend tarafından sağlanan tam short_url kullanılmalı
    data.links.forEach(link => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><a href="${link.original_url}" target="_blank">${link.original_url}</a></td>
        <td><a href="${BACKEND_ORIGIN}/${link.short_code}" target="_blank">${BACKEND_ORIGIN}/${link.short_code}</a></td>
        <td>${link.click_count}</td>
        <td>${new Date(link.created_at).toLocaleString('tr-TR')}</td>
        <td>${link.expires_at ? new Date(link.expires_at).toLocaleString('tr-TR') : '-'}</td>
        <td>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <button onclick="showQrCode(${link.id})">QR</button>
            <button onclick="deleteLink(${link.id})">Sil</button>
          </div>
        </td>
      `;
      listContainer.appendChild(row);
    });

  } catch (err) {
    console.error(err);
    alert('Sunucu hatası.');
  }
}


fetchUserLinks('created_at');

async function deleteLink(linkId) {
  const token = localStorage.getItem('token');
  if (!token) return;

  if (!confirm('Bu linki silmek istediğinize emin misiniz?')) return;

  try {
    const data = await apiRequest(`/links/${linkId}`, 'DELETE', null, token);

    if (!data) {
      alert('Silme işlemi başarısız.');
      return;
    }

    alert('Link başarıyla silindi.');
    fetchUserLinks(); // listeyi güncelle

  } catch (err) {
    console.error(err);
    alert('Sunucu hatası.');
  }
}

async function showQrCode(linkId) {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch(`${BACKEND_ORIGIN}/api/links/${linkId}/qrcode`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      alert('QR kod alınamadı.');
      return;
    }

    const data = await response.json();

    let modal = document.getElementById('qr-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'qr-modal';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = '9999';

      modal.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h3>QR Kodu</h3>
          <img src="${data.qr}" alt="QR Kod" />
          <br/><br/>
          <button id="close-qr-btn">Kapat</button>
        </div>
      `;
      document.body.appendChild(modal);
    } else {
      modal.querySelector('img').src = data.qr;
      modal.style.display = 'flex';
    }

    const closeBtn = modal.querySelector('#close-qr-btn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        modal.style.display = 'none';
      };
    }

  } catch (err) {
    console.error(err);
    alert('QR kod alınırken hata oluştu.');
  }
}
window.showQrCode = showQrCode;