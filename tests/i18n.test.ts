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
