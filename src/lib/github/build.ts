import { normalizeTech, orderProjects } from "./normalize.ts";
import { pickCover, ptBlock, resolveAsset } from "./readme.ts";
import type { GitHubApi, Project, ProjectsConfig, RepoInfo } from "./types.ts";

async function toProject(api: GitHubApi, info: RepoInfo, config: ProjectsConfig): Promise<Project> {
  const o = config.overrides[info.fullName] ?? {};
  const [languages, readme] = await Promise.all([
    api.getLanguages(info.fullName).catch(() => [] as string[]),
    api.getReadme(info.fullName).catch(() => null),
  ]);
  const [owner, repo] = info.fullName.split("/");
  const en = o.description?.en ?? info.description ?? "";
  const pt = o.description?.pt ?? (readme ? ptBlock(readme) : null) ?? en;
  const coverSrc = readme ? pickCover(readme) : null;
  return {
    repo: info.fullName,
    name: o.name ?? info.name,
    description: { en, pt },
    tech: o.tech ?? normalizeTech([...languages, ...info.topics], [config.topic, config.featuredTopic]),
    repoUrl: info.htmlUrl,
    demoUrl: o.demo ?? (info.homepage || null),
    cover: coverSrc ? resolveAsset(coverSrc, { owner, repo, branch: info.defaultBranch }) : null,
    coverFile: null,
    featured: o.featured ?? info.topics.includes(config.featuredTopic),
    pushedAt: info.pushedAt,
  };
}

export async function buildProjects(api: GitHubApi, config: ProjectsConfig): Promise<Project[]> {
  const tagged = await api.listTopicRepos(config.owner, config.topic);
  const names = new Set(tagged.map((r) => r.fullName));
  const extras = await Promise.all(
    config.extraRepos.filter((n) => !names.has(n)).map((n) => api.getRepo(n).catch(() => null))
  );
  const infos = [...tagged, ...extras.filter((r): r is RepoInfo => r !== null)].filter((r) => !r.fork && !r.archived);
  const projects = await Promise.all(infos.map((info) => toProject(api, info, config)));
  return orderProjects(projects);
}
