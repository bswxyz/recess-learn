<script>
  import { base } from '$app/paths';

  const snipSpring = `import { spring } from 'svelte/motion';

// two springs give Pip his life: the pupils and a whole-body lean
const pupil = spring({ x: 0, y: 0 }, { stiffness: 0.12, damping: 0.5 });
const lean  = spring({ x: 0, y: 0, r: 0 }, { stiffness: 0.08, damping: 0.55 });

function onMove(e) {
  const r  = host.getBoundingClientRect();
  const dx = (e.clientX - (r.left + r.width  / 2)) / (innerWidth  / 2);
  const dy = (e.clientY - (r.top  + r.height * 0.46)) / (innerHeight / 2);
  pupil.set({ x: clamp(dx) * 8, y: clamp(dy) * 6 });  // eyes chase the cursor
  lean.set({  x: clamp(dx) * 6, y: clamp(dy) * 3, r: clamp(dx) * 3 });
}`;

  const snipReduced = `// every spring in the site respects "reduce motion" by jumping instantly
export function springTo(store, value) {
  return store.set(value, prefersReduced() ? { hard: true } : {});
}

// Pip's happy-bounce, called by the mini-lesson on a correct answer
const hop = spring(0, { stiffness: 0.11, damping: 0.28 });
export async function celebrate() {
  if (prefersReduced()) return;   // stay calm
  await hop.set(1);               // spring up — overshoots, wobbles
  hop.set(0);                     // …then settles back down
}`;

  const snipConfig = `import adapter from '@sveltejs/adapter-static';
const dev = process.argv.includes('dev');

export default {
  kit: {
    // write the prerendered site straight into /docs for GitHub Pages
    adapter: adapter({ pages: 'docs', assets: 'docs', fallback: undefined, strict: true }),
    // every asset + link is prefixed with the repo name in production
    paths: { base: dev ? '' : '/recess-learn' }
  }
};`;

  const snipDeploy = `npm run build             # → docs/index.html + docs/guide/index.html
git add -A && git commit -m "Recess — kids' learning app"
gh repo create bswxyz/recess-learn --public --source . --push
# GitHub → Settings → Pages → Branch: main · Folder: /docs
# live at https://bswxyz.github.io/recess-learn/`;
</script>

<svelte:head>
  <title>How Recess was built — the guide</title>
  <meta name="description" content="Build notes for Recess: Svelte spring physics for the Pip mascot, the winding SVG lesson path, a playable count-the-apples mini-lesson, and shipping SvelteKit adapter-static to GitHub Pages." />
  <meta name="theme-color" content="#fff8ec" />
</svelte:head>

<div class="wrap">
  <div class="top">
    <a href="{base}/">← recess</a>
    <span>the guide · how it was built</span>
  </div>

  <span class="ey">Design showcase · build notes</span>
  <h1>How <em>Recess</em> bounces.</h1>
  <p class="sub">Recess is the one site in the Parable showcase built on something else entirely —
    <strong>SvelteKit</strong> — because its whole personality is <em>motion</em>, and Svelte's
    built-in spring physics is the cleanest way to make a page feel alive and bouncy.</p>

  <span class="chip chip--red">Fredoka + Nunito</span>
  <span class="chip chip--blue">SvelteKit</span>
  <span class="chip chip--green">adapter-static</span>
  <span class="chip chip--yellow">spring() &amp; tweened()</span>

  <h2>The idea</h2>
  <p>A learning app for four-to-eight-year-olds has to earn one feeling before it earns a single word of
    copy: <em>delight</em>. Kids trust things that are round, soft, and responsive — things that squash when
    you press them and bounce when you win. So the brief was never "explain the curriculum." It was "make
    the page itself feel like a toy," and then let the honest, evidence-flavoured pitch live quietly in the
    parents' corner. Two audiences, two voices, one bouncy world.</p>

  <h2>The stack — why SvelteKit</h2>
  <ul>
    <li><strong>Svelte's motion primitives are the point.</strong> <code>spring()</code> and
      <code>tweened()</code> ship in the framework. No animation library, no keyframe math — you set a
      target value and Svelte does the physics. For a site whose identity <em>is</em> springiness, that's
      the perfect tool, and it proves the showcase isn't one framework wearing different paint.</li>
    <li><strong>Fredoka / Nunito, no mono.</strong> A chunky rounded display face and a rounded body face —
      warm, legible, friendly. There's deliberately no monospace: nothing here is technical or grown-up.
      Nunito even sets the big lesson numbers.</li>
    <li><strong>SvelteKit + <code>adapter-static</code></strong> prerenders every route to plain HTML, so the
      whole thing deploys to GitHub Pages as static files — no server, no runtime.</li>
  </ul>

  <h2>Signature technique #1 — a spring-driven mascot</h2>
  <p>Pip is authored entirely in SVG — a circle body, two big eyes, little limbs. What makes him feel alive
    is that his pupils and whole body are driven by springs that chase the cursor. You never set a
    position directly; you set a <em>target</em>, and the spring eases there with a natural overshoot:</p>
  <pre><code>{snipSpring}</code></pre>
  <p>He blinks on a random timer, glances around when the pointer goes still, and — the payoff — does a
    happy-bounce when you answer the mini-lesson correctly. Every one of those springs checks the user's
    motion preference first:</p>
  <pre><code>{snipReduced}</code></pre>

  <h2>Signature technique #2 — the winding lesson path</h2>
  <p>Straight from the Duolingo-ABC playbook: a dotted SVG trail snakes down the page with lesson nodes on
    it — <strong>done</strong> (a green ✓), <strong>current</strong> (a pulsing yellow star with Pip's
    "Start here" bubble), and <strong>locked</strong> (a padlock). Each node is its own component driven by
    a <code>tweened</code> store with a <code>backOut</code> easing — the same bouncy overshoot a spring
    gives, but time-based, so a throttled background tab can never make it diverge. A scroll trigger flips
    the nodes on with a staggered delay so they <em>pop</em> into place one after another. The decorative
    SVG is mirrored by a visually-hidden ordered list, so a screen reader hears the journey as real
    content.</p>

  <h2>Signature technique #3 — a playable mini-lesson</h2>
  <p>"Count the apples" is a real, working lesson embedded in the marketing page. Tap the right number and
    you get a canvas confetti burst, Pip's happy-bounce, and a warm word; tap a wrong one and the button
    gives a gentle wobble and a "count again, you've got this" — never a buzzer, never a loss. The choices
    are real <code>&lt;button&gt;</code> elements: fully keyboard-operable, and every result is announced
    through an <code>aria-live</code> region for screen-reader users.</p>

  <h2>Details that matter</h2>
  <ul>
    <li><strong>Reduced motion is wired all the way down.</strong> The CSS media query calms transitions and
      the floating shapes, <em>and</em> the JavaScript springs jump instantly — so a child prone to motion
      sickness gets a still, fully-usable page, not a broken one.</li>
    <li><strong>Contrast holds up.</strong> Text sits as dark ink on cream, white, and yellow; the saturated
      red / blue / green are used behind large, bold type or as shapes, never as small body text.</li>
    <li><strong>Big tap targets, real focus rings.</strong> Every control clears 44px with room to spare, and
      <code>:focus-visible</code> paints a chunky blue outline you can actually see across a room.</li>
    <li><strong>The parent gate is the joke made real.</strong> "Press and hold" is exactly the friction a
      toddler won't sit through — a charming take on the App Store kids-category gate — and it's operable by
      mouse, touch, <em>and</em> keyboard (hold Enter).</li>
  </ul>

  <h2>Ship it on GitHub Pages</h2>
  <p>The trick with a framework site on project Pages is two settings: send the build into <code>/docs</code>,
    and prefix every path with the repo name. <code>adapter-static</code> does the first; <code>paths.base</code>
    does the second (and dev keeps it empty so localhost still works):</p>
  <pre><code>{snipConfig}</code></pre>
  <p>After that it's build, commit the <code>docs/</code> folder, and point Pages at it:</p>
  <pre><code>{snipDeploy}</code></pre>
  <p>A <code>static/.nojekyll</code> file rides along into <code>docs/</code> so Pages serves SvelteKit's
    <code>_app/</code> folder untouched. That's the whole deploy.</p>

  <hr class="rule" />
  <p class="fine">Recess is a design-showcase concept — there's no real curriculum, accounts, or app behind
    it. See the repository README for the full demo-vs-real map.</p>
  <a class="back" href="{base}/">← Back to Recess</a>
</div>

<style>
  :global(:root) { --max: 780px; }
  .wrap { max-width: var(--max); margin: 0 auto; padding: clamp(28px, 6vw, 76px) clamp(18px, 5vw, 32px); }
  .top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem;
    font-family: "Fredoka", system-ui, sans-serif; font-weight: 500; font-size: .82rem; letter-spacing: .04em;
    text-transform: uppercase; color: var(--dim); }
  .top a { color: var(--dim); }
  .top a:hover { color: var(--red); }
  h1 { font-size: clamp(2.4rem, 7vw, 3.8rem); margin-bottom: .6rem; }
  h1 em { color: var(--red); font-style: normal; }
  .sub { color: var(--dim); font-size: 1.15rem; margin-bottom: 1.6rem; max-width: 60ch; }
  .ey { font-family: "Fredoka", system-ui, sans-serif; font-weight: 600; font-size: .72rem; letter-spacing: .18em;
    text-transform: uppercase; color: var(--blue); display: block; margin-bottom: 2rem; }
  .chip { display: inline-block; font-family: "Fredoka", system-ui, sans-serif; font-weight: 600; font-size: .82rem;
    border: 3px solid var(--ink); border-radius: 30px; padding: .25rem .8rem; margin: 0 .4rem .4rem 0;
    box-shadow: 0 3px 0 var(--ink); }
  .chip--red { background: var(--red); } .chip--blue { background: var(--blue); color: #fff; }
  .chip--green { background: var(--green); } .chip--yellow { background: var(--yellow); }
  h2 { font-size: clamp(1.5rem, 4vw, 2.1rem); margin: 2.8rem 0 .9rem; }
  p { color: #4a4540; margin: 1rem 0; line-height: 1.66; }
  strong { color: var(--ink); font-weight: 800; }
  em { color: var(--ink); font-style: italic; }
  ul { margin: 1rem 0 1rem 1.1rem; color: #4a4540; }
  li { margin: .6rem 0; line-height: 1.6; }
  code { font-family: "Nunito", monospace; font-weight: 800; font-size: .92em; color: var(--red);
    background: rgba(255,90,77,.1); padding: .06em .38em; border-radius: 7px; }
  pre { background: #fff; border: 3px solid var(--ink); border-radius: 18px; padding: 18px 20px; overflow-x: auto;
    margin: 1.3rem 0; box-shadow: 0 8px 0 rgba(35,32,32,.1); }
  pre code { color: #2e2a26; background: none; padding: 0; font-weight: 600; font-size: .82rem; line-height: 1.7;
    font-family: ui-monospace, "SF Mono", Menlo, monospace; }
  .rule { height: 3px; background: var(--line); border: 0; border-radius: 3px; margin: 3rem 0; }
  .fine { color: var(--dim); font-size: .9rem; }
  .back { display: inline-block; margin-top: 1.4rem; font-family: "Fredoka", system-ui, sans-serif; font-weight: 600;
    color: var(--blue); }
  .back:hover { text-decoration: underline; }
</style>
