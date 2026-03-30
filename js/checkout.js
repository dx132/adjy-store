/**
 * checkout.js
 * ADJY Store - Checkout & Payment Processing
 *
 * @author ADJY Store
 * @version 2.0
 */

// ============================================
// CHECKOUT FUNCTIONS
// ============================================
function renderCheckoutSummary() {
    var container = document.getElementById('checkoutItems');
    var subtotal = currentCheckoutItems.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
    
    container.innerHTML = currentCheckoutItems.map(function(item) {
        return '<div style="display: flex; gap: 0.75rem; margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border); align-items: center;">' +
            '<img src="' + item.image + '" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; flex-shrink: 0;" ' +
                 'onerror="this.src=\'https://via.placeholder.com/50\'" loading="lazy">' +
            '<div style="flex: 1; min-width: 0;">' +
                '<div style="font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + item.name + '</div>' +
                '<div style="font-size: 0.85rem; color: var(--text-light);">' + item.quantity + ' × ' + formatPrice(item.price) + '</div>' +
            '</div>' +
            '<div style="font-weight: bold; white-space: nowrap;">' + formatPrice(item.price * item.quantity) + '</div>' +
        '</div>';
    }).join('');
    
    document.getElementById('checkoutSubtotal').textContent = formatPrice(subtotal);
    updateCheckoutTotal();
}

// BUG FIX: Pass element explicitly instead of using implicit event
function selectShipping(courier, cost, el) {
    selectedShipping = { courier: courier, cost: cost };
    document.querySelectorAll('.shipping-option').forEach(function(e) { e.classList.remove('selected'); });
    if (el) el.classList.add('selected');
    document.getElementById('checkoutShipping').textContent = formatPrice(cost);
    updateCheckoutTotal();
}

function selectPayment(method, el) {
    selectedPayment = method;
    document.querySelectorAll('.payment-option').forEach(function(e) { e.classList.remove('selected'); });
    if (el) el.classList.add('selected');
    
    document.getElementById('codFeeRow').style.display = method === 'cod' ? 'flex' : 'none';
    updateCheckoutTotal();
}

function updateCheckoutTotal() {
    var subtotal = currentCheckoutItems.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
    var shipping = selectedShipping ? selectedShipping.cost : 0;
    var codFee = selectedPayment === 'cod' ? 5000 : 0;
    var total = subtotal + shipping + codFee;
    
    document.getElementById('checkoutTotal').textContent = formatPrice(total);
}

function processCheckout() {
    var name = document.getElementById('checkoutName').value.trim();
    var phone = document.getElementById('checkoutPhone').value.trim();
    var address = document.getElementById('checkoutAddress').value.trim();
    var city = document.getElementById('checkoutCity').value;
    
    if (!name || !phone || !address || !city) {
        showNotification('Lengkapi semua data pengiriman', 'error');
        return;
    }
    
    if (!selectedShipping) {
        showNotification('Pilih metode pengiriman', 'error');
        return;
    }
    
    if (!selectedPayment) {
        showNotification('Pilih metode pembayaran', 'error');
        return;
    }
    
    showLoading();
    
    var subtotal = currentCheckoutItems.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
    var total = subtotal + selectedShipping.cost + (selectedPayment === 'cod' ? 5000 : 0);
    
    var order = {
        id: 'ORD-' + Date.now(),
        date: new Date().toISOString(),
        customer: { name: name, phone: phone, address: address, city: city },
        items: currentCheckoutItems.map(function(item) { return Object.assign({}, item); }),
        shipping: Object.assign({}, selectedShipping),
        payment: selectedPayment,
        subtotal: subtotal,
        total: total,
        status: 'pending',
        resi: ''
    };
    
    orders.unshift(order);
    localStorage.setItem('adjy_orders', JSON.stringify(orders));
    
    // Update stock
    currentCheckoutItems.forEach(function(item) {
        var product = products.find(function(p) { return p.id === item.id; });
        if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
            product.sold += item.quantity;
        }
    });
    
    // Remove checked items from cart
    cart = cart.filter(function(c) { return !c.checked; });
    saveCart();
    
    // Generate WhatsApp message
    var wa = storeSettings.whatsapp;
    var msg = '*PESANAN BARU - ' + storeSettings.storeName + '*%0A%0A';
    msg += '*Data Pembeli:*%0A';
    msg += 'Nama: ' + name + '%0A';
    msg += 'HP: ' + phone + '%0A';
    msg += 'Alamat: ' + address + ', ' + city + '%0A%0A';
    msg += '*Pesanan:*%0A';
    currentCheckoutItems.forEach(function(item, i) {
        msg += (i + 1) + '. ' + item.name + ' x' + item.quantity + ' = ' + formatPrice(item.price * item.quantity) + '%0A';
    });
    msg += '%0A*Subtotal:* ' + formatPrice(subtotal) + '%0A';
    msg += '*Ongkir:* ' + formatPrice(selectedShipping.cost) + '%0A';
    if (selectedPayment === 'cod') msg += '*Biaya COD:* Rp 5.000%0A';
    msg += '*TOTAL:* ' + formatPrice(total) + '%0A%0A';
    msg += '*Pembayaran:* ' + selectedPayment.toUpperCase() + '%0A';
    msg += '*Pengiriman:* ' + selectedShipping.courier.toUpperCase() + '%0A';
    msg += '%0ATerima kasih! 🙏';
    
    setTimeout(function() {
        hideLoading();
        window.open('https://wa.me/' + wa + '?text=' + msg, '_blank');
        showNotification('Pesanan berhasil dibuat! 🎉');
        showSection('home');
        
        // Reset form
        document.getElementById('checkoutName').value = '';
        document.getElementById('checkoutPhone').value = '';
        document.getElementById('checkoutAddress').value = '';
        document.getElementById('checkoutCity').value = '';
        selectedShipping = null;
        selectedPayment = null;
        currentCheckoutItems = [];
    }, 1000);
}