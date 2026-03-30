/**
 * admin.js
 * ADJY Store - Admin Panel (Login, Dashboard, CRUD, Settings)
 *
 * @author ADJY Store
 * @version 2.0
 */

// ============================================
// ADMIN LOGIN
// ============================================
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
        isAdminLoggedIn = true;
        sessionStorage.setItem('adjy_admin_logged', 'true');
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        document.getElementById('adminUsername').textContent = username;
        document.getElementById('loginError').classList.remove('show');
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        renderAdminDashboard();
        showNotification('Login berhasil! Selamat datang, ' + username);
    } else {
        document.getElementById('loginError').classList.add('show');
        showNotification('Username atau password salah!', 'error');
        // Shake animation
        const form = document.querySelector('.login-container');
        form.style.animation = 'none';
        form.offsetHeight; // trigger reflow
        form.style.animation = 'shake 0.5s';
    }
}

function handleLogout() {
    if (!confirm('Yakin ingin logout dari admin panel?')) return;
    isAdminLoggedIn = false;
    sessionStorage.removeItem('adjy_admin_logged');
    document.getElementById('adminLogin').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
    showNotification('Berhasil logout');
}

function togglePasswordVisibility() {
    const input = document.getElementById('loginPassword');
    const toggle = input.nextElementSibling;
    if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = '🙈';
    } else {
        input.type = 'password';
        toggle.textContent = '👁️';
    }
}

function checkAdminSession() {
    if (sessionStorage.getItem('adjy_admin_logged') === 'true') {
        isAdminLoggedIn = true;
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        document.getElementById('adminUsername').textContent = adminCredentials.username;
    }
}

// ============================================
// ADMIN FUNCTIONS
// ============================================
function showAdminTab(tab) {
    document.querySelectorAll('.admin-menu a').forEach(function(a) { a.classList.remove('active'); });
    var activeTab = document.querySelector('.admin-menu a[data-tab="' + tab + '"]');
    if (activeTab) activeTab.classList.add('active');
    
    document.querySelectorAll('.admin-tab').forEach(function(t) { t.classList.add('hidden'); });
    var tabEl = document.getElementById('admin-' + tab);
    if (tabEl) tabEl.classList.remove('hidden');
    
    if (tab === 'dashboard') renderAdminDashboard();
    else if (tab === 'products') renderAdminProducts();
    else if (tab === 'orders') renderAdminOrders();
    else if (tab === 'stock') renderAdminStock();
    else if (tab === 'settings') loadSettings();
}

function renderAdminDashboard() {
    var today = new Date().toDateString();
    var todayOrders = orders.filter(function(o) { return new Date(o.date).toDateString() === today; });
    var todaySales = todayOrders.reduce(function(sum, o) { return sum + o.total; }, 0);
    var totalSold = products.reduce(function(sum, p) { return sum + p.sold; }, 0);
    var lowStock = products.filter(function(p) { return p.stock <= 5; }).length;
    
    document.getElementById('statToday').textContent = formatPrice(todaySales);
    document.getElementById('statOrders').textContent = orders.length;
    document.getElementById('statSold').textContent = totalSold;
    document.getElementById('statLowStock').textContent = lowStock;
    
    var recentOrders = orders.slice(0, 5);
    var tbody = document.getElementById('recentOrdersTable');
    if (recentOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-light);">Belum ada pesanan</td></tr>';
    } else {
        tbody.innerHTML = recentOrders.map(function(o) {
            return '<tr>' +
                '<td><code>' + o.id.substring(0, 12) + '</code></td>' +
                '<td>' + o.customer.name + '</td>' +
                '<td>' + formatPrice(o.total) + '</td>' +
                '<td><span class="status-badge status-' + o.status + '">' + o.status + '</span></td>' +
                '<td>' + new Date(o.date).toLocaleDateString('id-ID') + '</td>' +
            '</tr>';
        }).join('');
    }
}

function renderAdminProducts() {
    var tbody = document.getElementById('adminProductsTable');
    tbody.innerHTML = products.map(function(p) {
        return '<tr>' +
            '<td><img src="' + p.images[0] + '" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;" onerror="this.src=\'https://via.placeholder.com/50\'" loading="lazy"></td>' +
            '<td>' + p.name + '</td>' +
            '<td>' + formatPrice(p.price) + '</td>' +
            '<td>' + p.stock + '</td>' +
            '<td>' + p.sold + '</td>' +
            '<td style="white-space: nowrap;">' +
                '<button class="btn btn-sm btn-primary" onclick="editProduct(' + p.id + ')" style="margin-right: 0.25rem;">✏️</button>' +
                '<button class="btn btn-sm btn-danger" onclick="deleteProduct(' + p.id + ')">🗑️</button>' +
            '</td>' +
        '</tr>';
    }).join('');
}

function showAddProductForm() {
    document.getElementById('productForm').style.display = 'block';
    document.getElementById('formTitle').textContent = '➕ Tambah Produk Baru';
    document.getElementById('editProductId').value = '';
    document.getElementById('adminProductName').value = '';
    document.getElementById('adminProductPrice').value = '';
    document.getElementById('adminProductStock').value = '';
    document.getElementById('adminProductImage').value = '';
    document.getElementById('adminProductDesc').value = '';
    document.getElementById('adminProductName').focus();
}

function hideProductForm() {
    document.getElementById('productForm').style.display = 'none';
}

function editProduct(id) {
    var p = products.find(function(x) { return x.id === id; });
    if (!p) return;
    
    document.getElementById('productForm').style.display = 'block';
    document.getElementById('formTitle').textContent = '✏️ Edit Produk';
    document.getElementById('editProductId').value = id;
    document.getElementById('adminProductName').value = p.name;
    document.getElementById('adminProductPrice').value = p.price;
    document.getElementById('adminProductStock').value = p.stock;
    document.getElementById('adminProductCategory').value = p.category;
    document.getElementById('adminProductImage').value = p.images[0];
    document.getElementById('adminProductDesc').value = p.description;
    
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
}

function saveProduct() {
    var id = document.getElementById('editProductId').value;
    var name = document.getElementById('adminProductName').value.trim();
    var price = parseInt(document.getElementById('adminProductPrice').value);
    var stock = parseInt(document.getElementById('adminProductStock').value);
    var category = document.getElementById('adminProductCategory').value;
    var image = document.getElementById('adminProductImage').value.trim();
    var desc = document.getElementById('adminProductDesc').value.trim();
    
    if (!name || isNaN(price) || price <= 0) {
        showNotification('Nama dan harga wajib diisi!', 'error');
        return;
    }
    if (isNaN(stock) || stock < 0) stock = 0;
    
    if (id) {
        var p = products.find(function(x) { return x.id === parseInt(id); });
        if (p) {
            p.name = name;
            p.price = price;
            p.stock = stock;
            p.category = category;
            p.description = desc || p.description;
            if (image) p.images[0] = image;
            showNotification('Produk berhasil diperbarui ✅');
        }
    } else {
        var newId = products.length > 0 ? Math.max.apply(null, products.map(function(p) { return p.id; })) + 1 : 1;
        products.push({
            id: newId,
            name: name,
            price: price,
            stock: stock,
            category: category,
            description: desc || 'Deskripsi produk.',
            images: [image || 'https://via.placeholder.com/300?text=' + encodeURIComponent(name)],
            sold: 0,
            rating: 0,
            reviews: 0,
            specs: {},
            reviews_list: []
        });
        showNotification('Produk baru ditambahkan ✅');
    }
    
    hideProductForm();
    renderAdminProducts();
}

function deleteProduct(id) {
    if (!confirm('Yakin hapus produk ini? Tindakan ini tidak bisa dibatalkan.')) return;
    products = products.filter(function(p) { return p.id !== id; });
    renderAdminProducts();
    showNotification('Produk berhasil dihapus');
}

function renderAdminOrders() {
    var tbody = document.getElementById('adminOrdersTable');
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-light);">Belum ada pesanan</td></tr>';
        return;
    }
    tbody.innerHTML = orders.map(function(o) {
        return '<tr>' +
            '<td><code>' + o.id.substring(0, 12) + '</code></td>' +
            '<td>' + o.customer.name + '</td>' +
            '<td>' + o.items.length + ' item</td>' +
            '<td>' + formatPrice(o.total) + '</td>' +
            '<td><span class="status-badge status-' + o.status + '">' + o.status + '</span></td>' +
            '<td>' + (o.resi || '<span style="color: var(--text-light);">-</span>') + '</td>' +
            '<td style="white-space: nowrap;">' +
                '<button class="btn btn-sm btn-primary" onclick="updateOrderStatus(\'' + o.id + '\')" style="margin-right: 0.25rem;" title="Update Status">📋</button>' +
                '<button class="btn btn-sm btn-secondary" onclick="addResi(\'' + o.id + '\')" title="Tambah Resi">📦</button>' +
            '</td>' +
        '</tr>';
    }).join('');
}

function updateOrderStatus(orderId) {
    var order = orders.find(function(o) { return o.id === orderId; });
    if (!order) return;
    var statuses = ['pending', 'paid', 'shipped', 'completed'];
    var currentIdx = statuses.indexOf(order.status);
    order.status = statuses[(currentIdx + 1) % statuses.length];
    localStorage.setItem('adjy_orders', JSON.stringify(orders));
    renderAdminOrders();
    showNotification('Status pesanan diubah ke: ' + order.status);
}

function addResi(orderId) {
    var resi = prompt('Masukkan nomor resi:');
    if (resi && resi.trim()) {
        var order = orders.find(function(o) { return o.id === orderId; });
        if (order) {
            order.resi = resi.trim();
            localStorage.setItem('adjy_orders', JSON.stringify(orders));
            renderAdminOrders();
            showNotification('Nomor resi berhasil ditambahkan');
        }
    }
}

function renderAdminStock() {
    var lowStock = products.filter(function(p) { return p.stock <= 5; });
    document.getElementById('lowStockAlert').style.display = lowStock.length > 0 ? 'block' : 'none';
    
    document.getElementById('stockTable').innerHTML = products.map(function(p) {
        var status, color;
        if (p.stock === 0) { status = '❌ Habis'; color = 'var(--danger)'; }
        else if (p.stock <= 5) { status = '⚠️ Kritis'; color = 'var(--warning)'; }
        else { status = '✅ Normal'; color = 'var(--success)'; }
        
        return '<tr>' +
            '<td>' + p.name + '</td>' +
            '<td style="font-weight: 600;">' + p.stock + '</td>' +
            '<td style="color: ' + color + '; font-weight: bold;">' + status + '</td>' +
            '<td><button class="btn btn-sm btn-primary" onclick="restock(' + p.id + ')">+ Restock</button></td>' +
        '</tr>';
    }).join('');
}

function restock(productId) {
    var qty = parseInt(prompt('Tambah stok berapa unit?'));
    if (qty && qty > 0) {
        var p = products.find(function(x) { return x.id === productId; });
        if (p) {
            p.stock += qty;
            renderAdminStock();
            showNotification('Stok ' + p.name + ' ditambah ' + qty + ' unit ✅');
        }
    }
}

// ============================================
// SETTINGS FUNCTIONS
// ============================================
function loadSettings() {
    document.getElementById('settingStoreName').value = storeSettings.storeName;
    document.getElementById('settingWhatsapp').value = storeSettings.whatsapp;
    document.getElementById('settingTheme').value = document.documentElement.getAttribute('data-theme') || 'light';
}

function saveStoreSettings() {
    storeSettings.storeName = document.getElementById('settingStoreName').value.trim() || 'ADJY Store';
    storeSettings.whatsapp = document.getElementById('settingWhatsapp').value.trim() || '62895708753070';
    localStorage.setItem('adjy_settings', JSON.stringify(storeSettings));
    showNotification('Pengaturan toko berhasil disimpan ✅');
}

function changeAdminPassword() {
    var oldPass = document.getElementById('settingOldPass').value;
    var newPass = document.getElementById('settingNewPass').value;
    var confirmPass = document.getElementById('settingConfirmPass').value;
    
    if (!oldPass || !newPass || !confirmPass) {
        showNotification('Lengkapi semua field password', 'error');
        return;
    }
    
    if (oldPass !== adminCredentials.password) {
        showNotification('Password lama salah!', 'error');
        return;
    }
    
    if (newPass.length < 6) {
        showNotification('Password baru minimal 6 karakter', 'error');
        return;
    }
    
    if (newPass !== confirmPass) {
        showNotification('Konfirmasi password tidak cocok!', 'error');
        return;
    }
    
    adminCredentials.password = newPass;
    localStorage.setItem('adjy_admin_creds', JSON.stringify(adminCredentials));
    
    document.getElementById('settingOldPass').value = '';
    document.getElementById('settingNewPass').value = '';
    document.getElementById('settingConfirmPass').value = '';
    
    showNotification('Password berhasil diubah! ✅');
}

function clearAllData() {
    if (!confirm('Yakin hapus SEMUA data? (Pesanan, keranjang, wishlist, riwayat)\nTindakan ini tidak bisa dibatalkan!')) return;
    
    cart = [];
    wishlist = [];
    viewedHistory = [];
    orders = [];
    compareList = [];
    
    localStorage.removeItem('adjy_cart');
    localStorage.removeItem('adjy_wishlist');
    localStorage.removeItem('adjy_history');
    localStorage.removeItem('adjy_orders');
    localStorage.removeItem('adjy_compare');
    
    updateBadges();
    updateCompareBar();
    showNotification('Semua data berhasil dihapus');
}