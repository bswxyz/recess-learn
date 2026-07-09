<script>
  import Pip from './Pip.svelte';
  import Confetti from './Confetti.svelte';
  import { prefersReduced } from './motion.js';

  const rounds = [
    { count: 3, choices: [2, 3, 5], fruit: 'apple' },
    { count: 5, choices: [4, 5, 6], fruit: 'apple' },
    { count: 2, choices: [2, 3, 4], fruit: 'apple' },
    { count: 4, choices: [6, 4, 3], fruit: 'apple' }
  ];

  let round = 0;
  let solved = false;
  let finished = false;
  let stars = 0;
  let feedback = '';
  let feedbackKind = ''; // 'good' | 'try'
  let wrongKey = null;
  let pip;
  let confetti;
  let mood = 'happy';

  $: r = rounds[round];

  function choose(n, ev) {
    if (solved || finished) return;
    if (n === r.count) {
      solved = true;
      stars += 1;
      mood = 'excited';
      feedbackKind = 'good';
      feedback = `That's right — ${r.count} apples! ${['Woohoo!', 'Nice counting!', 'You got it!', 'Superstar!'][round % 4]}`;
      confetti?.burst(0.5, 0.34);
      pip?.celebrate();
      setTimeout(() => {
        if (round < rounds.length - 1) {
          round += 1; solved = false; mood = 'happy'; feedback = ''; feedbackKind = '';
        } else {
          finished = true; feedbackKind = 'good';
          feedback = `You counted them all! ${stars} stars earned.`;
        }
      }, 1250);
    } else {
      feedbackKind = 'try';
      feedback = "Not quite — count again, you've got this!";
      wrongKey = ev?.currentTarget;
      if (!prefersReduced() && wrongKey) {
        wrongKey.classList.remove('wobble');
        void wrongKey.offsetWidth;
        wrongKey.classList.add('wobble');
      }
    }
  }

  function replay() {
    round = 0; solved = false; finished = false; stars = 0; feedback = ''; feedbackKind = ''; mood = 'happy';
  }
</script>

<section id="play" class="lesson">
  <div class="wrap">
    <header class="lesson-head">
      <p class="eyebrow reveal">Have a go</p>
      <h2 class="reveal">Count the apples!</h2>
      <p class="lede reveal">This is a real Recess mini-lesson, right here in the page. Tap how many
        apples you see. Pip will let you know how you did.</p>
    </header>

    <div class="card reveal">
      <Confetti bind:this={confetti} />

      <div class="progress" aria-hidden="true">
        {#each rounds as _, i}
          <span class="pip-dot" class:filled={i < stars} class:now={i === round && !finished}></span>
        {/each}
      </div>

      <div class="stage">
        <div class="pip-slot">
          <Pip bind:this={pip} {mood} size={150} />
        </div>

        {#if !finished}
          <div class="tray" role="group" aria-label={`${r.count} apples to count`}>
            {#key round}
              {#each Array(r.count) as _, i}
                <span class="apple" style="--i:{i}" aria-hidden="true">
                  <svg viewBox="0 0 60 64">
                    <path d="M30 12 C24 4, 12 6, 12 18 C6 16, 2 24, 6 36 C9 47, 18 58, 30 58 C42 58, 51 47, 54 36 C58 24, 54 16, 48 18 C48 6, 36 4, 30 12 Z" fill="var(--red)" stroke="var(--ink)" stroke-width="3.5" />
                    <path d="M30 12 C31 6, 34 2, 40 2" fill="none" stroke="var(--ink)" stroke-width="3.5" stroke-linecap="round" />
                    <ellipse cx="40" cy="8" rx="8" ry="5" fill="var(--green)" stroke="var(--ink)" stroke-width="3" transform="rotate(24 40 8)" />
                    <ellipse cx="22" cy="28" rx="6" ry="9" fill="#fff" opacity=".35" />
                  </svg>
                </span>
              {/each}
            {/key}
          </div>
        {:else}
          <div class="win" role="status">
            <p class="win-star" aria-hidden="true">⭐️⭐️⭐️⭐️</p>
            <p class="win-line">You did it!</p>
          </div>
        {/if}
      </div>

      {#if !finished}
        <p class="ask">How many apples?</p>
        <div class="choices" role="group" aria-label="Choose the number of apples">
          {#each r.choices as n (round + '-' + n)}
            <button
              type="button"
              class="choice"
              class:locked={solved}
              disabled={solved}
              on:click={(e) => choose(n, e)}
            >{n}</button>
          {/each}
        </div>
      {:else}
        <button type="button" class="btn btn--green replay" on:click={replay}>Play again ↺</button>
      {/if}

      <p class="feedback" class:good={feedbackKind === 'good'} class:try={feedbackKind === 'try'} role="status" aria-live="assertive">{feedback}</p>
    </div>
  </div>
</section>

<style>
  .lesson { padding: clamp(30px, 6vw, 70px) 0 clamp(70px, 10vw, 120px); }
  .lesson-head { text-align: center; max-width: 620px; margin: 0 auto clamp(24px, 4vw, 44px); }
  .lesson-head h2 { font-size: clamp(2rem, 5.4vw, 3.4rem); margin: .7rem 0 .8rem; }
  .lede { color: var(--dim); font-size: clamp(1.02rem, 2vw, 1.2rem); max-width: 44ch; margin-inline: auto; }

  .card {
    position: relative;
    max-width: 640px;
    margin: 0 auto;
    background: var(--card);
    border: 4px solid var(--ink);
    border-radius: var(--r-lg);
    box-shadow: 0 14px 0 rgba(35,32,32,.14);
    padding: clamp(20px, 4vw, 34px);
    overflow: hidden;
  }

  .progress { display: flex; gap: .5rem; justify-content: center; margin-bottom: .4rem; }
  .pip-dot { width: 14px; height: 14px; border-radius: 50%; border: 3px solid var(--ink); background: var(--card); transition: background .3s var(--ease); }
  .pip-dot.filled { background: var(--green); }
  .pip-dot.now { background: var(--yellow); }

  .stage { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: clamp(8px, 3vw, 24px); min-height: 190px; }
  .pip-slot { align-self: end; }

  .tray {
    display: flex; flex-wrap: wrap; gap: 10px 12px; align-content: center; justify-content: center;
    background: #fff5df; border: 3px dashed var(--line-strong); border-radius: 24px;
    padding: 18px; min-height: 150px;
  }
  .apple { width: clamp(46px, 12vw, 62px); }
  .apple svg { width: 100%; height: auto; overflow: visible; }
  .apple { animation: pop-in .5s var(--ease) backwards; animation-delay: calc(var(--i) * 70ms); }
  @keyframes pop-in { from { transform: scale(0) translateY(10px); } to { transform: scale(1) translateY(0); } }

  .win { grid-column: 1 / -1; text-align: center; }
  .win-star { font-size: clamp(1.8rem, 6vw, 2.6rem); margin-bottom: .3rem; }
  .win-line { font-family: "Fredoka", system-ui, sans-serif; font-weight: 600; font-size: clamp(1.8rem, 6vw, 2.6rem); color: var(--green); }

  .ask { text-align: center; font-family: "Fredoka", system-ui, sans-serif; font-size: clamp(1.2rem, 3.4vw, 1.7rem); margin: 1.1rem 0 .9rem; }

  .choices { display: flex; gap: clamp(10px, 3vw, 18px); justify-content: center; }
  .choice {
    width: clamp(76px, 22vw, 104px); height: clamp(76px, 22vw, 104px);
    font-family: "Nunito", system-ui, sans-serif; font-weight: 800;
    font-size: clamp(2rem, 7vw, 3rem); color: var(--ink);
    background: var(--yellow); border: 4px solid var(--ink); border-radius: 26px;
    box-shadow: 0 7px 0 var(--ink);
    transition: transform .13s var(--ease), box-shadow .13s var(--ease), background .2s;
  }
  .choice:nth-child(2) { background: var(--blue); color: #fff; }
  .choice:nth-child(3) { background: var(--green); }
  .choice:hover:not(:disabled) { transform: translateY(-3px) scale(1.03); box-shadow: 0 10px 0 var(--ink); }
  .choice:active:not(:disabled) { transform: translateY(5px) scale(.94); box-shadow: 0 2px 0 var(--ink); }
  .choice:disabled { opacity: .5; cursor: default; }
  .choice.wobble { animation: wobble .5s ease; }
  @keyframes wobble {
    0%, 100% { transform: translateX(0) rotate(0); }
    20% { transform: translateX(-8px) rotate(-5deg); }
    40% { transform: translateX(8px) rotate(5deg); }
    60% { transform: translateX(-5px) rotate(-3deg); }
    80% { transform: translateX(5px) rotate(3deg); }
  }

  .replay { margin: .4rem auto 0; display: flex; }

  .feedback { text-align: center; min-height: 1.7em; margin-top: 1rem; font-weight: 800; font-size: 1.1rem; }
  .feedback.good { color: var(--green); }
  .feedback.try { color: var(--blue); }

  @media (max-width: 460px) {
    .stage { grid-template-columns: 1fr; text-align: center; }
    .pip-slot { justify-self: center; align-self: center; }
  }
  @media (prefers-reduced-motion: reduce) {
    .apple, .choice.wobble { animation: none; }
    .choice:hover, .choice:active { transform: none; }
  }
</style>
