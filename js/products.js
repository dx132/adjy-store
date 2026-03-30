/**
 * products.js
 * ADJY Store - Product Rendering, Detail Modal & Compare
 *
 * @author ADJY Store
 * @version 2.0
 */

// ============================================
// PRODUCT FUNCTIONS
// ============================================
function getStockStatus(stock) {
    if (stock === 0) return { text: 'Stok Habis', class: 'out' };
    if (stock <= 5) return { text: 'Sisa ' + stock, class: 'low' };
    return { text: 'Tersedia', class: 'available' };
}

function createProductCard(product, showCompare) {
    if (showCompare === undefined) showCompare = true;
    const stockStatus = getStockStatus(product.stock);
    const inWishlist = wishlist.includes(product.id);
    const inCompare = compareList.includes(product.id);
    
    return '<div class="product-card" data-id="' + product.id + '">' +
        '<div class="product-image-container">' +
            '<img src="' + product.images[0] + '" class="product-image" alt="' + product.name + '" ' +
                 'onerror="this.src=\'https://via.placeholder.com/300x220?text=No+Image\'" ' +
                 'onclick="openProductDetail(' + product.id + ')" loading="lazy">' +
            '<div class="product-badges">' +
                '<span class="badge-stock ' + stockStatus.class + '">' + stockStatus.text + '</span>' +
            '</div>' +
            '<button class="wishlist-btn ' + (inWishlist ? 'active' : '') + '" onclick="toggleWishlist(' + product.id + ', event)" title="Wishlist">' +
                (inWishlist ? '❤️' : '🤍') +
            '</button>' +
            (showCompare ? '<button class="wishlist-btn" style="top: 50px;' + (inCompare ? ' background: var(--primary); color: white;' : '') + '" ' +
                'onclick="toggleCompare(' + product.id + ', event)" title="Bandingkan">' +
                (inCompare ? '✓' : '⚖️') +
            '</button>' : '') +
        '</div>' +
        '<div class="product-info">' +
            '<div class="product-category">' + product.category + '</div>' +
            '<div class="product-name" onclick="openProductDetail(' + product.id + ')" style="cursor: pointer;">' + product.name + '</div>' +
            '<div class="product-rating">' +
                '<span class="stars">' + '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating)) + '</span>' +
                '<span>(' + product.reviews + ')</span>' +
            '</div>' +
            '<div class="product-price">' + formatPrice(product.price) + '</div>' +
            '<div class="product-actions">' +
                '<button class="btn btn-primary" onclick="openProductDetail(' + product.id + ')" style="flex: 1;">Detail</button>' +
                '<button class="btn btn-primary" onclick="addToCart(' + product.id + ')" ' + (product.stock === 0 ? 'disabled' : '') + '>' +
                    (product.stock === 0 ? 'Habis' : '🛒') +
                '</button>' +
            '</div>' +
        '</div>' +
    '</div>';
}

function renderFeaturedProducts() {
    // BUG FIX: Use slice() before sort() to avoid mutating original array
    var featured = products.slice().sort(function(a, b) { return b.sold - a.sold; }).slice(0, 4);
    document.getElementById('featuredProducts').innerHTML = featured.map(function(p) { return createProductCard(p); }).join('');
}

function renderAllProducts() {
    var filtered = currentFilter === 'all' ? products.slice() : products.filter(function(p) { return p.category === currentFilter; });
    
    var searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    if (searchTerm) {
        filtered = filtered.filter(function(p) {
            return p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm);
        });
    }
    
    if (currentSort === 'price-asc') filtered.sort(function(a, b) { return a.price - b.price; });
    else if (currentSort === 'price-desc') filtered.sort(function(a, b) { return b.price - a.price; });
    else if (currentSort === 'newest') filtered.sort(function(a, b) { return b.id - a.id; });
    else if (currentSort === 'popular') filtered.sort(function(a, b) { return b.sold - a.sold; });
    
    var container = document.getElementById('allProducts');
    if (filtered.length) {
        container.innerHTML = filtered.map(function(p) { return createProductCard(p); }).join('');
    } else {
        container.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><div class="empty-icon">🔍</div><h3>Tidak ada produk ditemukan</h3><p style="margin-top: 0.5rem;">Coba kata kunci lain</p></div>';
    }
}

function renderRecommendations() {
    var recs = products.filter(function(p) { return !cart.find(function(c) { return c.id === p.id; }) && p.stock > 0; })
        .sort(function() { return 0.5 - Math.random(); }).slice(0, 4);
    document.getElementById('recommendedProducts').innerHTML = recs.map(function(p) { return createProductCard(p); }).join('');
}

// BUG FIX: Pass element explicitly instead of relying on implicit event
function filterCategory(cat, el) {
    currentFilter = cat;
    document.querySelectorAll('.pill').forEach(function(p) { p.classList.remove('active'); });
    if (el) el.classList.add('active');
    renderAllProducts();
}

function sortProducts() {
    currentSort = document.getElementById('sortSelect').value;
    renderAllProducts();
}

// BUG FIX: Use debounce for search instead of firing on every keyup
function debounceSearch() {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(function() {
        if (document.getElementById('products').classList.contains('active')) {
            renderAllProducts();
        } else {
            showSection('products');
        }
    }, 300);
}

// Also handle Enter key
document.getElementById('searchInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        clearTimeout(searchDebounceTimer);
        if (!document.getElementById('products').classList.contains('active')) {
            showSection('products');
        } else {
            renderAllProducts();
        }
    }
});

// ============================================
// PRODUCT DETAIL MODAL
// ============================================
function openProductDetail(productId) {
    var product = products.find(function(p) { return p.id === productId; });
    if (!product) return;
    
    // Add to history
    if (!viewedHistory.find(function(h) { return h.id === productId; })) {
        viewedHistory.unshift({id: productId, viewedAt: new Date().toISOString()});
        if (viewedHistory.length > 20) viewedHistory.pop();
        saveHistory();
    }
    
    var stockStatus = getStockStatus(product.stock);
    var inWishlist = wishlist.includes(productId);
    
    var imagesHtml = product.images.map(function(img, idx) {
        return '<img src="' + img + '" class="thumbnail ' + (idx === 0 ? 'active' : '') + '" onclick="changeMainImage(this, \'' + img + '\')" ' +
               'onerror="this.src=\'https://via.placeholder.com/80?text=No+Image\'" loading="lazy">';
    }).join('');
    
    var specsHtml = Object.entries(product.specs).map(function(entry) {
        return '<tr><td>' + entry[0] + '</td><td>' + entry[1] + '</td></tr>';
    }).join('');
    
    var reviewsHtml = product.reviews_list.length ? product.reviews_list.map(function(r) {
        return '<div class="review-item">' +
            '<div class="review-header">' +
                '<span class="reviewer-name">👤 ' + r.name + '</span>' +
                '<span class="review-date">' + r.date + '</span>' +
            '</div>' +
            '<div class="stars">' + '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating) + '</div>' +
            '<p style="margin-top: 0.25rem;">' + r.comment + '</p>' +
        '</div>';
    }).join('') : '<p style="color: var(--text-light); padding: 1rem 0;">Belum ada review untuk produk ini.</p>';
    
    document.getElementById('productDetailContent').innerHTML =
        '<div class="detail-gallery">' +
            '<img src="' + product.images[0] + '" class="main-image" id="mainImage" alt="' + product.name + '" ' +
                 'onerror="this.src=\'https://via.placeholder.com/400?text=No+Image\'">' +
            '<div class="thumbnail-list">' + imagesHtml + '</div>' +
        '</div>' +
        '<div class="detail-info">' +
            '<span class="product-category">' + product.category + '</span>' +
            '<h2>' + product.name + '</h2>' +
            '<div class="detail-meta">' +
                '<div class="product-rating">' +
                    '<span class="stars">' + '★'.repeat(Math.floor(product.rating)) + '</span>' +
                    '<span>' + product.rating + ' (' + product.reviews + ' ulasan)</span>' +
                '</div>' +
                '<div>Terjual: ' + product.sold + '</div>' +
                '<div class="badge-stock ' + stockStatus.class + '">' + stockStatus.text + '</div>' +
            '</div>' +
            '<div class="detail-price">' + formatPrice(product.price) + '</div>' +
            '<p class="detail-description">' + product.description + '</p>' +
            '<table class="specs-table"><tbody>' + specsHtml + '</tbody></table>' +
            '<div style="display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap;">' +
                '<button class="btn btn-primary" onclick="addToCart(' + product.id + '); closeModal(\'productModal\');" ' +
                    (product.stock === 0 ? 'disabled' : '') + ' style="flex: 1; min-width: 150px;">' +
                    (product.stock === 0 ? '🚫 Stok Habis' : '🛒 Tambah ke Keranjang') +
                '</button>' +
                '<button class="btn btn-secondary" onclick="toggleWishlist(' + product.id + ')" style="width: auto;">' +
                    (inWishlist ? '❤️' : '🤍') +
                '</button>' +
                '<button class="btn btn-secondary" onclick="toggleCompare(' + product.id + ')" style="width: auto;">' +
                    '⚖️' +
                '</button>' +
            '</div>' +
            '<div class="reviews-section">' +
                '<h3 style="margin-bottom: 1rem;">💬 Review Pelanggan</h3>' +
                reviewsHtml +
            '</div>' +
        '</div>';
    
    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function changeMainImage(thumb, src) {
    document.querySelectorAll('.thumbnail').forEach(function(t) { t.classList.remove('active'); });
    thumb.classList.add('active');
    document.getElementById('mainImage').src = src;
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = '';
}

function closeModalOnOverlay(e, modalId) {
    if (e.target === e.currentTarget) {
        closeModal(modalId);
    }
}

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(function(m) {
            m.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

// ============================================
// COMPARE FUNCTIONS
// ============================================
function toggleCompare(productId, event) {
    if (event) event.stopPropagation();
    
    var idx = compareList.indexOf(productId);
    if (idx > -1) {
        compareList.splice(idx, 1);
        showNotification('Dihapus dari perbandingan');
    } else {
        if (compareList.length >= 3) {
            showNotification('Maksimal 3 produk untuk dibandingkan', 'warning');
            return;
        }
        compareList.push(productId);
        showNotification('Ditambahkan ke perbandingan');
    }
    
    localStorage.setItem('adjy_compare', JSON.stringify(compareList));
    updateCompareBar();
    
    // Re-render if on products page
    if (document.getElementById('products').classList.contains('active')) {
        renderAllProducts();
    }
}

function updateCompareBar() {
    var bar = document.getElementById('compareBar');
    var container = document.getElementById('compareItems');
    
    if (compareList.length === 0) {
        bar.classList.remove('active');
        return;
    }
    
    bar.classList.add('active');
    container.innerHTML = compareList.map(function(id) {
        var p = products.find(function(x) { return x.id === id; });
        if (!p) return '';
        return '<div class="compare-thumb-wrapper">' +
            '<img src="' + p.images[0] + '" class="compare-thumb" alt="' + p.name + '" onerror="this.src=\'https://via.placeholder.com/60\'">' +
            '<button class="remove-compare" onclick="toggleCompare(' + id + ')">×</button>' +
        '</div>';
    }).join('');
}

function clearCompare() {
    compareList = [];
    localStorage.setItem('adjy_compare', JSON.stringify(compareList));
    updateCompareBar();
    if (document.getElementById('products').classList.contains('active')) {
        renderAllProducts();
    }
}

function showCompareModal() {
    if (compareList.length < 2) {
        showNotification('Pilih minimal 2 produk untuk dibandingkan', 'warning');
        return;
    }
    
    var items = compareList.map(function(id) { return products.find(function(p) { return p.id === id; }); }).filter(Boolean);
    var labels = ['Nama', 'Harga', 'Kategori', 'Rating', 'Terjual', 'Stok'];
    
    var rows = labels.map(function(label) {
        var cells = items.map(function(p) {
            if (label === 'Nama') return p.name;
            if (label === 'Harga') return formatPrice(p.price);
            if (label === 'Kategori') return p.category;
            if (label === 'Rating') return '★ ' + p.rating;
            if (label === 'Terjual') return p.sold;
            if (label === 'Stok') return p.stock;
            return '';
        }).map(function(val) { return '<td style="padding: 0.85rem; border: 1px solid var(--border);">' + val + '</td>'; }).join('');
        return '<tr><td style="padding: 0.85rem; border: 1px solid var(--border); font-weight: bold; color: var(--text-light);">' + label + '</td>' + cells + '</tr>';
    }).join('');
    
    var headers = items.map(function(p) {
        return '<th style="padding: 1rem; border: 1px solid var(--border); text-align: center;">' +
            '<img src="' + p.images[0] + '" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin-bottom: 0.5rem; display: block; margin-left: auto; margin-right: auto;" onerror="this.src=\'https://via.placeholder.com/80\'">' +
            '<div style="font-size: 0.9rem;">' + p.name + '</div></th>';
    }).join('');
    
    document.getElementById('compareContent').innerHTML =
        '<table style="width: 100%; border-collapse: collapse;">' +
            '<thead><tr><th style="padding: 1rem; border: 1px solid var(--border);">Fitur</th>' + headers + '</tr></thead>' +
            '<tbody>' + rows + '</tbody>' +
        '</table>' +
        '<div style="margin-top: 1.5rem; text-align: center;">' +
            '<button class="btn btn-secondary" onclick="clearCompare(); closeModal(\'compareModal\');">Hapus Perbandingan</button>' +
        '</div>';
    
    document.getElementById('compareModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}