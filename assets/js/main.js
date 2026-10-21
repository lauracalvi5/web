(() => {
  'use strict';

  /* ------------------------------------------------------------ */
  /* Header: solid background after scroll, active link tracking   */
  /* ------------------------------------------------------------ */
  const header = document.getElementById('siteNav');
  const navLinks = document.querySelectorAll('nav.links a');
  const sections = [...document.querySelectorAll('main section[id]')];
  
  const counters = document.querySelectorAll('.count-up');
  const counterIO = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1200; const start = performance.now();
      function tick(now){
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if(p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, {threshold:.6});
  counters.forEach(c=>counterIO.observe(c));

  const heroVisualParallax = document.querySelector('.hero-visual');
  const heroSection = document.getElementById('inicio');

  function onScroll() {
    header && header.classList.toggle('scrolled', window.scrollY > 12);

    if (heroVisualParallax && heroSection) {
      const rect = heroSection.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const shift = Math.max(-24, Math.min(24, window.scrollY * 0.08));
        heroVisualParallax.style.setProperty('--py', shift + 'px');
      }
    }
  }

  const scrollState = { ticking: false };
  window.addEventListener('scroll', () => {
    if (!scrollState.ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        scrollState.ticking = false;
      });
      scrollState.ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* ------------------------------------------------------------ */
  /* Active nav link tracking while scrolling                     */
  /* ------------------------------------------------------------ */
  if (sections.length && navLinks.length) {
    const sectionIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    sections.forEach((section) => sectionIO.observe(section));
  }

  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('mousemove', (e)=>{
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      btn.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });





  /* ------------------------------------------------------------ */
  /* Menú móvil (burger) — estilo de la web original              */
  /* ------------------------------------------------------------ */
  const burger = document.getElementById('burgerBtn');
  const linksBox = document.getElementById('navLinks');
  if (burger && linksBox) {
    const closeNav = () => {
      document.body.classList.remove('nav-open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
    };
    burger.addEventListener('click', () => {
      const open = !document.body.classList.contains('nav-open');
      document.body.classList.toggle('nav-open', open);
      burger.classList.toggle('active', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    linksBox.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNav));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
  }

  /* ------------------------------------------------------------ */
  /* Mobile menu                                                   */
  /* ------------------------------------------------------------ */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');

  function openMenu() {
    if (!mobileMenu || !navToggle) return;
    mobileMenu.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!mobileMenu || !navToggle) return;
    mobileMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  navToggle?.addEventListener('click', openMenu);
  mobileMenuClose?.addEventListener('click', closeMenu);
  mobileMenu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  /* ------------------------------------------------------------ */
  /* Login modal (dashboard-mockup variant only; no-op elsewhere)  */
  /* ------------------------------------------------------------ */
  const loginTrigger = document.getElementById('loginTrigger');
  const loginModal = document.getElementById('loginModal');
  const loginModalClose = document.getElementById('loginModalClose');
  const loginBadge = loginModal?.querySelector('.login-badge');

  function openLoginModal() {
    loginModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    loginModal.querySelector('input, select, button:not(.modal-close)')?.focus();
    // restart the badge's pop-in animation each time the modal opens
    if (loginBadge) {
      loginBadge.style.animation = 'none';
      void loginBadge.offsetWidth;
      loginBadge.style.animation = '';
    }
  }
  function closeLoginModal() {
    loginModal.classList.remove('is-open');
    document.body.style.overflow = '';
    loginTrigger?.focus();
  }
  if (loginTrigger && loginModal) {
    loginTrigger.addEventListener('click', openLoginModal);
    loginModalClose?.addEventListener('click', closeLoginModal);
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) closeLoginModal();
    });
  }

  /* ------------------------------------------------------------ */
  /* Login modal: show/hide password                               */
  /* ------------------------------------------------------------ */
  const toggleClave = document.getElementById('toggleClaveLogin');
  const clavePass = document.getElementById('loginPass');
  toggleClave?.addEventListener('click', () => {
    const showing = clavePass.type === 'text';
    clavePass.type = showing ? 'password' : 'text';
    toggleClave.classList.toggle('is-showing', !showing);
  });

  /* ------------------------------------------------------------ */
  /* Contact form + footer newsletter: no backend yet, just stop   */
  /* the page from reloading                                       */
  /* ------------------------------------------------------------ */
  document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
  });
  document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  /* ------------------------------------------------------------ */
  /* Scroll-reveal: transform + opacity only, IntersectionObserver  */
  /* ------------------------------------------------------------ */
  const revealTargets = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------ */
  /* Hero card: pointer-driven tilt (desktop only, motion-safe)     */
  /* ------------------------------------------------------------ */
  const heroCard = document.getElementById('heroCard');
  const heroVisual = heroCard?.closest('.hero-visual');

  if (heroCard && heroVisual && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let raf = null;
    let targetX = -8, targetY = 4, curX = -8, curY = 4;

    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      targetY = px * 16;
      targetX = -py * 14 - 4;
      if (!raf) raf = requestAnimationFrame(tick);
    });

    heroVisual.addEventListener('mouseleave', () => {
      targetX = -8;
      targetY = 4;
      if (!raf) raf = requestAnimationFrame(tick);
    });

    function tick() {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      heroCard.style.transform = `rotateX(${curX}deg) rotateY(${curY}deg)`;
      if (Math.abs(targetX - curX) > 0.05 || Math.abs(targetY - curY) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }
  }



  /* ------------------------------------------------------------ */
  /* Escape key closes mobile menu / login modal                   */
  /* ------------------------------------------------------------ */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeMenu();
    if (loginModal?.classList.contains('is-open')) closeLoginModal();
  });


})();

/* ==========================================================================
   Visor de la historieta: zoom, arrastre y cierre
   ========================================================================== */
(() => {
  const opener = document.getElementById('comicOpen');
  const lb = document.getElementById('comicViewer');
  if (!opener || !lb) return;

  const stage = document.getElementById('lbStage');
  const img = document.getElementById('lbImg');
  const btnIn = document.getElementById('lbIn');
  const btnOut = document.getElementById('lbOut');
  const btnReset = document.getElementById('lbReset');
  const MIN = 1, MAX = 4, STEP = 0.5;
  let scale = 1, x = 0, y = 0, lastFocus = null;
  const pointers = new Map();
  let pinchStart = null, drag = null;

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function bounds() {
    // límites para que la imagen no se pierda fuera de la pantalla
    const w = img.offsetWidth, h = img.offsetHeight;
    const maxX = Math.max(0, (w * scale - w) / 2 + 0), maxY = Math.max(0, (h * scale - h) / 2 + 0);
    return { w, h, maxX, maxY };
  }
  function apply(animate) {
    const { w, h, maxX, maxY } = bounds();
    // x,y = desplazamiento relativo al centro
    x = clamp(x, -maxX, maxX); y = clamp(y, -maxY, maxY);
    const tx = x - (w * scale - w) / 2, ty = y - (h * scale - h) / 2;
    img.classList.toggle('is-animating', !!animate);
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    btnReset.textContent = Math.round(scale * 100) + '%';
    btnOut.disabled = scale <= MIN; btnIn.disabled = scale >= MAX;
  }
  // zoom manteniendo fijo el punto (cx, cy) de la pantalla
  function zoomTo(next, cx, cy, animate) {
    next = clamp(next, MIN, MAX);
    const r = img.getBoundingClientRect();
    if (cx == null) { cx = r.left + r.width / 2; cy = r.top + r.height / 2; }
    const ratio = next / scale;
    const centerX = r.left + r.width / 2, centerY = r.top + r.height / 2;
    x += (cx - centerX) * (1 - ratio);
    y += (cy - centerY) * (1 - ratio);
    scale = next;
    if (scale === MIN) { x = 0; y = 0; }
    apply(animate);
  }

  function open(e) {
    e.preventDefault();
    lastFocus = document.activeElement;
    img.src = opener.getAttribute('href');
    scale = 1; x = 0; y = 0;
    lb.hidden = false;
    document.body.classList.add('lb-open');
    apply(false);
    lb.querySelector('.lb-close').focus();
  }
  function close() {
    lb.hidden = true;
    document.body.classList.remove('lb-open');
    pointers.clear(); drag = null; pinchStart = null;
    if (lastFocus) lastFocus.focus();
  }

  opener.addEventListener('click', open);
  lb.querySelectorAll('[data-lb-close]').forEach(el => el.addEventListener('click', close));
  btnIn.addEventListener('click', () => zoomTo(scale + STEP, null, null, true));
  btnOut.addEventListener('click', () => zoomTo(scale - STEP, null, null, true));
  btnReset.addEventListener('click', () => { scale = 1; x = 0; y = 0; apply(true); });

  // clic en el fondo (fuera de la imagen) cierra
  stage.addEventListener('click', (e) => { if (e.target === stage && !stage.dataset.moved) close(); });

  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === '+' || e.key === '=') zoomTo(scale + STEP, null, null, true);
    else if (e.key === '-') zoomTo(scale - STEP, null, null, true);
    else if (e.key === '0') { scale = 1; x = 0; y = 0; apply(true); }
    else if (e.key === 'Tab') { // mantener el foco dentro del visor
      const f = [...lb.querySelectorAll('button:not(:disabled)')];
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });

  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = Math.exp(-e.deltaY * 0.0015);
    zoomTo(scale * factor, e.clientX, e.clientY, false);
  }, { passive: false });

  img.addEventListener('dblclick', (e) => {
    if (scale > 1) { scale = 1; x = 0; y = 0; apply(true); }
    else zoomTo(2, e.clientX, e.clientY, true);
  });

  stage.addEventListener('pointerdown', (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    stage.setPointerCapture(e.pointerId);
    delete stage.dataset.moved;
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchStart = { d: Math.hypot(a.x - b.x, a.y - b.y), s: scale };
      drag = null;
    } else {
      drag = { sx: e.clientX, sy: e.clientY, ox: x, oy: y };
    }
  });
  stage.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinchStart && pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomTo(pinchStart.s * d / pinchStart.d, (a.x + b.x) / 2, (a.y + b.y) / 2, false);
      stage.dataset.moved = '1';
    } else if (drag && scale > 1) {
      const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (Math.abs(dx) + Math.abs(dy) > 3) { stage.dataset.moved = '1'; stage.classList.add('is-dragging'); }
      x = drag.ox + dx; y = drag.oy + dy;
      apply(false);
    }
  });
  const end = (e) => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchStart = null;
    if (pointers.size === 0) { drag = null; stage.classList.remove('is-dragging'); }
    else if (pointers.size === 1) { const p = [...pointers.values()][0]; drag = { sx: p.x, sy: p.y, ox: x, oy: y }; }
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  window.addEventListener('resize', () => { if (!lb.hidden) apply(false); });
})();
