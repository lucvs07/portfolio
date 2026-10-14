---
name: Lucas Grecco
description: A dark, editorial one-page portfolio set in large Chillax, with marigold orange used only for marks and one authored object, the logo in 3D.
colors:
  ink-ground: "#161412"
  bone-text: "#F4EFEA"
  ash-muted: "#B9B2AB"
  ember-rule: "#2C2926"
  marigold: "#FFA737"
  paper-ground: "#F6F1EB"
  soot-text: "#1E1D1B"
  clay-muted: "#5E5750"
  sand-rule: "#E2D9CF"
  burnt-orange-text: "#A34E08"
typography:
  display:
    fontFamily: "Chillax, system-ui, sans-serif"
    fontSize: "clamp(4.25rem, 13vw, 11rem)"
    fontWeight: 700
    lineHeight: 0.86
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Chillax, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1
  title:
    fontFamily: "Chillax, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2rem)"
    fontWeight: 600
    lineHeight: 1
  lead:
    fontFamily: "Chillax, system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 1.8vw, 1.4rem)"
    fontWeight: 500
    lineHeight: 1.6
  body:
    fontFamily: "Chillax, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 500
    lineHeight: 1.55
  label:
    fontFamily: "Chillax, system-ui, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 600
    lineHeight: 1.55
rounded:
  focus: "2px"
  cover: "0.75rem"
  pill: "999px"
spacing:
  gutter: "clamp(1.25rem, 5vw, 4rem)"
  section: "clamp(4rem, 10vw, 8rem)"
  block: "3rem"
  row: "1.5rem"
  container: "80rem"
components:
  link:
    textColor: "{colors.marigold}"
    typography: "{typography.body}"
  link-light:
    textColor: "{colors.burnt-orange-text}"
  chip:
    textColor: "{colors.ash-muted}"
    rounded: "{rounded.pill}"
    padding: "0.2rem 0.7rem"
  lang-pill:
    textColor: "{colors.bone-text}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.4rem 0.6rem"
  theme-toggle:
    rounded: "{rounded.pill}"
    size: "2.25rem"
  header-bar:
    backgroundColor: "{colors.ink-ground}"
    height: "4rem"
  project-cover:
    rounded: "{rounded.cover}"
    width: "100%"
---

# Design System: Lucas Grecco

## Overview

**Creative North Star: "The Lit Signature"**

A warm near-black page, set like a magazine spread. Very large Chillax type carries the voice. Generous space and 1px rules stand in for every container, and one lit object, the owner's logo extruded in glossy orange, turns to face the visitor. The interface steps back so the name, the work and the symbol lead. Orange is a signature, not a fill: it marks the period after the name, the hero index numeral, the links and the logo, and nothing else.

Density is low and the rhythm editorial. Sections stack full width inside one 80rem column and are divided only by hairline rules. Lists replace grids of boxes: projects are numbered rows, the path is one timeline, the stack is three plain columns of words. Light theme is the same page printed on warm paper. Every role keeps its job, and orange text darkens to stay legible.

The system is flat. Depth exists in exactly one place, the 3D logo over its soft orange glow, so the object reads as the only thing with a body.

**Key Characteristics:**
- Warm neutrals with a slight orange cast (hue around 68 in OKLCH) in both themes; no cool greys.
- One family, Chillax, at 500 for reading, 600 for labels and links, 700 for headings.
- Display type up to 11rem with tight 0.86 leading; headings balance-wrapped.
- 1px rules separate sections, rows and the header; no cards, no shadows.
- Pills (999px, 1px rule border) are the only bordered controls.
- Drawn SVG strokes for arrows and markers; no icon set, no glyph icons.
- Motion is a one-time soft rise on entry, and the logo's turn; all of it yields to reduced motion.

## Colors

Warm, low-chroma neutrals with a single marigold accent. Light theme maps each dark role to a paper counterpart rather than inverting.

### Primary
- **Marigold** (marigold): the brand orange of the logo. In both themes it is the color of marks: the period after the name and after the contact headline, the filled timeline dots, the footer and hero logos, the hero glow, text selection and the skip link background. On the dark ground it is also the text-orange (9.5:1) used by links and the hero index numeral.
- **Burnt Orange Text** (burnt-orange-text): light theme only. Takes over every orange *text* role (links, the hero index numeral, the focus ring) on paper, where marigold would fall to about 1.7:1.

### Neutral
- **Ink Ground** (ink-ground): dark page background, also the 92% base of the sticky header.
- **Bone Text** (bone-text): dark-theme primary text and headings.
- **Ash Muted** (ash-muted): dark-theme secondary text: the hero lead, nav links at rest, periods, notes, chips, stack group titles (8.8:1 on ink).
- **Ember Rule** (ember-rule): dark-theme hairlines: section tops, header and footer borders, row dividers, timeline spine, pill borders.
- **Paper Ground** (paper-ground): light page background.
- **Soot Text** (soot-text): light-theme primary text; also the fixed text color on marigold fills (selection, skip link) in both themes.
- **Clay Muted** (clay-muted): light-theme secondary text (6.3:1 on paper).
- **Sand Rule** (sand-rule): light-theme hairlines.

Tokens are applied as CSS custom properties (`--bg`, `--text`, `--muted`, `--rule`, `--accent`, `--accent-text`) generated from `src/lib/theme.ts` and switched by `data-theme` on the root element.

### Named Rules
**The Mark and Ink Rule.** Orange has two tokens and they never trade jobs: `--accent` paints marks (the terminal period of a display headline, timeline dots, the logo, the glow, fills under dark text); `--accent-text` paints every orange word, numeral, underline and focus ring. A display headline's terminal period is the one glyph treated as a mark: it is brand punctuation at display scale, never reading text, so it keeps marigold on paper too.

**The Signature Only Rule.** Orange appears only as display punctuation, the hero index numeral, links and the logo. It never fills a section, a button body or a background panel.

## Typography

**Display Font:** Chillax (with system-ui, sans-serif)
**Body Font:** Chillax (with system-ui, sans-serif)

**Character:** One rounded, slightly quirky geometric sans does everything. Hierarchy comes from scale and weight jumps, not from a second family.

### Hierarchy
- **Display** (700, clamp(4.25rem, 13vw, 11rem), 0.86): the two-line name in the hero, with a marigold period. The contact headline uses the same voice one step down (clamp(3.5rem, 10vw, 8rem), 0.9), as does the featured project name (clamp(2.5rem, 6vw, 5rem), -0.01em).
- **Headline** (700, clamp(2.5rem, 6vw, 4.5rem), 1): section titles, capped at 16ch and balance-wrapped.
- **Title** (600, clamp(1.5rem, 2.4vw, 2rem), 1): project names in the list; timeline organizations use 600 at 1.3rem.
- **Lead** (500, clamp(1.15rem, 1.8vw, 1.4rem), 1.6): the about paragraph (max 42rem) and the hero lead (clamp(1.1rem, 1.6vw, 1.35rem), 1.45, max 30rem, muted with the role in 600 bone/soot).
- **Body** (500, 1.1rem, 1.55): default text; paragraphs use pretty wrapping.
- **Label** (600, 0.95rem): links, the brand name, the language pill and the hero index numeral; nav and periods use the same size at 500, numbers in tabular figures.

### Named Rules
**The Medium Floor Rule.** Nothing on the page is set lighter than 500. Weight 400 is loaded but unused; reading text sits at 500 on both grounds.

**The Scale Not Style Rule.** Hierarchy is built from size and weight only: no italics, no uppercase tracking, no second typeface.

## Layout

One centered column, max 80rem, with fluid side padding (clamp(1.25rem, 5vw, 4rem)). Sections are full-width bands with fluid vertical padding (clamp(4rem, 10vw, 8rem)) and a 1px rule on top. Sections are numbered in order (01 to 05), and the header nav lists them. Content blocks start 3rem below the section title; list rows breathe at 1.5rem block padding with a rule beneath.

The hero fills the first viewport (100svh minus the 4rem header): name and lead on the left, the logo stage on the right (1.1fr / 1fr from 900px), the stage dropping below the text on phones (min 40svh). A bottom rule spans the hero with a link to section 01 and a drawn down-arrow scroll cue.

Breakpoints are content-driven at 700px (stack becomes three columns) and 900px (hero and featured project split into two columns, project rows gain a right-hand link column, timeline gains an 11rem period column, header nav moves inline). Below 900px the header nav becomes a second row that scrolls horizontally with hidden scrollbar.

Anchors account for the sticky header (scroll padding 7rem); smooth scrolling is disabled under reduced motion.

## Elevation & Depth

Flat. No box-shadows anywhere; separation is done with hairline rules and space. The only depth on the page is the hero: a radial marigold glow (26% accent mixed into transparent, fading by 70%; at 0.55 opacity in light theme) behind the 3D logo, which is lit by warm studio light (glossy physical material, clearcoat, metalness 0.55). The sticky header stays flat: the ground at 92% opacity with a bottom rule, no blur.

### Named Rules
**The One Body Rule.** Only the logo has volume. Every other surface is flat paper divided by 1px lines; no shadows, no raised cards, no soft or decorative gradients beyond the hero glow.

## Shapes

Square by default: sections, rows, the header and the featured project are open bands defined by rules, not boxes. Rounding is reserved for three things: pills (999px) for small controls and tags, gently rounded project covers (0.75rem), and a 2px corner on the focus outline. Circles appear as the timeline dots (0.6rem) and the theme toggle's half-filled disc. Arrows are drawn as rounded SVG strokes (1.75 stroke, 0.8em), rotated for direction.

## Components

### Links
Text with an underline, always.
- **Style:** label weight (600) in orange text (`--accent-text`), 1px underline offset 0.25em, followed by a drawn arrow when the link leaves the page (up-right) or moves down it.
- **Hover:** underline thickens to 2px.
- **Focus:** 2px orange-text outline, 4px offset, 2px radius (global for all focusable elements).

### Chips
- **Style:** tech tags as 999px pills with a 1px rule border, muted 0.9rem text, 0.2rem 0.7rem padding, 0.4rem gaps. Non-interactive.

### Pills (language switch, theme toggle)
- **Language switch:** label-weight text in a 1px rule-bordered pill (0.4rem 0.6rem); border lifts to muted on hover.
- **Theme toggle:** 2.25rem circular pill, transparent, holding a 0.9rem disc half-filled with the text color (a hard-stop fill drawing a half-moon). Border lifts to muted on hover.

### Navigation
- Sticky 4rem bar, ground at 92% opacity with a bottom rule. Brand name in 600 at left; section links in muted 0.95rem that turn to full text color on hover; language pill and theme toggle at right. On phones the section links wrap to a horizontally scrolling second row.

### Project list
- **Featured project:** an open band between two rules: display-scale name, description (max 36rem), chips, code and demo links, with the cover (0.75rem radius) at right from 900px. A project without a cover stays typographic; no placeholder box.
- **Rows:** numbered list rows (muted tabular index, title-scale name, muted one-line description, chips, links), each closed by a rule.

### Timeline
- A 1px rule spine on the left; each entry hangs off a 0.6rem marigold dot. Consecutive entries in the same group sit closer (1rem) and the following entry's dot turns hollow (ground fill, 1.5px marigold ring) to read as one continued stay.

### Hero logo (signature)
- The owner's ambigram logo, flat SVG in marigold first, cross-fading to the 3D render (flat out over 0.6s, canvas in over 0.8s) once it is ready. It spins in to face the visitor, follows the pointer slightly, floats gently, and flips 180 degrees across the first viewport of scroll so `b` becomes `q`. Reduced motion holds a fixed pose; no WebGL or Save-Data keeps the flat SVG. Always decorative (`aria-hidden`); the name is the h1.

### Motion (GSAP, `src/components/Motion.astro`)
- **Focal moment:** the hero name rises out of per-line masks, the orange period lands last, the lead un-blurs, and the bottom rule draws left to right, timed with the 3D logo's spin-in.
- **Editorial rules:** each section's top rule draws in (`--rule-x` 0→1), the section number types itself, and the title rises line by line. Project rows draw their bottom rule the same way.
- **Per section:** About lights up word by word with scroll (scrub); the featured cover opens through a clip-path mask with slight drift; Stack lists cascade column by column; the Path line grows with scroll and each dot pops as it is reached; the Contact title rises letter by letter and its period lands like the hero's; the footer logo turns 180° back from q to b.
- **Feedback:** an orange reading-progress bar under the header, the active section underlined in the nav, arrows nudge on link hover, project rows shift on hover, and the theme dot turns 180° on toggle.
- **Ease:** `expo.out` for arrivals, `power3.inOut` for drawn lines, `back.out` only for the two landing periods and the timeline dots.
- **Safety:** content is visible by default. `<html class="motion">` (set only when motion is allowed) hides the hero until the script runs; a 3 s fallback removes it if the script never arrives. With reduced motion nothing moves; the progress bar and the active section still update.

## Do's and Don'ts

### Do:
- **Do** route orange through the two tokens: `--accent` for marks and fills under dark text, `--accent-text` for any orange text, underline or focus ring.
- **Do** separate sections, rows and bars with 1px `--rule` lines and space instead of containers.
- **Do** set headings in Chillax 700 and reading text at 500; let size carry hierarchy.
- **Do** draw arrows and markers as inline SVG strokes in `currentColor`; Chillax has no arrow glyphs.
- **Do** use 999px pills with a 1px rule border for small controls and tags.
- **Do** gate every motion behind `prefers-reduced-motion` and keep content visible without JavaScript.
- **Do** keep a project without imagery purely typographic.

### Don't:
- **Don't** add box-shadows, raised cards or bordered panels; the logo is the only object with depth.
- **Don't** use soft or decorative gradients beyond the hero glow.
- **Don't** use marigold (`--accent`) for words, numerals or underlines on the light paper ground; only a display headline's terminal period keeps it.
- **Don't** fill sections, buttons or backgrounds with orange.
- **Don't** use an icon set, icon fonts or text glyph icons.
- **Don't** introduce a second typeface or set text lighter than 500.
- **Don't** use cool greys; neutrals keep the warm cast of the tokens.
