/**
 * wishlist.js
 * ADJY Store - Wishlist & Browsing History
 *
 * @author ADJY Store
 * @version 2.0
 */

// ============================================
// WISHLIST FUNCTIONS
// ============================================
function toggleWishlist(productId, event) {
    if (event) event.stopPropagation();
    
    var idx = wishlist.indexOf(productId);
    if (idx > -1) {
        wishlist.splice(idx, 1);
        showNotification('Dihapus dari wishlist');
    } else {
        wishlist.push(productId);
        showNotification('Ditambahkan ke wishlist ❤️');
    }
    
    saveWishlist();
    
    // Refresh relevant views
    if (document.getElementById('productModal').classList.contains('active')) {
        openProductDetail(productId);
    }
    if (document.getElementById('products').classList.contains('active')) {
        renderAllProducts();
    }
    if (document.getElementById('wishlist').classList.contains('active')) {
        renderWishlist();
    }
    if (document.getElementById('home').classList.contains('active')) {
        renderFeaturedProducts();
        renderRecommendations();
    }
}

function renderWishlist() {
    var container = document.getElementById('wishlistContainer');
    if (wishlist.length === 0) {
        container.innerHTML =
            '<div class="empty-state" style="grid-column: 1/-1;">' +
                '<div class="empty-icon">❤️</div>' +
                '<h3>Wishlist Kosong</h3>' +
                '<p>Simpan produk favorit Anda di sini</p>' +
                '<button class="btn btn-primary mt-4" onclick="showSection(\'products\')">Jelajahi Produk</button>' +
            '</div>';
        return;
    }
    
    var items = wishlist.map(function(id) { return products.find(function(p) { return p.id === id; }); }).filter(Boolean);
    container.innerHTML = items.map(function(p) { return createProductCard(p, false); }).join('');
}

// ============================================
// HISTORY FUNCTIONS
// ============================================
function renderHistory() {
    var container = document.getElementById('historyContainer');
    if (viewedHistory.length === 0) {
        container.innerHTML =
            '<div class="empty-state" style="grid-column: 1/-1;">' +
                '<div class="empty-icon">👁️</div>' +
                '<h3>Belum Ada Riwayat</h3>' +
                '<p>Produk yang Anda lihat akan muncul di sini</p>' +
            '</div>';
        return;
    }
    
    var items = viewedHistory.map(function(h) { return products.find(function(p) { return p.id === h.id; }); }).filter(Boolean);
    container.innerHTML = items.map(function(p) { return createProductCard(p); }).join('');
}