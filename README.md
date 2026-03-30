# ADJY Store - Toko Online Modern

## 📁 Struktur Folder

```
adjy-store/
├── index.html              # Template HTML utama
├── README.md               # Dokumentasi proyek
├── css/
│   ├── variables.css       # CSS custom properties & tema (dark/light)
│   ├── base.css            # Reset & style global
│   ├── layout.css          # Container, section, grid utama
│   ├── navigation.css      # Navbar, search bar, hamburger menu
│   ├── hero-filters.css    # Hero banner & filter kategori
│   ├── products.css        # Product grid & card styles
│   ├── modal.css           # Modal overlay & product detail
│   ├── compare.css         # Fitur perbandingan produk
│   ├── cart.css            # Keranjang belanja styles
│   ├── checkout.css        # Form checkout & payment methods
│   ├── wishlist.css        # Wishlist grid
│   ├── admin.css           # Admin panel, login, dashboard, tables
│   ├── recommendations.css # Rekomendasi & riwayat produk
│   ├── utilities.css       # Loading spinner, notifikasi, toast
│   ├── footer.css          # Footer styles
│   └── responsive.css      # Media queries (1024px, 768px, 480px)
├── js/
│   ├── data.js             # Product data, state, localStorage helpers
│   ├── utils.js            # Format harga, notifikasi, loading overlay
│   ├── theme.js            # Toggle dark/light mode
│   ├── navigation.js       # Menu navigation & section switching
│   ├── products.js         # Render produk, detail modal, compare
│   ├── cart.js             # CRUD keranjang belanja
│   ├── checkout.js         # Proses checkout & WhatsApp order
│   ├── wishlist.js         # Wishlist & browsing history
│   ├── admin.js            # Login admin, dashboard, CRUD produk, settings
│   └── app.js              # Inisialisasi aplikasi
└── assets/
    ├── images/             # Gambar produk & banner
    ├── icons/              # Ikon custom (favicon, dll)
    └── fonts/              # Font lokal (jika diperlukan)
```

## 🚀 Cara Menjalankan

1. Buka `index.html` langsung di browser, atau
2. Gunakan local server:
   ```bash
   # Python
   python -m http.server 8000

   # Node.js
   npx serve .
   ```

## 🔐 Login Admin

- **Username:** `admin`
- **Password:** `admin123`
- Akses melalui menu navigasi → "Admin"

## 📝 Catatan Pengembangan

- Semua state disimpan di `localStorage` (tanpa backend)
- CSS menggunakan Custom Properties untuk theming
- JavaScript menggunakan global scope (vanilla JS, tanpa module bundler)
- Urutan `<script>` di HTML penting karena ada dependensi antar file
