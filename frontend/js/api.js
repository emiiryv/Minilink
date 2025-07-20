

const BASE_URL = 'http://localhost:3001/api';

async function apiRequest(endpoint, method = 'GET', data = null) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const response = await fetch(url, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Sunucu hatası');
    }

    return result;
  } catch (err) {
    console.error('API Hatası:', err.message);
    throw err;
  }
}

export default apiRequest;