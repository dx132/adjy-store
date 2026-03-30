/**
 * navigation.js
 * ADJY Store - Navigation, Menu & Section Switching
 *
 * @author ADJY Store
 * @version 2.0
 */

// ============================================
// NAVIGATION
// ============================================
function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById(sectionName);
    if (section) section.classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector('.nav-link[data-section="' + sectionName + '"]');
    if (activeLink) activeLink.classList.add('active');
    
    document.getElementById('navLinks').classList.remove('active');
    document.getElementById('menuToggle').classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    updateBreadcrumb(sectionName);
    
    if (sectionName === 'home') {
        renderFeaturedProducts();
        renderRecommendations();
    } else if (sectionName === 'products') {
        renderAllProducts();
    } else if (sectionName === 'cart') {
        renderCart();
    } else if (sectionName === 'wishlist') {
        renderWishlist();
    } else if (sectionName === 'history') {
        renderHistory();
    } else if (sectionName === 'admin') {
        checkAdminSession();
        if (isAdminLoggedIn) renderAdminDashboard();
    }
}

function updateBreadcrumb(current) {
    const map = {
        'home': 'Beranda',
        'products': 'Produk',
        'cart': 'Keranjang',
        'checkout': 'Checkout',
        'wishlist': 'Wishlist',
        'history': 'Riwayat',
        'admin': 'Admin Panel'
    };
    const bc = document.getElementById('breadcrumb');
    if (current === 'home') {
        bc.innerHTML = '<span onclick="showSection(\'home\')" style="cursor:pointer; color: var(--primary);">Beranda</span>';
    } else {
        bc.innerHTML = '<span onclick="showSection(\'home\')" style="cursor:pointer; color: var(--primary);">Beranda</span> / <span>' + (map[current] || current) + '</span>';
    }
}

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
    document.getElementById('menuToggle').classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    const nav = document.querySelector('nav');
    if (!nav.contains(e.target)) {
        document.getElementById('navLinks').classList.remove('active');
        document.getElementById('menuToggle').classList.remove('active');
    }
});