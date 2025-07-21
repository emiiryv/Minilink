import apiRequest from './api.js';
import { logout, isLoggedIn } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }

  // Global fonksiyonlar
  window.deleteLink = deleteLink;
  window.logout = logout;
});



async function fetchUserLinks() {
  if (!isLoggedIn()) {
    alert('Oturum bulunamadı. Giriş yapmalısınız.');
    window.location.href = 'login.html';
    return;
  }
  const token = localStorage.getItem('token');

  try {
    const data = await apiRequest('/links/me', 'GET');

    if (!data) {
      alert('Bir hata oluştu');
      return;
    }

    const listContainer = document.getElementById('link-list');
    listContainer.innerHTML = '';

    if (data.length === 0) {
      listContainer.innerHTML = '<p>Henüz linkiniz yok.</p>';
      return;
    }

    // Backend tarafından sağlanan tam short_url kullanılmalı
    data.forEach(link => {
      const el = document.createElement('div');
      el.innerHTML = `
        <p><strong>Original:</strong> <a href="${link.original_url}" target="_blank">${link.original_url}</a></p>
        <p><strong>Short:</strong> <a href="${link.short_url || '#'}" target="_blank">${link.short_url || 'Link bulunamadı'}</a></p>
        <p><strong>Tıklama:</strong> ${link.click_count}</p>
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


fetchUserLinks();

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