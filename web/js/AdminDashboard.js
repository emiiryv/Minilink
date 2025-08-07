const usersTableBody = document.querySelector('#users-table tbody');
const linksTableBody = document.querySelector('#links-table tbody');
const token = localStorage.getItem('token');

window.addEventListener('DOMContentLoaded', async () => {
  await fetchUsers();
  await fetchLinks();
  await fetchStatsAndDrawCharts(); // 🔽 yeni eklendi
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
        <td><a href="./UserLinks?id=${user.id}">Görüntüle</a></td>
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
      const shortUrl = link.redirect_url || `http://localhost:3001/${link.short_code}`;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${link.id}</td>
        <td><a href="${link.original_url}" target="_blank">${link.original_url}</a></td>
        <td><a href="${shortUrl}" target="_blank">${link.short_code}</a></td>
        <td>${link.user ? link.user.username : '-'}</td>
        <td>${link.click_count ?? 0}</td>
        <td>${link.expires_at ? new Date(link.expires_at).toLocaleString('tr-TR') : '-'}</td>
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
  document.getElementById('expires-date').min = new Date().toISOString().slice(0, 16);
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
    const now = new Date().toISOString();
    if (expires_at_input < now) {
      alert('Geçmiş tarih seçilemez.');
      return;
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


// ... diğer fetchUsers, fetchLinks, deleteUser, deleteLink, updateLink, confirmDate, cancelDate fonksiyonları değişmedi ...

function aggregateByDate(dateArray) {
  const counts = {};
  dateArray.forEach(dt => {
    const date = new Date(dt).toISOString().split('T')[0];
    counts[date] = (counts[date] || 0) + 1;
  });
  return Object.entries(counts).map(([date, count]) => ({ date, count }));
}

async function fetchStatsAndDrawCharts() {
  try {
    const res = await fetch('http://localhost:3001/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'İstatistik verisi alınamadı');
    }

    const data = await res.json();
    console.log("Gelen istatistik verisi:", data);

    if (!data || !data.user_creation_dates || !data.link_creation_dates) {
      console.error("İstatistik verisi eksik:", data);
      return;
    }

    // Toplam sayılar
    const totalUsersElem = document.getElementById('total-users');
    if (totalUsersElem) totalUsersElem.textContent = data.total_users;

    const totalLinksElem = document.getElementById('total-links');
    if (totalLinksElem) totalLinksElem.textContent = data.total_links;

    // Grafikler
    const userChartCtx = document.getElementById('userChart').getContext('2d');
    const linkChartCtx = document.getElementById('linkChart').getContext('2d');

    const userStats = aggregateByDate(data.user_creation_dates);
    const linkStats = aggregateByDate(data.link_creation_dates);

    new Chart(userChartCtx, {
      type: 'line',
      data: {
        labels: userStats.map(item => item.date),
        datasets: [{
          label: 'Kullanıcılar',
          data: userStats.map(item => item.count),
          borderColor: '#f39c12',
          backgroundColor: 'rgba(243, 156, 18, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0
            }
          }
        }
      }
    });

    new Chart(linkChartCtx, {
      type: 'line',
      data: {
        labels: linkStats.map(item => item.date),
        datasets: [{
          label: 'Linkler',
          data: linkStats.map(item => item.count),
          borderColor: '#3498db',
          backgroundColor: 'rgba(52, 152, 219, 0.2)',
          tension: 0.3,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0
            }
          }
        }
      }
    });

  } catch (err) {
    console.error('İstatistik hatası:', err.message);
  }
}