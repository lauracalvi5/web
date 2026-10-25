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
  // Cualquier enlace con data-lightbox abre su imagen en el visor
  const openers = document.querySelectorAll('[data-lightbox]');
  const lb = document.getElementById('comicViewer');
  if (!openers.length || !lb) return;

  const stage = document.getElementById('lbStage');
  const img = document.getElementById('lbImg');
  const btnIn = document.getElementById('lbIn');
  const btnOut = document.getElementById('lbOut');
  const btnReset = document.getElementById('lbReset');
  const MIN = 1, STEP = 0.5;
  let MAX = 4;
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
    const opener = e.currentTarget;
    lastFocus = document.activeElement;
    MAX = parseFloat(opener.dataset.zoomMax) || 4;
    img.alt = opener.dataset.alt || '';
    lb.setAttribute('aria-label', opener.dataset.title || 'Imagen ampliada');
    img.onload = () => apply(false);
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

  openers.forEach((o) => o.addEventListener('click', open));
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

/* ==========================================================================
   ¿Por qué?: líneas desde cada origen hasta Sabium, con chispas que viajan
   ========================================================================== */
(() => {
  const diagram = document.getElementById('pqDiagram');
  const svg = document.getElementById('pqLines');
  const hub = document.getElementById('pqHub');
  if (!diagram || !svg || !hub) return;
  const NS = 'http://www.w3.org/2000/svg';
  const colors = ['#ea878a', '#69a9a9', '#ff8e4b'];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function draw() {
    svg.innerHTML = '';
    const box = diagram.getBoundingClientRect();
    const hb = hub.getBoundingClientRect();
    const mobile = window.innerWidth <= 760;
    const srcs = [...diagram.querySelectorAll('.pq-src')];
    // punto de llegada: borde del recuadro de Sabium
    const end = mobile
      ? { x: hb.left + hb.width / 2 - box.left, y: hb.top - box.top }
      : { x: hb.left - box.left, y: hb.top + hb.height * 0.42 - box.top };
    const merge = mobile ? { x: end.x, y: end.y - 26 } : { x: end.x - 28, y: end.y };

    srcs.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const s = mobile
        ? { x: r.left + r.width / 2 - box.left, y: r.bottom - box.top }
        : { x: r.right - box.left, y: r.top + r.height / 2 - box.top };
      const d = mobile
        ? `M${s.x},${s.y} C${s.x},${s.y + 40} ${merge.x},${merge.y - 40} ${merge.x},${merge.y} L${end.x},${end.y}`
        : `M${s.x},${s.y} C${s.x + (merge.x - s.x) * 0.55},${s.y} ${merge.x - (merge.x - s.x) * 0.45},${merge.y} ${merge.x},${merge.y} L${end.x},${end.y}`;
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d); p.setAttribute('class', 'ln'); p.id = 'pqPath' + i;
      svg.appendChild(p);
      if (reduce) return;
      // chispa que viaja del origen a Sabium
      const c = document.createElementNS(NS, 'circle');
      const col = colors[i % colors.length];
      c.setAttribute('r', '4'); c.setAttribute('fill', col); c.setAttribute('class', 'spark'); c.style.color = col;
      const m = document.createElementNS(NS, 'animateMotion');
      m.setAttribute('dur', (2.6 + (i % 3) * 0.4) + 's');
      m.setAttribute('repeatCount', 'indefinite');
      m.setAttribute('begin', (i * 0.45) + 's');
      m.setAttribute('keyPoints', '0;1'); m.setAttribute('keyTimes', '0;1'); m.setAttribute('calcMode', 'spline');
      m.setAttribute('keySplines', '.45 0 .25 1');
      const mp = document.createElementNS(NS, 'mpath');
      mp.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#pqPath' + i);
      mp.setAttribute('href', '#pqPath' + i);
      m.appendChild(mp); c.appendChild(m);
      // aparece y se desvanece al llegar
      const a = document.createElementNS(NS, 'animate');
      a.setAttribute('attributeName', 'opacity'); a.setAttribute('values', '0;1;1;0');
      a.setAttribute('keyTimes', '0;.1;.85;1'); a.setAttribute('dur', m.getAttribute('dur'));
      a.setAttribute('begin', m.getAttribute('begin')); a.setAttribute('repeatCount', 'indefinite');
      c.appendChild(a);
      svg.appendChild(c);
    });
  }
  let t; const schedule = () => { cancelAnimationFrame(t); t = requestAnimationFrame(draw); };
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  // las plaquitas flotan (transform), así que fijamos las líneas al centro de su recorrido
  schedule();
  setTimeout(schedule, 1200);
})();

/* ==========================================================================
   Visibilidad: las barras y los porcentajes avanzan con el scroll
   ========================================================================== */
(() => {
  const card = document.getElementById('bfMetric');
  if (!card) return;
  const rows = [...card.querySelectorAll('.bf-bars li')].map((li) => ({
    fill: li.querySelector('.bf-fill'),
    pct: li.querySelector('.bf-pct'),
    to: parseFloat(li.querySelector('.bf-pct').dataset.to) || 0,
  }));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const ease = (t) => 1 - (1 - t) * (1 - t);

  function update() {
    const r = card.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 cuando la tarjeta asoma por abajo; 1 cuando su centro llega a ~55% de la pantalla
    const start = vh * 1.05, end = vh * 0.5;
    const p = reduce ? 1 : clamp((start - (r.top + r.height / 2)) / (start - end));
    rows.forEach((row, i) => {
      const lag = i * 0.12;                       // cada barra arranca un poquito después
      const pi = ease(clamp((p - lag) / (1 - lag)));
      row.fill.style.setProperty('--p', pi.toFixed(4));
      row.pct.textContent = Math.round(row.to * pi) + '%';
    });
  }
  let ticking = false;
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; update(); }); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

/* ==========================================================================
   Portada: el 68% de cobertura cuenta desde 0 cuando aparece
   ========================================================================== */
(() => {
  const vis = document.querySelector('.hp-visual');
  const num = document.querySelector('.hs-count');
  if (!vis || !num) return;
  const to = parseInt(num.dataset.to, 10) || 0;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  num.textContent = '0';
  const run = () => {
    const t0 = performance.now() + 1000, dur = 1600; // acompaña al anillo
    const tick = (now) => {
      const p = Math.min(1, Math.max(0, (now - t0) / dur));
      num.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (vis.classList.contains('is-visible')) run();
  else new MutationObserver((m, o) => { if (vis.classList.contains('is-visible')) { o.disconnect(); run(); } })
        .observe(vis, { attributes: true, attributeFilter: ['class'] });
})();

/* ==========================================================================
   Simulador de planificación: arrastrar (o tocar) contenidos, completar y guardar
   ========================================================================== */
(() => {
  const modal = document.getElementById('simModal');
  const openBtn = document.getElementById('simOpen');
  if (!modal || !openBtn) return;
  const $ = (id) => document.getElementById(id);
  const app = modal.querySelector('.sim-app');
  const list = $('simList'), drop = $('simDrop'), chosen = $('simChosen'), empty = $('simEmpty');
  const nameIn = $('simName'), formatIn = $('simFormat'), qtyIn = $('simQty');
  const ghost = $('simGhost'), toast = $('simToast'), done = $('simDone');
  const steps = [...modal.querySelectorAll('.sim-steps li')];
  const items = [...list.querySelectorAll('.sim-item')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let picked = [], lastFocus = null, toastTimer = null, hintOn = false;

  /* ---------- estado y pasos ---------- */
  function updateSteps() {
    const ok = [nameIn.value.trim() !== '', formatIn.value !== '', picked.length > 0];
    let current = ok.indexOf(false); if (current === -1) current = 3;
    steps.forEach((li, i) => {
      li.classList.toggle('is-done', i < 3 && ok[i]);
      li.classList.toggle('is-current', i === current);
    });
  }
  function render() {
    chosen.innerHTML = '';
    picked.forEach((id) => {
      const it = items.find((x) => x.dataset.id === id);
      const li = document.createElement('li');
      li.innerHTML = `<span></span><button type="button" aria-label="Quitar">×</button>`;
      li.querySelector('span').textContent = it.dataset.label;
      li.querySelector('button').addEventListener('click', () => remove(id));
      chosen.appendChild(li);
    });
    empty.hidden = picked.length > 0;
    items.forEach((it) => {
      const on = picked.includes(it.dataset.id);
      it.classList.toggle('is-picked', on);
      it.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    drop.classList.remove('is-missing');
    updateSteps();
  }
  function add(id) {
    if (picked.includes(id)) return;
    stopHint();
    picked.push(id);
    render();
    if (window.innerWidth <= 860) showToast('✓ Sumado a tu planificación (' + picked.length + ')');
  }
  function remove(id) { picked = picked.filter((x) => x !== id); render(); }

  function showToast(msg) {
    toast.textContent = msg; toast.classList.add('is-on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('is-on'), 3600);
  }

  /* ---------- guía animada ---------- */
  function startHint() {
    if (reduce || picked.length || window.innerWidth <= 860 || !nameIn.value.trim() || !formatIn.value) return; // primero título y formato
    const it = items[1];
    const a = app.getBoundingClientRect(), r = it.getBoundingClientRect(), d = drop.getBoundingClientRect();
    ghost.firstChild && ghost.firstChild.nodeType === 3 && ghost.removeChild(ghost.firstChild);
    ghost.insertBefore(document.createTextNode(it.dataset.label), ghost.firstChild);
    ghost.style.setProperty('--sx', (r.left - a.left + 30) + 'px');
    ghost.style.setProperty('--sy', (r.top - a.top) + 'px');
    ghost.style.setProperty('--ex', (d.left - a.left + 24) + 'px');
    ghost.style.setProperty('--ey', (d.top - a.top + 40) + 'px');
    ghost.classList.add('is-hint'); hintOn = true;
  }
  function stopHint() { if (hintOn) { ghost.classList.remove('is-hint'); hintOn = false; } }

  /* ---------- arrastrar con mouse o dedo ---------- */
  let drag = null, suppressClick = false;
  items.forEach((it) => {
    it.addEventListener('pointerdown', (e) => {
      if (it.classList.contains('is-picked') || e.button > 0) return;
      drag = { it, id: it.dataset.id, x0: e.clientX, y0: e.clientY, active: false, el: null, pid: e.pointerId };
    });
    it.addEventListener('click', () => {
      if (suppressClick) { suppressClick = false; return; }
      add(it.dataset.id);
    });
  });
  function overDrop(x, y) { const r = drop.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; }
  window.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.pid) return;
    const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (!drag.active && Math.hypot(dx, dy) > 6) {
      drag.active = true; stopHint();
      const r = drag.it.getBoundingClientRect();
      drag.offX = drag.x0 - r.left; drag.offY = drag.y0 - r.top;
      drag.el = document.createElement('div'); drag.el.className = 'sim-floating';
      drag.el.textContent = drag.it.dataset.label; drag.el.style.width = Math.min(r.width, 360) + 'px';
      document.body.appendChild(drag.el); drag.it.classList.add('is-dragging');
    }
    if (drag.active) {
      e.preventDefault();
      drag.el.style.transform = `translate(${e.clientX - drag.offX}px, ${e.clientY - drag.offY}px)`;
      drop.classList.toggle('is-over', overDrop(e.clientX, e.clientY));
    }
  }, { passive: false });
  function endDrag(e) {
    if (!drag) return;
    if (drag.active) {
      suppressClick = true;
      if (overDrop(e.clientX, e.clientY)) add(drag.id);
      drag.el.remove(); drag.it.classList.remove('is-dragging'); drop.classList.remove('is-over');
      setTimeout(() => { suppressClick = false; }, 0);
    }
    drag = null;
  }
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  /* ---------- formulario y botones ---------- */
  nameIn.addEventListener('input', () => { nameIn.closest('.sim-row').classList.remove('is-missing'); updateSteps(); });
  formatIn.addEventListener('change', () => { formatIn.closest('.sim-row').classList.remove('is-missing'); updateSteps(); if (nameIn.value.trim()) startHint(); });
  nameIn.addEventListener('change', () => { if (formatIn.value) startHint(); });
  qtyIn.addEventListener('change', () => { qtyIn.value = Math.min(20, Math.max(1, parseInt(qtyIn.value, 10) || 1)); });

  function reset() {
    picked = []; nameIn.value = ''; formatIn.value = ''; qtyIn.value = 1;
    modal.querySelectorAll('.is-missing').forEach((n) => n.classList.remove('is-missing'));
    render();
  }
  $('simClear').addEventListener('click', () => { reset(); showToast('Listo, empezá de nuevo.'); });
  $('simPdf').addEventListener('click', () => showToast('En la plataforma, desde acá descargás la planificación en PDF, lista para imprimir o compartir.'));
  $('simSave').addEventListener('click', () => {
    const miss = [];
    if (!nameIn.value.trim()) { miss.push('un título'); const r = nameIn.closest('.sim-row'); r.classList.remove('is-missing'); void r.offsetWidth; r.classList.add('is-missing'); }
    if (!formatIn.value) { miss.push('el formato'); const r = formatIn.closest('.sim-row'); r.classList.remove('is-missing'); void r.offsetWidth; r.classList.add('is-missing'); }
    if (!picked.length) { miss.push('elegir al menos un contenido'); drop.classList.remove('is-missing'); void drop.offsetWidth; drop.classList.add('is-missing'); }
    if (miss.length) { showToast('Te falta ' + miss.join(', ').replace(/, ([^,]*)$/, ' y $1') + '.'); return; }
    const n = picked.length, q = parseInt(qtyIn.value, 10) || 1;
    const s = $('simSummary'); s.textContent = '';
    const b = document.createElement('b'); b.textContent = '«' + nameIn.value.trim() + '»';
    s.append(b, ` · ${formatIn.value} · ${n} ${n === 1 ? 'contenido' : 'contenidos'} · ${q} ${q === 1 ? 'clase' : 'clases'}. Ya quedó ubicada en el calendario: martes de 08:00 a 09:30.`);
    done.hidden = false; updateSteps();
    steps.forEach((li) => { li.classList.add('is-done'); li.classList.remove('is-current'); });
    $('simAgain').focus();
  });
  $('simAgain').addEventListener('click', () => { done.hidden = true; reset(); setTimeout(startHint, 300); });
  $('simDemo').addEventListener('click', () => close());

  /* ---------- abrir / cerrar ---------- */
  function open() {
    lastFocus = document.activeElement;
    modal.hidden = false; document.body.classList.add('sim-open');
    done.hidden = true; render();
    modal.querySelector('.sim-close').focus();
  }
  function close() {
    modal.hidden = true; document.body.classList.remove('sim-open'); stopHint();
    if (lastFocus) lastFocus.focus();
  }
  openBtn.addEventListener('click', open);
  modal.querySelectorAll('[data-sim-close]').forEach((el) => el.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const f = [...modal.querySelectorAll('button, input, select, a[href]')].filter((n) => n.offsetParent !== null && !n.disabled);
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  window.addEventListener('resize', () => { if (!modal.hidden && hintOn) { stopHint(); startHint(); } });
})();
