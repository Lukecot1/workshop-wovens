(function () {
  'use strict';

  // ── HAMBURGER ────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    var hamburger = document.querySelector('.hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', function () {
        document.body.classList.toggle('nav-open');
        var open = document.body.classList.contains('nav-open');
        hamburger.setAttribute('aria-expanded', open);
        hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });

      // Close when a nav link is tapped
      document.querySelectorAll('nav a').forEach(function (link) {
        link.addEventListener('click', function () {
          document.body.classList.remove('nav-open');
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.setAttribute('aria-label', 'Open menu');
        });
      });
    }
  });

  // ── CAROUSEL ─────────────────────────────────────────────────
  function initCarousel(section) {
    var track = section.querySelector('.carousel-track');
    var slides = section.querySelectorAll('.carousel-slide');
    var prevBtn = section.querySelector('.carousel-btn-prev');
    var nextBtn = section.querySelector('.carousel-btn-next');

    if (!track || slides.length === 0) return;

    var idx = 0;

    function perView() {
      var w = window.innerWidth;
      var isAbout = section.classList.contains('about-carousel');
      if (w <= 768) return 1;
      if (w <= 960) return 2;
      return isAbout ? 4 : 3;
    }

    function maxIdx() {
      return Math.max(0, slides.length - perView());
    }

    function go(n) {
      idx = Math.max(0, Math.min(n, maxIdx()));
      var slideW = slides[0].getBoundingClientRect().width + 12;
      if (window.innerWidth > 768) slideW = slides[0].getBoundingClientRect().width + 16;
      track.style.transform = 'translateX(' + (-idx * slideW) + 'px)';
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { go(idx - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(idx + 1); });

    // Touch swipe
    var touchStartX = 0;
    var touchStartY = 0;
    var dragging = false;

    track.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      dragging = true;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      if (!dragging) return;
      dragging = false;
      var dx = e.changedTouches[0].clientX - touchStartX;
      var dy = e.changedTouches[0].clientY - touchStartY;
      // Only trigger if horizontal swipe dominates
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        dx < 0 ? go(idx + 1) : go(idx - 1);
      }
    }, { passive: true });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        idx = Math.min(idx, maxIdx());
        go(idx);
      }, 100);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.carousel-section, .about-carousel').forEach(initCarousel);
  });
})();
