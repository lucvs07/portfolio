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

test("each language has the five sections with localized anchors", () => {
  for (const id of ["sobre", "projetos", "stack", "trajetoria", "contato"]) assert.match(page("index.html"), new RegExp(`id="${id}"`));
  for (const id of ["about", "projects", "stack", "path", "contact"]) assert.match(page("en/index.html"), new RegExp(`id="${id}"`));
});

test("language switch links to the other locale and hreflang alternates exist", () => {
  assert.match(page("index.html"), /href="\/portfolio\/en\/?"[^>]*lang="en"/);
  assert.match(page("en/index.html"), /href="\/portfolio\/?"[^>]*lang="pt-BR"/);
  for (const p of ["index.html", "en/index.html"]) {
    assert.match(page(p), /<link rel="alternate" hreflang="pt-BR" href="https:\/\/lucvs07\.github\.io\/portfolio\/?"/);
    assert.match(page(p), /<link rel="alternate" hreflang="en" href="https:\/\/lucvs07\.github\.io\/portfolio\/en\/?"/);
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
  assert.match(page("404.html"), /href="\/portfolio\/?"/);
});

test("the hero ships the flat logo in the HTML for first paint and no-JS", () => {
  for (const p of ["index.html", "en/index.html"]) {
    assert.match(page(p), /data-logo-static/);
    assert.match(page(p), /<astro-island[^>]*client="idle"/);
  }
});

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

test("on the 404 page the section links go back to the home page", () => {
  assert.match(page("404.html"), /href="\/portfolio\/?#projetos"/);
  assert.doesNotMatch(page("404.html"), /href="#projetos"/);
});

test("the language switch's accessible name contains its visible text (WCAG 2.5.3)", () => {
  assert.match(page("index.html"), /aria-label="EN[^"]*"[^>]*>EN</);
  assert.match(page("en/index.html"), /aria-label="PT[^"]*"[^>]*>PT</);
});
