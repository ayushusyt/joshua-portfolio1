/* ═══════════════════════════════════════════════════════════
   Portfolio Script — Black × Magenta
   All animations via transform + opacity (GPU safe)
   IntersectionObserver throughout — no scroll listeners
   ═══════════════════════════════════════════════════════════ */

/* ─── CURSOR ─────────────────────────────────────────────── */
const cur      = document.getElementById('cur');
const curLabel = document.getElementById('cur-label');

let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function cursorLoop() {
  cx += (mx - cx) * 0.14;
  cy += (my - cy) * 0.14;
  cur.style.transform = `translate(${cx}px,${cy}px)`;
  requestAnimationFrame(cursorLoop);
})();

/* ─── CARD HOVER — cursor + label + video play ───────────── */
document.querySelectorAll('.bezel[data-label]').forEach(card => {
  card.addEventListener('mouseenter', () => {
    document.body.classList.add('hovering');
    curLabel.textContent = card.dataset.label || '';
    const v = card.querySelector('video');
    if (v) v.play().catch(() => {});
  });
  card.addEventListener('mouseleave', () => {
    document.body.classList.remove('hovering');
    curLabel.textContent = '';
  });
});

/* ─── PER-VIDEO MUTE BUTTONS ─────────────────────────────── */
document.querySelectorAll('.vid-mute-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const card = btn.closest('.bezel');
    const video = card ? card.querySelector('video') : null;
    if (!video) return;

    const nowMuted = !video.muted;
    video.muted = nowMuted;

    if (!nowMuted) {
      // If this video just got unmuted, mute all others
      document.querySelectorAll('.bezel video').forEach(v => {
        if (v !== video) {
          v.muted = true;
          const otherBtn = v.closest('.bezel')?.querySelector('.vid-mute-btn');
          if (otherBtn) otherBtn.classList.remove('sound-on');
        }
      });
    }

    btn.classList.toggle('sound-on', !nowMuted);
  });
});

/* ─── NAV STICKY ─────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 60);
}, { passive: true });

/* ─── SECTION REVEAL ─────────────────────────────────────── */
const ioReveal = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); ioReveal.unobserve(e.target); }
  });
}, { threshold: 0.07 });

document.querySelectorAll('.reveal').forEach(el => ioReveal.observe(el));

/* ─── VIDEO — LAZY LOAD + PLAY/PAUSE ON SCROLL ───────────── */
const ioVid = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const v = e.target.querySelector('video');
    if (!v) return;
    if (e.isIntersecting) {
      if (v.getAttribute('preload') === 'none') v.load();
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.bezel').forEach(b => ioVid.observe(b));

/* ─── HERO VIDEO ─────────────────────────────────────────── */
const heroV = document.getElementById('heroVid');
if (heroV) heroV.play().catch(() => {});

/* ─── STAGGERED GRID ENTRANCE ────────────────────────────── */
const ioGrid = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.bezel').forEach((card, i) => {
      setTimeout(() => {
        card.style.opacity   = '1';
        card.style.transform = 'none';
      }, i * 80);
    });
    ioGrid.unobserve(e.target);
  });
}, { threshold: 0.04 });

document.querySelectorAll('.mag-grid').forEach(grid => {
  grid.querySelectorAll('.bezel').forEach(card => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(18px)';
    card.style.transition = 'opacity .7s cubic-bezier(0.16,1,0.3,1), transform .7s cubic-bezier(0.16,1,0.3,1)';
  });
  ioGrid.observe(grid);
});
