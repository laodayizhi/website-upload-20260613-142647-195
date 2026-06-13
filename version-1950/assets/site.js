(() => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => mobileNav.classList.toggle('open'));
  }

  document.querySelectorAll('.hero-carousel').forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
    const dots = Array.from(carousel.querySelectorAll('.hero-dot'));
    const prev = carousel.querySelector('[data-hero-prev]');
    const next = carousel.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    const show = (value) => {
      if (!slides.length) return;
      index = (value + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    };

    const start = () => {
      clearInterval(timer);
      timer = setInterval(() => show(index + 1), 5200);
    };

    dots.forEach((dot, i) => dot.addEventListener('click', () => {
      show(i);
      start();
    }));
    if (prev) prev.addEventListener('click', () => { show(index - 1); start(); });
    if (next) next.addEventListener('click', () => { show(index + 1); start(); });
    show(0);
    start();
  });

  document.querySelectorAll('[data-filter-scope]').forEach((scope) => {
    const input = scope.querySelector('[data-filter-search]');
    const year = scope.querySelector('[data-filter-year]');
    const type = scope.querySelector('[data-filter-type]');
    const cards = Array.from(scope.querySelectorAll('[data-movie-card]'));
    const empty = scope.querySelector('[data-empty-state]');

    const update = () => {
      const q = input ? input.value.trim().toLowerCase() : '';
      const y = year ? year.value : '';
      const t = type ? type.value : '';
      let visible = 0;
      cards.forEach((card) => {
        const title = (card.dataset.title || '').toLowerCase();
        const meta = (card.dataset.meta || '').toLowerCase();
        const hitText = !q || title.includes(q) || meta.includes(q);
        const hitYear = !y || card.dataset.year === y;
        const hitType = !t || card.dataset.type === t;
        const ok = hitText && hitYear && hitType;
        card.style.display = ok ? '' : 'none';
        if (ok) visible += 1;
      });
      if (empty) empty.style.display = visible ? 'none' : 'block';
    };

    if (input) input.addEventListener('input', update);
    if (year) year.addEventListener('change', update);
    if (type) type.addEventListener('change', update);
  });

  document.querySelectorAll('.player-shell').forEach((shell) => {
    const video = shell.querySelector('video');
    const layer = shell.querySelector('.play-layer');
    const source = shell.dataset.video;
    let loaded = false;

    const loadAndPlay = () => {
      if (!video || !source) return;
      if (!loaded) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
          video.play().catch(() => {});
        } else if (window.Hls && Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
        } else {
          video.src = source;
          video.play().catch(() => {});
        }
        loaded = true;
      } else {
        video.play().catch(() => {});
      }
      if (layer) layer.style.display = 'none';
      video.setAttribute('controls', 'controls');
    };

    if (layer) layer.addEventListener('click', loadAndPlay);
  });
})();
