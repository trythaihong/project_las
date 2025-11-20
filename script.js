// =========================================
// Authentication System
// =========================================

const TEST_CREDENTIALS = {
  email: 'demo@test.com',
  password: 'password123'
};

let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Update UI based on login status
function updateAuthUI() {
  const authButton = document.getElementById('authButton');
  const loginBtn = document.getElementById('loginBtn');
  
  if (isLoggedIn && currentUser) {
    loginBtn.textContent = `សួស្តី, ${currentUser.name || 'អ្នកប្រើប្រាស់'}`;
    loginBtn.onclick = (e) => {
      e.preventDefault();
      logout();
    };
  } else {
    loginBtn.textContent = 'ចូលប្រើប្រាស់';
    loginBtn.onclick = (e) => {
      e.preventDefault();
      showLoginModal();
    };
  }
}

// Show login modal
function showLoginModal() {
  const loginModal = document.getElementById('loginModal');
  loginModal.classList.add('show');
}

// Hide login modal
function hideLoginModal() {
  const loginModal = document.getElementById('loginModal');
  loginModal.classList.remove('show');
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
    isLoggedIn = true;
    currentUser = {
      email: email,
      name: 'អ្នកប្រើប្រាស់',
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    hideLoginModal();
    updateAuthUI();
    
    showNotification('ចូលប្រើប្រាស់ដោយជោគជ័យ! 🎉', 'success');
  } else {
    showNotification('អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ!', 'error');
  }
});

// Logout function
function logout() {
  if (confirm('តើអ្នកចង់ចាកចេញពីប្រព័ន្ធមែនទេ?')) {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showNotification('អ្នកបានចាកចេញដោយជោគជ័យ!', 'info');
  }
}

// =========================================
// Mobile Menu Toggle
// =========================================

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// =========================================
// Smooth Scrolling
// =========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || !href.includes('#')) return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// =========================================
// Header Scroll Effect
// =========================================

let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
  } else {
    header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
  }
  
  lastScroll = currentScroll;
});

// =========================================
// Scroll Animations
// =========================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.product-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 0.6s ease-out';
  observer.observe(el);
});

// =========================================
// Modal Close Handlers (for login modal)
// =========================================

document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.target.closest('.modal').classList.remove('show');
  });
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });
});

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.show').forEach(modal => {
      modal.classList.remove('show');
    });
  }
});

// =========================================
// Back to Top Button
// =========================================

const createBackToTopButton = () => {
  const button = document.createElement('button');
  button.innerHTML = '↑';
  button.className = 'back-to-top';
  button.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 30px;
    width: 55px;
    height: 55px;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0;
    transition: all 0.3s;
    z-index: 998;
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
  `;
  
  document.body.appendChild(button);
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      button.style.opacity = '1';
      button.style.pointerEvents = 'auto';
    } else {
      button.style.opacity = '0';
      button.style.pointerEvents = 'none';
    }
  });
  
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-5px)';
    button.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.5)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.4)';
  });
};

// =========================================
// FAQ Accordion (if you add FAQ section)
// =========================================

document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const faqItem = question.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
      faqItem.classList.add('active');
    }
  });
});

// =========================================
// Registration Link Handler
// =========================================

const showRegisterLink = document.getElementById('showRegister');
if (showRegisterLink) {
  showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    showNotification('មុខងារចុះឈ្មោះនឹងមកដល់ឆាប់ៗនេះ!', 'info');
  });
}

// =========================================
// Notification System (shared with cart.js)
// =========================================

if (typeof showNotification === 'undefined') {
  window.showNotification = function(message, type = 'info') {
    const existingNotifs = document.querySelectorAll('.notification');
    existingNotifs.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<span>${message}</span>`;
    
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
      fontWeight: '500'
    });
    
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
    
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideOutRight 0.3s';
        setTimeout(() => notification.remove(), 300);
      }
    }, 3000);
  };
}

// =========================================
// Loading Animation
// =========================================

function showLoading() {
  const loader = document.createElement('div');
  loader.id = 'pageLoader';
  loader.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
  `;
  loader.innerHTML = `
    <div style="text-align: center;">
      <div style="
        width: 60px;
        height: 60px;
        border: 4px solid #e5e7eb;
        border-top: 4px solid #22c55e;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
      <p style="margin-top: 20px; color: #666; font-size: 1.1rem;">កំពុងផ្ទុក...</p>
    </div>
  `;
  document.body.appendChild(loader);
}

function hideLoading() {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.3s';
    setTimeout(() => loader.remove(), 300);
  }
}

// Add spin animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// =========================================
// Form Validation Helper
// =========================================

function validatePhoneNumber(phone) {
  // Cambodian phone number validation
  const phoneRegex = /^(\+855|0)(1[0-9]|2[0-9]|3[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])[0-9]{6,7}$/;
  return phoneRegex.test(phone);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// =========================================
// Local Storage Helper Functions
// =========================================

function clearAllData() {
  if (confirm('តើអ្នកពិតជាចង់លុបទិន្នន័យទាំងអស់មែនទេ?')) {
    localStorage.clear();
    location.reload();
  }
}

// Export data as JSON
function exportData() {
  const data = {
    cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    orders: JSON.parse(localStorage.getItem('orders') || '[]'),
    user: JSON.parse(localStorage.getItem('currentUser') || 'null')
  };
  
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `cambo-net-data-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  
  showNotification('បានទាញយកទិន្នន័យ!', 'success');
}

// =========================================
// WhatsApp Integration (Optional)
// =========================================

function sendWhatsAppMessage(phone, message) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// =========================================
// Initialization
// =========================================

window.addEventListener('load', () => {
  // Update auth UI
  updateAuthUI();
  
  // Create back to top button
  createBackToTopButton();
  
  // Page load animation
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '1';
  }, 100);
  
  console.log('%c🌱 CAMBO NET Website Loaded!', 'color: #22c55e; font-size: 18px; font-weight: bold;');
  console.log('%cVersion: 3.0.0 - Enhanced Shopping System', 'color: #666; font-size: 12px;');
  console.log('%cFeatures: 🛒 Cart | 📦 Orders | 💳 Payments | 📜 History', 'color: #666; font-size: 12px;');
});

// =========================================
// Error Handling
// =========================================

window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  // You can send errors to a logging service here
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  // You can send errors to a logging service here
});

// =========================================
// Online/Offline Detection
// =========================================

window.addEventListener('online', () => {
  showNotification('អ៊ីនធឺណិតភ្ជាប់ហើយ! 🌐', 'success');
});

window.addEventListener('offline', () => {
  showNotification('អ៊ីនធឺណិតផ្តាច់! ⚠️', 'warning');
});

// =========================================
// Prevent Right Click (Optional - remove if not needed)
// =========================================

// Uncomment to prevent right click on images
// document.querySelectorAll('img').forEach(img => {
//   img.addEventListener('contextmenu', (e) => e.preventDefault());
// });

// =========================================
// Performance Monitoring (Optional)
// =========================================

if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
    }, 0);
  });
}

// =========================================
// Console Welcome Message
// =========================================

console.log(`
╔═══════════════════════════════════════╗
║                                       ║
║         🌱 CAMBO NET 🌱              ║
║    សំណាញ់សម្រាប់កសិកម្ម            ║
║                                       ║
║  Version: 3.0.0                      ║
║  Build: ${new Date().toLocaleDateString('km-KH')}                  ║
║                                       ║
╚═══════════════════════════════════════╝
`);

console.log('%cDeveloped with ❤️ for Cambodian Farmers', 'color: #22c55e; font-size: 14px; font-weight: bold;');

// =========================================
// Export functions to global scope
// =========================================

window.updateAuthUI = updateAuthUI;
window.showLoginModal = showLoginModal;
window.logout = logout;
window.clearAllData = clearAllData;
window.exportData = exportData;
window.sendWhatsAppMessage = sendWhatsAppMessage;


// =========================================
// PROMOTIONAL POPUP SCRIPT
// =========================================

// Show popup on page load
window.addEventListener('load', () => {
  // Delay popup by 1 second for better UX
  setTimeout(() => {
    const promoPopup = document.getElementById('promoPopup');
    if (promoPopup) {
      promoPopup.classList.add('show');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
  }, 1000);
});

// Close popup function
function closePromoPopup() {
  const promoPopup = document.getElementById('promoPopup');
  if (promoPopup) {
    promoPopup.classList.remove('show');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }
}

// Close button handler
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('closePromo');
  if (closeBtn) {
    closeBtn.addEventListener('click', closePromoPopup);
  }
  
  // Close when clicking outside
  const promoPopup = document.getElementById('promoPopup');
  if (promoPopup) {
    promoPopup.addEventListener('click', (e) => {
      if (e.target === promoPopup) {
        closePromoPopup();
      }
    });
  }
  
  // Close with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePromoPopup();
    }
  });
});

// Buy now button - opens product detail for promotional item
function buyPromoProduct() {
  closePromoPopup();
  
  // Show the promotional product (ម្ជុល 8 ក្រាស់ - 5 rolls special offer)
  setTimeout(() => {
    showProductDetail(
      "ម្ជុល 8 (ក្រាស់) - កញ្ចប់ពិសេស", 
      "ការពារកម្ដៅបាន 90% - ទិញ 5 រមឹល តម្លៃពិសេស $32/រមឹល", 
      "img/Screenshot 2025-11-15 142806.png"
    );
  }, 300);
}

// Optional: Don't show popup again for 24 hours
function setPromoShown() {
  const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
  localStorage.setItem('promoShown', expiryTime);
}

function shouldShowPromo() {
  const promoShown = localStorage.getItem('promoShown');
  if (!promoShown) return true;
  
  const expiryTime = parseInt(promoShown);
  const now = new Date().getTime();
  
  if (now > expiryTime) {
    localStorage.removeItem('promoShown');
    return true;
  }
  
  return false;
}

// Uncomment to enable 24-hour restriction
// window.addEventListener('load', () => {
//   if (shouldShowPromo()) {
//     setTimeout(() => {
//       document.getElementById('promoPopup').classList.add('show');
//       setPromoShown();
//     }, 1000);
//   }