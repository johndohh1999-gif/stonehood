document.addEventListener('DOMContentLoaded', () => {
  // === FULL MENU LOGIC ===
  const fullMenu = document.getElementById('fullMenu');
  const menuToggle = document.getElementById('menuToggle');
  const closeMenu = document.getElementById('closeMenu');
  const categoryButtons = document.querySelectorAll('.menu-category');
  const submenus = document.querySelectorAll('.submenu');

  function hideAllSubmenus() {
    submenus.forEach(menu => menu.classList.remove('active'));
    categoryButtons.forEach(btn => btn.classList.remove('active'));
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      fullMenu.classList.add('open');
    });
  }

  if (closeMenu) {
    closeMenu.addEventListener('click', () => {
      fullMenu.classList.remove('open');
      hideAllSubmenus();
    });
  }

  document.addEventListener('click', (e) => {
    if (
      fullMenu.classList.contains('open') &&
      !fullMenu.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      fullMenu.classList.remove('open');
      hideAllSubmenus();
    }
  });

  categoryButtons.forEach(button => {
    const target = button.parentElement.getAttribute('data-category');
    const submenu = document.getElementById(`submenu-${target}`);

    if (!submenu) return;

    button.addEventListener('mouseenter', () => {
      hideAllSubmenus();
      submenu.classList.add('active');
      button.classList.add('active');
    });

    button.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!submenu.matches(':hover') && !button.matches(':hover')) {
          submenu.classList.remove('active');
          button.classList.remove('active');
        }
      }, 300);
    });

    submenu.addEventListener('mouseenter', () => {
      submenu.classList.add('active');
      button.classList.add('active');
    });

    submenu.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!submenu.matches(':hover') && !button.matches(':hover')) {
          submenu.classList.remove('active');
          button.classList.remove('active');
        }
      }, 300);
    });
  });

  if (fullMenu) {
    fullMenu.addEventListener('mouseleave', () => {
      hideAllSubmenus();
    });
  }

  // === SEARCH INPUT LOGIC ===
  const searchWrapper = document.getElementById('searchWrapper');
  const searchInput = document.getElementById('searchInput');
  const searchIcon = document.getElementById('searchIcon');

  if (searchIcon && searchWrapper && searchInput) {
    searchIcon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchWrapper.classList.add('active');
      searchInput.focus();
    });

    searchWrapper.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.addEventListener('click', (e) => {
      if (!searchWrapper.contains(e.target)) {
        searchWrapper.classList.remove('active');
      }
    });
  }

  // === CAROUSEL LOGIC ===
  const carouselInner = document.querySelector('.carousel-inner');
  const slides = document.querySelectorAll('.carousel-slide');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const heroCarousel = document.querySelector('.hero-carousel');
  let currentSlide = 0;
  const totalSlides = slides.length;

  // Touch/swipe variables
  let startX = 0;
  let endX = 0;
  let isDragging = false;
  const minSwipeDistance = 50;
  let slideInterval = null; // Initialize interval variable

  if (carouselInner && slides.length && nextBtn && prevBtn) {
    function updateSlidePosition() {
      carouselInner.style.transform = `translateX(${-currentSlide * 100}%)`;
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlidePosition();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlidePosition();
    }

    function resetInterval() {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
      slideInterval = setInterval(nextSlide, 5000);
    }

    // Button event listeners
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetInterval();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetInterval();
    });

    // Touch event listeners for swipe functionality
    if (heroCarousel) {
      // Touch events for mobile
      heroCarousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        if (slideInterval) {
          clearInterval(slideInterval);
        }
      }, { passive: true });

      heroCarousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        endX = e.touches[0].clientX;
      }, { passive: true });

      heroCarousel.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaX = startX - endX;
        
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            nextSlide(); // Swipe left - next slide
          } else {
            prevSlide(); // Swipe right - previous slide
          }
        }
        resetInterval();
      });

      // Mouse events for desktop drag
      heroCarousel.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        if (slideInterval) {
          clearInterval(slideInterval);
        }
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        endX = e.clientX;
      });

      document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaX = startX - endX;
        
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            nextSlide(); // Drag left - next slide
          } else {
            prevSlide(); // Drag right - previous slide
          }
        }
        resetInterval();
      });
    }

    // Start the auto-advance interval
    slideInterval = setInterval(nextSlide, 5000);
    updateSlidePosition();
  }

  // === LOGIN POPUP LOGIC ===
  const loginWrapper = document.getElementById('loginWrapper');
  const closeLogin = document.getElementById('closeLogin');
  const userIcon = document.querySelector('.nav-icon i.fa-user');

  if (userIcon && userIcon.parentElement && loginWrapper) {
    userIcon.parentElement.addEventListener('click', (e) => {
      e.preventDefault();
      loginWrapper.classList.add('active');
    });
  }

  if (closeLogin && loginWrapper) {
    closeLogin.addEventListener('click', () => {
      loginWrapper.classList.remove('active');
    });

    loginWrapper.addEventListener('click', (e) => {
      if (e.target === loginWrapper) {
        loginWrapper.classList.remove('active');
      }
    });
  }

  // === PASSWORD TOGGLE ===
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eyeIcon');
  const eyeSlashIcon = document.getElementById('eyeSlashIcon');

  if (togglePassword && passwordInput && eyeIcon && eyeSlashIcon) {
    togglePassword.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');

      eyeIcon.style.display = isPassword ? 'none' : 'block';
      eyeSlashIcon.style.display = isPassword ? 'block' : 'none';
    });
  }

  // === FLIP CARD ANIMATION ===
  const loginContainer = document.getElementById('loginContainer');

  document.querySelectorAll('.signup-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!loginContainer) return;
      loginContainer.classList.remove('rotate-animation');
      void loginContainer.offsetWidth; // trigger reflow
      loginContainer.classList.add('rotate-animation');
    });
  });

  const flipCard = document.getElementById('flipCard');
  const toSignupBtn = document.getElementById("toSignup");
  const toLoginBtn = document.getElementById("toLogin");

  if (toSignupBtn && flipCard) {
    toSignupBtn.addEventListener("click", () => {
      flipCard.classList.add("flipped");
    });
  }

  if (toLoginBtn && flipCard) {
    toLoginBtn.addEventListener("click", () => {
      flipCard.classList.remove("flipped");
    });
  }

  // === LOAD PAGE CONTENT DYNAMICALLY ===
  function loadPage(pageUrl) {
    fetch(pageUrl)
      .then(response => {
        if (!response.ok) throw new Error("Page not found");
        return response.text();
      })
      .then(html => {
        const contentDiv = document.getElementById('pageContent');
        if (contentDiv) {
          contentDiv.innerHTML = html;
          window.scrollTo(0, 0);

          if (pageUrl.includes('men')) {
            initVerticalSlide(); // Initialize vertical slide on men page content load
          }
        }
      })
      .catch(error => {
        const contentDiv = document.getElementById('pageContent');
        if (contentDiv) {
          contentDiv.innerHTML = `<p>${error.message}</p>`;
        }
      });
  }

  document.querySelectorAll('.menu-item[data-page]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const pageUrl = item.getAttribute('data-page');
      if (pageUrl) {
        loadPage(pageUrl);
      }
    });
  });
});

// === GSAP VERTICAL SLIDE INIT ===
function initVerticalSlide() {
  gsap.registerPlugin(Observer);

  const sections = gsap.utils.toArray(".section");
  let currentIndex = 0;
  let isAnimating = false;

  function showSection(index, direction) {
    if (isAnimating) return;
    isAnimating = true;

    index = (index + sections.length) % sections.length;

    const current = sections[currentIndex];
    const next = sections[index];

    gsap.set(next, {
      yPercent: direction * 100,
      pointerEvents: "auto",
      opacity: 1,
      zIndex: 2
    });

    const tl = gsap.timeline({
      defaults: { duration: 1.8, ease: "power3.inOut" },
      onComplete: () => {
        gsap.set(current, {
          opacity: 0,
          pointerEvents: "none",
          zIndex: 0,
          yPercent: 0
        });
        gsap.set(next, { zIndex: 1, yPercent: 0 });
        currentIndex = index;
        isAnimating = false; // ✅ Reset animation state
      }
    });

    tl.fromTo(next, { yPercent: direction * 100 }, { yPercent: 0 });
    tl.fromTo(current, { yPercent: 0 }, { yPercent: -direction * 100 }, "<");
  }

  Observer.create({
    type: "wheel,touch",
    wheelSpeed: -1,
    onDown: () => showSection(currentIndex + 1, 1),
    onUp: () => showSection(currentIndex - 1, -1),
    tolerance: 10,
    preventDefault: true
  });
}
