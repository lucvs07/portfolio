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
