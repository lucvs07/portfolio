import { test } from "node:test";
import assert from "node:assert/strict";
import { projectAnchor, projectsUsing } from "../src/lib/stack.ts";

test("projectAnchor is a stable id from the repo name", () => {
  assert.equal(projectAnchor({ repo: "lucvs07/Fiap-Skill-Match" }), "p-fiap-skill-match");
  assert.equal(projectAnchor({ repo: "An4lu/DeereGO" }), "p-deerego");
  assert.equal(projectAnchor({ repo: "lucvs07/deereGO-ESP" }), "p-deerego-esp");
});

test("projectsUsing matches tech names exactly, ignoring case", () => {
  const ps = [{ name: "A", tech: ["React", "Node.js"] }, { name: "B", tech: ["C++", "ESP32"] }, { name: "C", tech: ["JavaScript"] }];
  assert.deepEqual(projectsUsing(ps, "node.js").map((p) => p.name), ["A"]);
  assert.deepEqual(projectsUsing(ps, "C++").map((p) => p.name), ["B"]);
  assert.deepEqual(projectsUsing(ps, "Java").map((p) => p.name), []);
});
