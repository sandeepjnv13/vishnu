# CLAUDE.md

Guidance for Claude Code when working in this repository. See `architecture.md`
for the full structural breakdown.

## What this is

Static marketing website for **Infinitspaces** (interior design & build).
Plain **HTML + CSS + vanilla JS**. No framework, no bundler, no `package.json`,
no build step. Files are served as-is. Deployed to **GitHub Pages** on the custom
domain **infinitspaces.com** via `.github/workflows/static.yml`.

## Running locally

There is nothing to build. Serve the folder over HTTP (not `file://`, because
`index.html` uses `fetch()` to inject `sections/*.html`):

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

## Layout at a glance

- `*.html` — one file per page (index, our-services, interior-design,
  product-catalog, turnkey-execution, projects, contact).
- `css/` — one stylesheet per component/page. `css/styles.css` is the shared
  foundation (design tokens + header + banner + generic sections). `our-services-page.css`
  is loaded by most pages.
- `js/` — one plain script per component/page. `main.js` drives the home page.
- `sections/` — HTML partials `fetch()`-injected into `index.html` only.
- `resources/` — WebP-optimized images; `resources/archived/` holds originals.

## Preserved / dangling files — DO NOT DELETE

These are intentionally kept but **not linked from any navigation**. They exist
so the old "OUR WORKS" gallery can be re-connected later. Do not remove or
"clean them up" without explicit confirmation from the user:

- `our-work-gallery.html` — the old OUR WORKS gallery section that used to live
  inside `interior-design.html` (removed on the `alignment-fixes` branch). Kept
  as a standalone, self-contained page.
- `css/interior-design-gallery.css` — styles for that gallery; used **only** by
  `our-work-gallery.html`.
- `js/interior-design-gallery.js` — script for that gallery; used **only** by
  `our-work-gallery.html`.

Note: the live "OUR WORK" nav links now point to `projects.html` (the dedicated
work page), not to the old in-page `#our-work-section` anchor.

## Conventions

- **Use the design tokens** in `css/styles.css` `:root` — especially the spacing
  scale `--space-1 … --space-5` (fluid `clamp()` values) for vertical rhythm.
  Prefer these over raw px margins/paddings.
- **Avoid `!important` and duplicate declarations.** They exist today as specificity
  workarounds and are actively being removed. Fix the specificity instead of stacking
  overrides.
- **Keep styles in CSS, not inline `style=` attributes.** Several pages still carry
  inline styles (notably the mobile nav in `index.html`); prefer moving new styling
  into the appropriate stylesheet.
- Each page must link `styles.css` + `footer.css` plus its component stylesheets;
  match the existing per-page CSS list when editing (see `architecture.md`).
- Vanilla JS only. No dependencies, no framework APIs. Scripts are `defer`-loaded.

## Responsive / mobile

- Desktop layout is broadly fine; **mobile is the weak spot.** The root cause is
  **inconsistent breakpoints** across stylesheets (700 vs 768 vs others), so
  components collapse to mobile at different widths.
- When adding responsive rules, use a **consistent breakpoint set** (target phone
  breakpoint is being standardized — check what neighboring components use and match
  it rather than inventing a new value).
- Keep header-height values in sync: tokens `--header-h-desktop` / `--header-h-mobile`
  vs the hardcoded 56px in the 700px media query.

## Working style for this repo

- **Preserve the existing look.** Changes should streamline/repair alignment, not
  restyle. No drastic visual changes unless asked.
- Test changes at real mobile widths (e.g. 360–430px) and around the breakpoint
  boundaries (700–768px) where things currently break.
- Commit/push only when asked. Work happens on feature branches (current work:
  `alignment-fixes`), not directly on `main`.
