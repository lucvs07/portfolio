export interface RepoRef {
  owner: string;
  repo: string;
  branch: string;
}

export interface Project {
  repo: string; // "owner/name"
  name: string;
  description: { en: string; pt: string };
  tech: string[];
  repoUrl: string;
  demoUrl: string | null;
  cover: string | null; // URL remota resolvida
  coverFile: string | null; // nome do arquivo em src/assets/projects
  featured: boolean;
  pushedAt: string;
}

export interface RepoInfo {
  fullName: string;
  name: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  topics: string[];
  defaultBranch: string;
  pushedAt: string;
  fork: boolean;
  archived: boolean;
}

export interface GitHubApi {
  listTopicRepos(owner: string, topic: string): Promise<RepoInfo[]>;
  getRepo(fullName: string): Promise<RepoInfo>;
  getLanguages(fullName: string): Promise<string[]>;
  getReadme(fullName: string): Promise<string | null>;
}

export interface ProjectOverride {
  name?: string;
  description?: { en: string; pt: string };
  tech?: string[];
  demo?: string;
  featured?: boolean;
}

export interface ProjectsConfig {
  owner: string;
  topic: string;
  featuredTopic: string;
  extraRepos: string[];
  overrides: Record<string, ProjectOverride>;
}

// Erro de HTTP com o status, para distinguir "não existe" (404) de falhas passageiras.
export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const isNotFound = (err: unknown): boolean => err instanceof HttpError && err.status === 404;
