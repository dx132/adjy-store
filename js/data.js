/**
 * data.js
 * ADJY Store - Product Data, State Variables & LocalStorage Management
 *
 * @author ADJY Store
 * @version 2.0
 */

// ============================================
// DATA & STATE
// ============================================
let products = [
    {
        id: 1,
        name: "Headphone Wireless Premium",
        price: 450000,
        category: "elektronik",
        stock: 15,
        sold: 45,
        rating: 4.8,
        reviews: 128,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"],
        description: "Headphone wireless dengan kualitas suara superior, noise cancellation aktif, dan baterai tahan 30 jam.",
        specs: {"Tipe": "Over-ear", "Konektivitas": "Bluetooth 5.0", "Baterai": "30 jam", "Berat": "250g"},
        reviews_list: [
            {name: "Budi", rating: 5, date: "2024-01-15", comment: "Kualitas suara mantap!"},
            {name: "Ani", rating: 4, date: "2024-01-10", comment: "Bagus, tapi agak berat"}
        ]
    },
    {
        id: 2,
        name: "Smart Watch Pro Series",
        price: 899000,
        category: "elektronik",
        stock: 8,
        sold: 32,
        rating: 4.6,
        reviews: 89,
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500"],
        description: "Jam tangan pintar dengan fitur health monitoring lengkap, GPS, dan water resistant.",
        specs: {"Layar": "1.4 inch AMOLED", "Sensor": "Heart rate, SpO2", "Water Resist": "5ATM", "Baterai": "7 hari"},
        reviews_list: [{name: "Citra", rating: 5, date: "2024-01-20", comment: "Fitur lengkap, baterai awet"}]
    },
    {
        id: 3,
        name: "Tas Laptop Modern",
        price: 275000,
        category: "fashion",
        stock: 25,
        sold: 67,
        rating: 4.7,
        reviews: 156,
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
        description: "Tas laptop waterproof dengan desain minimalis, cocok untuk kerja dan traveling.",
        specs: {"Material": "Waterproof Nylon", "Ukuran": "15.6 inch", "Kompartemen": "3 ruang", "Berat": "800g"},
        reviews_list: []
    },
    {
        id: 4,
        name: "Keyboard Mechanical RGB",
        price: 650000,
        category: "elektronik",
        stock: 3,
        sold: 28,
        rating: 4.9,
        reviews: 203,
        images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500", "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500"],
        description: "Keyboard gaming mechanical dengan switch blue, lampu RGB customizable.",
        specs: {"Switch": "Mechanical Blue", "Layout": "TKL (87 keys)", "RGB": "Per-key RGB", "Koneksi": "USB Type-C"},
        reviews_list: []
    },
    {
        id: 5,
        name: "Mouse Gaming Wireless",
        price: 320000,
        category: "elektronik",
        stock: 0,
        sold: 91,
        rating: 4.5,
        reviews: 78,
        images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"],
        description: "Mouse gaming wireless dengan DPI hingga 16000 dan baterai tahan 50 jam.",
        specs: {"DPI": "16000", "Sensor": "Optical", "Tombol": "6 programmable", "Berat": "95g"},
        reviews_list: []
    },
    {
        id: 6,
        name: "Sneakers Sport Casual",
        price: 399000,
        category: "fashion",
        stock: 12,
        sold: 45,
        rating: 4.6,
        reviews: 67,
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"],
        description: "Sepatu sneakers nyaman untuk olahraga dan casual, desain trendy.",
        specs: {"Upper": "Mesh breathable", "Sole": "Rubber anti-slip", "Size": "39-44", "Berat": "600g"},
        reviews_list: []
    },
    {
        id: 7,
        name: "Botol Minum Tumbler Premium",
        price: 125000,
        category: "rumah",
        stock: 100,
        sold: 156,
        rating: 4.3,
        reviews: 89,
        images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"],
        description: "Tumbler stainless steel insulated, menjaga suhu minuman hingga 12 jam.",
        specs: {"Material": "304 Stainless", "Kapasitas": "500ml", "Insulated": "Double wall", "Warna": "Hitam/Putih"},
        reviews_list: []
    },
    
];

let cart = JSON.parse(localStorage.getItem('adjy_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('adjy_wishlist')) || [];
let viewedHistory = JSON.parse(localStorage.getItem('adjy_history')) || [];
let compareList = JSON.parse(localStorage.getItem('adjy_compare')) || [];
let orders = JSON.parse(localStorage.getItem('adjy_orders')) || [];
let storeSettings = JSON.parse(localStorage.getItem('adjy_settings')) || {
    storeName: 'ADJY Store',
    whatsapp: '6283819250877'
};

let currentFilter = 'all';
let currentSort = 'default';
let selectedShipping = null;
let selectedPayment = null;
let currentCheckoutItems = [];
let isAdminLoggedIn = false;
let searchDebounceTimer = null;

// Admin credentials stored in localStorage (hashed with simple encoding for no-backend)
const DEFAULT_ADMIN = { username: 'admin', password: 'admin123' };
let adminCredentials = JSON.parse(localStorage.getItem('adjy_admin_creds')) || { ...DEFAULT_ADMIN };
