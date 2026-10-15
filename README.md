# Lucas Grecco · Portfolio

One-page portfolio built with [Astro](https://astro.build): PT at `/`, EN at `/en/`, dark and light themes, a 3D logo in the hero (React island with three.js), and projects pulled from GitHub at build time.

Live: https://lucasgrecco.dev

## Develop

```bash
npm install
npm run dev        # http://localhost:4321/
npm run verify     # astro check, unit tests, build, tests on the built HTML
```

Node 22.18 or newer (the scripts run `.ts` files directly).

## Adding a project

Projects come from GitHub when the site is built (`scripts/sync-projects.ts`):

1. Add the topic **`portfolio`** to the repository. Add **`featured`** to the one that should appear large (if several have it, the most recently pushed wins).
2. Fill the repository **About**: the description (English) and the **website** (shown as the demo link).
3. In the README, add a screenshot with the alt text `cover`: `![cover](docs/screenshot.png)`. Without it, the first image is used; without images, the project is shown as text. CI badges are ignored.
4. Optional Portuguese description, anywhere in the README:

   ```md
   <!-- portfolio:pt -->
   Descrição do projeto em português.
   <!-- /portfolio:pt -->
   ```

5. Once a repo has the topic, remove it from `extraRepos` in `src/data/projects.config.ts` (that list is for the transition and for repos you don't own, like `An4lu/DeereGO`).

The result is saved in `src/data/projects.snapshot.json` and the covers in `src/assets/projects/`. If GitHub is unavailable or rate-limited, the build keeps the last snapshot. To refresh it locally with a token:

```bash
GITHUB_TOKEN=... npm run sync
```

## Deploy

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every push to `main`, once a day (so new projects appear without a commit) and on demand. In the repository settings, set **Pages → Source** to **GitHub Actions**.

## Structure

- `src/i18n/` — all copy, PT and EN
- `src/components/` — sections, header, footer, the 3D logo island
- `src/lib/github/` — README parsing and project building (unit-tested)
- `src/lib/theme.ts` — theme tokens (contrast-tested)
- `tests/` unit tests, `tests-dist/` checks on the built pages
