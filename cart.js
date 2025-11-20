// =========================================
// CAMBO NET - Shopping Cart System
// Version: 3.0.0
// =========================================

// =========================================
// PRODUCT DATA WITH SIZES AND PRICES
// =========================================

const productSizes = {
  "ម្ជុល 3 (ស្តើង)": [
    { size: "3 ម៉ែត្រ", price: 50 },
    { size: "4 ម៉ែត្រ", price: 65 },
    { size: "6 ម៉ែត្រ", price: 85 }
  ],
  "ម្ជុល 6 (កណ្ដាល)": [
    { size: "3 ម៉ែត្រ", price: 65 },
    { size: "4 ម៉ែត្រ", price: 80 },
    { size: "6 ម៉ែត្រ", price: 100 }
  ],
  "ម្ជុល 8 (ក្រាស់)": [
    { size: "3 ម៉ែត្រ", price: 85 },
    { size: "4 ម៉ែត្រ", price: 100 },
    { size: "6 ម៉ែត្រ", price: 120 }
  ]
};

// =========================================
// CART STATE MANAGEMENT
// =========================================

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentProduct = null;
let selectedSize = null;

// =========================================
// PRODUCT DETAIL MODAL FUNCTIONS
// =========================================

/**
 * Show product detail modal with size options
 */
function showProductDetail(name, description, image) {
  currentProduct = { name, description, image };
  
  // Update modal content
  document.getElementById('modalProductName').textContent = name;
  document.getElementById('modalProductDesc').textContent = description;
  document.getElementById('modalProductImage').src = image;
  
  // Render size options
  const sizeOptions = document.getElementById('sizeOptions');
  sizeOptions.innerHTML = '';
  
  productSizes[name].forEach((option, index) => {
    const sizeBtn = document.createElement('button');
    sizeBtn.className = 'size-option' + (index === 0 ? ' active' : '');
    sizeBtn.textContent = option.size;
    sizeBtn.onclick = () => selectSize(name, option.size, option.price);
    sizeOptions.appendChild(sizeBtn);
  });
  
  // Set default selection (first size)
  const defaultOption = productSizes[name][0];
  selectSize(name, defaultOption.size, defaultOption.price);
  
  // Show modal
  document.getElementById('productModal').classList.add('show');
}

/**
 * Handle size selection
 */
function selectSize(productName, size, price) {
  selectedSize = { size, price };
  
  // Update active state on buttons
  document.querySelectorAll('.size-option').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent === size) {
      btn.classList.add('active');
    }
  });
  
  // Update price display
  updatePriceDisplay();
}

/**
 * Update price display based on quantity
 */
function updatePriceDisplay() {
  if (!selectedSize) return;
  
  const qty = parseInt(document.getElementById('productQty').value) || 1;
  const price = selectedSize.price;
  const total = price * qty;
  
  document.getElementById('selectedPrice').textContent = `$${price.toFixed(2)}`;
  document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;
}

/**
 * Increase quantity
 */
function increaseQty() {
  const input = document.getElementById('productQty');
  input.value = parseInt(input.value) + 1;
  updatePriceDisplay();
}

/**
 * Decrease quantity
 */
function decreaseQty() {
  const input = document.getElementById('productQty');
  const currentValue = parseInt(input.value);
  if (currentValue > 1) {
    input.value = currentValue - 1;
    updatePriceDisplay();
  }
}

// =========================================
// SHOPPING CART FUNCTIONS
// =========================================

/**
 * Add current product to cart
 */
function addToCart() {
  if (!currentProduct || !selectedSize) {
    showNotification('សូមជ្រើសរើសទំហំផលិតផល!', 'warning');
    return;
  }
  
  const qty = parseInt(document.getElementById('productQty').value) || 1;
  
  const cartItem = {
    id: Date.now(),
    name: currentProduct.name,
    size: selectedSize.size,
    price: selectedSize.price,
    quantity: qty,
    image: currentProduct.image,
    addedAt: new Date().toISOString()
  };
  
  cart.push(cartItem);
  saveCart();
  updateCartBadge();
  
  showNotification('បានបញ្ចូលទៅកន្ត្រក! 🛒', 'success');
  document.getElementById('productModal').classList.remove('show');
  
  // Reset quantity to 1
  document.getElementById('productQty').value = 1;
}

/**
 * Add to cart and go directly to cart
 */
function buyNow() {
  addToCart();
  setTimeout(() => {
    showCart();
  }, 300);
}

/**
 * Show cart modal
 */
function showCart() {
  renderCartItems();
  document.getElementById('cartModal').classList.add('show');
}

/**
 * Render all cart items
 */
function renderCartItems() {
  const cartItemsDiv = document.getElementById('cartItems');
  
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p class="empty-cart">កន្ត្រករបស់អ្នកទទេ</p>';
    document.querySelector('.cart-summary').style.display = 'none';
    return;
  }
  
  document.querySelector('.cart-summary').style.display = 'block';
  
  let html = '<div class="cart-items-list">';
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" />
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>ទំហំ: ${item.size}</p>
          <p class="item-price">$${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <div class="cart-item-actions">
          <span class="item-total">$${itemTotal.toFixed(2)}</span>
          <button class="btn-remove" onclick="removeFromCart(${item.id})">🗑️</button>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  cartItemsDiv.innerHTML = html;
  document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

/**
 * Remove item from cart
 */
function removeFromCart(itemId) {
  if (confirm('តើអ្នកចង់លុបផលិតផលនេះមែនទេ?')) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartBadge();
    renderCartItems();
    showNotification('បានដកចេញពីកន្ត្រក', 'info');
  }
}

/**
 * Save cart to localStorage
 */
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Update cart badge count
 */
function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.textContent = count;
    
    // Add animation when count changes
    badge.style.transform = 'scale(1.3)';
    setTimeout(() => {
      badge.style.transform = 'scale(1)';
    }, 200);
  }
}

/**
 * Clear entire cart
 */
function clearCart() {
  if (confirm('តើអ្នកចង់លុបផលិតផលទាំងអស់មែនទេ?')) {
    cart = [];
    saveCart();
    updateCartBadge();
    renderCartItems();
    showNotification('កន្ត្រកទទេហើយ', 'info');
  }
}

// =========================================
// CHECKOUT PROCESS
// =========================================

/**
 * Proceed to checkout
 */
function proceedToCheckout() {
  if (cart.length === 0) {
    showNotification('សូមបញ្ចូលផលិតផលទៅកន្ត្រក', 'warning');
    return;
  }
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    showNotification('សូមចូលប្រើប្រាស់ជាមុនសិន!', 'warning');
    document.getElementById('cartModal').classList.remove('show');
    document.getElementById('loginModal').classList.add('show');
    return;
  }
  
  // Pre-fill customer info if available
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser && currentUser.name) {
    document.getElementById('customerName').value = currentUser.name;
  }
  
  renderCheckoutItems();
  document.getElementById('cartModal').classList.remove('show');
  document.getElementById('checkoutModal').classList.add('show');
}

/**
 * Render checkout items summary
 */
function renderCheckoutItems() {
  const checkoutItemsDiv = document.getElementById('checkoutItems');
  let html = '';
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    html += `
      <div class="summary-row">
        <span>${item.name} (${item.size}) x ${item.quantity}</span>
        <span>$${itemTotal.toFixed(2)}</span>
      </div>
    `;
  });
  
  checkoutItemsDiv.innerHTML = html;
  document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
}

// =========================================
// ORDER SUBMISSION
// =========================================

/**
 * Handle checkout form submission
 */
document.addEventListener('DOMContentLoaded', () => {
  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }
});

function handleCheckoutSubmit(e) {
  e.preventDefault();
  
  const customerName = document.getElementById('customerName').value.trim();
  const customerPhone = document.getElementById('customerPhone').value.trim();
  const customerAddress = document.getElementById('customerAddress').value.trim();
  
  // Validation
  if (!customerName || !customerPhone || !customerAddress) {
    showNotification('សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់!', 'warning');
    return;
  }
  
  // Create order object
  const order = {
    id: 'ORD' + Date.now(),
    customer: {
      name: customerName,
      phone: customerPhone,
      address: customerAddress
    },
    items: [...cart],
    payment: document.querySelector('input[name="payment"]:checked').value,
    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    date: new Date().toISOString(),
    status: 'កំពុងដំណើរការ'
  };
  
  // Save order to localStorage
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  
  // Clear cart
  cart = [];
  saveCart();
  updateCartBadge();
  
  // Close modal
  document.getElementById('checkoutModal').classList.remove('show');
  
  // Show success message
  showNotification('ការបញ្ជាទិញបានជោគជ័យ! 🎉 យើងនឹងទាក់ទងអ្នកឆាប់ៗនេះ។', 'success');
  
  // Reset form
  e.target.reset();
  
  // Optional: Send to WhatsApp or Telegram
  // sendOrderNotification(order);
}

// =========================================
// ORDER HISTORY
// =========================================

/**
 * Show order history modal
 */
function showOrderHistory() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    showNotification('សូមចូលប្រើប្រាស់ជាមុនសិន!', 'warning');
    document.getElementById('loginModal').classList.add('show');
    return;
  }
  
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const historyDiv = document.getElementById('historyItems');
  
  if (orders.length === 0) {
    historyDiv.innerHTML = '<p class="empty-cart">មិនមានប្រវត្តិការបញ្ជាទិញ</p>';
  } else {
    let html = '<div class="order-history-list">';
    
    // Show most recent orders first
    orders.reverse().forEach(order => {
      const date = new Date(order.date).toLocaleDateString('km-KH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      html += `
        <div class="order-history-item">
          <div class="order-header">
            <h3>លេខបញ្ជាទិញ: ${order.id}</h3>
            <span class="order-status">${order.status}</span>
          </div>
          <p class="order-date">📅 កាលបរិច្ឆេទ: ${date}</p>
          <div class="order-items">
            ${order.items.map(item => `
              <div class="order-item-row">
                <span>${item.name} (${item.size}) x ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div class="order-footer">
            <span>💳 ${getPaymentMethodName(order.payment)}</span>
            <strong>សរុប: $${order.total.toFixed(2)}</strong>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    historyDiv.innerHTML = html;
  }
  
  document.getElementById('historyModal').classList.add('show');
}

/**
 * Get payment method display name
 */
function getPaymentMethodName(method) {
  const methods = {
    'cod': 'សាច់ប្រាក់ពេលទទួល',
    'aba': 'ABA Mobile Banking',
    'wing': 'Wing Money',
    'acleda': 'ACLEDA Mobile'
  };
  return methods[method] || method;
}

// =========================================
// NOTIFICATION SYSTEM
// =========================================

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifs = document.querySelectorAll('.notification');
  existingNotifs.forEach(n => n.remove());
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `<span>${message}</span>`;
  
  // Base styles
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '15px 25px',
    borderRadius: '12px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
    zIndex: '100000',
    animation: 'slideInRight 0.3s',
    fontSize: '1rem',
    fontWeight: '500',
    maxWidth: '400px'
  });
  
  // Type-specific colors
  const colors = {
    success: { bg: '#dcfce7', color: '#166534', border: '#22c55e' },
    error: { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' },
    warning: { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' },
    info: { bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' }
  };
  
  const colorSet = colors[type] || colors.info;
  notification.style.background = colorSet.bg;
  notification.style.color = colorSet.color;
  notification.style.borderLeft = `4px solid ${colorSet.border}`;
  
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOutRight 0.3s';
      setTimeout(() => notification.remove(), 300);
    }
  }, 3000);
}

// =========================================
// MODAL CLOSE HANDLERS
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  // Close button handlers
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.modal').classList.remove('show');
    });
  });
  
  // Click outside to close
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  });
  
  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.show').forEach(modal => {
        modal.classList.remove('show');
      });
    }
  });
  
  // Quantity input listener
  const qtyInput = document.getElementById('productQty');
  if (qtyInput) {
    qtyInput.addEventListener('input', updatePriceDisplay);
    qtyInput.addEventListener('change', updatePriceDisplay);
  }
});

// =========================================
// INITIALIZATION
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  // Update cart badge on page load
  updateCartBadge();
  
  console.log('%c🛒 Cart System Loaded', 'color: #22c55e; font-size: 14px; font-weight: bold;');
  console.log(`Cart items: ${cart.length}`);
});

// =========================================
// EXPORT FUNCTIONS TO GLOBAL SCOPE
// =========================================

window.showProductDetail = showProductDetail;
window.selectSize = selectSize;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
window.addToCart = addToCart;
window.buyNow = buyNow;
window.showCart = showCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToCheckout;
window.showOrderHistory = showOrderHistory;
window.showNotification = showNotification;