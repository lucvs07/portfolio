# Astro Editorial Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Vite/React app with an Astro one-page editorial portfolio (PT at `/`, EN at `/en/`), a 3D logo hero island, projects pulled from GitHub at build time, dark/light themes, deployed to GitHub Pages.

**Architecture:** Astro renders every section as static HTML from typed content dictionaries and a committed projects snapshot. A build-time Node script (`scripts/sync-projects.ts`) talks to the GitHub API through pure, unit-tested functions, writes the snapshot and downloads cover images into `src/assets/projects/` for `astro:assets`. The only React is one island (`LogoHero`) that server-renders the flat SVG logo and, in the browser, lazy-loads a three.js scene that crossfades in.

**Tech Stack:** Astro 7.3.8, @astrojs/react 7.0.1, React 19.3.1, three 0.186.1, @react-three/fiber 9.8.1, @react-three/drei 10.7.9, TypeScript 6.0.3 (required by @astrojs/check 0.9.10), Node 24 (`node --test` runs `.ts` directly), sharp (bundled with Astro).

**Spec:** `docs/superpowers/specs/2026-10-14-astro-editorial-portfolio-design.md` (product truth in `PRODUCT.md`).

## Global Constraints

- Branch `feat/astro` (already created from `main`; spec and PRODUCT.md committed). Every commit ends with `-m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"`.
- Verified in a probe: Astro 7 `i18n` with `prefixDefaultLocale: false`, `getRelativeLocaleUrl` from `astro:i18n`, `Image` from `astro:assets` with `import.meta.glob(..., { eager: true })`, `client:idle` React islands, `base: "/portfolio"`. `import.meta.env.BASE_URL` is `/portfolio` **without** a trailing slash; always build public URLs with `withBase()` (Task 1).
- TypeScript 6.0.3, not 7 (peer range of @astrojs/check).
- Files imported by `node --test` (everything under `src/lib/`, `src/i18n/`, `src/data/projects.config.ts`, `scripts/`) import siblings with an explicit `.ts` extension and import nothing from Astro, React or the DOM.
- Removing files: use `git rm <file list>` (a hook blocks `rm -r` and `git rm -r`). Example: `git rm -q $(git ls-files src)`.
- Chillax only (Fontshare), weights 400/500/600/700. Orange `#FFA737` only as accent; on the light theme, orange text/links use `#A34E08`.
- No icon libraries, no GSAP, no Stitches, no CSS-in-JS, no blur/backdrop-filter, no cards with shadows. Thin rules, numbered sections, generous space.
- Without JavaScript the full page is readable; reveals never hide content unless JS has run and motion is allowed.
- Do not invent content. Copy comes from the spec; the owner reviews PT and EN before merge.
- Hooks: writing `.github/workflows/*` needs the owner's approval at that step (Task 9). Never work around a blocked command.

## Review Focus

1. A README whose first image is a CI/shields badge would become the project cover: `pickCover` skips badge URLs; tested in Task 4.
2. A README image given as a relative path, a `/`-rooted path or a `github.com/.../blob/...` URL must resolve to a raw URL; `data:` URIs are ignored: tested in Task 4.
3. GitHub API down or rate-limited (no token locally) must not break the build when a snapshot exists, and must fail loudly when none exists: tested in Task 5 with a throwing fake API.
4. Storage blocked or a garbage stored theme value must still give a theme and a working toggle: the boot script and toggle catch errors; checked in Task 10 by overriding `Storage.prototype`.
5. Reduced motion, Save-Data or no WebGL must leave the flat SVG logo visible and every section visible: Task 7 gates the island; Task 10 checks with JS disabled and with reduced motion emulated.
6. Base path: every internal URL (assets, favicon, locale switch, 404 home link) must include `/portfolio`: `tests-dist/pages.test.ts` asserts no `href="/` or `src="/` without the base (Task 1, extended in Tasks 6 and 8).

---

## File Structure

| File | Responsibility |
|---|---|
| `astro.config.mjs`, `tsconfig.json`, `package.json` | Astro + React integration, i18n, base path, scripts |
| `src/lib/url.ts` | `withBase(path)` |
| `src/lib/theme.ts` | Theme token table, `contrast()`, `themeCss()` (pure) |
| `src/i18n/types.ts`, `pt.ts`, `en.ts`, `index.ts` | Typed dictionaries, `getDict(lang)`, `fmt()` |
| `src/lib/github/types.ts` | `Project`, `RepoInfo`, `GitHubApi`, `ProjectsConfig` |
| `src/lib/github/readme.ts` | `readmeImages`, `pickCover`, `ptBlock`, `resolveAsset` (pure) |
| `src/lib/github/normalize.ts` | `normalizeTech`, `orderProjects` (pure) |
| `src/lib/github/build.ts` | `buildProjects(api, config)` (pure orchestration over an injected API) |
| `src/lib/github/http.ts` | Real `GitHubApi` over `fetch` (thin) |
| `src/data/projects.config.ts` | Owner, topics, extra repos, overrides |
| `src/data/projects.snapshot.json`, `src/assets/projects/*` | Last good build output (committed) |
| `scripts/sync-projects.ts` | Prebuild: build projects, write snapshot, download covers, fall back |
| `scripts/og-image.ts` | Generates `public/og.png` with sharp |
| `src/layouts/Base.astro` | `<html>`, head meta, fonts, theme boot, skip link |
| `src/components/*.astro` | Header, ThemeToggle, Hero, About, Projects, Stack, Path, Contact, Footer, Logo, Reveal |
| `src/components/LogoHero.tsx`, `LogoScene.tsx` | The island and its lazy three.js scene |
| `src/pages/index.astro`, `en/index.astro`, `404.astro` | Routes |
| `src/styles/global.css` | Reset, type scale, layout, reveal |
| `tests/*.test.ts` | Pure-logic tests (`npm test`) |
| `tests-dist/*.test.ts` | Assertions on the built HTML (`npm run test:dist`, after build) |
| `.github/workflows/deploy.yml` | Pages deploy on push, daily, manual |

---

### Task 1: Scaffold Astro and remove the old app

**Files:**
- Delete: everything under `src/`, `index.html`, `vite.config.js`, `yarn.lock`, `public/animations/*`, `public/models/*`, `public/patern.png`, `public/patern-2.png`
- Create: `package.json` (replace), `astro.config.mjs`, `tsconfig.json`, `src/lib/url.ts`, `src/layouts/Base.astro`, `src/pages/index.astro`, `src/pages/en/index.astro`, `src/env.d.ts`
- Test: `tests/url.test.ts`, `tests-dist/pages.test.ts`

**Interfaces:**
- Produces: `withBase(path: string): string`; `Base.astro` props `{ lang: "pt" | "en"; title: string; description: string; path?: string }` with a default `<slot />`; npm scripts `test`, `test:dist`, `check`, `verify`.

- [ ] **Step 1: Remove the old app and write the new manifest**

```bash
git rm -q $(git ls-files src) index.html vite.config.js yarn.lock $(git ls-files public/animations public/models) public/patern.png public/patern-2.png
```

Replace `package.json`:

```json
{
  "name": "portfolio",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "engines": { "node": ">=22.18" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "node --test \"tests/**/*.test.ts\"",
    "test:dist": "node --test \"tests-dist/**/*.test.ts\"",
    "verify": "npm run check && npm test && npm run build && npm run test:dist"
  },
  "dependencies": {
    "@astrojs/react": "7.0.1",
    "@react-three/drei": "10.7.9",
    "@react-three/fiber": "9.8.1",
    "astro": "7.3.8",
    "react": "19.3.1",
    "react-dom": "19.3.1",
    "three": "0.186.1"
  },
  "devDependencies": {
    "@astrojs/check": "0.9.10",
    "@types/node": "^24.19.2",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@types/three": "0.186.0",
    "typescript": "6.0.3"
  }
}
```

Move the old lockfile and modules aside (do not delete them; a hook blocks recursive deletes) and install:

```bash
mv node_modules "$SCRATCH/node_modules.old" && mv package-lock.json "$SCRATCH/package-lock.old.json" && npm install --no-audit --no-fund
```

(`$SCRATCH` is the session scratchpad directory.) Expected: install succeeds with no ERESOLVE.

- [ ] **Step 2: Write the failing tests**

`tests/url.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { joinBase } from "../src/lib/url.ts";

test("joinBase adds the base once, with exactly one slash", () => {
  assert.equal(joinBase("/portfolio", "logo.svg"), "/portfolio/logo.svg");
  assert.equal(joinBase("/portfolio", "/logo.svg"), "/portfolio/logo.svg");
  assert.equal(joinBase("/portfolio/", "/og.png"), "/portfolio/og.png");
  assert.equal(joinBase("/", "/og.png"), "/og.png");
  assert.equal(joinBase("", "og.png"), "/og.png");
});
```

`tests-dist/pages.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = (p: string) => readFileSync(new URL(`../dist/${p}`, import.meta.url), "utf8");

test("PT is served at the root and EN under /en/", () => {
  assert.match(page("index.html"), /<html[^>]*lang="pt-BR"/);
  assert.match(page("en/index.html"), /<html[^>]*lang="en"/);
});

test("both pages have exactly one h1 with the owner's name", () => {
  for (const p of ["index.html", "en/index.html"]) {
    const h1s = page(p).match(/<h1[\s>]/g) ?? [];
    assert.equal(h1s.length, 1, p);
    assert.match(page(p), /Lucas/);
  }
});

test("every root-relative URL carries the /portfolio base", () => {
  for (const p of ["index.html", "en/index.html"]) {
    const bad = [...page(p).matchAll(/(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1]).filter((u) => !u.startsWith("/portfolio"));
    assert.deepEqual(bad, [], p);
  }
});
```

Run: `npm test` → FAIL (`Cannot find module '../src/lib/url.ts'`).

- [ ] **Step 3: Config, helper, layout, pages**

`astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://lucvs07.github.io",
  base: "/portfolio",
  trailingSlash: "ignore",
  integrations: [react()],
  i18n: {
    defaultLocale: "pt",
    locales: ["pt", "en"],
    routing: { prefixDefaultLocale: false },
  },
});
```

`tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "allowImportingTsExtensions": true,
    "types": ["node"]
  }
}
```

`src/env.d.ts`:

```ts
/// <reference types="astro/client" />
```

`src/lib/url.ts`:

```ts
// Junta a base do site (ex.: "/portfolio") a um caminho público, com uma barra só.
export function joinBase(base: string, path: string): string {
  const b = base.replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");
  return `${b}/${p}`;
}

export const withBase = (path: string): string => joinBase(import.meta.env?.BASE_URL ?? "/", path);
```

`src/layouts/Base.astro`:

```astro
---
import { withBase } from "../lib/url";

interface Props {
  lang: "pt" | "en";
  title: string;
  description: string;
}
const { lang, title, description } = Astro.props;
---
<!doctype html>
<html lang={lang === "pt" ? "pt-BR" : "en"}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href={withBase("logo.svg")} />
    <link rel="preconnect" href="https://api.fontshare.com" />
    <link rel="preconnect" href="https://cdn.fontshare.com" crossorigin />
    <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=chillax@400,500,600,700&display=swap" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

`src/pages/index.astro`:

```astro
---
import Base from "../layouts/Base.astro";
---
<Base lang="pt" title="Lucas Grecco" description="Portfólio de Lucas Grecco">
  <main><h1>Lucas Grecco</h1></main>
</Base>
```

`src/pages/en/index.astro`:

```astro
---
import Base from "../../layouts/Base.astro";
---
<Base lang="en" title="Lucas Grecco" description="Lucas Grecco's portfolio">
  <main><h1>Lucas Grecco</h1></main>
</Base>
```

(Both pages are replaced by the shared `Page.astro` in Task 6.)

- [ ] **Step 4: Verify**

Run: `npm test && npm run check && npm run build && npm run test:dist`
Expected: url test PASS; `astro check` 0 errors; build writes `dist/index.html` and `dist/en/index.html`; dist tests PASS (3).

- [ ] **Step 5: Commit**

```bash
git add -A package.json package-lock.json astro.config.mjs tsconfig.json src tests tests-dist public index.html vite.config.js yarn.lock
git commit -m "chore: replace the Vite app with an Astro scaffold" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Theme tokens, boot script and toggle

**Files:**
- Create: `src/lib/theme.ts`, `src/styles/global.css`, `src/components/ThemeToggle.astro`
- Modify: `src/layouts/Base.astro`
- Test: `tests/theme.test.ts`

**Interfaces:**
- Produces: `THEMES: Record<"dark"|"light", Tokens>`, `type Tokens = { bg; surface; text; muted; rule; accent; accentText }` (hex strings), `contrast(a, b): number`, `themeCss(): string`; CSS variables `--bg --surface --text --muted --rule --accent --accent-text`; `ThemeToggle` props `{ toDark: string; toLight: string }`; localStorage key `"theme"`.

- [ ] **Step 1: Failing test**

`tests/theme.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { THEMES, contrast, themeCss } from "../src/lib/theme.ts";

for (const name of ["dark", "light"] as const) {
  const t = THEMES[name];
  test(`${name}: text, muted and accent text reach 4.5:1 on background and surface`, () => {
    for (const fg of [t.text, t.muted, t.accentText]) {
      for (const bg of [t.bg, t.surface]) assert.ok(contrast(fg, bg) >= 4.5, `${name} ${fg} on ${bg}: ${contrast(fg, bg).toFixed(2)}`);
    }
  });
  test(`${name}: the orange accent mark reaches 3:1 on the background`, () => {
    assert.ok(contrast(t.accent, t.bg) >= 3 || name === "light", `${name}`);
  });
}

test("themeCss emits both themes as custom properties", () => {
  const css = themeCss();
  assert.match(css, /\[data-theme="dark"\][^}]*--bg:\s*#161412/);
  assert.match(css, /\[data-theme="light"\][^}]*--accent-text:\s*#A34E08/);
});
```

Run `npm test` → FAIL (module missing).

- [ ] **Step 2: Tokens module**

`src/lib/theme.ts`:

```ts
export interface Tokens {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  rule: string;
  accent: string; // marcas e a logo
  accentText: string; // texto e links em laranja
}

export const THEMES: Record<"dark" | "light", Tokens> = {
  dark: { bg: "#161412", surface: "#1E1B18", text: "#F4EFEA", muted: "#B9B2AB", rule: "#2C2926", accent: "#FFA737", accentText: "#FFA737" },
  light: { bg: "#F6F1EB", surface: "#EFE7DE", text: "#1E1D1B", muted: "#5E5750", rule: "#E2D9CF", accent: "#FFA737", accentText: "#A34E08" },
};

const channel = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const vars = (t: Tokens) =>
  `--bg:${t.bg};--surface:${t.surface};--text:${t.text};--muted:${t.muted};--rule:${t.rule};--accent:${t.accent};--accent-text:${t.accentText};`;

export function themeCss(): string {
  return `:root,[data-theme="dark"]{${vars(THEMES.dark)}color-scheme:dark}[data-theme="light"]{${vars(THEMES.light)}color-scheme:light}`;
}
```

Run `npm test` → PASS. (The light accent `#FFA737` is decorative only; the test exempts it.)

- [ ] **Step 3: Global CSS**

`src/styles/global.css`:

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; scroll-padding-top: 5rem; overflow-x: clip; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
body {
  min-height: 100svh;
  background: var(--bg);
  color: var(--text);
  font-family: Chillax, system-ui, sans-serif;
  font-weight: 500;
  font-size: 1.1rem;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}
img, svg, canvas { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
h1, h2, h3 { font-weight: 700; line-height: 1; text-wrap: balance; }
p { text-wrap: pretty; }
::selection { background: var(--accent); color: #1e1d1b; }
:focus-visible { outline: 2px solid var(--accent-text); outline-offset: 4px; border-radius: 2px; }

.wrap { width: 100%; max-width: 80rem; margin-inline: auto; padding-inline: clamp(1.25rem, 5vw, 4rem); }
.section { padding-block: clamp(4rem, 10vw, 8rem); border-top: 1px solid var(--rule); }
.num { color: var(--accent-text); font-weight: 600; font-size: 0.95rem; letter-spacing: 0.02em; }
.title { font-size: clamp(2.5rem, 6vw, 4.5rem); margin-top: 0.75rem; max-width: 16ch; }
.muted { color: var(--muted); }
.link { color: var(--accent-text); font-weight: 600; text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.25em; }
.link:hover { text-decoration-thickness: 2px; }

.skip { position: absolute; left: 1rem; top: -4rem; z-index: 100; padding: 0.75rem 1rem; background: var(--accent); color: #1e1d1b; font-weight: 600; }
.skip:focus { top: 1rem; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

/* Revelação: só esconde quando o JS rodou e o movimento é permitido. */
@media (prefers-reduced-motion: no-preference) {
  .js [data-reveal] { opacity: 0; translate: 0 1rem; transition: opacity 0.7s ease, translate 0.7s ease; }
  .js [data-reveal].is-in { opacity: 1; translate: 0 0; }
}
```

- [ ] **Step 4: Boot script, toggle, layout wiring**

`src/components/ThemeToggle.astro`:

```astro
---
interface Props { toDark: string; toLight: string }
const { toDark, toLight } = Astro.props;
---
<button type="button" class="theme" data-theme-toggle data-to-dark={toDark} data-to-light={toLight} aria-label={toLight}>
  <span class="dot" aria-hidden="true"></span>
</button>

<script>
  const btn = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
  const root = document.documentElement;
  const sync = () => {
    if (!btn) return;
    const dark = root.dataset.theme !== "light";
    btn.setAttribute("aria-label", (dark ? btn.dataset.toLight : btn.dataset.toDark) ?? "");
  };
  sync();
  btn?.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* sem persistência */
    }
    sync();
  });
</script>

<style>
  .theme { display: inline-grid; place-items: center; width: 2.25rem; height: 2.25rem; border: 1px solid var(--rule); border-radius: 999px; background: transparent; cursor: pointer; }
  .dot { width: 0.9rem; height: 0.9rem; border-radius: 50%; background: linear-gradient(90deg, var(--text) 50%, transparent 50%); border: 1.5px solid var(--text); }
  .theme:hover { border-color: var(--muted); }
</style>
```

In `src/layouts/Base.astro`: import `"../styles/global.css"` and `{ themeCss }` from `"../lib/theme"` in the frontmatter, and add as the first children of `<head>` (before `<title>`):

```astro
    <script is:inline>
      (() => {
        const root = document.documentElement;
        root.classList.add("js");
        let t = null;
        try { t = localStorage.getItem("theme"); } catch (e) {}
        if (t !== "dark" && t !== "light") t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
        root.dataset.theme = t;
      })();
    </script>
    <style is:inline set:html={themeCss()}></style>
```

and add `<meta name="theme-color" content="#161412" media="(prefers-color-scheme: dark)" />` plus `<meta name="theme-color" content="#F6F1EB" media="(prefers-color-scheme: light)" />`.

- [ ] **Step 5: Verify and commit**

Run: `npm run verify` → all green.

```bash
git add -A src tests
git commit -m "feat: dark and light theme tokens with a no-flash toggle" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: PT/EN content dictionaries

**Files:**
- Create: `src/i18n/types.ts`, `src/i18n/pt.ts`, `src/i18n/en.ts`, `src/i18n/index.ts`
- Test: `tests/i18n.test.ts`

**Interfaces:**
- Produces: `type Lang = "pt" | "en"`; `interface Dict` (below); `getDict(lang: Lang): Dict`; `fmt(template: string, vars: Record<string, string>): string`.

- [ ] **Step 1: Failing test**

`tests/i18n.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { pt } from "../src/i18n/pt.ts";
import { en } from "../src/i18n/en.ts";
import { fmt } from "../src/i18n/index.ts";

// Mesma forma: mesmas chaves e mesmo tamanho de listas, em qualquer profundidade.
function shape(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(shape);
  if (v && typeof v === "object") return Object.fromEntries(Object.keys(v).sort().map((k) => [k, shape((v as Record<string, unknown>)[k])]));
  return typeof v;
}

test("PT and EN have the same structure", () => {
  assert.deepEqual(shape(pt), shape(en));
});

test("no string is empty", () => {
  const walk = (v: unknown, path: string): void => {
    if (typeof v === "string") assert.ok(v.trim(), path);
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
  };
  walk(pt, "pt");
  walk(en, "en");
});

test("links in contact are https and identical across languages", () => {
  assert.deepEqual(pt.contact.links.map((l) => l.href), en.contact.links.map((l) => l.href));
  for (const l of pt.contact.links) assert.match(l.href, /^https:\/\//);
});

test("fmt fills placeholders and leaves unknown ones", () => {
  assert.equal(fmt("{name} code, {x}", { name: "CARI" }), "CARI code, {x}");
});
```

Run `npm test` → FAIL.

- [ ] **Step 2: Types and helpers**

`src/i18n/types.ts`:

```ts
export type Lang = "pt" | "en";

export interface PathItem {
  org: string;
  role: string;
  period: string;
  note?: string;
  group?: string; // entradas com o mesmo group aparecem juntas
}

export interface Dict {
  meta: { title: string; description: string };
  nav: {
    skip: string; label: string; about: string; projects: string; stack: string; path: string; contact: string;
    switchLang: string; switchLangLabel: string; toDark: string; toLight: string; home: string;
  };
  hero: { role: string; rest: string; scroll: string };
  about: { title: string; body: string; languages: string };
  projects: { title: string; code: string; demo: string; codeLabel: string; demoLabel: string; techs: string; empty: string };
  stack: { title: string; groups: { title: string; items: string[] }[] };
  path: { title: string; items: PathItem[] };
  contact: { title: string; opens: string; links: { name: string; href: string }[] };
  footer: { rights: string };
  notFound: { title: string; text: string; home: string };
}
```

`src/i18n/index.ts`:

```ts
import { en } from "./en.ts";
import { pt } from "./pt.ts";
import type { Dict, Lang } from "./types.ts";

export const getDict = (lang: Lang): Dict => (lang === "pt" ? pt : en);

export const fmt = (template: string, vars: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (m, k: string) => (Object.hasOwn(vars, k) ? vars[k] : m));
```

- [ ] **Step 3: Dictionaries**

`src/i18n/pt.ts`:

```ts
import type { Dict } from "./types.ts";

const LINKS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/lucasrgrecco/" },
  { name: "GitHub", href: "https://github.com/lucvs07" },
  { name: "HackerRank", href: "https://www.hackerrank.com/profile/lucas_rgrecco" },
  { name: "Behance", href: "https://www.behance.net/lucasgrecco1" },
];

export const pt: Dict = {
  meta: {
    title: "Lucas Grecco · Desenvolvedor full stack",
    description: "Portfólio de Lucas Grecco, desenvolvedor full stack no Asaas e estudante de Engenharia da Computação na FIAP.",
  },
  nav: {
    skip: "Ir para o conteúdo", label: "Seções", about: "Sobre", projects: "Projetos", stack: "Stack", path: "Trajetória", contact: "Contato",
    switchLang: "EN", switchLangLabel: "Read in English", toDark: "Mudar para o tema escuro", toLight: "Mudar para o tema claro", home: "Lucas Grecco, início",
  },
  hero: {
    role: "Desenvolvedor full stack no Asaas",
    rest: "e estudante de Engenharia da Computação na FIAP. Construo produtos web de ponta a ponta, do back-end à interface.",
    scroll: "Role",
  },
  about: {
    title: "Tecnologia com cuidado de produto.",
    body: "Trabalho com Java, TypeScript e Python, do back-end à interface. Antes do código, passo pelo design e pelas metodologias ágeis, porque me importo com o produto inteiro. Gosto de usar tecnologia de forma criativa para resolver problemas que mudam o dia a dia das pessoas.",
    languages: "Inglês profissional · Espanhol básico",
  },
  projects: {
    title: "Trabalhos selecionados",
    code: "Código", demo: "Demo",
    codeLabel: "Código de {name} no GitHub (abre em nova aba)", demoLabel: "Demo de {name} (abre em nova aba)",
    techs: "Tecnologias",
    empty: "Os projetos estão sendo atualizados. Veja todos no GitHub.",
  },
  stack: {
    title: "Ferramentas que uso",
    groups: [
      { title: "Programação", items: ["Java", "JSF", "TypeScript", "JavaScript", "React", "Node.js", "Python", "PHP", "C++"] },
      { title: "Dados", items: ["SQL", "MongoDB", "Pandas", "Excel"] },
      { title: "Design e produto", items: ["UX", "Figma", "Tailwind", "CSS", "Métodos ágeis"] },
    ],
  },
  path: {
    title: "Formação, experiência e prêmios",
    items: [
      { org: "Asaas", role: "Desenvolvedor Full Stack Júnior · time Skywalkers (Notas Fiscais de Produto)", period: "dez 2025 – atual", group: "asaas" },
      { org: "Asaas", role: "Estágio em Engenharia de Software Full Stack · mesmo time", period: "mai – dez 2025", group: "asaas" },
      { org: "FIAP", role: "Engenharia da Computação (bacharelado)", period: "2024 – 2029" },
      { org: "NEXT · SmartFinder Challenge, FIAP", role: "Finalista e pódio", period: "2024", note: "Sistema de localização desenvolvido com a John Deere." },
      { org: "ISI Dublin", role: "Intercâmbio de inglês por mérito acadêmico na Etec", period: "fev – mar 2023" },
      { org: "Instituto Ismart", role: "Bolsista Ismart Online", period: "2021 – 2023", note: "Programação, matemática e um app de saúde mental feito em equipe." },
      { org: "Etec Parque Belém", role: "Informática para internet (ensino médio técnico)", period: "2021 – 2023" },
    ],
  },
  contact: { title: "Vamos conversar.", opens: "abre em nova aba", links: LINKS },
  footer: { rights: "Todos os direitos reservados." },
  notFound: { title: "Página não encontrada", text: "Esse endereço não existe por aqui.", home: "Voltar para o início" },
};
```

`src/i18n/en.ts` (same structure; drafted translation):

```ts
import type { Dict } from "./types.ts";

const LINKS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/lucasrgrecco/" },
  { name: "GitHub", href: "https://github.com/lucvs07" },
  { name: "HackerRank", href: "https://www.hackerrank.com/profile/lucas_rgrecco" },
  { name: "Behance", href: "https://www.behance.net/lucasgrecco1" },
];

export const en: Dict = {
  meta: {
    title: "Lucas Grecco · Full stack developer",
    description: "Portfolio of Lucas Grecco, full stack developer at Asaas and Computer Engineering student at FIAP.",
  },
  nav: {
    skip: "Skip to content", label: "Sections", about: "About", projects: "Projects", stack: "Stack", path: "Path", contact: "Contact",
    switchLang: "PT", switchLangLabel: "Ler em português", toDark: "Switch to dark theme", toLight: "Switch to light theme", home: "Lucas Grecco, home",
  },
  hero: {
    role: "Full stack developer at Asaas",
    rest: "and Computer Engineering student at FIAP. I build web products end to end, from back-end to interface.",
    scroll: "Scroll",
  },
  about: {
    title: "Technology with a product mindset.",
    body: "I work with Java, TypeScript and Python, from back-end to interface. Before the code, I go through design and agile methods, because I care about the whole product. I like using technology creatively to solve problems that change people's everyday lives.",
    languages: "English, professional working · Spanish, elementary",
  },
  projects: {
    title: "Selected work",
    code: "Code", demo: "Demo",
    codeLabel: "{name} source code on GitHub (opens in a new tab)", demoLabel: "{name} live demo (opens in a new tab)",
    techs: "Technologies",
    empty: "Projects are being updated. See everything on GitHub.",
  },
  stack: {
    title: "Tools I use",
    groups: [
      { title: "Programming", items: ["Java", "JSF", "TypeScript", "JavaScript", "React", "Node.js", "Python", "PHP", "C++"] },
      { title: "Data", items: ["SQL", "MongoDB", "Pandas", "Excel"] },
      { title: "Design and product", items: ["UX", "Figma", "Tailwind", "CSS", "Agile methods"] },
    ],
  },
  path: {
    title: "Education, experience and awards",
    items: [
      { org: "Asaas", role: "Full Stack Developer (Junior) · Skywalkers team (product invoices)", period: "Dec 2025 – present", group: "asaas" },
      { org: "Asaas", role: "Full Stack Software Engineering intern · same team", period: "May – Dec 2025", group: "asaas" },
      { org: "FIAP", role: "Computer Engineering (bachelor's degree)", period: "2024 – 2029" },
      { org: "NEXT · SmartFinder Challenge, FIAP", role: "Finalist and podium", period: "2024", note: "Location system built with John Deere." },
      { org: "ISI Dublin", role: "English exchange awarded for academic merit at Etec", period: "Feb – Mar 2023" },
      { org: "Instituto Ismart", role: "Ismart Online scholar", period: "2021 – 2023", note: "Programming, math and a mental health app built as a team." },
      { org: "Etec Parque Belém", role: "Informatics for the internet (technical high school)", period: "2021 – 2023" },
    ],
  },
  contact: { title: "Let's talk.", opens: "opens in a new tab", links: LINKS },
  footer: { rights: "All rights reserved." },
  notFound: { title: "Page not found", text: "That address doesn't exist here.", home: "Back to home" },
};
```

- [ ] **Step 4: Verify and commit**

Run: `npm test && npm run check` → PASS, 0 errors.

```bash
git add -A src/i18n tests
git commit -m "feat: PT and EN content dictionaries" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: README parsing and normalization (pure)

**Files:**
- Create: `src/lib/github/types.ts`, `src/lib/github/readme.ts`, `src/lib/github/normalize.ts`
- Test: `tests/readme.test.ts`, `tests/normalize.test.ts`

**Interfaces:**
- Produces:
  - `interface RepoRef { owner: string; repo: string; branch: string }`
  - `interface Project { repo: string; name: string; description: { en: string; pt: string }; tech: string[]; repoUrl: string; demoUrl: string | null; cover: string | null; coverFile: string | null; featured: boolean; pushedAt: string }`
  - `readmeImages(md: string): { alt: string; src: string }[]`, `pickCover(md: string): string | null`, `ptBlock(md: string): string | null`, `resolveAsset(src: string, ref: RepoRef): string | null`
  - `normalizeTech(names: string[], ignore?: string[]): string[]`, `orderProjects(list: Project[]): Project[]`

- [ ] **Step 1: Failing tests**

`tests/readme.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { pickCover, ptBlock, readmeImages, resolveAsset } from "../src/lib/github/readme.ts";

const ref = { owner: "lucvs07", repo: "CARI", branch: "main" };

test("readmeImages finds markdown and HTML images in document order", () => {
  const md = `intro ![a](one.png "t") text <img alt="b" src="two.jpg"> and <img src='three.gif' alt='c' />`;
  assert.deepEqual(readmeImages(md), [
    { alt: "a", src: "one.png" },
    { alt: "b", src: "two.jpg" },
    { alt: "c", src: "three.gif" },
  ]);
});

test("pickCover prefers alt 'cover', any case", () => {
  assert.equal(pickCover(`![x](a.png) ![Cover](b.png)`), "b.png");
});

test("pickCover falls back to the first non-badge image", () => {
  const md = `![build](https://img.shields.io/badge/x-y-green) ![ci](https://github.com/o/r/actions/workflows/ci.yml/badge.svg) ![shot](docs/home.png)`;
  assert.equal(pickCover(md), "docs/home.png");
});

test("pickCover returns null when there is no usable image", () => {
  assert.equal(pickCover("# Title\nno images"), null);
  assert.equal(pickCover("![b](https://img.shields.io/badge/a-b-c)"), null);
});

test("ptBlock extracts the marked block as plain text", () => {
  const md = "x\n<!-- portfolio:pt -->\nSistema **web** com [link](https://a.b) para *lojas*.\n<!-- /portfolio:pt -->\ny";
  assert.equal(ptBlock(md), "Sistema web com link para lojas.");
  assert.equal(ptBlock("no block"), null);
  assert.equal(ptBlock("<!-- portfolio:pt -->   <!-- /portfolio:pt -->"), null);
});

test("resolveAsset turns README paths into raw URLs", () => {
  const raw = "https://raw.githubusercontent.com/lucvs07/CARI/main/";
  assert.equal(resolveAsset("docs/a.png", ref), raw + "docs/a.png");
  assert.equal(resolveAsset("./docs/a.png", ref), raw + "docs/a.png");
  assert.equal(resolveAsset("/docs/a.png", ref), raw + "docs/a.png");
  assert.equal(resolveAsset("https://github.com/lucvs07/CARI/blob/main/docs/a.png", ref), raw + "docs/a.png");
  assert.equal(resolveAsset("https://github.com/lucvs07/CARI/raw/main/docs/a.png", ref), raw + "docs/a.png");
  assert.equal(resolveAsset("https://example.com/x.png", ref), "https://example.com/x.png");
  assert.equal(resolveAsset("//cdn.example.com/x.png", ref), "https://cdn.example.com/x.png");
  assert.equal(resolveAsset("data:image/png;base64,AAA", ref), null);
});
```

`tests/normalize.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeTech, orderProjects } from "../src/lib/github/normalize.ts";
import type { Project } from "../src/lib/github/types.ts";

test("normalizeTech maps aliases, drops control topics and duplicates", () => {
  assert.deepEqual(
    normalizeTech(["JavaScript", "react", "portfolio", "featured", "nodejs", "Node", "esp32", "cpp", "TypeScript", "some-tool"]),
    ["JavaScript", "React", "Node.js", "ESP32", "C++", "TypeScript", "Some tool"]
  );
});

const p = (repo: string, featured: boolean, pushedAt: string): Project => ({
  repo, name: repo, description: { en: "", pt: "" }, tech: [], repoUrl: "", demoUrl: null, cover: null, coverFile: null, featured, pushedAt,
});

test("orderProjects puts featured first, then most recently pushed", () => {
  const out = orderProjects([p("a", false, "2024-01-01"), p("b", true, "2020-01-01"), p("c", false, "2025-01-01")]);
  assert.deepEqual(out.map((x) => x.repo), ["b", "c", "a"]);
});
```

Run `npm test` → FAIL.

- [ ] **Step 2: Implementation**

`src/lib/github/types.ts`:

```ts
export interface RepoRef {
  owner: string;
  repo: string;
  branch: string;
}

export interface Project {
  repo: string; // "owner/name"
  name: string;
  description: { en: string; pt: string };
  tech: string[];
  repoUrl: string;
  demoUrl: string | null;
  cover: string | null; // URL remota resolvida
  coverFile: string | null; // nome do arquivo em src/assets/projects
  featured: boolean;
  pushedAt: string;
}

export interface RepoInfo {
  fullName: string;
  name: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  topics: string[];
  defaultBranch: string;
  pushedAt: string;
  fork: boolean;
  archived: boolean;
}

export interface GitHubApi {
  listTopicRepos(owner: string, topic: string): Promise<RepoInfo[]>;
  getRepo(fullName: string): Promise<RepoInfo>;
  getLanguages(fullName: string): Promise<string[]>;
  getReadme(fullName: string): Promise<string | null>;
}

export interface ProjectOverride {
  name?: string;
  description?: { en: string; pt: string };
  tech?: string[];
  demo?: string;
  featured?: boolean;
}

export interface ProjectsConfig {
  owner: string;
  topic: string;
  featuredTopic: string;
  extraRepos: string[];
  overrides: Record<string, ProjectOverride>;
}
```

`src/lib/github/readme.ts`:

```ts
import type { RepoRef } from "./types.ts";

export interface ImageRef {
  alt: string;
  src: string;
}

const MD_IMG = /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
const HTML_IMG = /<img\b[^>]*>/gi;
const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i"))?.[1] ?? "";

export function readmeImages(md: string): ImageRef[] {
  const found: { at: number; img: ImageRef }[] = [];
  for (const m of md.matchAll(MD_IMG)) found.push({ at: m.index ?? 0, img: { alt: m[1].trim(), src: m[2] } });
  for (const m of md.matchAll(HTML_IMG)) {
    const src = attr(m[0], "src");
    if (src) found.push({ at: m.index ?? 0, img: { alt: attr(m[0], "alt").trim(), src } });
  }
  return found.sort((a, b) => a.at - b.at).map((f) => f.img);
}

const isBadge = (src: string) => /shields\.io|badgen\.net|\/badge\.svg(\?|$)|\/workflows\/.*badge/i.test(src);

export function pickCover(md: string): string | null {
  const images = readmeImages(md).filter((i) => !isBadge(i.src));
  return (images.find((i) => i.alt.toLowerCase() === "cover") ?? images[0])?.src ?? null;
}

export function ptBlock(md: string): string | null {
  const m = md.match(/<!--\s*portfolio:pt\s*-->([\s\S]*?)<!--\s*\/portfolio:pt\s*-->/i);
  if (!m) return null;
  const text = m[1]
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]+/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text || null;
}

export function resolveAsset(src: string, ref: RepoRef): string | null {
  const raw = `https://raw.githubusercontent.com/${ref.owner}/${ref.repo}/${ref.branch}/`;
  if (src.startsWith("data:")) return null;
  if (src.startsWith("//")) return `https:${src}`;
  const gh = src.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:blob|raw)\/([^/]+)\/(.+)$/);
  if (gh) return `https://raw.githubusercontent.com/${gh[1]}/${gh[2]}/${gh[3]}/${gh[4]}`;
  if (/^https?:\/\//.test(src)) return src;
  return raw + src.replace(/^\.?\//, "").replace(/^\/+/, "");
}
```

`src/lib/github/normalize.ts`:

```ts
import type { Project } from "./types.ts";

const ALIASES: Record<string, string> = {
  js: "JavaScript", javascript: "JavaScript", ts: "TypeScript", typescript: "TypeScript",
  react: "React", reactjs: "React", node: "Node.js", nodejs: "Node.js", "node.js": "Node.js",
  esp32: "ESP32", cpp: "C++", "c++": "C++", mongodb: "MongoDB", php: "PHP", html: "HTML", css: "CSS",
  python: "Python", java: "Java", sql: "SQL", jsf: "JSF", figma: "Figma", tailwind: "Tailwind", tailwindcss: "Tailwind",
};

const label = (raw: string) => {
  const key = raw.toLowerCase();
  if (ALIASES[key]) return ALIASES[key];
  if (/[A-Z]/.test(raw)) return raw; // já veio com a grafia da linguagem (API de languages)
  const words = raw.replace(/[-_]+/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};

export function normalizeTech(names: string[], ignore: string[] = ["portfolio", "featured"]): string[] {
  const out: string[] = [];
  for (const n of names) {
    if (ignore.includes(n.toLowerCase())) continue;
    const l = label(n);
    if (!out.includes(l)) out.push(l);
  }
  return out;
}

export function orderProjects(list: Project[]): Project[] {
  return [...list].sort((a, b) => Number(b.featured) - Number(a.featured) || b.pushedAt.localeCompare(a.pushedAt));
}
```

- [ ] **Step 3: Verify and commit**

Run: `npm test` → all PASS.

```bash
git add -A src/lib/github tests
git commit -m "feat: README cover and PT block parsing for GitHub projects" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Build projects from GitHub, snapshot and covers

**Files:**
- Create: `src/lib/github/build.ts`, `src/lib/github/http.ts`, `src/data/projects.config.ts`, `scripts/sync-projects.ts`, `src/data/projects.snapshot.json` (generated), `src/assets/projects/*` (generated)
- Modify: `package.json` (add `"prebuild": "node scripts/sync-projects.ts"`, `"sync": "node scripts/sync-projects.ts"`)
- Test: `tests/build-projects.test.ts`

**Interfaces:**
- Consumes: Task 4 types and functions.
- Produces: `buildProjects(api: GitHubApi, config: ProjectsConfig): Promise<Project[]>`; `createHttpApi(token?: string): GitHubApi`; snapshot shape `{ generatedAt: string; projects: Project[] }`; covers saved as `src/assets/projects/<slug>.<ext>` where slug is the repo full name lowercased with `/` → `--`.

- [ ] **Step 1: Failing test**

`tests/build-projects.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildProjects } from "../src/lib/github/build.ts";
import type { GitHubApi, ProjectsConfig, RepoInfo } from "../src/lib/github/types.ts";

const repo = (fullName: string, extra: Partial<RepoInfo> = {}): RepoInfo => ({
  fullName, name: fullName.split("/")[1], description: null, htmlUrl: `https://github.com/${fullName}`, homepage: null,
  topics: [], defaultBranch: "main", pushedAt: "2025-01-01T00:00:00Z", fork: false, archived: false, ...extra,
});

const config: ProjectsConfig = {
  owner: "lucvs07", topic: "portfolio", featuredTopic: "featured",
  extraRepos: ["other/Ext"],
  overrides: { "other/Ext": { name: "Ext Project", description: { en: "Ext EN", pt: "Ext PT" }, demo: "https://ext.app" } },
};

function fakeApi(): GitHubApi {
  const repos: Record<string, RepoInfo> = {
    "lucvs07/Alpha": repo("lucvs07/Alpha", { description: "Alpha app", homepage: "https://alpha.app", topics: ["portfolio", "featured", "react"], pushedAt: "2024-05-01T00:00:00Z" }),
    "lucvs07/Beta": repo("lucvs07/Beta", { description: "Beta tool", topics: ["portfolio"], pushedAt: "2025-02-01T00:00:00Z" }),
    "lucvs07/OldFork": repo("lucvs07/OldFork", { topics: ["portfolio"], fork: true }),
    "other/Ext": repo("other/Ext", { pushedAt: "2023-01-01T00:00:00Z" }),
  };
  const readmes: Record<string, string> = {
    "lucvs07/Alpha": "![badge](https://img.shields.io/badge/a-b-c) ![cover](docs/shot.png)\n<!-- portfolio:pt -->App **Alpha** em português.<!-- /portfolio:pt -->",
    "lucvs07/Beta": "# Beta",
  };
  return {
    listTopicRepos: async () => Object.values(repos).filter((r) => r.fullName.startsWith("lucvs07/") && r.topics.includes("portfolio")),
    getRepo: async (n) => repos[n],
    getLanguages: async (n) => (n === "lucvs07/Alpha" ? ["TypeScript", "CSS"] : ["PHP"]),
    getReadme: async (n) => readmes[n] ?? null,
  };
}

test("buildProjects merges topic repos and extra repos, skipping forks", async () => {
  const out = await buildProjects(fakeApi(), config);
  assert.deepEqual(out.map((p) => p.repo), ["lucvs07/Alpha", "lucvs07/Beta", "other/Ext"]);
});

test("fields come from About, README and topics", async () => {
  const [alpha, beta, ext] = await buildProjects(fakeApi(), config);
  assert.equal(alpha.featured, true);
  assert.deepEqual(alpha.description, { en: "Alpha app", pt: "App Alpha em português." });
  assert.equal(alpha.cover, "https://raw.githubusercontent.com/lucvs07/Alpha/main/docs/shot.png");
  assert.equal(alpha.demoUrl, "https://alpha.app");
  assert.deepEqual(alpha.tech, ["TypeScript", "CSS", "React"]);
  assert.deepEqual(beta.description, { en: "Beta tool", pt: "Beta tool" });
  assert.equal(beta.cover, null);
  assert.equal(ext.name, "Ext Project");
  assert.deepEqual(ext.description, { en: "Ext EN", pt: "Ext PT" });
  assert.equal(ext.demoUrl, "https://ext.app");
});

test("a repo that fails to load is skipped, not fatal", async () => {
  const api = fakeApi();
  const broken: GitHubApi = { ...api, getReadme: async (n) => { if (n === "lucvs07/Beta") throw new Error("500"); return api.getReadme(n); } };
  const out = await buildProjects(broken, config);
  assert.ok(out.some((p) => p.repo === "lucvs07/Beta"), "README failure only drops the README-derived fields");
});

test("listing failure propagates so the caller can fall back to the snapshot", async () => {
  const api: GitHubApi = { ...fakeApi(), listTopicRepos: async () => { throw new Error("rate limited"); } };
  await assert.rejects(() => buildProjects(api, config), /rate limited/);
});
```

Run `npm test` → FAIL.

- [ ] **Step 2: Orchestration and HTTP API**

`src/lib/github/build.ts`:

```ts
import { normalizeTech, orderProjects } from "./normalize.ts";
import { pickCover, ptBlock, resolveAsset } from "./readme.ts";
import type { GitHubApi, Project, ProjectsConfig, RepoInfo } from "./types.ts";

async function toProject(api: GitHubApi, info: RepoInfo, config: ProjectsConfig): Promise<Project> {
  const o = config.overrides[info.fullName] ?? {};
  const [languages, readme] = await Promise.all([
    api.getLanguages(info.fullName).catch(() => [] as string[]),
    api.getReadme(info.fullName).catch(() => null),
  ]);
  const [owner, repo] = info.fullName.split("/");
  const en = o.description?.en ?? info.description ?? "";
  const pt = o.description?.pt ?? (readme ? ptBlock(readme) : null) ?? en;
  const coverSrc = readme ? pickCover(readme) : null;
  return {
    repo: info.fullName,
    name: o.name ?? info.name,
    description: { en, pt },
    tech: o.tech ?? normalizeTech([...languages, ...info.topics], [config.topic, config.featuredTopic]),
    repoUrl: info.htmlUrl,
    demoUrl: o.demo ?? (info.homepage || null),
    cover: coverSrc ? resolveAsset(coverSrc, { owner, repo, branch: info.defaultBranch }) : null,
    coverFile: null,
    featured: o.featured ?? info.topics.includes(config.featuredTopic),
    pushedAt: info.pushedAt,
  };
}

export async function buildProjects(api: GitHubApi, config: ProjectsConfig): Promise<Project[]> {
  const tagged = await api.listTopicRepos(config.owner, config.topic);
  const names = new Set(tagged.map((r) => r.fullName));
  const extras = await Promise.all(
    config.extraRepos.filter((n) => !names.has(n)).map((n) => api.getRepo(n).catch(() => null))
  );
  const infos = [...tagged, ...extras.filter((r): r is RepoInfo => r !== null)].filter((r) => !r.fork && !r.archived);
  const projects = await Promise.all(infos.map((info) => toProject(api, info, config)));
  return orderProjects(projects);
}
```

`src/lib/github/http.ts`:

```ts
import type { GitHubApi, RepoInfo } from "./types.ts";

interface RawRepo {
  full_name: string; name: string; description: string | null; html_url: string; homepage: string | null;
  topics?: string[]; default_branch: string; pushed_at: string; fork: boolean; archived: boolean;
}

const toInfo = (r: RawRepo): RepoInfo => ({
  fullName: r.full_name, name: r.name, description: r.description, htmlUrl: r.html_url, homepage: r.homepage,
  topics: r.topics ?? [], defaultBranch: r.default_branch, pushedAt: r.pushed_at, fork: r.fork, archived: r.archived,
});

export function createHttpApi(token?: string): GitHubApi {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-build" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const get = async <T>(path: string, accept?: string): Promise<T> => {
    const res = await fetch(`https://api.github.com${path}`, { headers: accept ? { ...headers, Accept: accept } : headers });
    if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
    return (accept?.includes("raw") ? await res.text() : await res.json()) as T;
  };
  return {
    listTopicRepos: async (owner, topic) =>
      (await get<{ items: RawRepo[] }>(`/search/repositories?q=${encodeURIComponent(`user:${owner} topic:${topic}`)}&per_page=100`)).items.map(toInfo),
    getRepo: async (n) => toInfo(await get<RawRepo>(`/repos/${n}`)),
    getLanguages: async (n) => Object.keys(await get<Record<string, number>>(`/repos/${n}/languages`)),
    getReadme: async (n) => get<string>(`/repos/${n}/readme`, "application/vnd.github.raw+json").catch(() => null),
  };
}
```

Run `npm test` → PASS.

- [ ] **Step 3: Config with the transition list**

`src/data/projects.config.ts` (descriptions carried over from the current site so the section is complete before the owner tags repos):

```ts
import type { ProjectsConfig } from "../lib/github/types.ts";

export const PROJECTS_CONFIG: ProjectsConfig = {
  owner: "lucvs07",
  topic: "portfolio",
  featuredTopic: "featured",
  // Transição: remova cada repo daqui quando ele ganhar o topic "portfolio" no GitHub.
  extraRepos: ["An4lu/DeereGO", "lucvs07/deereGO-ESP", "lucvs07/CARI", "lucvs07/Api-Hunger", "lucvs07/pokedex", "lucvs07/OneWay"],
  overrides: {
    "An4lu/DeereGO": {
      name: "DeereGo", featured: true, tech: ["React", "Node.js", "MongoDB"],
      description: {
        en: "System for IoT-based logistics optimization in manufacturing, integrating IoT devices to monitor and optimize the flow of materials and products.",
        pt: "Sistema de otimização logística com IoT para a indústria, integrando dispositivos IoT para monitorar e otimizar o fluxo de materiais e produtos.",
      },
    },
    "lucvs07/deereGO-ESP": {
      name: "DeereGo · ESP32", tech: ["C++", "ESP32"],
      description: {
        en: "IoT solution that uses ESP32 microcontrollers to locate and monitor assets in real time.",
        pt: "Solução IoT com microcontroladores ESP32 para localizar e monitorar ativos em tempo real.",
      },
    },
    "lucvs07/CARI": {
      name: "CARI", tech: ["PHP", "SQL", "HTML", "CSS"],
      description: {
        en: "System for sustainable food organization and consumption, connecting consumers with local food sources to reduce waste.",
        pt: "Sistema para organização e consumo sustentável de alimentos, conectando consumidores a fontes locais para reduzir o desperdício.",
      },
    },
    "lucvs07/Api-Hunger": {
      name: "Hungerdle", tech: ["React", "Node.js", "MongoDB"], demo: "https://front-hunger.vercel.app",
      description: {
        en: "Web game where players guess a Hunger Games character from clues.",
        pt: "Jogo web em que o jogador descobre um personagem de Jogos Vorazes a partir de pistas.",
      },
    },
    "lucvs07/pokedex": {
      name: "Pokédex", tech: ["JavaScript", "HTML", "CSS"],
      description: {
        en: "Web app to search for Pokémon and learn about different species.",
        pt: "Aplicativo web para buscar Pokémon e conhecer diferentes espécies.",
      },
    },
    "lucvs07/OneWay": {
      name: "One Way", tech: ["PHP", "SQL", "HTML", "CSS"],
      description: {
        en: "E-commerce web system for a clothing store, with product listings, cart and checkout.",
        pt: "Sistema web de e-commerce para uma loja de roupas, com listagem de produtos, carrinho e checkout.",
      },
    },
  },
};
```

- [ ] **Step 4: Sync script**

`scripts/sync-projects.ts`:

```ts
// Prebuild: busca os projetos no GitHub, salva o snapshot e baixa as capas.
// Se a API falhar, mantém o último snapshot. Sem snapshot, falha o build.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { buildProjects } from "../src/lib/github/build.ts";
import { createHttpApi } from "../src/lib/github/http.ts";
import { PROJECTS_CONFIG } from "../src/data/projects.config.ts";
import type { Project } from "../src/lib/github/types.ts";

const SNAPSHOT = new URL("../src/data/projects.snapshot.json", import.meta.url);
const COVERS = new URL("../src/assets/projects/", import.meta.url);
const EXT: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };

const slug = (repo: string) => repo.toLowerCase().replace("/", "--").replace(/[^a-z0-9-]+/g, "-");

async function downloadCover(p: Project): Promise<string | null> {
  if (!p.cover) return null;
  try {
    const res = await fetch(p.cover);
    const type = (res.headers.get("content-type") ?? "").split(";")[0];
    const ext = EXT[type];
    if (!res.ok || !ext) return null;
    const file = `${slug(p.repo)}.${ext}`;
    await writeFile(new URL(file, COVERS), Buffer.from(await res.arrayBuffer()));
    return file;
  } catch {
    return null;
  }
}

try {
  const projects = await buildProjects(createHttpApi(process.env.GITHUB_TOKEN), PROJECTS_CONFIG);
  await mkdir(COVERS, { recursive: true });
  for (const p of projects) p.coverFile = await downloadCover(p);
  await writeFile(SNAPSHOT, JSON.stringify({ generatedAt: new Date().toISOString(), projects }, null, 2) + "\n");
  console.log(`[projects] ${projects.length} projetos, ${projects.filter((p) => p.coverFile).length} com capa`);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  const hasSnapshot = await readFile(SNAPSHOT).then(() => true, () => false);
  if (!hasSnapshot) {
    console.error(`[projects] GitHub indisponível e sem snapshot: ${message}`);
    process.exit(1);
  }
  console.warn(`[projects] GitHub indisponível (${message}); usando o snapshot salvo`);
}
```

Add to `package.json` scripts: `"sync": "node scripts/sync-projects.ts"`, `"prebuild": "node scripts/sync-projects.ts"`.

- [ ] **Step 5: First snapshot**

Run with the owner's authenticated GitHub CLI token only if the session permits it; otherwise run unauthenticated:

```bash
npm run sync
```

Expected: `[projects] 6 projetos, N com capa` (N is 1 today: only DeereGo's README has images, and its first image is a diagram). If the API is rate-limited and no snapshot exists yet, the script exits 1: ledger a ruling and create the first snapshot by running `npm run sync` again later, or ask the owner to run it with `GITHUB_TOKEN`. Do not hand-write the snapshot.

Run: `npm test && npm run check` → PASS.

- [ ] **Step 6: Commit**

```bash
git add -A src/lib/github src/data scripts package.json tests src/assets/projects
git commit -m "feat: build-time GitHub projects with snapshot fallback and cover download" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: The page (sections, header, footer, 404)

**Files:**
- Create: `src/components/logoPaths.ts`, `Logo.astro`, `Header.astro`, `Hero.astro`, `About.astro`, `Projects.astro`, `Stack.astro`, `Path.astro`, `Contact.astro`, `Footer.astro`, `Reveal.astro`, `Page.astro`, `src/pages/404.astro`
- Modify: `src/pages/index.astro`, `src/pages/en/index.astro`, `src/layouts/Base.astro` (skip link + hreflang)
- Test: extend `tests-dist/pages.test.ts`

**Interfaces:**
- Consumes: `getDict`, `fmt` (Task 3); `withBase` (Task 1); `ThemeToggle` (Task 2); snapshot + covers (Task 5).
- Produces: `Page.astro` props `{ lang: Lang }`; section ids `sobre|about`, `projetos|projects`, `stack`, `trajetoria|path`, `contato|contact` (one table in `src/components/sections.ts`); `Hero.astro` exposes a `<slot name="logo" />` that Task 7 fills.

- [ ] **Step 1: Extend the dist tests (failing)**

Append to `tests-dist/pages.test.ts`:

```ts
test("each language has the five sections with localized anchors", () => {
  for (const id of ["sobre", "projetos", "stack", "trajetoria", "contato"]) assert.match(page("index.html"), new RegExp(`id="${id}"`));
  for (const id of ["about", "projects", "stack", "path", "contact"]) assert.match(page("en/index.html"), new RegExp(`id="${id}"`));
});

test("language switch links to the other locale and hreflang alternates exist", () => {
  assert.match(page("index.html"), /href="\/portfolio\/en\/"[^>]*lang="en"/);
  assert.match(page("en/index.html"), /href="\/portfolio\/"[^>]*lang="pt-BR"/);
  for (const p of ["index.html", "en/index.html"]) {
    assert.match(page(p), /<link rel="alternate" hreflang="pt-BR" href="https:\/\/lucvs07\.github\.io\/portfolio\/"/);
    assert.match(page(p), /<link rel="alternate" hreflang="en" href="https:\/\/lucvs07\.github\.io\/portfolio\/en\/"/);
  }
});

test("external links open safely", () => {
  for (const p of ["index.html", "en/index.html"]) {
    const ext = [...page(p).matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map((m) => m[0]);
    assert.ok(ext.length >= 4, p);
    for (const a of ext) assert.match(a, /rel="noopener noreferrer"/);
  }
});

test("projects from the snapshot are rendered", () => {
  const snapshot = JSON.parse(readFileSync(new URL("../src/data/projects.snapshot.json", import.meta.url), "utf8"));
  for (const proj of snapshot.projects) assert.ok(page("index.html").includes(proj.name), proj.name);
});

test("the 404 page exists and links home with the base", () => {
  assert.match(page("404.html"), /href="\/portfolio\/"/);
});
```

Run: `npm run build && npm run test:dist` → FAIL on the new tests.

- [ ] **Step 2: Shared pieces**

`src/components/sections.ts`:

```ts
import type { Lang } from "../i18n/types.ts";

export const SECTION_IDS: Record<Lang, { about: string; projects: string; stack: string; path: string; contact: string }> = {
  pt: { about: "sobre", projects: "projetos", stack: "stack", path: "trajetoria", contact: "contato" },
  en: { about: "about", projects: "projects", stack: "stack", path: "path", contact: "contact" },
};
```

`src/components/logoPaths.ts`:

```ts
// Os dois caminhos de public/logo.svg (viewBox 0 0 49 76).
export const LOGO_PATHS = [
  "M0.503035 7.40295C0.508809 7.6873 0.526347 8.04397 0.503027 8.36283V17.5502L16.1756 30.0677C16.6239 30.4257 17.2685 30.3727 17.6987 29.9931C19.5115 28.3937 21.8924 27.4233 24.5 27.4233C30.1799 27.4233 34.7844 32.0278 34.7844 37.7077C34.7844 39.5379 34.3063 41.2564 33.4683 42.7452C33.184 43.2502 33.2709 43.899 33.7234 44.261L48.4969 56.0825V41.1358C48.4969 39.9703 48.4969 38.945 48.4969 37.7077C48.4969 24.4545 37.7531 13.7107 24.5 13.7107C21.1276 13.7107 17.9177 14.4064 15.006 15.662C14.636 15.8215 14.2156 15.5551 14.2156 15.1522L14.2156 0.0881264C14.2156 -0.048998 14.2156 -0.00182828 13.9468 0.0667373C0.716712 3.85799 0.458906 5.22945 0.503035 7.40295Z",
  "M48.4969 59.0307L32.2086 45.8642C31.7853 45.5221 31.1788 45.5474 30.7467 45.8783C29.015 47.2042 26.8495 47.9921 24.5 47.9921C18.8201 47.9921 14.2156 43.3876 14.2156 37.7077C14.2156 36.1341 14.569 34.6431 15.2007 33.3097C15.4367 32.8115 15.3292 32.2046 14.8955 31.8643L0.503027 20.567V34.0739C0.503005 35.308 0.503019 36.4703 0.503019 37.7077C0.503019 50.9608 11.2468 61.7047 24.5 61.7047C27.8723 61.7047 31.0822 61.009 33.994 59.7534C34.364 59.5938 34.7844 59.8602 34.7844 60.2632V75.2115C34.7844 75.4172 34.7158 75.4858 35.0586 75.3486C48.2887 71.5574 48.5411 70.1859 48.4969 68.0124C48.4912 67.7281 48.4736 67.3028 48.4969 66.984V59.0307Z",
];
```

`src/components/Logo.astro`:

```astro
---
import { LOGO_PATHS } from "./logoPaths";
interface Props { class?: string }
const { class: cls } = Astro.props;
---
<svg class={cls} viewBox="0 0 49 76" fill="currentColor" aria-hidden="true">
  {LOGO_PATHS.map((d) => <path d={d} />)}
</svg>
```

`src/components/Reveal.astro` (one observer for the whole page):

```astro
<script>
  const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("is-in"));
  }
</script>
```

- [ ] **Step 3: Layout additions**

In `src/layouts/Base.astro`: add a `path?: string` prop (unused by pages now; reserved), import `getAbsoluteLocaleUrl` from `"astro:i18n"`, and add to `<head>`:

```astro
    <link rel="alternate" hreflang="pt-BR" href={getAbsoluteLocaleUrl("pt", "")} />
    <link rel="alternate" hreflang="en" href={getAbsoluteLocaleUrl("en", "")} />
    <link rel="alternate" hreflang="x-default" href={getAbsoluteLocaleUrl("pt", "")} />
```

and as the first child of `<body>` (before the slot), a skip link that pages pass via a named slot: `<slot name="skip" />`.

- [ ] **Step 4: Header and footer**

`src/components/Header.astro`:

```astro
---
import { getRelativeLocaleUrl } from "astro:i18n";
import { getDict } from "../i18n/index";
import type { Lang } from "../i18n/types";
import { SECTION_IDS } from "./sections";
import ThemeToggle from "./ThemeToggle.astro";

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = getDict(lang);
const ids = SECTION_IDS[lang];
const other: Lang = lang === "pt" ? "en" : "pt";
const home = getRelativeLocaleUrl(lang, "");
const items = [
  [ids.about, t.nav.about], [ids.projects, t.nav.projects], [ids.stack, t.nav.stack], [ids.path, t.nav.path], [ids.contact, t.nav.contact],
] as const;
---
<header class="bar">
  <div class="wrap row">
    <a class="brand" href={home} aria-label={t.nav.home}>Lucas Grecco</a>
    <nav aria-label={t.nav.label}>
      <ul>
        {items.map(([id, label]) => <li><a href={`#${id}`}>{label}</a></li>)}
      </ul>
    </nav>
    <div class="tools">
      <a class="lang" href={getRelativeLocaleUrl(other, "")} lang={other === "pt" ? "pt-BR" : "en"} hreflang={other === "pt" ? "pt-BR" : "en"} aria-label={t.nav.switchLangLabel}>{t.nav.switchLang}</a>
      <ThemeToggle toDark={t.nav.toDark} toLight={t.nav.toLight} />
    </div>
  </div>
</header>

<style>
  .bar { position: sticky; top: 0; z-index: 10; background: color-mix(in srgb, var(--bg) 92%, transparent); border-bottom: 1px solid var(--rule); }
  .row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 4rem; }
  .brand { font-weight: 600; }
  ul { display: none; list-style: none; gap: 2rem; font-size: 0.95rem; color: var(--muted); }
  ul a:hover { color: var(--text); }
  @media (min-width: 900px) { ul { display: flex; } }
  .tools { display: flex; align-items: center; gap: 0.75rem; }
  .lang { font-weight: 600; font-size: 0.95rem; padding: 0.4rem 0.6rem; border: 1px solid var(--rule); border-radius: 999px; }
  .lang:hover { border-color: var(--muted); }
</style>
```

(The sticky bar uses `color-mix` for a solid-looking tint, no blur.)

`src/components/Footer.astro`:

```astro
---
import { getDict } from "../i18n/index";
import type { Lang } from "../i18n/types";
import Logo from "./Logo.astro";
interface Props { lang: Lang }
const t = getDict(Astro.props.lang);
---
<footer class="wrap foot">
  <Logo class="mark" />
  <p class="muted">© {new Date().getFullYear()} Lucas Grecco. {t.footer.rights}</p>
</footer>
<style>
  .foot { display: flex; align-items: center; gap: 1rem; padding-block: 2rem; border-top: 1px solid var(--rule); font-size: 0.95rem; }
  .mark { width: 1rem; color: var(--accent); }
</style>
```

- [ ] **Step 5: Sections**

`src/components/Hero.astro`:

```astro
---
import { getDict } from "../i18n/index";
import type { Lang } from "../i18n/types";
import { SECTION_IDS } from "./sections";
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = getDict(lang);
---
<section class="hero wrap" aria-labelledby="hero-title">
  <div class="copy">
    <h1 id="hero-title" class="name">Lucas<br />Grecco<span class="dot">.</span></h1>
    <p class="lead"><strong>{t.hero.role}</strong> {t.hero.rest}</p>
  </div>
  <div class="stage"><slot name="logo" /></div>
  <a class="index" href={`#${SECTION_IDS[lang].about}`}><span><b>01</b> — {t.nav.about}</span><span aria-hidden="true">{t.hero.scroll} ↓</span></a>
</section>

<style>
  .hero { position: relative; min-height: calc(100svh - 4rem); display: grid; grid-template-rows: auto minmax(40svh, 1fr) auto; padding-block: 3rem 1.5rem; }
  @media (min-width: 900px) { .hero { grid-template-columns: 1.1fr 1fr; grid-template-rows: 1fr auto; align-items: center; } }
  .name { font-size: clamp(4.25rem, 13vw, 11rem); line-height: 0.86; letter-spacing: -0.02em; }
  .dot { color: var(--accent); }
  .lead { margin-top: 2rem; max-width: 30rem; font-size: clamp(1.1rem, 1.6vw, 1.35rem); line-height: 1.45; color: var(--muted); }
  .lead strong { color: var(--text); font-weight: 600; }
  .stage { position: relative; min-height: 40svh; }
  @media (min-width: 900px) { .stage { min-height: 70svh; } }
  .index { grid-column: 1 / -1; display: flex; justify-content: space-between; border-top: 1px solid var(--rule); padding-top: 1rem; font-size: 0.95rem; color: var(--muted); }
  .index b { color: var(--accent-text); font-weight: 600; }
</style>
```

`src/components/About.astro`:

```astro
---
import { getDict } from "../i18n/index";
import type { Lang } from "../i18n/types";
import { SECTION_IDS } from "./sections";
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = getDict(lang);
---
<section id={SECTION_IDS[lang].about} class="section" aria-labelledby="about-title">
  <div class="wrap" data-reveal>
    <p class="num">01 — {t.nav.about}</p>
    <h2 id="about-title" class="title">{t.about.title}</h2>
    <p class="body">{t.about.body}</p>
    <p class="langs muted">{t.about.languages}</p>
  </div>
</section>
<style>
  .body { margin-top: 2rem; max-width: 42rem; font-size: clamp(1.15rem, 1.8vw, 1.4rem); line-height: 1.6; }
  .langs { margin-top: 1.5rem; }
</style>
```

`src/components/Projects.astro`:

```astro
---
import { Image } from "astro:assets";
import type { ImageMetadata } from "astro";
import snapshot from "../data/projects.snapshot.json";
import { fmt, getDict } from "../i18n/index";
import type { Lang } from "../i18n/types";
import type { Project } from "../lib/github/types";
import { SECTION_IDS } from "./sections";

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = getDict(lang);
const projects = (snapshot as { projects: Project[] }).projects;
const covers = import.meta.glob<{ default: ImageMetadata }>("../assets/projects/*.{png,jpg,webp,gif,avif}", { eager: true });
const coverFor = (p: Project) => (p.coverFile ? covers[`../assets/projects/${p.coverFile}`]?.default : undefined);
const [featured, ...rest] = projects;
const ext = { target: "_blank", rel: "noopener noreferrer" };
---
<section id={SECTION_IDS[lang].projects} class="section" aria-labelledby="projects-title">
  <div class="wrap">
    <p class="num">02 — {t.nav.projects}</p>
    <h2 id="projects-title" class="title">{t.projects.title}</h2>

    {projects.length === 0 && <p class="muted empty"><a class="link" href="https://github.com/lucvs07" {...ext}>{t.projects.empty}</a></p>}

    {featured && (
      <article class="feat" data-reveal>
        <div class="feat-copy">
          <h3>{featured.name}</h3>
          <p class="desc">{featured.description[lang]}</p>
          <ul class="tech" aria-label={t.projects.techs}>{featured.tech.map((x) => <li>{x}</li>)}</ul>
          <p class="links">
            <a class="link" href={featured.repoUrl} {...ext} aria-label={fmt(t.projects.codeLabel, { name: featured.name })}>{t.projects.code} ↗</a>
            {featured.demoUrl && <a class="link" href={featured.demoUrl} {...ext} aria-label={fmt(t.projects.demoLabel, { name: featured.name })}>{t.projects.demo} ↗</a>}
          </p>
        </div>
        {coverFor(featured) && <Image class="cover" src={coverFor(featured)!} alt="" widths={[480, 800, 1200]} sizes="(min-width: 900px) 40vw, 100vw" />}
      </article>
    )}

    <ol class="list">
      {rest.map((p, i) => (
        <li class="row" data-reveal>
          <span class="i">{String(i + 2).padStart(2, "0")}</span>
          <div>
            <h3>{p.name}</h3>
            <p class="muted">{p.description[lang]}</p>
            <ul class="tech small" aria-label={t.projects.techs}>{p.tech.map((x) => <li>{x}</li>)}</ul>
          </div>
          <p class="links">
            <a class="link" href={p.repoUrl} {...ext} aria-label={fmt(t.projects.codeLabel, { name: p.name })}>{t.projects.code} ↗</a>
            {p.demoUrl && <a class="link" href={p.demoUrl} {...ext} aria-label={fmt(t.projects.demoLabel, { name: p.name })}>{t.projects.demo} ↗</a>}
          </p>
        </li>
      ))}
    </ol>
  </div>
</section>

<style>
  .feat { display: grid; gap: 2rem; margin-top: 3rem; padding: clamp(1.25rem, 3vw, 2.5rem); background: var(--surface); border-radius: 1rem; }
  @media (min-width: 900px) { .feat { grid-template-columns: 1.1fr 1fr; align-items: center; } }
  .feat h3 { font-size: clamp(2rem, 4vw, 3rem); }
  .desc { margin-top: 1rem; max-width: 36rem; }
  .cover { width: 100%; height: auto; border-radius: 0.75rem; }
  .tech { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 1rem; list-style: none; }
  .tech li { font-size: 0.9rem; padding: 0.2rem 0.7rem; border: 1px solid var(--rule); border-radius: 999px; color: var(--muted); }
  .tech.small { margin-top: 0.6rem; }
  .links { display: flex; gap: 1.25rem; margin-top: 1.25rem; }
  .list { list-style: none; margin-top: 2rem; }
  .row { display: grid; grid-template-columns: 2.5rem 1fr; gap: 0.5rem 1rem; padding-block: 1.5rem; border-bottom: 1px solid var(--rule); }
  @media (min-width: 900px) { .row { grid-template-columns: 3rem 1fr auto; align-items: baseline; } }
  .row .links { grid-column: 2; margin-top: 0; }
  @media (min-width: 900px) { .row .links { grid-column: 3; } }
  .row h3 { font-size: 1.4rem; font-weight: 600; }
  .i { color: var(--muted); font-size: 0.95rem; }
  .empty { margin-top: 2rem; }
</style>
```

`src/components/Stack.astro`:

```astro
---
import { getDict } from "../i18n/index";
import type { Lang } from "../i18n/types";
import { SECTION_IDS } from "./sections";
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = getDict(lang);
---
<section id={SECTION_IDS[lang].stack} class="section" aria-labelledby="stack-title">
  <div class="wrap">
    <p class="num">03 — {t.nav.stack}</p>
    <h2 id="stack-title" class="title">{t.stack.title}</h2>
    <div class="cols">
      {t.stack.groups.map((g) => (
        <div data-reveal>
          <h3>{g.title}</h3>
          <ul>{g.items.map((x) => <li>{x}</li>)}</ul>
        </div>
      ))}
    </div>
  </div>
</section>
<style>
  .cols { display: grid; gap: 2.5rem; margin-top: 3rem; }
  @media (min-width: 700px) { .cols { grid-template-columns: repeat(3, 1fr); } }
  h3 { font-size: 0.95rem; font-weight: 500; color: var(--muted); margin-bottom: 1rem; }
  ul { list-style: none; font-size: clamp(1.25rem, 2vw, 1.6rem); line-height: 1.6; font-weight: 500; }
</style>
```

`src/components/Path.astro`:

```astro
---
import { getDict } from "../i18n/index";
import type { Lang } from "../i18n/types";
import { SECTION_IDS } from "./sections";
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = getDict(lang);
---
<section id={SECTION_IDS[lang].path} class="section" aria-labelledby="path-title">
  <div class="wrap">
    <p class="num">04 — {t.nav.path}</p>
    <h2 id="path-title" class="title">{t.path.title}</h2>
    <ol class="tl">
      {t.path.items.map((item, i) => {
        const joined = item.group && t.path.items[i + 1]?.group === item.group;
        return (
          <li class:list={["item", { joined }]} data-reveal>
            <p class="period muted">{item.period}</p>
            <div>
              <h3>{item.org}</h3>
              <p>{item.role}</p>
              {item.note && <p class="muted note">{item.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  </div>
</section>
<style>
  .tl { list-style: none; margin-top: 3rem; border-left: 1px solid var(--rule); }
  .item { position: relative; display: grid; gap: 0.25rem 2rem; padding: 0 0 2.25rem 2rem; }
  @media (min-width: 900px) { .item { grid-template-columns: 11rem 1fr; } }
  .item::before { content: ""; position: absolute; left: -0.3rem; top: 0.45rem; width: 0.6rem; height: 0.6rem; border-radius: 50%; background: var(--accent); }
  .item.joined { padding-bottom: 1rem; }
  .item.joined + .item::before { background: var(--bg); border: 1.5px solid var(--accent); }
  h3 { font-size: 1.3rem; font-weight: 600; }
  .period { font-size: 0.95rem; }
  .note { margin-top: 0.25rem; font-size: 1rem; }
</style>
```

`src/components/Contact.astro`:

```astro
---
import { getDict } from "../i18n/index";
import type { Lang } from "../i18n/types";
import { SECTION_IDS } from "./sections";
interface Props { lang: Lang }
const { lang } = Astro.props;
const t = getDict(lang);
---
<section id={SECTION_IDS[lang].contact} class="section" aria-labelledby="contact-title">
  <div class="wrap" data-reveal>
    <p class="num">05 — {t.nav.contact}</p>
    <h2 id="contact-title" class="big">{t.contact.title.replace(/\.$/, "")}<span class="dot">.</span></h2>
    <ul class="links">
      {t.contact.links.map((l) => (
        <li><a class="link" href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${l.name} (${t.contact.opens})`}>{l.name} ↗</a></li>
      ))}
    </ul>
  </div>
</section>
<style>
  .big { font-size: clamp(3.5rem, 10vw, 8rem); line-height: 0.9; margin-top: 1rem; }
  .dot { color: var(--accent); }
  .links { display: flex; flex-wrap: wrap; gap: 1rem 2.5rem; margin-top: 3rem; list-style: none; font-size: 1.25rem; }
</style>
```

- [ ] **Step 6: Page, routes, 404**

`src/components/Page.astro`:

```astro
---
import Base from "../layouts/Base.astro";
import { getDict } from "../i18n/index";
import type { Lang } from "../i18n/types";
import About from "./About.astro";
import Contact from "./Contact.astro";
import Footer from "./Footer.astro";
import Header from "./Header.astro";
import Hero from "./Hero.astro";
import Path from "./Path.astro";
import Projects from "./Projects.astro";
import Reveal from "./Reveal.astro";
import Stack from "./Stack.astro";

interface Props { lang: Lang }
const { lang } = Astro.props;
const t = getDict(lang);
---
<Base lang={lang} title={t.meta.title} description={t.meta.description}>
  <a slot="skip" class="skip" href="#main">{t.nav.skip}</a>
  <Header lang={lang} />
  <main id="main" tabindex="-1">
    <Hero lang={lang}><slot name="logo" slot="logo" /></Hero>
    <About lang={lang} />
    <Projects lang={lang} />
    <Stack lang={lang} />
    <Path lang={lang} />
    <Contact lang={lang} />
  </main>
  <Footer lang={lang} />
  <Reveal />
</Base>
```

`src/pages/index.astro`:

```astro
---
import Page from "../components/Page.astro";
---
<Page lang="pt" />
```

`src/pages/en/index.astro`:

```astro
---
import Page from "../../components/Page.astro";
---
<Page lang="en" />
```

`src/pages/404.astro`:

```astro
---
import { getRelativeLocaleUrl } from "astro:i18n";
import Base from "../layouts/Base.astro";
import Footer from "../components/Footer.astro";
import Header from "../components/Header.astro";
import { getDict } from "../i18n/index";
const t = getDict("pt");
const en = getDict("en");
---
<Base lang="pt" title={`${t.notFound.title} · Lucas Grecco`} description={t.notFound.text}>
  <Header lang="pt" />
  <main class="wrap nf">
    <h1>{t.notFound.title}</h1>
    <p class="muted">{t.notFound.text} <span lang="en">{en.notFound.text}</span></p>
    <a class="link" href={getRelativeLocaleUrl("pt", "")}>{t.notFound.home}</a>
  </main>
  <Footer lang="pt" />
</Base>
<style>
  .nf { min-height: 60svh; display: grid; align-content: center; gap: 1.5rem; padding-block: 6rem; }
  h1 { font-size: clamp(3rem, 9vw, 7rem); }
</style>
```

- [ ] **Step 7: Verify and commit**

Run: `npm run verify`
Expected: check 0 errors; unit tests pass; build ok; dist tests pass (8).

Open the dev server (`npm run dev`, through the browser pane's launch config updated to `npx astro dev --port 5199`, URL `http://localhost:5199/portfolio/`) and look once at 1440 and 375: sections render, no horizontal scroll.

```bash
git add -A src tests-dist
git commit -m "feat: editorial one-page with header, sections, footer and 404" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: The 3D logo island

**Files:**
- Create: `src/components/LogoHero.tsx`, `src/components/LogoScene.tsx` (uses `logoPaths.ts` from Task 6)
- Modify: `src/pages/index.astro`, `src/pages/en/index.astro` (pass the island into the `logo` slot)
- Test: extend `tests-dist/pages.test.ts`

**Interfaces:**
- Consumes: hero `logo` slot (Task 6); CSS vars (Task 2).
- Produces: `LogoHero` (default export, no props) rendered with `client:idle`; it server-renders the flat SVG with `data-logo-static`.

- [ ] **Step 1: Dist test (failing)**

```ts
test("the hero ships the flat logo in the HTML for first paint and no-JS", () => {
  for (const p of ["index.html", "en/index.html"]) {
    assert.match(page(p), /data-logo-static/);
    assert.match(page(p), /<astro-island[^>]*client="idle"/);
  }
});
```

Run `npm run build && npm run test:dist` → FAIL.

- [ ] **Step 2: Scene (ported from `spike/hero:prototypes/hero/LogoScene.tsx`)**

`src/components/LogoScene.tsx`:

```tsx
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { LOGO_PATHS } from "./logoPaths";

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useGeometry() {
  return useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49 76">${LOGO_PATHS.map((d) => `<path d="${d}"/>`).join("")}</svg>`;
    const shapes = new SVGLoader().parse(svg).paths.flatMap((p) => SVGLoader.createShapes(p));
    const g = new THREE.ExtrudeGeometry(shapes, { depth: 9, bevelEnabled: true, bevelThickness: 1.4, bevelSize: 0.9, bevelSegments: 8, curveSegments: 32 });
    g.center();
    return g;
  }, []);
}

function Logo({ still }: { still: boolean }) {
  const geometry = useGeometry();
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const spin = useRef(still ? 0 : -Math.PI * 1.5);
  const flip = useRef(0);

  useEffect(() => {
    if (still) return;
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [still]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const damp = THREE.MathUtils.damp;
    pointer.current.x = damp(pointer.current.x, target.current.x, 4, delta);
    pointer.current.y = damp(pointer.current.y, target.current.y, 4, delta);
    spin.current = damp(spin.current, 0, 2.2, delta); // chegada: gira até encarar o visitante
    const turn = still ? 0 : Math.min(window.scrollY / window.innerHeight, 1) * Math.PI; // rolar: b vira q
    flip.current = damp(flip.current, turn, 6, delta);
    const t = state.clock.elapsedTime;
    g.rotation.set(pointer.current.y * 0.35 + (still ? 0 : Math.sin(t * 0.6) * 0.04), spin.current + pointer.current.x * 0.55 - 0.35, flip.current);
    g.position.y = still ? 0 : Math.sin(t * 0.8) * 0.06;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} scale={0.029} rotation-x={Math.PI}>
        <meshPhysicalMaterial color="#FFA737" metalness={0.55} roughness={0.26} clearcoat={0.8} clearcoatRoughness={0.2} />
      </mesh>
    </group>
  );
}

export default function LogoScene({ light, onReady }: { light: boolean; onReady: () => void }) {
  const still = reduceMotion();
  const k = light ? 0.75 : 1; // no tema claro a luz ambiente já é alta; reduz para o objeto não lavar
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 35 }} gl={{ alpha: true, antialias: true }} onCreated={() => requestAnimationFrame(onReady)}>
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3 * k} color="#fff1dd" position={[-4, 3, 3]} scale={[5, 3, 1]} />
        <Lightformer form="rect" intensity={1.4 * k} color="#ffffff" position={[4, -1, 3]} scale={[3, 5, 1]} />
        <Lightformer form="ring" intensity={2.5 * k} color="#ff8a1f" position={[0, 0, -4]} scale={5} />
        <Lightformer form="rect" intensity={0.8 * k} color="#ffd29a" position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} />
      </Environment>
      <Logo still={still} />
    </Canvas>
  );
}
```

`LOGO_PATHS` comes from `src/components/logoPaths.ts` (Task 6).

- [ ] **Step 3: Island wrapper**

`src/components/LogoHero.tsx`:

```tsx
import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from "react";
import { LOGO_PATHS } from "./logoPaths";

const LogoScene = lazy(() => import("./LogoScene"));

// Se o canvas lançar erro, a logo plana continua na tela.
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function canRender3d(): boolean {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  if (saveData) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function LogoHero() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    setEnabled(canRender3d());
    const root = document.documentElement;
    const sync = () => setLight(root.dataset.theme === "light");
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  return (
    <div className="logo-hero" data-ready={ready ? "" : undefined} aria-hidden="true">
      <div className="glow" />
      <svg data-logo-static className="flat" viewBox="0 0 49 76" fill="currentColor">
        {LOGO_PATHS.map((d) => <path key={d.slice(0, 12)} d={d} />)}
      </svg>
      {enabled && (
        <Boundary>
          <Suspense fallback={null}>
            <div className="canvas"><LogoScene light={light} onReady={() => setReady(true)} /></div>
          </Suspense>
        </Boundary>
      )}
    </div>
  );
}
```

Add to `src/styles/global.css` (island markup is React, so its CSS is global):

```css
.logo-hero { position: absolute; inset: 0; color: var(--accent); }
.logo-hero .glow { position: absolute; inset: 0; background: radial-gradient(42% 46% at 50% 52%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 70%); pointer-events: none; }
[data-theme="light"] .logo-hero .glow { opacity: 0.55; }
.logo-hero .flat { position: absolute; left: 50%; top: 50%; height: min(62%, 26rem); width: auto; translate: -50% -50%; transition: opacity 0.6s ease; }
.logo-hero .canvas { position: absolute; inset: 0; opacity: 0; transition: opacity 0.8s ease; }
.logo-hero[data-ready] .canvas { opacity: 1; }
.logo-hero[data-ready] .flat { opacity: 0; }
@media (prefers-reduced-motion: reduce) { .logo-hero .flat, .logo-hero .canvas { transition: none; } }
```

In both pages, pass the island into the slot:

```astro
---
import Page from "../components/Page.astro";
import LogoHero from "../components/LogoHero.tsx";
---
<Page lang="pt"><LogoHero slot="logo" client:idle /></Page>
```

(EN page: same with `lang="en"` and `../../components/...`.)

- [ ] **Step 4: Verify and commit**

Run: `npm run verify` → green. Record the island chunk size from the build output.

Browser (pane visible, 1440): the flat logo appears instantly; within about a second the 3D logo crossfades in, spins to face the viewer, follows the cursor, and turns 180° as the first viewport scrolls. Toggle the theme: the glow softens on light. Emulate reduced motion and reload: the 3D logo stays still, no spin.

```bash
git add -A src tests-dist
git commit -m "feat: 3D logo hero island with flat SVG first paint and fallbacks" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Social preview and metadata

**Files:**
- Create: `scripts/og-image.ts`, `public/og.png` (generated, committed)
- Modify: `src/layouts/Base.astro`, `package.json` (`"og": "node scripts/og-image.ts"`)
- Test: extend `tests-dist/pages.test.ts`

- [ ] **Step 1: Dist test (failing)**

```ts
test("link previews have title, description, image and canonical", () => {
  for (const [p, url] of [["index.html", "https://lucvs07.github.io/portfolio/"], ["en/index.html", "https://lucvs07.github.io/portfolio/en/"]]) {
    const html = page(p);
    assert.match(html, new RegExp(`<link rel="canonical" href="${url}"`));
    assert.match(html, /<meta property="og:title" content="[^"]+"/);
    assert.match(html, /<meta property="og:description" content="[^"]+"/);
    assert.match(html, /<meta property="og:image" content="https:\/\/lucvs07\.github\.io\/portfolio\/og\.png"/);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
  }
});
```

- [ ] **Step 2: OG image generator**

`scripts/og-image.ts` (1200×630, dark background, name, role, orange logo; uses sharp, which Astro depends on):

```ts
import sharp from "sharp";
import { LOGO_PATHS } from "../src/components/logoPaths.ts";

const logo = LOGO_PATHS.map((d) => `<path d="${d}" fill="#FFA737"/>`).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#161412"/>
  <circle cx="930" cy="315" r="260" fill="#FFA737" opacity="0.10"/>
  <g transform="translate(820 145) scale(4.5)">${logo}</g>
  <text x="80" y="300" font-family="Chillax, Arial, sans-serif" font-weight="700" font-size="112" fill="#F4EFEA">Lucas</text>
  <text x="80" y="410" font-family="Chillax, Arial, sans-serif" font-weight="700" font-size="112" fill="#F4EFEA">Grecco<tspan fill="#FFA737">.</tspan></text>
  <text x="84" y="480" font-family="Chillax, Arial, sans-serif" font-weight="500" font-size="30" fill="#B9B2AB">Full stack developer · Asaas · FIAP</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(new URL("../public/og.png", import.meta.url).pathname);
console.log("[og] public/og.png");
```

`logoPaths.ts` must import nothing (it is a plain array), so Node can import it. Run `npm run og` and open `public/og.png` to check it (Chillax is not installed for sharp, so the text renders in the Arial fallback; that is acceptable for the preview image).

- [ ] **Step 3: Meta tags**

In `src/layouts/Base.astro`, compute `const canonical = new URL(Astro.url.pathname, Astro.site).href;` and `const og = new URL(withBase("og.png"), Astro.site).href;` and add:

```astro
    <link rel="canonical" href={canonical} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={og} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content={lang === "pt" ? "pt_BR" : "en_US"} />
    <meta name="twitter:card" content="summary_large_image" />
```

- [ ] **Step 4: Verify and commit**

Run: `npm run verify` → green.

```bash
git add -A scripts public/og.png src package.json tests-dist
git commit -m "feat: social preview image and canonical metadata" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: GitHub Pages workflow and README

**Files:**
- Create: `.github/workflows/deploy.yml` (needs the owner's approval when the write is attempted)
- Modify: `README.md`

- [ ] **Step 1: Workflow**

Tell the owner the file is about to be written and wait for the approval prompt. Content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  schedule:
    - cron: "0 9 * * *" # todo dia, 06:00 em São Paulo
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - run: npm run test:dist
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

If the write is refused, stop this step, ledger it, and give the owner the file content to add themselves; continue with Step 2.

- [ ] **Step 2: README**

Replace `README.md` with: what the site is; `npm install`, `npm run dev` (URL `http://localhost:4321/portfolio/`), `npm run verify`; how projects are added (topic `portfolio`, `featured`, About description and website, `![cover](...)` in the README, `<!-- portfolio:pt -->…<!-- /portfolio:pt -->`; remove the repo from `extraRepos` in `src/data/projects.config.ts` once tagged); `npm run sync` with `GITHUB_TOKEN` to refresh the snapshot locally; deploy (Pages source = GitHub Actions; daily rebuild).

- [ ] **Step 3: Commit**

```bash
git add -A .github README.md
git commit -m "ci: deploy to GitHub Pages on push, daily and on demand" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Verification matrix

- [ ] **Step 1:** `npm run verify` green; impeccable detector over `src` (`"<impeccable skill dir>/scripts/impeccable" detect src`) with no findings left unfixed or unexplained; record initial HTML+CSS size (`gzip -c dist/index.html | wc -c` plus the CSS file) and the island chunk sizes.
- [ ] **Step 2:** Browser at 1440, 1024, 375 and 360px, PT and EN, dark and light: `document.documentElement.scrollWidth <= innerWidth`; nothing overlaps; hero logo crossfades; projects list readable; one screenshot per theme at 1440 and 375 reviewed.
- [ ] **Step 3:** JavaScript disabled (or the island removed via devtools and `.js` class removed from `<html>`): every section visible, flat logo shown.
- [ ] **Step 4:** Reduced motion emulated: no reveal hides content (`[...document.querySelectorAll("[data-reveal]")].every(e => getComputedStyle(e).opacity === "1")`), 3D logo still.
- [ ] **Step 5:** Keyboard: skip link first, then brand, nav, EN/PT link, theme button; focus ring visible on both themes; anchors land below the sticky bar.
- [ ] **Step 6:** Storage blocked (`Storage.prototype.getItem = Storage.prototype.setItem = () => { throw new Error("x") }` then reload is not possible, so test the toggle after overriding): theme still switches; no console errors.
- [ ] **Step 7:** Commit fixes as `fix: ...` commits.

### Task 11: Finish review, DESIGN.md, branch review

- [ ] **Step 1:** Capture `.impeccable/review/desktop.png` (1440×900, `/portfolio/`, dark, settled) and `mobile.png` (375), dispatch `impeccable:impeccable-finish-reviewer` with PRODUCT.md, the spec and the captures; apply material fixes in one batch, one confirming screenshot round, `npm run verify`, commit.
- [ ] **Step 2:** Dispatch `impeccable:impeccable-documenter` to write `DESIGN.md` from the shipped code; commit `DESIGN.md`.
- [ ] **Step 3:** Whole-branch review by a fresh reviewer on the most capable model (review package from `main`), with this plan's Review Focus; fix Critical/Important with a failing test first where testable; ledger minors.
- [ ] **Step 4:** Report to the owner: what shipped, sizes, owner actions (topics, About, covers, PT blocks, Pages source, workflow approval if refused), PT/EN copy to review, and merge/PR options for `feat/astro`.

---

## Self-Review

- **Spec coverage:** architecture and base path → Task 1; themes and no-flash → Task 2; all copy and the PT/EN split → Task 3 and Task 6; projects pipeline (topic, extras, About, PT block, cover rules, badge skip, relative URLs, demo, tech, featured, order, snapshot fallback, image download, transition list) → Tasks 4 and 5; sections, timeline grouping, contact without email, 404 → Task 6; 3D hero with SVG first paint, `client:idle`, reduced motion, Save-Data, no WebGL, error boundary, light-theme softening → Task 7; link previews → Task 8; deploy and owner docs → Task 9; verification list → Task 10; finish review, DESIGN.md → Task 11.
- **Placeholder scan:** none; Task 5 Step 5 and Task 9 Step 1 define what to do when the network or a hook refuses.
- **Type consistency:** `Project`, `RepoInfo`, `GitHubApi`, `ProjectsConfig` defined in Task 4 and used unchanged in Tasks 5 and 6; `Dict`/`getDict`/`fmt` from Task 3 used in Task 6; `LOGO_PATHS` defined in Task 6 and used by `Logo.astro`, `LogoHero`, `LogoScene` and `og-image.ts`; `withBase` from Task 1 used in Tasks 1 and 8.
