(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (menuButton && mobileNav) {
      menuButton.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var current = 0;
      var timer = null;

      function showSlide(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === current);
        });
      }

      function startSlider() {
        if (timer || slides.length < 2) {
          return;
        }
        timer = window.setInterval(function () {
          showSlide(current + 1);
        }, 5600);
      }

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
          if (timer) {
            window.clearInterval(timer);
            timer = null;
          }
          startSlider();
        });
      });
      startSlider();
    }

    var filterPanels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));
    filterPanels.forEach(function (panel) {
      var root = panel.parentElement || document;
      var containers = Array.prototype.slice.call(root.querySelectorAll('[data-filter-scope]'));
      if (!containers.length) {
        return;
      }
      var cards = [];
      containers.forEach(function (container) {
        cards = cards.concat(Array.prototype.slice.call(container.querySelectorAll('.movie-card')));
      });
      var searchInput = panel.querySelector('[data-search-input]');
      var fields = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-field]'));

      function applyFilters() {
        var query = normalize(searchInput ? searchInput.value : '');
        var activeFields = fields.map(function (field) {
          return {
            name: field.getAttribute('data-filter-field'),
            value: normalize(field.value)
          };
        });

        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-year'),
            card.getAttribute('data-type'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-tags'),
            card.textContent
          ].join(' '));
          var matchedText = !query || haystack.indexOf(query) !== -1;
          var matchedFields = activeFields.every(function (field) {
            return !field.value || normalize(card.getAttribute('data-' + field.name)) === field.value;
          });
          card.classList.toggle('is-hidden', !(matchedText && matchedFields));
        });
      }

      if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
      }
      fields.forEach(function (field) {
        field.addEventListener('change', applyFilters);
      });

      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q && searchInput) {
        searchInput.value = q;
        applyFilters();
      }
    });

    var players = Array.prototype.slice.call(document.querySelectorAll('.player-stage'));
    players.forEach(function (stage) {
      var video = stage.querySelector('video[data-stream]');
      var button = stage.querySelector('.play-overlay');
      if (!video || !button) {
        return;
      }
      var streamUrl = video.getAttribute('data-stream');
      var hlsInstance = null;

      function prepareVideo() {
        if (video.getAttribute('data-ready') === '1') {
          return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = streamUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            maxBufferLength: 60,
            enableWorker: true
          });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
        } else {
          video.src = streamUrl;
        }
        video.setAttribute('data-ready', '1');
      }

      function playVideo() {
        prepareVideo();
        stage.classList.add('is-playing');
        button.hidden = true;
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {
            button.hidden = false;
            stage.classList.remove('is-playing');
          });
        }
      }

      button.addEventListener('click', playVideo);
      video.addEventListener('click', function () {
        if (video.paused) {
          playVideo();
        }
      });
      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  });
}());
