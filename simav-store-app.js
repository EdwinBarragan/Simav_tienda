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
