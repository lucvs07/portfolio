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
