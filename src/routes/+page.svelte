<script>
  import { base } from '$app/paths';
  import { revealAll } from '$lib/motion.js';
  import Pip from '$lib/Pip.svelte';
  import LessonPath from '$lib/LessonPath.svelte';
  import MiniLesson from '$lib/MiniLesson.svelte';
  import ParentsCorner from '$lib/ParentsCorner.svelte';

  const subjects = [
    { key: 'count', color: 'var(--red)', title: 'Counting', kid: '"One, two, THREE apples!"', parent: 'Number sense & one-to-one correspondence, 1–20.' },
    { key: 'letters', color: 'var(--blue)', title: 'Letters', kid: '"A says ah! B says buh!"', parent: 'Phonemic awareness & letter–sound mapping.' },
    { key: 'patterns', color: 'var(--yellow)', title: 'Patterns', kid: '"Red, blue, red, blue… red!"', parent: 'Sequencing & early logical reasoning.' },
    { key: 'shapes', color: 'var(--green)', title: 'Shapes', kid: '"A circle is round and round!"', parent: 'Spatial vocabulary & shape recognition.' }
  ];
</script>

<svelte:head>
  <title>Recess — big ideas, tiny humans</title>
  <meta name="description" content="Recess is a playful 10-minute-a-day learning app for ages 4–8: counting, letters and patterns, built like play. Meet Pip, walk the lesson path, and try a real mini-lesson right in the page." />
  <meta property="og:title" content="Recess — big ideas, tiny humans" />
  <meta property="og:description" content="Playful 10-minute daily lessons for ages 4–8. Loved by kids, trusted by parents." />
  <meta property="og:type" content="website" />
</svelte:head>

<a class="skip" href="#play">Skip to the mini-lesson</a>

<header class="nav">
  <a class="brand" href="{base}/" aria-label="Recess home">
    <svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="21" r="15" fill="var(--red)" stroke="var(--ink)" stroke-width="3" />
      <circle cx="15" cy="19" r="4.5" fill="#fff" /><circle cx="25" cy="19" r="4.5" fill="#fff" />
      <circle cx="15.5" cy="19.5" r="2.2" fill="var(--ink)" /><circle cx="25.5" cy="19.5" r="2.2" fill="var(--ink)" />
      <path d="M15 26 q5 4 10 0" fill="none" stroke="var(--ink)" stroke-width="2.6" stroke-linecap="round" />
    </svg>
    <span class="brand-word">recess</span>
  </a>
  <nav class="nav-links" aria-label="Primary">
    <a href="#lessons">Lessons</a>
    <a href="#play">Play</a>
    <a href="#subjects">Learn</a>
    <a href="#parents">Parents</a>
    <a href="{base}/guide/">Guide</a>
    <a class="nav-cta" href="#get">Get the app</a>
  </nav>
</header>

<main use:revealAll>
  <!-- ── HERO ── -->
  <section class="hero">
    <div class="hero-decor" aria-hidden="true">
      <span class="shape s-star"></span>
      <span class="shape s-blue"></span>
      <span class="shape s-green"></span>
      <span class="shape s-tri"></span>
    </div>
    <div class="wrap hero-inner">
      <div class="hero-copy">
        <p class="eyebrow reveal">Ages 4–8 · 10 minutes a day</p>
        <h1 class="hero-title">
          <span class="line reveal-clip"><span>Big ideas,</span></span>
          <span class="line reveal-clip"><span style="transition-delay:.12s">tiny humans.</span></span>
        </h1>
        <p class="hero-sub reveal">Recess turns counting, letters and patterns into ten joyful minutes
          of play. Kids think they're just having fun. (They are. They're also learning.)</p>
        <div class="hero-actions reveal">
          <a class="btn btn--blue" href="#play"><span aria-hidden="true">▶</span> Play a lesson</a>
          <a class="btn btn--ghost" href="#lessons">See the journey</a>
        </div>
        <p class="hero-foot reveal">Loved by kids · trusted by parents · zero ads</p>
      </div>

      <div class="hero-pip">
        <div class="hero-pip-plate" aria-hidden="true"></div>
        <Pip mood="happy" size={300} label="Pip, the round red Recess mascot, waving hello" />
        <span class="speech reveal" aria-hidden="true">Let's play numbers!</span>
      </div>
    </div>
    <svg class="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 60 C 240 110, 480 10, 720 50 C 960 90, 1200 20, 1440 60 L1440 120 L0 120 Z" fill="var(--card)" />
    </svg>
  </section>

  <!-- ── LESSON PATH ── -->
  <div class="on-white">
    <LessonPath />
  </div>

  <!-- ── PLAYABLE MINI-LESSON ── -->
  <MiniLesson />

  <!-- ── WHAT KIDS LEARN ── -->
  <section id="subjects" class="subjects">
    <div class="wrap">
      <header class="subjects-head">
        <p class="eyebrow reveal">What kids learn</p>
        <h2 class="reveal">Four little worlds to explore.</h2>
        <p class="lede reveal">Each subject is a playground of tiny lessons — bite-sized, bouncy, and
          built on real early-childhood milestones.</p>
      </header>
      <div class="subject-grid">
        {#each subjects as s, i}
          <article class="subject reveal" style="--c:{s.color}; transition-delay:{i * 80}ms">
            <span class="subject-icon" aria-hidden="true">
              {#if s.key === 'count'}
                <svg viewBox="0 0 64 64"><text x="32" y="46" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="600" font-size="40" fill="var(--ink)">3</text></svg>
              {:else if s.key === 'letters'}
                <svg viewBox="0 0 64 64"><text x="32" y="45" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="600" font-size="34" fill="var(--ink)">Aa</text></svg>
              {:else if s.key === 'patterns'}
                <svg viewBox="0 0 64 64"><circle cx="16" cy="32" r="9" fill="var(--ink)"/><rect x="27" y="23" width="18" height="18" rx="4" fill="var(--ink)"/><circle cx="54" cy="32" r="6" fill="var(--ink)" opacity=".4"/></svg>
              {:else}
                <svg viewBox="0 0 64 64"><path d="M32 10 L52 46 L12 46 Z" fill="none" stroke="var(--ink)" stroke-width="5" stroke-linejoin="round"/></svg>
              {/if}
            </span>
            <h3>{s.title}</h3>
            <p class="subject-kid">{s.kid}</p>
            <p class="subject-parent">{s.parent}</p>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <!-- ── PARENTS ── -->
  <div class="on-white">
    <ParentsCorner />
  </div>

  <!-- ── CTA ── -->
  <section id="get" class="cta">
    <div class="wrap cta-inner">
      <p class="eyebrow reveal">Bring recess home</p>
      <h2 class="reveal">Ten good minutes.<br />Every single day.</h2>
      <p class="lede reveal">One small daily habit, disguised as the best part of the day. Free to try,
        no ads, cancel anytime a grown-up feels like it.</p>
      <div class="stores reveal">
        <a class="store" href="#get" aria-label="Download on the App Store (demo)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.5 3c.1 1-.3 2-1 2.8-.6.8-1.7 1.4-2.7 1.3-.1-1 .4-2 1-2.7C14.4 3.6 15.5 3 16.5 3zm3 15.3c-.5 1.1-.8 1.6-1.4 2.6-.9 1.3-2.1 3-3.6 3-1.4 0-1.7-.9-3.5-.9s-2.2.9-3.5.9c-1.5 0-2.7-1.5-3.5-2.8C2 20 1.6 15.9 3.3 13.5c.8-1.2 2.2-1.9 3.5-1.9 1.4 0 2.2.9 3.4.9 1.1 0 1.8-.9 3.4-.9 1.2 0 2.5.7 3.4 1.8-3 1.6-2.5 5.9.5 6.9z"/></svg>
          <span><small>Download on the</small>App Store</span>
        </a>
        <a class="store" href="#get" aria-label="Get it on Google Play (demo)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3.6 2.4c-.3.3-.5.7-.5 1.2v16.8c0 .5.2.9.5 1.2l9-9.6-9-9.6zm11 8.5 2.6-1.5c.9-.5.9-1.9 0-2.4L14.2 5 11.5 8l3.1 2.9zM4.8 2l8.1 4.7L15.4 4 5.9 1.7c-.4-.1-.8 0-1.1.3zm0 20 8.1-4.7 2.5 2.7-9.5 2.3c-.4.1-.8 0-1.1-.3z"/></svg>
          <span><small>Get it on</small>Google Play</span>
        </a>
      </div>
      <p class="cta-demo">This is a design-showcase concept — the buttons don't open a store. See the
        <a href="{base}/guide/">build notes</a> for what's real and what's mocked.</p>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="wrap foot-inner">
    <div class="foot-top">
      <a class="brand brand--foot" href="{base}/">
        <svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="21" r="15" fill="var(--red)" stroke="var(--ink)" stroke-width="3" />
          <circle cx="15" cy="19" r="4.5" fill="#fff" /><circle cx="25" cy="19" r="4.5" fill="#fff" />
          <circle cx="15.5" cy="19.5" r="2.2" fill="var(--ink)" /><circle cx="25.5" cy="19.5" r="2.2" fill="var(--ink)" />
          <path d="M15 26 q5 4 10 0" fill="none" stroke="var(--ink)" stroke-width="2.6" stroke-linecap="round" />
        </svg>
        <span class="brand-word">recess</span>
      </a>
      <nav class="foot-links" aria-label="Footer">
        <a href="#lessons">Lessons</a><a href="#play">Play</a><a href="#subjects">Learn</a>
        <a href="#parents">Parents</a><a href="{base}/guide/">Guide</a>
      </nav>
    </div>
    <div class="foot-bottom">
      <span>© 2026 Recess — a design-showcase concept, not a shipping app.</span>
      <span>Designed &amp; built by Fable · <a href="{base}/guide/">How this was built →</a></span>
    </div>
  </div>
</footer>

<style>
  .skip { position: absolute; left: 12px; top: -60px; z-index: 50; background: var(--ink); color: var(--bg); padding: .7rem 1.1rem; border-radius: 14px; font-weight: 700; transition: top .2s ease; }
  .skip:focus { top: 12px; }

  /* ── nav ── */
  .nav { position: sticky; top: 0; z-index: 30; display: flex; align-items: center; justify-content: space-between;
    padding: .8rem clamp(18px, 5vw, 40px); background: rgba(255,248,236,.82); backdrop-filter: blur(10px);
    border-bottom: 3px solid var(--line); }
  .brand { display: inline-flex; align-items: center; gap: .5rem; }
  .brand-mark { width: 38px; height: 38px; }
  .brand-word { font-family: "Fredoka", system-ui, sans-serif; font-weight: 600; font-size: 1.5rem; letter-spacing: -.02em; }
  .nav-links { display: flex; align-items: center; gap: clamp(.5rem, 1.6vw, 1.4rem); }
  .nav-links a { font-family: "Fredoka", system-ui, sans-serif; font-weight: 500; color: var(--ink); padding: .4rem .2rem; border-radius: 10px; }
  .nav-links a:hover { color: var(--blue); }
  .nav-cta { background: var(--yellow); border: 3px solid var(--ink); border-radius: 30px; padding: .45rem 1.1rem !important;
    box-shadow: 0 4px 0 var(--ink); }
  .nav-cta:hover { color: var(--ink) !important; transform: translateY(-1px); }
  @media (max-width: 720px) { .nav-links a:not(.nav-cta) { display: none; } }

  /* ── hero ── */
  .hero { position: relative; padding: clamp(40px, 8vw, 90px) 0 clamp(80px, 10vw, 120px); overflow: hidden; }
  .hero-inner { display: grid; grid-template-columns: 1.05fr .95fr; gap: clamp(20px, 4vw, 50px); align-items: center; }
  .hero-copy { position: relative; z-index: 2; }
  .hero-title { font-size: clamp(2.9rem, 9vw, 6rem); margin: 1rem 0 1.2rem; }
  .hero-title .line { display: block; }
  .hero-title .line:nth-child(1) :global(span) { color: var(--ink); }
  .hero-title .line:nth-child(2) :global(span) { color: var(--red); }
  .hero-sub { font-size: clamp(1.1rem, 2.3vw, 1.4rem); color: var(--dim); max-width: 42ch; }
  .hero-actions { display: flex; flex-wrap: wrap; gap: 1rem; margin: 1.8rem 0 1rem; }
  .hero-foot { font-weight: 700; color: var(--dim); font-size: .95rem; }

  .hero-pip { position: relative; display: grid; place-items: center; z-index: 1; }
  .hero-pip-plate { position: absolute; width: min(360px, 78%); aspect-ratio: 1; border-radius: 50%;
    background: radial-gradient(circle, var(--yellow) 0%, #ffe487 60%, rgba(255,210,61,0) 72%); opacity: .6; }
  .speech { position: absolute; top: 4%; right: 2%; background: var(--card); border: 3px solid var(--ink);
    border-radius: 20px 20px 20px 4px; padding: .5rem .9rem; font-family: "Fredoka", system-ui, sans-serif;
    font-weight: 500; box-shadow: var(--shadow); }

  .hero-decor .shape { position: absolute; border: 3px solid var(--ink); z-index: 0; animation: float 6s ease-in-out infinite; }
  .s-star { left: 2%; top: 14%; width: 40px; height: 40px; background: var(--yellow); border-radius: 10px; transform: rotate(12deg); }
  .s-blue { right: 8%; bottom: 26%; width: 54px; height: 54px; background: var(--blue); border-radius: 50%; animation-delay: -1.5s; }
  .s-green { left: 2.5%; bottom: 5%; width: 30px; height: 30px; background: var(--green); border-radius: 50%; animation-delay: -3s; }
  .s-tri { right: 16%; top: 16%; width: 0; height: 0; border: none; border-left: 22px solid transparent; border-right: 22px solid transparent; border-bottom: 36px solid var(--red); animation-delay: -2.2s; filter: drop-shadow(0 0 0 var(--ink)); }
  @keyframes float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-16px) rotate(6deg); } }

  .hero-wave { position: absolute; left: 0; bottom: -1px; width: 100%; height: clamp(50px, 8vw, 110px); }

  .on-white { background: var(--card); }

  /* ── subjects ── */
  .subjects { padding: clamp(70px, 10vw, 120px) 0; }
  .subjects-head { text-align: center; max-width: 620px; margin: 0 auto clamp(30px, 5vw, 56px); }
  .subjects-head h2 { font-size: clamp(2rem, 5.4vw, 3.4rem); margin: .7rem 0 .8rem; }
  .lede { color: var(--dim); font-size: clamp(1.02rem, 2vw, 1.2rem); max-width: 46ch; margin-inline: auto; }
  .subject-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(14px, 2.5vw, 22px); }
  .subject { background: var(--card); border: 4px solid var(--ink); border-radius: var(--r);
    box-shadow: 0 10px 0 rgba(35,32,32,.12); padding: clamp(18px, 2.4vw, 26px);
    transition: transform .18s var(--ease), box-shadow .18s var(--ease); }
  .subject:hover { transform: translateY(-6px) rotate(-1deg); box-shadow: 0 16px 0 rgba(35,32,32,.12); }
  .subject-icon { display: grid; place-items: center; width: 68px; height: 68px; border-radius: 20px;
    background: var(--c); border: 3px solid var(--ink); margin-bottom: 1rem; }
  .subject-icon svg { width: 42px; height: 42px; }
  .subject h3 { font-size: 1.5rem; margin-bottom: .35rem; }
  .subject-kid { font-family: "Fredoka", system-ui, sans-serif; font-weight: 500; color: var(--ink); margin-bottom: .5rem; }
  .subject-parent { font-size: .9rem; color: var(--dim); line-height: 1.45; }
  @media (max-width: 900px) { .subject-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 460px) { .subject-grid { grid-template-columns: 1fr; } }

  /* ── cta ── */
  .cta { padding: clamp(80px, 11vw, 140px) 0; text-align: center; }
  .cta-inner { max-width: 720px; }
  .cta h2 { font-size: clamp(2.2rem, 6.5vw, 4rem); margin: .7rem 0 1rem; }
  .cta .lede { margin-bottom: 2rem; }
  .stores { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .store { display: inline-flex; align-items: center; gap: .7rem; background: var(--ink); color: var(--bg);
    border: 3px solid var(--ink); border-radius: 18px; padding: .7rem 1.3rem; box-shadow: 0 6px 0 #000;
    transition: transform .12s var(--ease), box-shadow .12s var(--ease); }
  .store:hover { transform: translateY(-2px); box-shadow: 0 8px 0 #000; }
  .store:active { transform: translateY(4px); box-shadow: 0 2px 0 #000; }
  .store svg { width: 26px; height: 26px; }
  .store span { display: flex; flex-direction: column; align-items: flex-start; font-family: "Fredoka", system-ui, sans-serif; font-weight: 600; font-size: 1.15rem; line-height: 1.05; text-align: left; }
  .store small { font-weight: 500; font-size: .68rem; opacity: .8; letter-spacing: .02em; }
  .cta-demo { margin-top: 1.6rem; font-size: .86rem; color: var(--dim); }
  .cta-demo a { color: var(--blue); font-weight: 700; text-decoration: underline; }

  /* ── footer ── */
  .footer { background: var(--ink); color: var(--bg); padding: clamp(40px, 6vw, 64px) 0; }
  .foot-top { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.2rem;
    padding-bottom: 1.4rem; border-bottom: 2px solid rgba(255,248,236,.16); }
  .brand--foot .brand-word { color: var(--bg); }
  .foot-links { display: flex; gap: 1.2rem; flex-wrap: wrap; }
  .foot-links a { color: var(--bg); font-family: "Fredoka", system-ui, sans-serif; font-weight: 500; opacity: .85; }
  .foot-links a:hover { opacity: 1; color: var(--yellow); }
  .foot-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .6rem;
    margin-top: 1.3rem; font-size: .88rem; color: rgba(255,248,236,.7); }
  .foot-bottom a { color: var(--yellow); font-weight: 700; }

  @media (max-width: 780px) {
    .hero-inner { grid-template-columns: 1fr; text-align: center; }
    .hero-copy { order: 2; }
    .hero-pip { order: 1; }
    .hero-actions, .eyebrow { justify-content: center; }
    .eyebrow { display: inline-flex; }
    .s-blue, .s-green { display: none; }
    .s-star { top: 6%; }
  }

  @media (prefers-reduced-motion: reduce) {
    html.js .hero-title .line > span { transform: none !important; transition: none !important; }
    .hero-decor .shape { animation: none; }
    .subject:hover { transform: none; }
    .store:hover, .store:active { transform: none; }
  }
</style>
