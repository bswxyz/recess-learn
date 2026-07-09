<script>
  import { onMount, onDestroy } from 'svelte';
  import { spring } from 'svelte/motion';
  import { browser } from '$app/environment';
  import { prefersReduced } from './motion.js';

  /** @type {number} rendered pixel size */
  export let size = 220;
  /** @type {'happy'|'excited'|'idle'|'sleepy'} */
  export let mood = 'happy';
  /** decorative by default; give it a label only where it is the sole content */
  export let label = '';

  let host;
  // spring-driven pupils + body lean = the mascot's "life"
  const pupil = spring({ x: 0, y: 0 }, { stiffness: 0.12, damping: 0.5 });
  const lean = spring({ x: 0, y: 0, r: 0 }, { stiffness: 0.08, damping: 0.55 });
  const hop = spring(0, { stiffness: 0.11, damping: 0.28, precision: 0.001 });

  let blink = false;
  let blinkTimer;
  let idleTimer;

  function scheduleBlink() {
    const wait = 2200 + Math.random() * 3200;
    blinkTimer = setTimeout(() => {
      blink = true;
      setTimeout(() => { blink = false; }, 130);
      scheduleBlink();
    }, wait);
  }

  function onMove(e) {
    if (!host || prefersReduced()) return;
    const r = host.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.46;
    let dx = (e.clientX - cx) / (window.innerWidth / 2);
    let dy = (e.clientY - cy) / (window.innerHeight / 2);
    dx = Math.max(-1, Math.min(1, dx));
    dy = Math.max(-1, Math.min(1, dy));
    pupil.set({ x: dx * 8, y: dy * 6 });
    lean.set({ x: dx * 6, y: dy * 3, r: dx * 3 });
  }

  // idle: gentle look-around when the pointer is still / on touch devices
  function idleGlance() {
    if (prefersReduced()) return;
    const a = Math.random() * Math.PI * 2;
    pupil.set({ x: Math.cos(a) * 5, y: Math.sin(a) * 4 });
    idleTimer = setTimeout(idleGlance, 2600 + Math.random() * 2600);
  }

  /** public: called by the mini-lesson on a correct answer */
  export async function celebrate() {
    if (prefersReduced()) return;
    pupil.set({ x: 0, y: -4 });
    await hop.set(1);
    hop.set(0);
  }

  onMount(() => {
    if (!browser) return;
    window.addEventListener('mousemove', onMove, { passive: true });
    if (!prefersReduced()) {
      scheduleBlink();
      idleTimer = setTimeout(idleGlance, 3200);
    }
  });
  onDestroy(() => {
    if (!browser) return;
    window.removeEventListener('mousemove', onMove);
    clearTimeout(blinkTimer);
    clearTimeout(idleTimer);
  });

  // clamp rendered spring values: a throttled tab can briefly diverge a spring;
  // clamping keeps the mascot sane until the spring settles back to target.
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v || 0));
  $: hopPx = clamp(-34 * $hop, -46, 8);
  $: px = clamp($pupil.x, -14, 14);
  $: py = clamp($pupil.y, -12, 12);
  $: lx = clamp($lean.x, -12, 12);
  $: ly = clamp($lean.y, -8, 8);
  $: lr = clamp($lean.r, -8, 8);
</script>

<div
  class="pip"
  class:pip--reduced={false}
  bind:this={host}
  style="width:{size}px; height:{size * 1.05}px;"
  role={label ? 'img' : 'presentation'}
  aria-label={label || undefined}
  aria-hidden={label ? undefined : 'true'}
>
  <div class="pip-hop" style="transform: translateY({hopPx}px);">
    <svg viewBox="0 0 200 210" style="transform: translate({lx}px, {ly}px) rotate({lr}deg);">
      <!-- soft ground shadow -->
      <ellipse class="pip-shadow" cx="100" cy="196" rx="52" ry="11" />

      <!-- antenna -->
      <g class="pip-antenna">
        <path d="M100 46 Q106 26 118 20" fill="none" stroke="var(--ink)" stroke-width="6" stroke-linecap="round" />
        <circle cx="120" cy="18" r="9" fill="var(--yellow)" stroke="var(--ink)" stroke-width="5" />
      </g>

      <!-- feet -->
      <ellipse cx="76" cy="188" rx="17" ry="12" fill="var(--ink)" />
      <ellipse cx="124" cy="188" rx="17" ry="12" fill="var(--ink)" />

      <!-- arms -->
      <path class="pip-arm pip-arm--l" d="M44 116 Q20 118 18 138" fill="none" stroke="var(--ink)" stroke-width="12" stroke-linecap="round" />
      <path class="pip-arm pip-arm--r" d="M156 116 Q180 118 182 138" fill="none" stroke="var(--ink)" stroke-width="12" stroke-linecap="round" />

      <!-- body -->
      <circle cx="100" cy="112" r="66" fill="var(--red)" stroke="var(--ink)" stroke-width="7" />
      <!-- belly highlight -->
      <ellipse cx="86" cy="96" rx="26" ry="20" fill="#fff" opacity=".16" />

      <!-- cheeks -->
      <circle cx="66" cy="126" r="11" fill="#ff9a8f" opacity=".9" />
      <circle cx="134" cy="126" r="11" fill="#ff9a8f" opacity=".9" />

      <!-- eyes -->
      <g>
        <circle cx="80" cy="104" r="20" fill="#fff" stroke="var(--ink)" stroke-width="5" />
        <circle cx="120" cy="104" r="20" fill="#fff" stroke="var(--ink)" stroke-width="5" />
        {#if blink}
          <rect x="60" y="101" width="40" height="7" rx="3.5" fill="var(--ink)" />
          <rect x="100" y="101" width="40" height="7" rx="3.5" fill="var(--ink)" />
        {:else}
          <g style="transform: translate({px}px, {py}px);">
            <circle cx="80" cy="105" r="9" fill="var(--ink)" />
            <circle cx="120" cy="105" r="9" fill="var(--ink)" />
            <circle cx="84" cy="101" r="3" fill="#fff" />
            <circle cx="124" cy="101" r="3" fill="#fff" />
          </g>
        {/if}
      </g>

      <!-- mouth by mood -->
      {#if mood === 'excited'}
        <path d="M84 138 Q100 162 116 138 Q100 150 84 138 Z" fill="var(--ink)" />
        <path d="M90 145 Q100 152 110 145" fill="#ff9a8f" />
      {:else if mood === 'sleepy'}
        <path d="M88 142 Q100 150 112 142" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linecap="round" />
      {:else}
        <path d="M82 138 Q100 156 118 138" fill="none" stroke="var(--ink)" stroke-width="6" stroke-linecap="round" />
      {/if}
    </svg>
  </div>
</div>

<style>
  .pip { position: relative; display: grid; place-items: center; }
  .pip-hop { will-change: transform; }
  svg { width: 100%; height: 100%; overflow: visible; will-change: transform; }
  .pip-shadow { fill: rgba(35, 32, 32, .14); }

  /* idle breathing + antenna wobble (disabled under reduced motion) */
  svg { animation: breathe 3.6s var(--ease-soft, ease-in-out) infinite; transform-origin: 100px 178px; }
  .pip-antenna { transform-origin: 100px 46px; animation: wobble 2.8s ease-in-out infinite; }
  @keyframes breathe {
    0%, 100% { scale: 1 1; }
    50% { scale: 1.02 0.985; }
  }
  @keyframes wobble {
    0%, 100% { rotate: -4deg; }
    50% { rotate: 5deg; }
  }
  @media (prefers-reduced-motion: reduce) {
    svg, .pip-antenna { animation: none; }
  }
</style>
