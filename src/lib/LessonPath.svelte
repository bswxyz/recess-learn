<script>
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { browser } from '$app/environment';
  import { prefersReduced, onEnter } from './motion.js';
  import PathNode from './PathNode.svelte';

  const VBW = 560;
  const VBH = 1120;

  const nodes = [
    { cx: 410, cy: 92,   state: 'done',    label: 'Counting to five' },
    { cx: 168, cy: 250,  state: 'done',    label: 'Count to ten' },
    { cx: 402, cy: 408,  state: 'done',    label: 'Big and small' },
    { cx: 150, cy: 566,  state: 'current', label: 'Letter sounds' },
    { cx: 410, cy: 724,  state: 'locked',  label: 'Find the letter' },
    { cx: 168, cy: 882,  state: 'locked',  label: 'Match the pattern' },
    { cx: 400, cy: 1040, state: 'locked',  label: 'Shapes party' }
  ];

  // smooth snaking trail through the node centres
  const trail = `M410 92
    C 410 172, 168 170, 168 250
    C 168 330, 402 328, 402 408
    C 402 488, 150 486, 150 566
    C 150 646, 410 644, 410 724
    C 410 804, 168 802, 168 882
    C 168 962, 400 960, 400 1040`;

  let shown = nodes.map(() => false);
  let host;
  const current = nodes.find((n) => n.state === 'current');

  onMount(() => {
    if (!browser) return;
    if (prefersReduced()) { shown = nodes.map(() => true); return; }
    return onEnter(host, () => {
      nodes.forEach((_, i) => setTimeout(() => { shown[i] = true; shown = shown; }, i * 150));
    });
  });
</script>

<section id="lessons" class="path-section">
  <div class="wrap">
    <header class="path-head">
      <p class="eyebrow reveal">The learning journey</p>
      <h2 class="reveal">One tiny win at a time.</h2>
      <p class="lede reveal">Every lesson is a stepping-stone on Pip's path. Finish one, the next
        pops open — no rush, no losing, just the next small adventure.</p>
      <ul class="legend reveal" aria-hidden="true">
        <li><span class="dot done"></span> Done</li>
        <li><span class="dot current"></span> You're here</li>
        <li><span class="dot locked"></span> Coming up</li>
      </ul>
    </header>

    <div class="path-wrap" bind:this={host}>
      <svg viewBox="0 0 {VBW} {VBH}" class="path-svg" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
        <path d={trail} fill="none" stroke="var(--ink)" stroke-width="9" stroke-linecap="round" stroke-dasharray="0.1 34" opacity="0.16" />
        {#each nodes as node, i}
          <PathNode cx={node.cx} cy={node.cy} state={node.state} show={shown[i]} />
        {/each}
      </svg>

      {#if current}
        <a
          class="start-pop"
          href="{base}/#play"
          style="left: {(current.cx / VBW) * 100}%; top: {((current.cy - 96) / VBH) * 100}%;"
        >
          <span class="start-pop__label">▶ Start here</span>
          <span class="start-pop__tail" aria-hidden="true"></span>
        </a>
      {/if}

      <!-- accessible description of the decorative path -->
      <ol class="sr-only">
        {#each nodes as node}
          <li>{node.label} — {node.state === 'done' ? 'completed' : node.state === 'current' ? 'in progress, up next' : 'locked, unlocks later'}.</li>
        {/each}
      </ol>
    </div>
  </div>
</section>

<style>
  .path-section { padding: clamp(70px, 10vw, 130px) 0; }
  .path-head { text-align: center; max-width: 620px; margin: 0 auto clamp(28px, 5vw, 56px); }
  .path-head h2 { font-size: clamp(2rem, 5.4vw, 3.4rem); margin: .7rem 0 .8rem; }
  .lede { color: var(--dim); font-size: clamp(1.02rem, 2vw, 1.2rem); max-width: 46ch; margin-inline: auto; }

  .legend { list-style: none; display: flex; gap: 1.3rem; justify-content: center; flex-wrap: wrap; margin-top: 1.4rem; font-weight: 700; }
  .legend li { display: inline-flex; align-items: center; gap: .5rem; }
  .dot { width: 18px; height: 18px; border-radius: 50%; border: 3px solid var(--ink); }
  .dot.done { background: var(--green); }
  .dot.current { background: var(--yellow); }
  .dot.locked { background: #efe6d4; }

  .path-wrap { position: relative; max-width: 560px; margin: 0 auto; }
  .path-svg { width: 100%; height: auto; overflow: visible; }

  .start-pop {
    position: absolute;
    transform: translate(-50%, -50%);
    background: var(--ink);
    color: var(--bg);
    font-family: "Fredoka", system-ui, sans-serif;
    font-weight: 600;
    font-size: clamp(.95rem, 2.4vw, 1.1rem);
    padding: .5rem 1.05rem;
    border-radius: 30px;
    box-shadow: 0 6px 0 rgba(0,0,0,.35);
    white-space: nowrap;
    animation: bob 1.5s var(--ease-soft) infinite;
  }
  .start-pop:hover { background: #000; }
  .start-pop__tail {
    position: absolute; left: 50%; bottom: -8px; width: 16px; height: 16px;
    background: var(--ink); transform: translateX(-50%) rotate(45deg); border-radius: 3px;
  }
  @keyframes bob { 0%, 100% { transform: translate(-50%, -50%); } 50% { transform: translate(-50%, calc(-50% - 8px)); } }
  @media (prefers-reduced-motion: reduce) { .start-pop { animation: none; } }
</style>
