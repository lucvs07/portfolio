import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeTech, orderProjects, pickFeatured } from "../src/lib/github/normalize.ts";
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

test("normalizeTech drops build and scripting noise reported by GitHub languages", () => {
  assert.deepEqual(normalizeTech(["TypeScript", "Dockerfile", "Shell", "Makefile", "Batchfile", "Procfile", "CSS"]), ["TypeScript", "CSS"]);
});

test("pickFeatured prefers a featured project with cover and description, then any with description", () => {
  const mk = (repo: string, featured: boolean, en: string, coverFile: string | null): Project => ({
    ...p(repo, featured, "2025-01-01"), description: { en, pt: en }, coverFile,
  });
  const empty = mk("empty", true, "", null);
  const textOnly = mk("text", true, "Has text", null);
  const full = mk("full", true, "Has text", "full.png");
  assert.equal(pickFeatured([empty, textOnly, full], "pt")?.repo, "full");
  assert.equal(pickFeatured([empty, textOnly], "pt")?.repo, "text");
  assert.equal(pickFeatured([empty], "pt")?.repo, "empty");
  assert.equal(pickFeatured([], "pt"), undefined);
  assert.equal(pickFeatured([mk("plain", false, "x", "c.png"), empty], "pt")?.repo, "plain");
});
