(() => {
  const sections = gsap.utils.toArray("section.section");
  const total = sections.length;
  let current = 0;
  let isAnimating = false;

  function slideTo(newIndex) {
    if (isAnimating) return;

    newIndex = (newIndex + total) % total;

    if (newIndex === current) return;

    isAnimating = true;

    const currentSection = sections[current];
    const nextSection = sections[newIndex];

    const direction = newIndex > current || (current === total - 1 && newIndex === 0) ? -1 : 1;

    gsap.set(nextSection, {
      yPercent: 100 * -direction,
      opacity: 1,
      zIndex: 2,
      pointerEvents: "auto",
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(currentSection, { yPercent: 100 * direction, opacity: 0, zIndex: 0, pointerEvents: "none" });
        gsap.set(nextSection, { yPercent: 0, zIndex: 1 });
        current = newIndex;
        isAnimating = false;
        updateActiveClass();
      }
    });

    tl.to(currentSection, { yPercent: 100 * direction, opacity: 0, duration: 0.8, ease: "power2.inOut" }, 0)
      .to(nextSection, { yPercent: 0, opacity: 1, duration: 0.8, ease: "power2.inOut" }, 0);
  }

  function updateActiveClass() {
    sections.forEach((section, i) => {
      section.classList.toggle("active", i === current);
    });
  }

  window.initVerticalSlide = function() {
    gsap.set(sections, { yPercent: 100, opacity: 0, pointerEvents: "none" });
    gsap.set(sections[0], { yPercent: 0, opacity: 1, zIndex: 1, pointerEvents: "auto" });

    Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      onUp: () => slideTo(current - 1),
      onDown: () => slideTo(current + 1),
      tolerance: 10,
      preventDefault: true,
    });

    sections.forEach((section) => {
      section.addEventListener("click", () => {
        const page = section.dataset.page;
        if (page) {
          window.location.href = page;
        }
      });
    });
  };
})();
const searchIcon = document.getElementById('searchIcon');
const searchInput = document.getElementById('searchInput');

searchIcon.addEventListener('click', (e) => {
  e.preventDefault();
  searchInput.style.display = searchInput.style.display === 'block' ? 'none' : 'block';
  if (searchInput.style.display === 'block') {
    searchInput.focus();
  }
});
