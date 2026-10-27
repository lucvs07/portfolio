import type { Project } from "./github/types";

// Âncora da linha do projeto na seção de projetos; a roda da stack aponta para ela.
export const projectAnchor = (p: Pick<Project, "repo">): string =>
  `p-${(p.repo.split("/").pop() ?? p.repo).toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`;

// Projetos que usam a tecnologia, pelas linguagens e tópicos vindos do GitHub. Sem projeto, lista vazia.
export function projectsUsing<P extends Pick<Project, "tech">>(projects: P[], tech: string): P[] {
  const t = tech.toLowerCase();
  return projects.filter((p) => p.tech.some((x) => x.toLowerCase() === t));
}
