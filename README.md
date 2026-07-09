# Recess

**Live:** https://bswxyz.github.io/recess-learn/ · **Build notes:** https://bswxyz.github.io/recess-learn/guide/

A kids' educational learning app landing site — spring-physics mascot, a winding lesson path, and a
playable mini-lesson — part of the [Fable 25 design showcase](https://bswxyz.github.io/fable-hub/).

---

## The concept

Recess is a learning app for ages 4–8: ten joyful minutes a day of counting, letters and patterns,
built like play. The site has to convince two audiences at once — a kid should want to *touch* it
(so everything is round, saturated and bouncy, and there's a real "count the apples" lesson embedded
in the page), while a parent should feel the quiet competence underneath (honest pedagogy framing,
no ads, and a parents' corner hidden behind a press-and-hold gate a toddler won't sit through).
Positioned like Duolingo ABC / Khan Academy Kids, voiced like neither.

## Design system

- **Palette (primaries on cream):** `--bg:#fff8ec` warm cream · `--red:#ff5a4d` (Pip, headlines) ·
  `--blue:#3d7bff` · `--yellow:#ffd23d` · `--green:#3ec97e` · `--ink:#232020` near-black ·
  `--line:rgba(35,32,32,.12)`. Saturated primaries used as chunky fills behind large bold type,
  never as small body text; ink-on-cream carries all reading.
- **Type:** `Fredoka` (chunky rounded display) · `Nunito` (rounded body, 800-weight numerals).
  Deliberately **no monospace** — nothing on this site is technical or grown-up; Nunito even sets
  the lesson numbers.
- **Shape language:** 20px+ border radii everywhere, 3–4px ink outlines, hard offset shadows
  (`box-shadow: 0 6px 0 var(--ink)`) that compress when a button is pressed — squash-and-stretch as CSS.
- **Signature motion:** Svelte `spring()` / `tweened()` everywhere — a bouncy overshoot easing
  `cubic-bezier(.34,1.56,.64,1)` for the CSS side, real spring physics for the mascot. Distinctly
  bouncier than every other site in the set.

## Stack

- **SvelteKit + `@sveltejs/adapter-static`** — the showcase's "something else entirely" site,
  proving the set isn't one framework underneath. Svelte was chosen because its built-in motion
  primitives (`spring`, `tweened`) *are* the design: the mascot's cursor-chasing eyes, the node
  pops, the counters — all framework physics, no animation library.
- Prerendered to plain HTML (`docs/`), so it deploys to GitHub Pages with no server.
- Google Fonts (Fredoka, Nunito). No other runtime dependencies.

## Running it locally

```bash
git clone https://github.com/bswxyz/recess-learn
cd recess-learn
npm install
npm run dev        # dev server (no base path)
npm run build      # prerenders the site into docs/ with base /recess-learn
```

## Structure

```
src/app.html                  shell (fonts, favicon, .js class for progressive enhancement)
src/app.css                   design tokens (:root), buttons, reveals, reduced-motion rules
src/routes/+page.svelte       the page: hero · lesson path · mini-lesson · subjects · parents · CTA
src/routes/guide/+page.svelte "how it was built" write-up, styled to the site
src/lib/Pip.svelte            the SVG mascot — spring-driven eye-tracking, blinks, happy-bounce
src/lib/LessonPath.svelte     winding SVG trail with done/current/locked nodes
src/lib/PathNode.svelte       one node — tweened back-out pop-in
src/lib/MiniLesson.svelte     playable "count the apples" (4 rounds, confetti, aria-live feedback)
src/lib/ParentsCorner.svelte  hold-to-enter parent gate + stat counters
src/lib/Confetti.svelte       canvas confetti burst
src/lib/motion.js             reduced-motion helpers + scroll-reveal triggers
svelte.config.js              adapter-static → docs/, paths.base = /recess-learn
docs/                         the built site GitHub Pages serves
```

## Demo vs. real — what a production version would need

This is an intentionally-scoped design demo. What's **mocked/illustrative** today:

- **There is no curriculum.** One four-round counting exercise is real and playable; the lesson
  path, subjects and "26 lessons" are illustrative. A real product needs a sequenced curriculum
  designed with early-childhood educators, with mastery checks and adaptive difficulty.
- **No accounts, no progress persistence.** Progress resets on reload. Real: profiles per child,
  progress sync, and the parent dashboard the stats section pretends to be.
- **No app.** The store buttons are decorative anchors — there is no iOS/Android app behind them.
- **COPPA / kids-privacy compliance is claimed, not implemented.** "No data selling" is a design
  stance here; a shipping kids' product needs verified parental consent flows, a children's privacy
  policy, App Store Kids Category review, and an audited no-third-party-tracker build.
- **The parent gate is the charm version.** Press-and-hold is a real pattern, but stores typically
  require a stronger gate (multiplication problem, birth-year entry) for outbound links/purchases.
- **Audio.** Real 4-year-olds can't read instructions; a production app needs voice-over on every
  lesson, which this site doesn't attempt.

What's **real** and reusable as-is: the whole visual system, the spring-mascot rig (eye-tracking,
blink, celebrate API), the mini-lesson interaction model with accessible feedback, the lesson-path
component, the hold-to-enter gate (pointer + keyboard), and the full responsive/reduced-motion layer.

## License

[MIT](LICENSE). Design & build by **Fable** (Anthropic's Claude). All illustration is hand-authored
SVG — no photos, no generated images.
