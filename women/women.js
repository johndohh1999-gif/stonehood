(() => {
  document.addEventListener('DOMContentLoaded', () => {
    // --- Vertical Slide Setup (GSAP + Observer) ---
    const sections = gsap.utils.toArray('section.section');
    const total = sections.length;
    let current = 0;
    let isAnimating = false;

    function slideTo(newIndex) {
      if (isAnimating) return;

      newIndex = (newIndex + total) % total; // Wrap index
      if (newIndex === current) return;

      isAnimating = true;

      const currentSection = sections[current];
      const nextSection = sections[newIndex];

      // Determine slide direction
      const direction =
        newIndex > current || (current === total - 1 && newIndex === 0) ? -1 : 1;

      // Prepare next section position before animation
      gsap.set(nextSection, {
        yPercent: 100 * -direction,
        opacity: 1,
        zIndex: 2,
        pointerEvents: 'auto',
      });

      const tl = gsap.timeline({
        onComplete: () => {
          // Reset current section after animation
          gsap.set(currentSection, {
            yPercent: 100 * direction,
            opacity: 0,
            zIndex: 0,
            pointerEvents: 'none',
          });
          // Reset next section final state
          gsap.set(nextSection, {
            yPercent: 0,
            zIndex: 1,
          });

          current = newIndex;
          isAnimating = false;
          updateActiveClass();
        },
      });

      tl.to(
        currentSection,
        {
          yPercent: 100 * direction,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
        },
        0
      ).to(
        nextSection,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.inOut',
        },
        0
      );
    }

    function updateActiveClass() {
      sections.forEach((section, i) => {
        section.classList.toggle('active', i === current);
      });
    }

    // Initialize vertical sliding sections
    if (sections.length > 0) {
      gsap.set(sections, {
        yPercent: 100,
        opacity: 0,
        pointerEvents: 'none',
      });
      gsap.set(sections[0], {
        yPercent: 0,
        opacity: 1,
        zIndex: 1,
        pointerEvents: 'auto',
      });
      updateActiveClass();

      // Create GSAP Observer for scroll and swipe
      Observer.create({
        target: window,
        type: 'wheel,touch,pointer',
        onUp: () => slideTo(current - 1),
        onDown: () => slideTo(current + 1),
        tolerance: 10,
        preventDefault: true,
      });

      // Click on section navigates if data-page is set
      sections.forEach((section) => {
        section.addEventListener('click', () => {
          const page = section.dataset.page;
          if (page) {
            window.location.href = page;
          }
        });
      });
    }

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

    // --- Search Input Toggle ---
    const searchWrapper = document.getElementById('searchWrapper');
    const searchInput = document.getElementById('searchInput');
    const searchIcon = document.getElementById('searchIcon');

    if (searchIcon && searchInput && searchWrapper) {
      // Toggle search input visibility on icon click
      searchIcon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isActive = searchWrapper.classList.contains('active');
        if (isActive) {
          searchWrapper.classList.remove('active');
          searchInput.style.display = 'none';
        } else {
          searchWrapper.classList.add('active');
          searchInput.style.display = 'block';
          searchInput.focus();
        }
      });

      // Prevent clicks inside searchWrapper from closing it
      searchWrapper.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      // Close search input when clicking outside
      document.addEventListener('click', () => {
        searchWrapper.classList.remove('active');
        searchInput.style.display = 'none';
      });
    }
  });
})();
