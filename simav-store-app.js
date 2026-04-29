/*
  SIMAV Store — JavaScript
  Sistema Inteligente para Movilidad y Asistencia Visual
*/

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
   if (window.scrollY > 100) {
      header.classList.add('scrolled');
   } else {
      header.classList.remove('scrolled');
   }
});

// Mobile navigation
const menuToggle    = document.getElementById('menuToggle');
const mobileNav     = document.getElementById('mobileNav');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileNavClose = document.getElementById('mobileNavClose');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

function openMobileNav() {
   mobileNav.classList.add('active');
   mobileOverlay.classList.add('active');
   document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
   mobileNav.classList.remove('active');
   mobileOverlay.classList.remove('active');
   document.body.style.overflow = '';
}

menuToggle.addEventListener('click', openMobileNav);
mobileNavClose.addEventListener('click', closeMobileNav);
mobileOverlay.addEventListener('click', closeMobileNav);

mobileNavLinks.forEach(link => {
   link.addEventListener('click', closeMobileNav);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
   anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href === '#') {
         window.scrollTo({ top: 0, behavior: 'smooth' });
         return;
      }
      const target = document.querySelector(href);
      if (target) {
         const headerHeight = header.offsetHeight;
         const targetPosition = target.offsetTop - headerHeight;
         window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
   });
});

// Hero image slideshow
const slides    = document.querySelectorAll('.hero-slide');
const heroTitle = document.getElementById('heroTitle');
const heroPrice = document.getElementById('heroPrice');
let currentSlide = 0;

function changeSlide() {
   slides[currentSlide].classList.remove('active');
   currentSlide = (currentSlide + 1) % slides.length;

   heroTitle.style.opacity = '0';
   heroPrice.style.opacity = '0';

   setTimeout(() => {
      heroTitle.textContent = slides[currentSlide].dataset.title;
      heroPrice.textContent = slides[currentSlide].dataset.price;
      heroTitle.style.opacity = '1';
      heroPrice.style.opacity = '1';
   }, 500);

   slides[currentSlide].classList.add('active');
}

setInterval(changeSlide, 4500);

// Contact form submission
const form = document.getElementById('contactForm');
if (form) {
   form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('¡Gracias por contactar a SIMAV! Nos pondremos en contacto contigo en menos de 24 horas.');
      form.reset();
   });
}

// Intersection Observer for scroll animations
const observerOptions = {
   threshold: 0.08,
   rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
      if (entry.isIntersecting) {
         entry.target.style.opacity = '1';
         entry.target.style.transform = 'translateY(0)';
         observer.unobserve(entry.target);
      }
   });
}, observerOptions);

document.querySelectorAll('section:not(.hero)').forEach(section => {
   section.style.opacity = '0';
   section.style.transform = 'translateY(28px)';
   section.style.transition = 'opacity 0.85s ease, transform 0.85s ease';
   observer.observe(section);
});

// ========== CARRITO DE COMPRAS ==========
class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
        this.initEventListeners();
        this.updateUI();
    }

    // Cargar carrito desde localStorage
    loadFromStorage() {
        const saved = localStorage.getItem('shopping-cart');
        if (saved) {
            this.items = JSON.parse(saved);
        }
    }

    // Guardar en localStorage
    saveToStorage() {
        localStorage.setItem('shopping-cart', JSON.stringify(this.items));
    }

    // Agregar producto
    addItem(product) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.saveToStorage();
        this.updateUI();
        this.showNotification(`✅ ${product.name} agregado`);
    }

    // Eliminar producto completamente
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateUI();
        this.showNotification('🗑️ Producto eliminado');
    }

    // Actualizar cantidad
    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveToStorage();
            this.updateUI();
        }
    }

    // Calcular total
    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Obtener número total de items
    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Mostrar notificación temporal
    showNotification(message) {
        const notif = document.createElement('div');
        notif.textContent = message;
        notif.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #2c3e50;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 2000;
            animation: fadeInOut 2s ease;
            font-size: 0.9rem;
        `;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2000);
    }

    // Renderizar items del carrito en el modal
    renderCartItems() {
        const container = document.getElementById('cart-items-container');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = '<div class="empty-cart">🛒 Tu carrito está vacío</div>';
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="decrement-qty" data-id="${item.id}">-</button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button class="increment-qty" data-id="${item.id}">+</button>
                    <button class="delete-item" data-id="${item.id}">🗑️</button>
                </div>
            </div>
        `).join('');

        // Agregar event listeners a los botones del modal
        document.querySelectorAll('.decrement-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                const item = this.items.find(i => i.id === id);
                if (item) this.updateQuantity(id, item.quantity - 1);
            });
        });

        document.querySelectorAll('.increment-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                const item = this.items.find(i => i.id === id);
                if (item) this.updateQuantity(id, item.quantity + 1);
            });
        });

        document.querySelectorAll('.delete-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                this.removeItem(id);
            });
        });
    }

    // Actualizar toda la UI (contador y modal)
    updateUI() {
        const countEl = document.getElementById('cart-count');
        if (countEl) countEl.textContent = this.getItemCount();
        
        const totalEl = document.getElementById('cart-total-price');
        if (totalEl) totalEl.textContent = `$${this.getTotal().toFixed(2)}`;
        
        this.renderCartItems();
    }

    // Inicializar event listeners del modal
    initEventListeners() {
        const cartBtn = document.getElementById('cart-btn');
        const cartModal = document.getElementById('cart-modal');
        const closeBtn = document.getElementById('close-cart');
        const checkoutBtn = document.getElementById('checkout-btn');

        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                cartModal.classList.add('show');
                this.renderCartItems();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                cartModal.classList.remove('show');
            });
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                alert('🛍️ Gracias por tu compra. Total: $' + this.getTotal().toFixed(2));
                // this.items = [];
                // this.saveToStorage();
                // this.updateUI();
                // cartModal.classList.remove('show');
            });
        }

        // Cerrar modal al hacer click fuera del contenido
        if (cartModal) {
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    cartModal.classList.remove('show');
                }
            });
        }
    }
}

function initProductButtons() {
    // Ejemplo: selecciona todos los productos (ajusta los selectores a tu HTML)
    const productButtons = document.querySelectorAll('.add-to-cart');
    productButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(btn.dataset.id);
            const productName = btn.dataset.name;
            const productPrice = parseFloat(btn.dataset.price);
            
            cart.addItem({
                id: productId,
                name: productName,
                price: productPrice
            });
        });
    });
}

// Inicializar carrito
const cart = new ShoppingCart();

// Agregar estilos para empty cart y animación
const style = document.createElement('style');
style.textContent = `
    .empty-cart {
        text-align: center;
        padding: 3rem;
        color: #7f8c8d;
        font-size: 1.1rem;
    }
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(20px); }
        15% { opacity: 1; transform: translateY(0); }
        85% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(20px); }
    }
`;
document.head.appendChild(style);

// Esperar a que cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    initProductButtons();
});
