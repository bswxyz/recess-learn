<script>
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { prefersReduced } from './motion.js';

  export let count = 90;
  let canvas;
  let raf;
  let pieces = [];
  let w = 0, h = 0, dpr = 1;
  const colors = ['#ff5a4d', '#3d7bff', '#ffd23d', '#3ec97e', '#ff9a8f'];

  function size() {
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height; dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = w * dpr; canvas.height = h * dpr;
  }

  /** public: fire a burst from (originX, originY) as fractions of the canvas */
  export function burst(ox = 0.5, oy = 0.42) {
    if (!browser || prefersReduced() || !canvas) return;
    size();
    for (let i = 0; i < count; i++) {
      const a = (Math.random() * Math.PI) - Math.PI / 2 + (Math.random() - 0.5);
      const sp = 6 + Math.random() * 10;
      pieces.push({
        x: ox * w, y: oy * h,
        vx: Math.cos(a) * sp * (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random()),
        vy: Math.sin(a) * sp - (4 + Math.random() * 5),
        g: 0.28 + Math.random() * 0.16,
        s: 6 + Math.random() * 8,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        c: colors[(Math.random() * colors.length) | 0],
        life: 0, max: 70 + Math.random() * 40,
        shape: Math.random() < 0.5 ? 'rect' : 'circle'
      });
    }
    if (!raf) loop();
  }

  function loop() {
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    for (const p of pieces) {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.rot += p.vr; p.life++;
    }
    pieces = pieces.filter((p) => p.life < p.max && p.y < h + 40);
    for (const p of pieces) {
      const alpha = 1 - Math.max(0, (p.life - p.max * 0.6) / (p.max * 0.4));
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      if (p.shape === 'rect') ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      else { ctx.beginPath(); ctx.arc(0, 0, p.s / 2, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    }
    if (pieces.length) raf = requestAnimationFrame(loop);
    else { cancelAnimationFrame(raf); raf = null; }
  }

  onMount(() => { if (browser) { size(); window.addEventListener('resize', size); } });
  onDestroy(() => { if (browser) { window.removeEventListener('resize', size); if (raf) cancelAnimationFrame(raf); } });
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
  canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 6; }
</style>
