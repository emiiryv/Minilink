# Minilink 🔗

Minilink, basit ama işlevsel bir URL kısaltma servisidir. Uzun bağlantıları kısa ve paylaşılabilir hale getirir, ayrıca her bağlantının kaç kez tıklandığını takip eder. Hafif yapısı sayesinde öğrenme, test etme veya özelleştirme amaçlı kullanıma uygundur.

---

## 🚀 Temel Özellikler

✅ URL kısaltma: Uzun bağlantılar rastgele kısa kodlarla yeniden yazılır  
✅ Yönlendirme: Kısa linke tıklanıldığında orijinal adrese yönlendirme yapılır  
✅ Tıklama istatistikleri: Her kısa link için kaç kez tıklanıldığı kaydedilir  
✅ Basit frontend: HTML/CSS ile sade ve kullanıcı dostu arayüz  
✅ API tabanlı mimari: JSON üzerinden veri alışverişi  
✅ PostgreSQL veritabanı entegrasyonu  
✅ Kolay kurulum ve genişletilebilir yapı

---

## 🎯 Hedef

Minilink, URL kısaltma servislerinin nasıl çalıştığını öğrenmek isteyen geliştiriciler için açık, sade ve işlevsel bir temel sağlar. Aynı zamanda küçük çaplı projeler veya özel dahili sistemler için de kullanılabilir bir çözüm sunar.

---

## 📌 Geliştirildiği Teknolojiler

- **Backend:** Node.js, Express.js  
- **Veritabanı:** PostgreSQL  
- **Frontend:** HTML5, CSS, Vanilla JavaScript  
- **Ortam Değişkenleri:** dotenv  
- **İstekler arası erişim:** CORS  
- **Geliştirme aracı:** nodemon  

---

## ⚙️ Kurulum Adımları

1. Reponun bir kopyasını alın:
   ```bash
   git clone https://github.com/emiiryv/Minilink.git
   cd Minilink
   ```

2. Ortam değişkenlerini tanımlayın:
   ```bash
   cp .env.example .env
   ```

   Örnek `.env` içeriği:
   ```
   DATABASE_URL="postgresql://postgres:admin123@localhost:5432/minilink"
   JWT_SECRET="gizli-anahtar"
   BASE_URL=http://localhost:3001
   PORT=3001
   ```

3. Gerekli paketleri yükleyin:
   ```bash
   npm install
   ```

4. Veritabanını Prisma ile kurun:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Uygulamayı başlatın:
   ```bash
   npm run build
   npm start
   ```

---

## 🗃️ Veritabanı Yapısı

**users tablosu:**
- `id`: Otomatik artan kullanıcı ID'si  
- `username`: Benzersiz kullanıcı adı  
- `password`: Şifre (hashlenmiş)  
- `is_admin`: Yönetici olup olmadığı (opsiyonel)  
- `created_at`: Oluşturulma zamanı  
- `links`: Kullanıcının oluşturduğu kısa linkler

**links tablosu:**
- `id`: Otomatik artan link ID'si  
- `original_url`: Uzun orijinal bağlantı  
- `short_code`: Kısaltılmış bağlantı kodu  
- `click_count`: Bağlantıya yapılan toplam tıklama sayısı  
- `created_at`: Link oluşturulma zamanı  
- `user_id`: Linkin ait olduğu kullanıcı  
- `expires_at`: Linkin geçerlilik bitiş tarihi (opsiyonel)

---

## 🧪 Örnek API Kullanımı

Kısa link oluşturma (JWT gerektirir):
```bash
curl -X POST http://localhost:3001/api/links \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com"}'
```

---

## 📎 Ek Notlar

- Redis entegrasyonu kullanılarak `click_count` işlemleri optimize edilmiştir.
- Uygulama TypeScript ile yazılmıştır.
- `dist/` klasörüne derlenerek çalıştırılır.
