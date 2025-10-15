🚀 RandevUpp - Modern Randevu Yönetim Sistemi
RandevUpp, modern web teknolojileri kullanılarak geliştirilmiş, kullanıcı dostu ve kapsamlı bir randevu yönetim sistemidir. Bu proje, Laravel ile güçlü ve güvenli bir REST API backend'i ve React ile dinamik ve modern bir kullanıcı arayüzü (frontend) üzerine kurulmuştur.

✨ Ana Özellikler
Rol Tabanlı Yetkilendirme (Authorization):

Admin: Tüm sistem üzerinde tam kontrol. Kullanıcıları, servisleri, randevuları ve personel çalışma saatlerini yönetebilir. İstatistiksel verileri görüntüler.

Personal (Personel): Tüm randevuları görebilir, durumlarını güncelleyebilir ve kendi çalışma takvimini yönetebilir.

Customer (Müşteri): Sisteme kayıt olabilir, randevu oluşturabilir, kendi randevularını listeleyebilir/iptal edebilir ve tamamlanmış hizmetleri puanlayabilir.

Güvenli Kimlik Doğrulama (Authentication):

JWT (JSON Web Token) tabanlı güvenli giriş sistemi. API endpoint'leri yetkisiz erişime karşı korunmaktadır.

Dinamik Randevu Sistemi:

Müşteriler, istedikleri personel ve hizmeti seçebilir.

Sistem, personelin çalışma takvimini ve mevcut randevularını analiz ederek sadece müsait olan zaman dilimlerini akıllıca listeler.

Randevu çakışmaları otomatik olarak engellenir.

Kapsamlı Admin Paneli:

Dashboard: Toplam müşteri sayısı, günlük/haftalık ciro, yaklaşan randevular ve yeni kullanıcılar gibi anlık istatistikler.

Kullanıcı Yönetimi: Tüm kullanıcıları listeleme, arama yapma ve rollerini (admin, personal, customer) anında değiştirme.

Servis Yönetimi: "Saç Kesimi", "Sakal Tıraşı" gibi hizmetleri fiyat ve süre bilgileriyle ekleme/silme.

Randevu Yönetimi: Sistemdeki tüm randevuları görüntüleme ve durumlarını (Onaylandı, Reddedildi, Tamamlandı vb.) güncelleme.

Çalışma Saatleri Yönetimi: Personellerin haftalık çalışma takvimlerini esnek bir şekilde ayarlama.

Değerlendirme Sistemi:

Müşteriler, "Tamamlandı" olarak işaretlenmiş randevuları için personele anonim olarak 5 üzerinden yıldız verebilir.

Personel seçim ekranında her personelin ortalama puanı gösterilir.

🛠️ Kullanılan Teknolojiler
Backend:

PHP 8+ & Laravel 11

MySQL

Tymon JWT-Auth (API Güvenliği için)

Frontend:

React 18+ & Vite

React Router DOM v7 (Yönlendirme için)

Axios (API İstekleri için)

React-Bootstrap & Bootstrap 5 (Arayüz Tasarımı için)

🚀 Projeyi Yerel Makinede Çalıştırma
Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin.

Ön Gereksinimler
XAMPP / WAMP / MAMP (Apache, MySQL, PHP)

Composer (getcomposer.org)

Node.js ve npm (nodejs.org)

1. Backend Kurulumu (backend Klasörü)
# 1. Proje dosyalarını klonlayın ve backend klasörüne gidin
git clone <proje-linki>
cd backend

# 2. Gerekli PHP paketlerini yükleyin
composer install

# 3. .env dosyasını oluşturun ve veritabanı bilgilerinizi girin
cp .env.example .env
# .env dosyasını açıp DB_DATABASE, DB_USERNAME, DB_PASSWORD alanlarını düzenleyin

# 4. Uygulama anahtarını ve JWT anahtarını oluşturun
php artisan key:generate
php artisan jwt:secret

# 5. Veritabanı tablolarını oluşturun
php artisan migrate:fresh

# 6. Laravel sunucusunu başlatın
php artisan serve

Backend API'niz artık http://127.0.0.1:8000 adresinde çalışıyor.

2. Frontend Kurulumu (frontend Klasörü)
# 1. Yeni bir terminal açın ve frontend klasörüne gidin
cd ../frontend

# 2. Gerekli JavaScript paketlerini yükleyin
npm install

# 3. React geliştirme sunucusunu başlatın
npm run dev
