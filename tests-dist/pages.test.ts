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
