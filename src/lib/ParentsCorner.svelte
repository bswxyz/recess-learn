<script>
  import { spring } from 'svelte/motion';
  import { prefersReduced } from './motion.js';
  import Counter from './Counter.svelte';

  const HOLD_MS = 1600;
  const R = 52;
  const CIRC = 2 * Math.PI * R;

  let progress = 0;
  let holding = false;
  let unlocked = false;
  let raf, startT;
  let keyHeld = false;
  const squish = spring(1, { stiffness: 0.18, damping: 0.4 });

  function tick(t) {
    if (!startT) startT = t;
    progress = Math.min(1, (t - startT) / HOLD_MS);
    if (progress >= 1) { finish(); return; }
    raf = requestAnimationFrame(tick);
  }
  function start() {
    if (unlocked || holding) return;
    holding = true; startT = 0;
    if (!prefersReduced()) squish.set(0.9);
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    if (unlocked) return;
    holding = false; cancelAnimationFrame(raf);
    squish.set(1);
    if (progress < 1) progress = 0;
  }
  function finish() {
    holding = false; unlocked = true; progress = 1;
    cancelAnimationFrame(raf); squish.set(1);
  }
  function onKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!keyHeld) { keyHeld = true; start(); } }
  }
  function onKeyup(e) {
    if (e.key === 'Enter' || e.key === ' ') { keyHeld = false; stop(); }
  }

  $: dash = CIRC * (1 - progress);
  $: squishScale = Math.max(0.82, Math.min(1.12, $squish || 1));
</script>

<section id="parents" class="parents">
  <div class="wrap">
    <div class="parents-grid">
      <div class="intro">
        <p class="eyebrow reveal">For grown-ups</p>
        <h2 class="reveal">The parents' corner.</h2>
        <p class="lede reveal">Ten minutes a day. Actual pedagogy. Zero ads. Here's the honest version —
          behind a little door only a grown-up has the patience to open.</p>
        <ul class="trust reveal">
          <li><span aria-hidden="true">✏️</span> Built with early-childhood educators, mapped to real numeracy and literacy milestones.</li>
          <li><span aria-hidden="true">🚫</span> No ads, no pop-ups, no "buy gems." Nothing interrupts a four-year-old.</li>
          <li><span aria-hidden="true">🔒</span> No data selling, ever. A daily play cap you set, and a gate they can't tap past.</li>
          <li><span aria-hidden="true">📵</span> Works offline on the kitchen tablet, on the plane, in the back seat.</li>
        </ul>
      </div>

      <div class="gate-col reveal">
        {#if !unlocked}
          <div class="gate">
            <p class="gate-title">This bit's for grown-ups</p>
            <p class="gate-sub">Press and <strong>hold</strong> the button for a moment — proof you're not two.</p>
            <button
              type="button"
              class="hold"
              on:pointerdown={start}
              on:pointerup={stop}
              on:pointerleave={stop}
              on:pointercancel={stop}
              on:keydown={onKeydown}
              on:keyup={onKeyup}
              aria-label="Hold to enter the parents' corner"
              style="transform: scale({squishScale});"
            >
              <svg viewBox="0 0 130 130" class="ring" aria-hidden="true">
                <circle cx="65" cy="65" r={R} fill="none" stroke="var(--line)" stroke-width="9" />
                <circle cx="65" cy="65" r={R} fill="none" stroke="var(--green)" stroke-width="9"
                  stroke-linecap="round" stroke-dasharray={CIRC} stroke-dashoffset={dash}
                  transform="rotate(-90 65 65)" />
              </svg>
              <span class="hold-face" aria-hidden="true">
                <span class="hold-emoji">{holding ? '🤔' : '🖐️'}</span>
                <span class="hold-word">{holding ? 'Keep holding…' : 'Hold me'}</span>
              </span>
            </button>
          </div>
        {:else}
          <div class="unlocked">
            <p class="unlocked-hi"><span aria-hidden="true">👋</span> Welcome in.</p>
            <div class="stats">
              <div class="stat">
                <span class="s-num"><Counter to={10} suffix=" min" /></span>
                <span class="s-lbl">a day is plenty — that's the whole design</span>
              </div>
              <div class="stat">
                <span class="s-num"><Counter to={26} /></span>
                <span class="s-lbl">lessons across counting, letters &amp; patterns</span>
              </div>
              <div class="stat">
                <span class="s-num"><Counter to={0} suffix="" />&nbsp;ads</span>
                <span class="s-lbl">and zero in-app purchases, forever</span>
              </div>
              <div class="stat">
                <span class="s-num">4–8</span>
                <span class="s-lbl">the age range every lesson is tuned for</span>
              </div>
            </div>
            <p class="demo-note">This is a design demo — the numbers illustrate the product's intent, not
              a shipping analytics dashboard.</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  .parents { padding: clamp(70px, 10vw, 120px) 0; }
  .parents-grid { display: grid; grid-template-columns: 1.05fr .95fr; gap: clamp(28px, 5vw, 64px); align-items: center; }
  .intro h2 { font-size: clamp(2rem, 5vw, 3.2rem); margin: .7rem 0 .9rem; }
  .lede { color: var(--dim); font-size: clamp(1.02rem, 2vw, 1.2rem); max-width: 46ch; }

  .trust { list-style: none; margin-top: 1.6rem; display: grid; gap: .8rem; }
  .trust li { display: grid; grid-template-columns: auto 1fr; gap: .7rem; font-weight: 600; color: var(--ink); line-height: 1.45; }
  .trust li span { font-size: 1.15rem; }

  .gate-col { min-height: 340px; display: grid; }
  .gate, .unlocked {
    background: var(--card); border: 4px solid var(--ink); border-radius: var(--r-lg);
    box-shadow: 0 14px 0 rgba(35,32,32,.14); padding: clamp(24px, 4vw, 38px); text-align: center;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .gate-title { font-family: "Fredoka", system-ui, sans-serif; font-size: clamp(1.4rem, 3.6vw, 1.9rem); }
  .gate-sub { color: var(--dim); margin: .5rem 0 1.6rem; max-width: 30ch; }

  .hold {
    position: relative; width: 150px; height: 150px; border-radius: 50%;
    background: #fff5df; border: 4px solid var(--ink); box-shadow: 0 8px 0 var(--ink);
    display: grid; place-items: center; touch-action: none; -webkit-tap-highlight-color: transparent;
    transition: box-shadow .12s var(--ease);
  }
  .hold:active { box-shadow: 0 3px 0 var(--ink); }
  .ring { position: absolute; inset: 6px; width: calc(100% - 12px); height: calc(100% - 12px); }
  .hold-face { display: grid; place-items: center; gap: .2rem; }
  .hold-emoji { font-size: 2.4rem; }
  .hold-word { font-family: "Fredoka", system-ui, sans-serif; font-weight: 500; font-size: .95rem; color: var(--ink); }

  .unlocked-hi { font-family: "Fredoka", system-ui, sans-serif; font-size: clamp(1.3rem, 3.4vw, 1.7rem); margin-bottom: 1.1rem; }
  .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; width: 100%; }
  .stat { background: #fff5df; border: 3px solid var(--ink); border-radius: 22px; padding: 16px 14px; text-align: left; }
  .s-num { display: block; font-family: "Nunito", system-ui, sans-serif; font-weight: 800; font-size: clamp(1.7rem, 5vw, 2.3rem); color: var(--red); line-height: 1; }
  .stat:nth-child(2) .s-num { color: var(--blue); }
  .stat:nth-child(3) .s-num { color: var(--green); }
  .stat:nth-child(4) .s-num { color: var(--ink); }
  .s-lbl { display: block; font-size: .86rem; font-weight: 600; color: var(--dim); margin-top: .4rem; line-height: 1.35; }
  .demo-note { font-size: .8rem; color: var(--dim); margin-top: 1.1rem; max-width: 34ch; }

  @media (max-width: 820px) {
    .parents-grid { grid-template-columns: 1fr; }
    .gate-col { min-height: 0; }
  }
  @media (max-width: 380px) {
    .stats { grid-template-columns: 1fr; }
  }
</style>
