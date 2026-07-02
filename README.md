# Off-Grid Mobile Irrigation — Portfolio Site

Single-page interactive case study of my final-year MEng dissertation:
a low-cost, trailer-mounted dribble-bar irrigation prototype for
smallholder farmers in Sub-Saharan Africa, designed around the Aftrak
AFT-e1 electric micro-tractor.

Built with **Vite + React + TypeScript**, **Tailwind CSS**,
**Framer Motion**, **Recharts** and two hand-rolled 2D canvas
simulations (hydraulic flow + birds-eye field coverage). No backend —
static build.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build & deploy

```bash
npm run build    # outputs static site to dist/
npm run preview  # serve the production build locally
```

Deploy `dist/` anywhere static:

- **Vercel / Netlify** — import the repo, framework preset "Vite",
  build command `npm run build`, output directory `dist`. Done.
- **GitHub Pages** — `vite.config.ts` already sets `base: "./"` so
  assets resolve on project pages. Push `dist/` to a `gh-pages` branch
  (e.g. `npx gh-pages -d dist`) or use a Pages GitHub Action.

## Adding the real images

Drop assets into `public/assets/` using the paths listed in
`src/data.ts` (`assets` object) — e.g. `public/assets/poster.png` —
then replace the corresponding `<ImagePlaceholder …/>` with a plain
`<img>` (the placeholder component documents exactly what belongs
where). Layout is stable either way.

## Where the numbers live

**Every** real data value on the site (flows, splits, coverages, event
times, stress-buffering days, costs) is defined once in
[`src/data.ts`](src/data.ts), with a comment citing the dissertation
section/table it comes from. See [`DATA_SOURCES.md`](DATA_SOURCES.md)
for the full audit list to sanity-check against the report.

## Project structure

```
src/
├── data.ts                    # ← single source of truth for all real data
├── App.tsx                    # section order + nav registry
├── components/
│   ├── Nav.tsx                # sticky nav, scroll progress, active section
│   ├── Section.tsx / Reveal.tsx / ImagePlaceholder.tsx
│   └── sections/              # one component per page section (10 total)
└── demos/
    ├── flowEngine.ts          # canvas particle sim of the hydraulic circuit
    └── fieldEngine.ts         # canvas birds-eye coverage sim
```

Both canvas demos pause automatically when scrolled off-screen or when
the tab is hidden, and all Framer Motion animation respects
`prefers-reduced-motion`.
