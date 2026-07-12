# Architecture — Infinitspaces Website

A **static, multi-page website** (no framework, no build step) for Infinitspaces,
an interior design & build company. Plain HTML + CSS + vanilla JS, deployed to
GitHub Pages on the custom domain **infinitspaces.com** (see `CNAME`).

## High-level

- **No bundler / no package.json.** Files are served exactly as they sit in the repo.
- **Deployment:** `.github/workflows/static.yml` publishes the repo to GitHub Pages.
- **Fonts:** Google Fonts (Bebas Neue, Montserrat) loaded via `<link>` in each page's `<head>`.
- **Shared UI is duplicated per page** except three reusable blocks on the home page,
  which are `fetch()`-injected at runtime (see "Section injection" below).

## Pages

| Page | Purpose |
|------|---------|
| `index.html` | Home — hero banner slideshow, About, Services, Specialization, Footer |
| `our-services.html` | Overview of the three service lines |
| `interior-design.html` | Interior design service + gallery + collage |
| `product-catalog.html` | Product supply catalog (largest page) |
| `turnkey-execution.html` | Turnkey execution service |
| `projects.html` | Project showcase |
| `contact.html` | Contact form / details |

## Directory layout

```
vishnu/
├── *.html                 # one file per page (see table above)
├── css/                   # one stylesheet per component/page (see mapping below)
├── js/                    # one script per component/page
├── sections/              # HTML partials fetch()-injected into index.html
│   ├── footer.html
│   ├── services.html
│   └── specialization.html
├── resources/             # images (WebP-optimized) + archived/ (originals)
├── CNAME                  # custom domain: infinitspaces.com
└── .github/workflows/     # static.yml — GitHub Pages deploy
```

## CSS architecture

CSS is split by **component/page**, not by a global system. Every page links
`css/styles.css` (the foundation) plus whichever component stylesheets it needs.

`css/styles.css` is the shared foundation and defines:
- **Design tokens** in `:root` — color (`--brand-*`, `--text-*`, `--surface-*`),
  spacing scale (`--space-1` … `--space-5`, all `clamp()`-based/fluid),
  radius, shadows, timing/easing, and header heights.
- The **header, mobile menu, hero banner, and generic section/card** rules.

Per-page CSS linkage (each also loads `styles.css` + `footer.css`):

| Page | Additional stylesheets |
|------|------------------------|
| index | services, specialization |
| our-services | our-services-page, three-column-page, product-catalog-sections, slider-block |
| interior-design | our-services-page, two-column-page, product-catalog-sections, slider-block, interior-design-gallery, interior-collage |
| product-catalog | two-column-page, our-services-page, three-column-page, product-catalog-sections, slider-block, custom-furniture-collage |
| turnkey-execution | our-services-page, three-column-page, product-catalog-sections, slider-block |
| projects | our-services-page, projects |
| contact | contact |

Note: `our-services-page.css` acts as a de-facto shared layout stylesheet — it is
loaded by six of the seven pages (it also contains the mobile sidebar-nav rules).

## JavaScript

All scripts are plain, `defer`-loaded vanilla JS with no dependencies.

| Script | Responsibility |
|--------|----------------|
| `main.js` | Home page: header compress-on-scroll, mobile menu toggle, banner slideshow (dot nav + autoplay + pause-on-hover), section slide rotators, reveal-on-scroll (IntersectionObserver), hide nav below hero |
| `our-services.js` | Interactions for the service pages |
| `product-catalog-sections.js` | Product catalog section behavior |
| `slider-scripts.js` | Sliders shared across service pages |
| `interior-design-gallery.js` | Interior design gallery |
| `interior-collage.js` | Interior collage layout |
| `custom-furniture-collage.js` | Custom furniture collage |
| `projects.js` | Projects page |
| `contact.js` | Contact page/form |

## Section injection (home page only)

`index.html` pulls three partials in at runtime with `fetch()`:

```js
fetch('sections/services.html').then(r => r.text())
  .then(html => document.getElementById('services-container').innerHTML = html);
```

Same pattern for `sections/specialization.html` and `sections/footer.html`.
This is the only place partials are shared — every other page has its markup inline.
(Implication: these sections only appear when the site is served over HTTP, not via
`file://`, and they load after first paint.)

## Responsive strategy (current state)

Mobile is handled with per-file `@media (max-width: …)` blocks. Breakpoint values
are **not standardized** across stylesheets (700 / 768 / 800 / 820 / 900 / 920 / 960 /
980 / 992 / 1024 / 1200 / 1280 / 1400 / 1600 all appear). The intended "phone"
breakpoint is inconsistent — some components collapse at 700px, others at 768px —
which is the main source of the mobile alignment problems. Standardizing these is the
subject of the current alignment-fixes work.

## Conventions & gotchas

- Header height is defined as tokens (`--header-h-desktop: 60px`, `--header-h-mobile: 64px`)
  but is also hardcoded (56px) inside the 700px media query — keep these in sync.
- The spacing scale (`--space-1..5`) is the intended way to express vertical rhythm;
  prefer it over raw px margins.
- Some rules rely on `!important` and duplicated declarations to win specificity
  battles — these are known workarounds being cleaned up, not the intended pattern.
