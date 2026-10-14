# Portfolio rebuild: editorial one-pager in Astro

Branch: `feat/astro` (from `main`). Status: awaiting review.
Product truth: `PRODUCT.md` (updated 2026-10-14 from the owner's LinkedIn profile).
Superseded: `docs/superpowers/specs/2026-10-14-sticker-lid-portfolio-design.md` on `feat/sticker-lid` (rejected: the sticker world read as childish and cluttered).
Evidence for the hero choice: the throwaway prototypes on branch `spike/hero` (`prototypes/hero.html`, variant B).

## Intent

A general portfolio of Lucas Grecco's work, for any visitor, that reads like a confident editorial page: dark and clean, large Chillax type, a lot of space, orange used only as an accent, and one memorable object in the hero, the logo in 3D. The site must be light, bilingual (PT and EN) and keep the project list up to date from GitHub without code changes.

Success criteria:
- First viewport: name, role ("full stack developer at Asaas, Computer Engineering student at FIAP") and the 3D logo; the reader knows it is a person's portfolio and what he does.
- Every project shows its description, stack, code link and demo link when one exists, and is reachable in one scroll.
- Adding a repo to the portfolio only requires a GitHub topic and README conventions; the site rebuilds daily.
- Without JavaScript the whole page reads correctly (only the 3D logo and the switches need JS).
- Works at 360px without horizontal scroll; dark and light themes; PT at `/`, EN at `/en/`.
- `astro check`, unit tests, build and the impeccable detector pass.

## Out of scope

The 3D avatar (retired), CV download, email or phone, certifications, blog, case-study pages, a CMS, analytics.

## Architecture

- **Framework:** Astro (static output) with TypeScript in strict mode. Plain CSS with custom properties, one global stylesheet for tokens plus component-scoped `<style>` blocks. No Stitches, no CSS-in-JS.
- **Islands:** one React island for the 3D logo (three.js, @react-three/fiber, @react-three/drei Environment/Lightformer). Theme and language switches are small inline scripts, not React.
- **Pages:** `src/pages/index.astro` (PT), `src/pages/en/index.astro` (EN), both rendering one `Page.astro` with a `lang` prop; `src/pages/404.astro`.
- **i18n:** Astro i18n config with `defaultLocale: "pt"`, `locales: ["pt", "en"]`, `prefixDefaultLocale: false`. UI strings and static content live in `src/i18n/pt.ts` and `src/i18n/en.ts` with identical keys. `<html lang>` is `pt-BR` or `en`; each page declares `hreflang` alternates. The PT/EN switch is a link to the same anchor in the other language.
- **Base path:** GitHub Pages project site at `https://lucvs07.github.io/portfolio/`, so `site` and `base: "/portfolio"` are set in `astro.config.mjs`. A custom domain later only changes these two values.
- **Repository layout:** the Vite/React app on `main` is replaced. Kept from history: `public/logo.svg` and the logo path data; the 3D logo scene ported from `prototypes/hero/LogoScene.tsx`. Removed: avatar models and animations, Stitches, react-router, GSAP, react-icons and phosphor (the page uses no icon set; links are text with arrows).

## Page sections (in order)

Anchors are numbered and the header nav lists them: Sobre, Projetos, Stack, Trajetória, Contato (EN: About, Projects, Stack, Path, Contact). The header also holds the PT/EN link and the theme button.

1. **Hero.** H1 "Lucas Grecco." (orange period), lead: PT "Desenvolvedor full stack no Asaas e estudante de Engenharia da Computação na FIAP. Construo produtos web de ponta a ponta, do back-end à interface." EN "Full stack developer at Asaas and Computer Engineering student at FIAP. I build web products end to end, from back-end to interface." The 3D logo on the right (below the text on phones). A bottom rule with "01 — Sobre" and a scroll cue.
2. **01 Sobre / About.** Title PT "Tecnologia com cuidado de produto." EN "Technology with a product mindset." Paragraph PT: "Trabalho com Java, TypeScript e Python, do back-end à interface. Antes do código, passo pelo design e pelas metodologias ágeis, porque me importo com o produto inteiro. Gosto de usar tecnologia de forma criativa para resolver problemas que mudam o dia a dia das pessoas." (EN translation drafted.) Languages line: Inglês profissional · Espanhol básico.
3. **02 Projetos / Projects.** One featured project (topic `featured`, else the most recently pushed) as a large block: cover image when present, name, description, tech list, links "Código ↗" and "Demo ↗" (demo only when present). The others as a numbered list (index, name, one-line description, techs, link). A project without a cover is purely typographic, never a placeholder box.
4. **03 Stack.** Three columns: Programação (Java, JSF, TypeScript, JavaScript, React, Node.js, Python, PHP, C++), Dados (SQL, MongoDB, Pandas, Excel), Design e produto (UX, Figma, Tailwind, CSS, Métodos ágeis). Plain text, no icons, no proficiency bars.
5. **04 Trajetória / Path.** One timeline, newest first:
   - Asaas · Desenvolvedor Full Stack Júnior, time Skywalkers (Notas Fiscais de Produto) · dez 2025 – atual
   - Asaas · Estágio em Engenharia de Software Full Stack, mesmo time · mai – dez 2025
   - FIAP · Engenharia da Computação (bacharelado) · 2024 – 2029
   - NEXT · SmartFinder Challenge, FIAP · 2024 · finalista e pódio, sistema de localização com a John Deere
   - ISI Dublin · Intercâmbio de inglês por mérito acadêmico na Etec · fev – mar 2023
   - Instituto Ismart · Bolsista Ismart Online · 2021 – 2023 · app de saúde mental em equipe
   - Etec Parque Belém · Informática para internet (ensino médio técnico) · 2021 – 2023
   The two Asaas entries are visually grouped to show the move from intern to developer in the same team.
6. **05 Contato / Contact.** Large "Vamos conversar." / "Let's talk." and four links, LinkedIn first: LinkedIn, GitHub, HackerRank, Behance (external, `rel="noopener noreferrer"`, accessible names).
7. **Footer.** "© {year} Lucas Grecco" and the small logo.
8. **404.** Same header and footer, title "Página não encontrada" / "Page not found" and a link home.

All PT copy is drafted by Claude from the owner's profile and confirmed facts; the owner reviews it before merge.

## Hero: the 3D logo

- Geometry: the two paths of `public/logo.svg` parsed with `SVGLoader`, extruded (`depth` 9, bevel thickness 1.4, size 0.9, 8 segments, 32 curve segments), centered, flipped with `rotation-x = π`.
- Material: `meshPhysicalMaterial` color `#FFA737`, metalness 0.55, roughness 0.26, clearcoat 0.8; lit by drei `Environment` with warm `Lightformer`s (no HDR download). A CSS radial glow sits behind the canvas.
- Behaviour: arrival spin to face the viewer (2.2s, ease out), cursor-follow tilt (smoothed), slow float, and a 180° in-plane turn tied to scrolling the first viewport (b becomes q). Theme-aware: on the light theme the glow and environment are softened so the object does not look muddy.
- Loading: the static SVG logo is rendered by Astro in the same place and is visible at first paint; the island (`client:idle`) mounts the canvas and crossfades once the first frame has rendered. The island chunk is the only large JS on the page.
- Fallbacks: `prefers-reduced-motion` (no spin, no float, no scroll turn; still 3D with a fixed pose), `Save-Data` or no WebGL (island never mounts; the SVG stays). An error boundary keeps the SVG if the canvas throws.

## Projects pipeline (build time)

`src/lib/github/` (pure functions unit-tested, network code thin):
- **Selection:** repos of `lucvs07` with topic `portfolio`, plus `extraRepos` in `src/data/projects.config.ts` (starts with `An4lu/DeereGO`, which the owner cannot tag). Forks and archived repos are ignored.
- **Fields:** name (repo name, overridable in config), EN description = About text, PT description = README block between `<!-- portfolio:pt -->` and `<!-- /portfolio:pt -->` (falls back to EN), cover = README image whose alt text is `cover`, else the first README image, else none; relative image paths resolve against `raw.githubusercontent.com/{owner}/{repo}/{default_branch}/`; demo = `homepage`; tech = repository languages plus topics minus `portfolio`/`featured`, normalized by an alias map (JS→JavaScript, Node→Node.js…); featured = topic `featured`; order = featured first, then `pushed_at` descending.
- **Images:** downloaded at build into a cache directory and rendered with `astro:assets` `<Image>` (resized, WebP, width/height set, lazy below the fold). An image that fails to download is dropped, not rendered broken.
- **Auth and failure:** uses `GITHUB_TOKEN` when present (Actions provides it). On any API failure the build reads `src/data/projects.snapshot.json`, the last successful result, which the build rewrites on success and which is committed. If neither exists the build fails with a clear message.
- **Transition:** until the owner tags repos, `projects.config.ts` also lists the six current repos so the section is never empty; the owner removes them from the list as topics are added.

## Visual system

- **Type:** Chillax only (Fontshare, `display=swap`), weights 400/500/600/700. Name `clamp(4.25rem, 13vw, 11rem)` at 700, line-height 0.86; section titles `clamp(2.5rem, 6vw, 4.5rem)`; body 1.1 to 1.2rem at 500; section numbers 0.95rem at 600 in orange.
- **Themes (CSS custom properties on `<html data-theme>`):**
  - Dark (default when the system is dark): background `#161412`, text `#F4EFEA`, muted `#B9B2AB`, rule `#2C2926`, surface `#1E1B18`, accent `#FFA737`.
  - Light: background `#F6F1EB`, text `#1E1D1B`, muted `#5E5750`, rule `#E2D9CF`, surface `#EFE7DE`, accent `#A34E08` for text and links (orange text on light needs a darker tone to reach 4.5:1) and `#FFA737` for the logo and non-text marks.
  - Choice: system preference, overridable with the header button, saved in `localStorage`, applied by an inline script in `<head>` before paint (no flash). Storage errors are ignored.
- **Layout:** max content width about 1280px with generous side padding `clamp(1.25rem, 5vw, 4rem)`; sections separated by thin rules; numbered section labels; no cards, no shadows, no gradients except the hero glow.
- **Motion:** sections and list rows fade and rise slightly when they enter the viewport (IntersectionObserver plus CSS transitions, once). Nothing moves under reduced motion. No GSAP.

## Accessibility and robustness

- Skip link first; semantic landmarks (`header`, `nav`, `main`, `section` with headings, `footer`); one `h1`.
- Visible focus ring in the accent color, contrast checked on both themes.
- Text contrast at least 4.5:1 on both themes (unit test over the token table).
- The 3D canvas is `aria-hidden`; the static SVG logo carries no text alternative (decorative, the name is the h1).
- Long Portuguese strings wrap; no fixed heights on text containers.
- External links say they open in a new tab via accessible name.

## Deploy

- GitHub Actions workflow `.github/workflows/deploy.yml` (created by Claude when the owner approves the write): triggers on push to `main`, a daily schedule and manual dispatch; installs, builds with `GITHUB_TOKEN`, and deploys with `actions/deploy-pages`. Pages source must be set to "GitHub Actions" in the repo settings (owner action).
- The snapshot file changes on build in CI but is not committed by CI; it is refreshed when the owner builds locally and commits.

## Testing and verification

1. Unit tests (`node --test` or Vitest): README cover extraction (alt `cover`, first image, HTML `<img>`, none), PT block extraction, relative URL resolution, tech normalization, ordering, PT/EN key parity, theme contrast table.
2. `astro check`, `astro build`, impeccable detector.
3. Browser: 1440, 1024, 375 and 360px; PT and EN; dark and light; no horizontal scroll; keyboard pass; reduced motion; JavaScript disabled (page complete, SVG logo shown); link preview metadata (title, description, `og:image`).
4. Lighthouse-style check of the built page: initial HTML/CSS without the island under about 60KB gzip; the island chunk reported.

## Owner actions

- Add topics `portfolio` (and `featured` on one repo), fill About (description and website), add a screenshot with `![cover](...)` and an optional `<!-- portfolio:pt -->` block to each project README.
- Approve the workflow file when asked; set Pages source to GitHub Actions.
- Review the Portuguese and English copy.

## Risks

- Repos without covers or About text make the section thin until the owner updates them; mitigated by the config fallback list and a typographic layout that does not depend on images.
- The 3D island is the heaviest asset (three.js); mitigated by `client:idle`, the SVG first paint and the Save-Data/no-WebGL fallbacks.
- GitHub API rate limits locally without a token; mitigated by the committed snapshot.
