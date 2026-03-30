/**
 * app.js
 * ADJY Store - App Initialization & Event Listeners
 *
 * @author ADJY Store
 * @version 2.0
 */

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    updateBadges();
    updateCompareBar();
    renderFeaturedProducts();
    renderRecommendations();
    checkAdminSession();
    
    showLoading();
    setTimeout(hideLoading, 400);
});