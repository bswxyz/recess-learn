<script>
  import { tweened } from 'svelte/motion';
  import { backOut } from 'svelte/easing';
  import { prefersReduced } from './motion.js';

  export let cx = 0;
  export let cy = 0;
  /** @type {'done'|'current'|'locked'} */
  export let state = 'locked';
  export let show = false;

  // time-based tween with an overshoot easing = a bouncy pop that (unlike a
  // spring) can never diverge if the tab is throttled mid-animation.
  const s = tweened(prefersReduced() ? 1 : 0, { duration: 520, easing: backOut });
  $: if (show) s.set(1);

  const fill = { done: 'var(--green)', current: 'var(--yellow)', locked: '#efe6d4' };
</script>

<g style="transform: translate({cx}px, {cy}px) scale({$s}); opacity: {Math.min(1, $s + 0.05)};">
  {#if state === 'current'}
    <circle class="pulse" r="46" fill="var(--yellow)" opacity="0.5" />
  {/if}
  <!-- 3d base -->
  <circle cx="0" cy="7" r="46" fill="var(--ink)" opacity="0.9" />
  <circle cx="0" cy="0" r="46" fill={fill[state]} stroke="var(--ink)" stroke-width="6" />

  {#if state === 'done'}
    <path d="M-17 1 L-5 14 L18 -13" fill="none" stroke="var(--ink)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" />
  {:else if state === 'current'}
    <path d="M0 -20 L6 -6 L21 -6 L9 4 L14 19 L0 10 L-14 19 L-9 4 L-21 -6 L-6 -6 Z" fill="var(--ink)" />
  {:else}
    <g stroke="var(--dim)" fill="var(--dim)">
      <path d="M-11 -3 v-4 a11 11 0 0 1 22 0 v4" fill="none" stroke-width="6" />
      <rect x="-15" y="-3" width="30" height="24" rx="6" stroke="none" />
      <circle cx="0" cy="7" r="4" fill="#efe6d4" stroke="none" />
    </g>
  {/if}
</g>

<style>
  g { will-change: transform; }
  .pulse { transform-box: fill-box; transform-origin: center; animation: ping 1.9s ease-out infinite; }
  @keyframes ping {
    0% { transform: scale(1); opacity: .55; }
    70%, 100% { transform: scale(1.9); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) { .pulse { animation: none; opacity: 0; } }
</style>
