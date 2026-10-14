import { test } from "node:test";
import assert from "node:assert/strict";
import { buildProjects } from "../src/lib/github/build.ts";
import { HttpError } from "../src/lib/github/types.ts";
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
  assert.deepEqual(alpha.covers, ["https://raw.githubusercontent.com/lucvs07/Alpha/main/docs/shot.png"]);
  assert.equal(alpha.demoUrl, "https://alpha.app");
  assert.deepEqual(alpha.tech, ["TypeScript", "CSS", "React"]);
  assert.deepEqual(beta.description, { en: "Beta tool", pt: "Beta tool" });
  assert.deepEqual(beta.covers, []);
  assert.equal(ext.name, "Ext Project");
  assert.deepEqual(ext.description, { en: "Ext EN", pt: "Ext PT" });
  assert.equal(ext.demoUrl, "https://ext.app");
});

test("a transient failure on any repo aborts the run, so a degraded result never replaces the snapshot", async () => {
  const api = fakeApi();
  const flaky: GitHubApi = { ...api, getLanguages: async () => { throw new HttpError(403, "rate limited"); } };
  await assert.rejects(() => buildProjects(flaky, config), /rate limited/);
  const flakyExtra: GitHubApi = { ...api, getRepo: async () => { throw new HttpError(500, "server error"); } };
  await assert.rejects(() => buildProjects(flakyExtra, config), /server error/);
});

test("an extra repo that no longer exists (404) is skipped", async () => {
  const api = fakeApi();
  const gone: GitHubApi = { ...api, getRepo: async () => { throw new HttpError(404, "not found"); } };
  const out = await buildProjects(gone, config);
  assert.deepEqual(out.map((p) => p.repo), ["lucvs07/Alpha", "lucvs07/Beta"]);
});

test("listing failure propagates so the caller can fall back to the snapshot", async () => {
  const api: GitHubApi = { ...fakeApi(), listTopicRepos: async () => { throw new Error("rate limited"); } };
  await assert.rejects(() => buildProjects(api, config), /rate limited/);
});
