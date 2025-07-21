// Auth yardımcı fonksiyonları - oturum kontrolü ve çıkışı

// Oturumu sonlandırır
export function logout() {
    localStorage.removeItem('token');
    console.log("Çıkış yapıldı");
    window.location.href = 'login.html';
  }
  
  // Kullanıcı oturumda mı kontrol eder
  export function isLoggedIn() {
    const token = localStorage.getItem('token');
    return token !== null && token !== '';
  }