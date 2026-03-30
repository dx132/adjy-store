/**
 * cart.js
 * ADJY Store - Shopping Cart Logic
 *
 * @author ADJY Store
 * @version 2.0
 */

// ============================================
// CART FUNCTIONS
// ============================================
function addToCart(productId) {
    var product = products.find(function(p) { return p.id === productId; });
    if (!product || product.stock === 0) {
        showNotification('Produk tidak tersedia', 'error');
        return;
    }
    
    var existing = cart.find(function(item) { return item.id === productId; });
    if (existing) {
        if (existing.quantity >= product.stock) {
            showNotification('Stok tidak mencukupi', 'warning');
            return;
        }
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1,
            checked: true
        });
    }
    
    saveCart();
    showNotification(product.name + ' ditambahkan ke keranjang');
}

function toggleCartCheck(productId) {
    var item = cart.find(function(c) { return c.id === productId; });
    if (item) {
        item.checked = !item.checked;
        saveCart();
        renderCart();
    }
}

function updateCartQuantity(productId, change) {
    var item = cart.find(function(c) { return c.id === productId; });
    var product = products.find(function(p) { return p.id === productId; });
    
    if (!item) return;
    
    var newQty = item.quantity + change;
    if (newQty <= 0) {
        removeFromCart(productId);
    } else if (product && newQty > product.stock) {
        showNotification('Stok tidak mencukupi (tersisa ' + product.stock + ')', 'warning');
    } else {
        item.quantity = newQty;
        saveCart();
        renderCart();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(function(c) { return c.id !== productId; });
    saveCart();
    renderCart();
    showNotification('Produk dihapus dari keranjang');
}

function getSelectedCartTotal() {
    return cart.filter(function(c) { return c.checked; }).reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
}

function getSelectedCartCount() {
    return cart.filter(function(c) { return c.checked; }).reduce(function(sum, item) { return sum + item.quantity; }, 0);
}

function renderCart() {
    var container = document.getElementById('cartContainer');
    
    if (cart.length === 0) {
        container.innerHTML =
            '<div class="empty-state">' +
                '<div class="empty-icon">🛒</div>' +
                '<h3>Keranjang Anda Kosong</h3>' +
                '<p>Yuk, tambahkan produk favorit Anda!</p>' +
                '<button class="btn btn-primary mt-4" onclick="showSection(\'products\')">Belanja Sekarang</button>' +
            '</div>';
        document.getElementById('cartTotal').textContent = 'Rp 0';
        document.getElementById('selectedCount').textContent = '0 item';
        return;
    }
    
    container.innerHTML = cart.map(function(item) {
        return '<div class="cart-item">' +
            '<input type="checkbox" class="cart-item-checkbox" ' + (item.checked ? 'checked' : '') +
                   ' onchange="toggleCartCheck(' + item.id + ')">' +
            '<img src="' + item.image + '" class="cart-item-image" alt="' + item.name + '" onerror="this.src=\'https://via.placeholder.com/90\'" loading="lazy">' +
            '<div class="cart-item-details">' +
                '<div class="cart-item-name">' + item.name + '</div>' +
                '<div class="cart-item-price">' + formatPrice(item.price) + '</div>' +
            '</div>' +
            '<div class="quantity-control">' +
                '<button class="qty-btn" onclick="updateCartQuantity(' + item.id + ', -1)">−</button>' +
                '<span style="min-width: 24px; text-align: center; font-weight: 600;">' + item.quantity + '</span>' +
                '<button class="qty-btn" onclick="updateCartQuantity(' + item.id + ', 1)">+</button>' +
            '</div>' +
            '<div style="font-weight: bold; min-width: 90px; text-align: right; color: var(--primary);">' +
                formatPrice(item.price * item.quantity) +
            '</div>' +
            '<button class="btn btn-danger btn-sm" onclick="removeFromCart(' + item.id + ')" title="Hapus">🗑️</button>' +
        '</div>';
    }).join('');
    
    document.getElementById('cartTotal').textContent = formatPrice(getSelectedCartTotal());
    document.getElementById('selectedCount').textContent = getSelectedCartCount() + ' item';
}

function proceedToCheckout() {
    var selected = cart.filter(function(c) { return c.checked; });
    if (selected.length === 0) {
        showNotification('Pilih minimal 1 produk untuk checkout', 'warning');
        return;
    }
    currentCheckoutItems = selected;
    selectedShipping = null;
    selectedPayment = null;
    document.querySelectorAll('.shipping-option, .payment-option').forEach(function(el) { el.classList.remove('selected'); });
    document.querySelectorAll('input[name="payment"]').forEach(function(el) { el.checked = false; });
    document.getElementById('codFeeRow').style.display = 'none';
    document.getElementById('checkoutShipping').textContent = 'Rp 0';
    showSection('checkout');
    renderCheckoutSummary();
}