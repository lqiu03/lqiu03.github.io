// V1ScholarWow — Cheng Lou-inspired motion layer wrapping V1Scholar.
//
// This file does NOT touch V1Scholar's markup. It mounts V1Scholar as-is,
// then attaches behaviors to the rendered DOM via querySelector + refs:
//
//   • Custom cursor that expands over interactive surfaces
//   • Headshot 3D-tilts toward the cursor (spring-damped)
//   • Letters of the name stagger in on first paint
//   • Section rules draw left→right when scrolled into view
//   • The "AI-native physical intelligence" phrase gets an underline that draws
//   • List items + sections fade-and-rise on scroll
//   • Bookshelf spines drop in with a spring on first paint
//   • Reading-section spines wiggle subtly with a slow ambient breeze
//
// Every install* function returns a cleanup. Wrapper unmount calls them all.

function V1ScholarWow() {
  const rootRef = React.useRef(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;
    let cleanups = [];
    let cancelled = false;

    const rafId = requestAnimationFrame(() => {
      if (cancelled) return;
      cleanups = [
        installCursor(root),
        installHeadshotTilt(root),
        installNameStagger(root),
        installSectionRuleDraw(root),
        installAccentUnderlineDraw(root),
        installScrollReveal(root),
        installBookshelfSettle(root),
        installShelfBreeze(root),
      ];
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      cleanups.forEach(fn => fn && fn());
    };
  }, []);

  return (
    <div ref={rootRef} className="v1-wow" style={{ position: 'relative' }}>
      <style>{wowCSS}</style>
      <V1Scholar />
    </div>
  );
}

const wowCSS = `
.wow-cursor {
  position: fixed;
  left: 0; top: 0;
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 1.5px solid #c96442;
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  transition: width .32s cubic-bezier(.2,.7,.3,1),
              height .32s cubic-bezier(.2,.7,.3,1),
              background .25s, border-color .25s, opacity .2s;
  mix-blend-mode: multiply;
}
.wow-cursor.is-visible { opacity: 1; }
.wow-cursor.is-big {
  width: 44px; height: 44px;
  background: rgba(201, 100, 66, 0.18);
  border-color: rgba(201, 100, 66, 0.9);
}
.wow-cursor.is-text {
  width: 4px; height: 22px;
  border-radius: 1px;
  background: #c96442;
  border-color: transparent;
}

.v1-wow .wow-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(10px);
  animation: wow-char-in .7s cubic-bezier(.2,.7,.3,1) both;
}
@keyframes wow-char-in {
  to { opacity: 1; transform: translateY(0); }
}

.v1-wow .wow-reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 1s cubic-bezier(.2,.7,.3,1),
              transform 1s cubic-bezier(.2,.7,.3,1);
  will-change: opacity, transform;
}
.v1-wow .wow-reveal.wow-in {
  opacity: 1; transform: translateY(0);
}

.v1-wow .wow-spine {
  animation: wow-drop .85s cubic-bezier(.3, 1.55, .55, 1) both;
  will-change: transform, opacity;
}
@keyframes wow-drop {
  0%   { transform: translateY(-220px) rotate(-6deg); opacity: 0; }
  60%  { opacity: 1; }
  100% { transform: translateY(0) rotate(0); opacity: 1; }
}

.v1-wow [data-headshot] {
  transform-origin: center center;
  transition: filter .25s;
}
.v1-wow [data-headshot] img { backface-visibility: hidden; }
`;

// ──────────────────────────────────────────────────────────────────────────
// Effect installers
// Each takes the root DOM node and returns a cleanup () => void.
// ──────────────────────────────────────────────────────────────────────────

// Maps viewport-space mouse coords into the artboard's local 1280-wide
// coordinate system, accounting for whatever scale the design canvas applied.
function makeLocal(root) {
  return function (e) {
    const rect = root.getBoundingClientRect();
    const sx = rect.width / root.offsetWidth || 1;
    const sy = rect.height / root.offsetHeight || 1;
    return { x: (e.clientX - rect.left) / sx, y: (e.clientY - rect.top) / sy };
  };
}

function installCursor(root) {
  // Decorative ring that follows the system cursor with a spring delay.
  // Lives in document.body so position:fixed isn't affected by the design
  // canvas's transforms. System cursor stays visible — this is a follower,
  // not a replacement.
  const dot = document.createElement('div');
  dot.className = 'wow-cursor';
  document.body.appendChild(dot);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;
  let state = 'default';
  let visible = false;

  function classify(target) {
    if (!target || !target.closest) return 'default';
    if (target.closest('a, button, [role="button"]')) return 'big';
    if (target.closest('h1, h2, h3, p, li, em, strong')) return 'text';
    return 'default';
  }

  function onMove(e) {
    const inside = !!(e.target && root.contains(e.target));
    if (inside) {
      mx = e.clientX; my = e.clientY;
      state = classify(e.target);
      if (!visible) { visible = true; dot.classList.add('is-visible'); }
    } else if (visible) {
      visible = false;
      dot.classList.remove('is-visible');
    }
  }

  let raf;
  function tick() {
    cx += (mx - cx) * 0.22;
    cy += (my - cy) * 0.22;
    dot.style.transform =
      `translate(${cx - dot.offsetWidth / 2}px, ${cy - dot.offsetHeight / 2}px)`;
    dot.classList.toggle('is-big',  state === 'big');
    dot.classList.toggle('is-text', state === 'text');
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  window.addEventListener('mousemove', onMove, true);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('mousemove', onMove, true);
    dot.remove();
  };
}

function installHeadshotTilt(root) {
  const img = root.querySelector('img[alt]');
  if (!img) return () => {};
  const hs = img.parentElement;
  hs.setAttribute('data-headshot', '');
  // Subtle border around the headshot to draw the eye to the tilt
  hs.style.boxShadow = '0 1px 0 rgba(0,0,0,.04), 0 16px 40px -22px rgba(0,0,0,.28)';

  let tx = 0, ty = 0, cx = 0, cy = 0;
  function onMove(e) {
    const rect = hs.getBoundingClientRect();
    const cxr = rect.left + rect.width / 2;
    const cyr = rect.top + rect.height / 2;
    const dx = (e.clientX - cxr) / Math.max(rect.width, 600);
    const dy = (e.clientY - cyr) / Math.max(rect.height, 600);
    tx = clamp(dx, -1, 1) * 7;
    ty = clamp(dy, -1, 1) * 5;
  }
  function onLeave() { tx = 0; ty = 0; }

  let raf;
  function tick() {
    cx += (tx - cx) * 0.07;
    cy += (ty - cy) * 0.07;
    hs.style.transform =
      `perspective(900px) rotateY(${cx.toFixed(2)}deg) rotateX(${(-cy).toFixed(2)}deg)`;
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseleave', onLeave);
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseleave', onLeave);
    hs.style.transform = '';
    hs.style.boxShadow = '';
  };
}

function installNameStagger(root) {
  const name = root.querySelector('h1');
  if (!name || name.dataset.wowed) return () => {};
  const original = name.textContent;
  name.dataset.wowed = '1';
  name.innerHTML = Array.from(original).map((c, i) =>
    `<span class="wow-char" style="animation-delay:${i * 55}ms">${c === ' ' ? '&nbsp;' : escapeHtml(c)}</span>`
  ).join('');
  return () => {
    name.textContent = original;
    delete name.dataset.wowed;
  };
}

function installSectionRuleDraw(root) {
  // Each section header is `<span n /> <h2 /> <span rule />`.
  // The rule is the h2's nextElementSibling — give it an x-scale transition.
  const heads = root.querySelectorAll('main h2, [class*="v1"] main h2');
  const cleanups = [];
  heads.forEach(h => {
    const rule = h.nextElementSibling;
    if (!rule) return;
    rule.style.transformOrigin = 'left center';
    rule.style.transform = 'scaleX(0)';
    rule.style.transition = 'transform 1.4s cubic-bezier(.2,.7,.3,1) .15s';
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        rule.style.transform = 'scaleX(1)';
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(h.parentElement || h);
    cleanups.push(() => io.disconnect());
  });
  return () => cleanups.forEach(fn => fn());
}

function installAccentUnderlineDraw(root) {
  const accent = Array.from(root.querySelectorAll('span')).find(s =>
    (s.textContent || '').trim() === 'AI-native physical intelligence'
  );
  if (!accent) return () => {};
  accent.style.backgroundImage = 'linear-gradient(currentColor, currentColor)';
  accent.style.backgroundSize = '0% 2px';
  accent.style.backgroundPosition = '0 calc(100% - 1px)';
  accent.style.backgroundRepeat = 'no-repeat';
  accent.style.transition = 'background-size 1.6s cubic-bezier(.2,.7,.3,1) .35s';
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      accent.style.backgroundSize = '100% 2px';
      io.disconnect();
    }
  }, { threshold: 0.6 });
  io.observe(accent);
  return () => io.disconnect();
}

function installScrollReveal(root) {
  // Target the writing / publication / publication-list items plus the
  // section headers. Each gets a baseline opacity/translate and reveals on IO.
  const targets = new Set();
  root.querySelectorAll('main > section').forEach(s => targets.add(s));
  root.querySelectorAll('main ol > li').forEach(s => targets.add(s));
  // Org chips and accent block in intro
  root.querySelectorAll('[style*="border:"] img[alt]').forEach(img => {
    const chip = img.closest('span');
    if (chip) targets.add(chip);
  });

  targets.forEach(t => t.classList.add('wow-reveal'));

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('wow-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(t => io.observe(t));
  return () => io.disconnect();
}

function installBookshelfSettle(root) {
  // Books only animate on first paint. Find the spines inside #reading and
  // attach a per-spine animation-delay so they cascade.
  let to = null;
  to = setTimeout(() => {
    const reading = root.querySelector('#reading');
    if (!reading) return;
    const spines = Array.from(reading.querySelectorAll('button'))
      .filter(b => b.offsetHeight > 150);
    spines.forEach((s, i) => {
      const jitter = (hashish(i) % 220);
      s.style.animationDelay = `${(i * 6 + jitter) % 900}ms`;
      s.classList.add('wow-spine');
    });
  }, 200);
  return () => clearTimeout(to);
}

function installShelfBreeze(root) {
  // Very subtle horizontal sway on the entire reading section after the
  // spines settle. Gives the bookshelf scene a "lived-in" feel.
  const reading = root.querySelector('#reading [style*="3b2f24"]');
  if (!reading) return () => {};
  let raf;
  const start = performance.now();
  function tick(t) {
    const dt = (t - start) / 1000;
    const sway = Math.sin(dt * 0.7) * 0.4;
    reading.style.transform = `translateX(${sway.toFixed(2)}px)`;
    raf = requestAnimationFrame(tick);
  }
  // Defer breeze until after the drop-in is done (~1.5s)
  let delay;
  delay = setTimeout(() => {
    raf = requestAnimationFrame(tick);
  }, 1500);
  return () => {
    clearTimeout(delay);
    cancelAnimationFrame(raf);
    reading.style.transform = '';
  };
}

// ── helpers ───────────────────────────────────────────────────────────────
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function hashish(i) { return (i * 2654435761) >>> 0; }
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, m => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]
  ));
}

Object.assign(window, { V1ScholarWow });
