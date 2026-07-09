import { browser } from '$app/environment';
import { readable } from 'svelte/store';

/** Live store: true when the user asked for reduced motion. */
export const reducedMotion = readable(false, (set) => {
  if (!browser) return;
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  set(mq.matches);
  const on = () => set(mq.matches);
  mq.addEventListener('change', on);
  return () => mq.removeEventListener('change', on);
});

/** Synchronous check (safe on server → false). */
export function prefersReduced() {
  return browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Set a Svelte spring/tweened store, but jump instantly when reduced motion
 * is requested. This is how every bouncy spring in the site stays accessible.
 */
export function springTo(store, value) {
  return store.set(value, prefersReduced() ? { hard: true } : {});
}

/**
 * Scroll-reveal action applied to a CONTAINER (e.g. <main>): it finds every
 * `.reveal` / `.reveal-clip` descendant and adds `.is-in` when each scrolls into
 * view. Because it's an action, it re-runs on every (re)mount of the container —
 * so a dev re-hydration can never leave content permanently stuck hidden.
 * Content is visible without JS (the hidden state only bites under html.js), and
 * reduced-motion reveals everything instantly.
 */
export function revealAll(node) {
  if (!browser) return {};
  const pending = new Set(node.querySelectorAll('.reveal, .reveal-clip'));
  const show = (n) => n.classList.add('is-in');
  if (prefersReduced()) {
    pending.forEach(show);
    return {};
  }
  // Resilient viewport height (some embedded/headless contexts report innerHeight 0).
  const vh = () => window.innerHeight || document.documentElement.clientHeight || 800;
  const check = () => {
    const h = vh();
    for (const n of [...pending]) {
      const r = n.getBoundingClientRect();
      if (r.top < h * 0.9 && r.bottom > -40) {
        show(n);
        pending.delete(n);
      }
    }
    if (!pending.size) teardown();
  };
  const onScroll = () => check();
  const teardown = () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  check(); // initial pass reveals everything above the fold
  // re-check after layout/viewport settles (guards a transient 0 innerHeight at mount)
  [140, 400, 900].forEach((t) => setTimeout(check, t));
  return { destroy: teardown };
}

/**
 * Call `cb` once when `node` first scrolls into view. Scroll-listener based (not
 * IntersectionObserver) so it works even where the embedded viewport height is
 * momentarily unreported. Reduced motion fires immediately.
 */
export function onEnter(node, cb) {
  if (!browser) return () => {};
  if (prefersReduced()) { cb(); return () => {}; }
  const vh = () => window.innerHeight || document.documentElement.clientHeight || 800;
  let done = false;
  const check = () => {
    if (done) return;
    const r = node.getBoundingClientRect();
    if (r.top < vh() * 0.85 && r.bottom > 0) { done = true; cb(); teardown(); }
  };
  const onScroll = () => check();
  const teardown = () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  check();
  [140, 400, 900].forEach((t) => setTimeout(check, t));
  return teardown;
}
