import type { RepoRef } from "./types.ts";

export interface ImageRef {
  alt: string;
  src: string;
}

const MD_IMG = /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
const HTML_IMG = /<img\b[^>]*>/gi;
const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i"))?.[1] ?? "";

export function readmeImages(md: string): ImageRef[] {
  const found: { at: number; img: ImageRef }[] = [];
  for (const m of md.matchAll(MD_IMG)) found.push({ at: m.index ?? 0, img: { alt: m[1].trim(), src: m[2] } });
  for (const m of md.matchAll(HTML_IMG)) {
    const src = attr(m[0], "src");
    if (src) found.push({ at: m.index ?? 0, img: { alt: attr(m[0], "alt").trim(), src } });
  }
  return found.sort((a, b) => a.at - b.at).map((f) => f.img);
}

const isBadge = (src: string) =>
  /shields\.io|badgen\.net|\/badge\.svg(\?|$)|\/workflows\/.*badge|travis-ci\.(com|org)|circleci\.com|codecov\.io|vercel\.com\/button|netlify\.com\/img|skillicons\.dev|github-readme-stats|readme-typing-svg/i.test(src);

// Blocos de código cercados (```) costumam ter exemplos, não prints do projeto.
const withoutCodeFences = (md: string) => md.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, "");

export function pickCover(md: string): string | null {
  const images = readmeImages(withoutCodeFences(md)).filter((i) => !isBadge(i.src) && !i.src.startsWith("data:"));
  return (images.find((i) => i.alt.toLowerCase() === "cover") ?? images[0])?.src ?? null;
}

// Todas as imagens que podem servir de capa, já resolvidas, na ordem de preferência
// (a de alt "cover" primeiro). O sync tenta uma por uma até um download dar certo.
export function coverCandidates(md: string, ref: RepoRef): string[] {
  const images = readmeImages(withoutCodeFences(md)).filter((i) => !isBadge(i.src));
  const ordered = [...images.filter((i) => i.alt.toLowerCase() === "cover"), ...images.filter((i) => i.alt.toLowerCase() !== "cover")];
  const urls = ordered.map((i) => resolveAsset(i.src, ref)).filter((u): u is string => u !== null);
  return [...new Set(urls)];
}

export function ptBlock(md: string): string | null {
  const m = md.match(/<!--\s*portfolio:pt\s*-->([\s\S]*?)<!--\s*\/portfolio:pt\s*-->/i);
  if (!m) return null;
  const text = m[1]
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]+/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text || null;
}

export function resolveAsset(src: string, ref: RepoRef): string | null {
  const raw = `https://raw.githubusercontent.com/${ref.owner}/${ref.repo}/${ref.branch}/`;
  if (src.startsWith("data:")) return null;
  if (src.startsWith("//")) return `https:${src}`;
  const gh = src.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:blob|raw)\/([^/]+)\/(.+)$/);
  if (gh) return `https://raw.githubusercontent.com/${gh[1]}/${gh[2]}/${gh[3]}/${gh[4]}`;
  if (/^https?:\/\//.test(src)) return src;
  return raw + src.replace(/^\.?\//, "").replace(/^\/+/, "");
}
