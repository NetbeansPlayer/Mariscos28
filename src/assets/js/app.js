// src/assets/js/swiper-config.js
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar Swiper
  const swiper = new Swiper('.mySwiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      // cuando el ancho es >= 640px
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      // cuando el ancho es >= 1024px
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    }
  });
});


// src/assets/js/app.js
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const dropdowns = document.querySelectorAll('.dropdown');
  
  // Menú móvil
  navToggle.addEventListener('click', function() {
    mainNav.classList.toggle('show');
  });
  
  // Dropdown en móvil
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    
    toggle.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
    });
  });
  
  // Cerrar menú al hacer clic en un link
  mainNav.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && window.innerWidth <= 768) {
      mainNav.classList.remove('show');
    }
  });
  
  // Header scroll effect
  window.addEventListener('scroll', function() {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
});


