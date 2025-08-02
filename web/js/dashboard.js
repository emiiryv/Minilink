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
      const el = document.createElement('div');
      el.innerHTML = `
        <p><strong>Original:</strong> <a href="${link.original_url}" target="_blank">${link.original_url}</a></p>
        <p><strong>Short:</strong> <a href="${BACKEND_ORIGIN}/${link.short_code}" target="_blank">${BACKEND_ORIGIN}/${link.short_code}</a></p>
        <p><strong>Tıklama:</strong> ${link.click_count}</p>
        <p><strong>Oluşturulma:</strong> ${new Date(link.created_at).toLocaleDateString('tr-TR')}</p>
        ${link.expires_at ? `<p><strong>Sona Erme:</strong> ${new Date(link.expires_at).toLocaleString('tr-TR')}</p>` : ''}
        <button onclick="deleteLink(${link.id})">Sil</button>
        <hr/>
      `;
      listContainer.appendChild(el);
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