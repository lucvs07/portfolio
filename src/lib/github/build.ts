import { normalizeTech, orderProjects } from "./normalize.ts";
import { coverCandidates, ptBlock } from "./readme.ts";
import { isNotFound, type GitHubApi, type Project, type ProjectsConfig, type RepoInfo } from "./types.ts";

async function toProject(api: GitHubApi, info: RepoInfo, config: ProjectsConfig): Promise<Project> {
  const o = config.overrides[info.fullName] ?? {};
  // Falhas aqui (limite da API, erro 5xx) derrubam a execução inteira: melhor manter
  // o snapshot anterior do que publicar projetos sem descrição ou tecnologias.
  const [languages, readme] = await Promise.all([api.getLanguages(info.fullName), api.getReadme(info.fullName)]);
  const [owner, repo] = info.fullName.split("/");
  const en = o.description?.en ?? info.description ?? "";
  const pt = o.description?.pt ?? (readme ? ptBlock(readme) : null) ?? en;
  return {
    repo: info.fullName,
    name: o.name ?? info.name,
    description: { en, pt },
    tech: o.tech ?? normalizeTech([...languages, ...info.topics], [config.topic, config.featuredTopic]),
    repoUrl: info.htmlUrl,
    demoUrl: o.demo ?? (info.homepage || null),
    covers: readme ? coverCandidates(readme, { owner, repo, branch: info.defaultBranch }) : [],
    coverFile: null,
    featured: o.featured ?? info.topics.includes(config.featuredTopic),
    pushedAt: info.pushedAt,
  };
}

export async function buildProjects(api: GitHubApi, config: ProjectsConfig): Promise<Project[]> {
  const tagged = await api.listTopicRepos(config.owner, config.topic);
  const names = new Set(tagged.map((r) => r.fullName));
  const extras = await Promise.all(
    config.extraRepos.filter((n) => !names.has(n)).map((n) =>
      api.getRepo(n).catch((err: unknown) => {
        if (isNotFound(err)) return null; // repo apagado ou privado: some da lista
        throw err;
      })
    )
  );
  const infos = [...tagged, ...extras.filter((r): r is RepoInfo => r !== null)].filter((r) => !r.fork && !r.archived);
  const projects = await Promise.all(infos.map((info) => toProject(api, info, config)));
  return orderProjects(projects);
}
