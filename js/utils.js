/**
 * utils.js
 * ADJY Store - Utility Functions (formatting, notifications, loading)
 *
 * @author ADJY Store
 * @version 2.0
 */

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatPrice(price) {
    return 'Rp ' + price.toLocaleString('id-ID');
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function showNotification(message, type = 'success') {
    const notif = document.getElementById('notification');
    const icons = { success: '✅', error: '❌', warning: '⚠️' };
    notif.innerHTML = (icons[type] || '') + ' ' + message;
    notif.className = 'notification ' + type + ' show';
    clearTimeout(notif._timer);
    notif._timer = setTimeout(() => notif.classList.remove('show'), 3000);
}

function saveCart() {
    localStorage.setItem('adjy_cart', JSON.stringify(cart));
    updateBadges();
}

function saveWishlist() {
    localStorage.setItem('adjy_wishlist', JSON.stringify(wishlist));
    updateBadges();
}

function saveHistory() {
    localStorage.setItem('adjy_history', JSON.stringify(viewedHistory));
}

function updateBadges() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = wishlist.length;
    
    const cartBadge = document.getElementById('cartBadge');
    const wishlistBadge = document.getElementById('wishlistBadge');
    
    cartBadge.textContent = cartCount;
    cartBadge.classList.toggle('hidden', cartCount === 0);
    
    wishlistBadge.textContent = wishlistCount;
    wishlistBadge.classList.toggle('hidden', wishlistCount === 0);
}

// ============================================
// SHAKE ANIMATION (for login error)
// ============================================
var shakeStyle = document.createElement('style');
shakeStyle.textContent = '@keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }';
document.head.appendChild(shakeStyle);