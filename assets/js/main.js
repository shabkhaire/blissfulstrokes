/* Blissful Strokes — nav, scroll reveal, lightbox. No dependencies. */
(function () {
  'use strict';

  /* ---- Header: shadow on scroll + mobile nav ---------------------------- */
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('primary-nav');
  const toggle = document.querySelector('.nav-toggle');

  function setHeaderHeight() {
    if (header) {
      document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    }
  }
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);

  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Scroll reveal ---------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---- Graceful placeholder when an image file is not there yet --------- */
  document.querySelectorAll('img[data-slot]').forEach((img) => {
    const mark = () => {
      img.classList.add('is-missing');
      img.removeAttribute('src');
      img.alt = ''; // otherwise the browser paints broken-image alt text over the tile
    };
    if (img.complete && img.naturalWidth === 0) mark();
    img.addEventListener('error', mark);
  });

  /* ---- Lightbox -------------------------------------------------------- */
  const items = Array.from(document.querySelectorAll('[data-lightbox]'));
  if (!items.length) return;

  const box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Artwork viewer');
  box.innerHTML =
    '<button class="lightbox__btn lightbox__btn--close" aria-label="Close">&times;</button>' +
    '<button class="lightbox__btn lightbox__btn--prev" aria-label="Previous">&#8249;</button>' +
    '<button class="lightbox__btn lightbox__btn--next" aria-label="Next">&#8250;</button>' +
    '<div><img class="lightbox__img" alt=""><p class="lightbox__cap"></p></div>';
  document.body.appendChild(box);

  const bImg = box.querySelector('.lightbox__img');
  const bCap = box.querySelector('.lightbox__cap');
  let index = 0;
  let lastFocus = null;

  function show(i) {
    index = (i + items.length) % items.length;
    const link = items[index];
    const img = link.querySelector('img');
    bImg.src = link.getAttribute('href') || (img && img.currentSrc) || '';
    bImg.alt = (img && img.alt) || '';
    bCap.textContent = link.dataset.lightbox || '';
  }

  function open(i) {
    lastFocus = document.activeElement;
    show(i);
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    box.querySelector('.lightbox__btn--close').focus();
  }

  function close() {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    bImg.removeAttribute('src');
    if (lastFocus) lastFocus.focus();
  }

  items.forEach((link, i) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      open(i);
    });
  });

  box.querySelector('.lightbox__btn--close').addEventListener('click', close);
  box.querySelector('.lightbox__btn--prev').addEventListener('click', () => show(index - 1));
  box.querySelector('.lightbox__btn--next').addEventListener('click', () => show(index + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });

  document.addEventListener('keydown', (e) => {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();
