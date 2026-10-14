import { HttpError, isNotFound, type GitHubApi, type RepoInfo } from "./types.ts";

interface RawRepo {
  full_name: string; name: string; description: string | null; html_url: string; homepage: string | null;
  topics?: string[]; default_branch: string; pushed_at: string; fork: boolean; archived: boolean;
}

const toInfo = (r: RawRepo): RepoInfo => ({
  fullName: r.full_name, name: r.name, description: r.description, htmlUrl: r.html_url, homepage: r.homepage,
  topics: r.topics ?? [], defaultBranch: r.default_branch, pushedAt: r.pushed_at, fork: r.fork, archived: r.archived,
});

export function createHttpApi(token?: string): GitHubApi {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-build" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const get = async <T>(path: string, accept?: string): Promise<T> => {
    const res = await fetch(`https://api.github.com${path}`, { headers: accept ? { ...headers, Accept: accept } : headers });
    if (!res.ok) throw new HttpError(res.status, `GET ${path} -> ${res.status}`);
    return (accept?.includes("raw") ? await res.text() : await res.json()) as T;
  };
  return {
    listTopicRepos: async (owner, topic) =>
      (await get<{ items: RawRepo[] }>(`/search/repositories?q=${encodeURIComponent(`user:${owner} topic:${topic}`)}&per_page=100`)).items.map(toInfo),
    getRepo: async (n) => toInfo(await get<RawRepo>(`/repos/${n}`)),
    getLanguages: async (n) => Object.keys(await get<Record<string, number>>(`/repos/${n}/languages`)),
    getReadme: async (n) =>
      get<string>(`/repos/${n}/readme`, "application/vnd.github.raw+json").catch((err: unknown) => {
        if (isNotFound(err)) return null; // repo sem README
        throw err;
      }),
  };
}
