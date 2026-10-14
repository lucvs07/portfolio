// Prebuild: busca os projetos no GitHub, salva o snapshot e baixa as capas.
// Se a API falhar, mantém o último snapshot. Sem snapshot, falha o build.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { buildProjects } from "../src/lib/github/build.ts";
import { createHttpApi } from "../src/lib/github/http.ts";
import { PROJECTS_CONFIG } from "../src/data/projects.config.ts";
import type { Project } from "../src/lib/github/types.ts";

const SNAPSHOT = new URL("../src/data/projects.snapshot.json", import.meta.url);
const COVERS = new URL("../src/assets/projects/", import.meta.url);
const EXT: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };

const slug = (repo: string) => repo.toLowerCase().replace("/", "--").replace(/[^a-z0-9-]+/g, "-");

async function downloadCover(p: Project): Promise<string | null> {
  if (!p.cover) return null;
  try {
    const res = await fetch(p.cover);
    const type = (res.headers.get("content-type") ?? "").split(";")[0];
    const ext = EXT[type];
    if (!res.ok || !ext) return null;
    const file = `${slug(p.repo)}.${ext}`;
    await writeFile(new URL(file, COVERS), Buffer.from(await res.arrayBuffer()));
    return file;
  } catch {
    return null;
  }
}

try {
  const projects = await buildProjects(createHttpApi(process.env.GITHUB_TOKEN), PROJECTS_CONFIG);
  await mkdir(COVERS, { recursive: true });
  for (const p of projects) p.coverFile = await downloadCover(p);
  await writeFile(SNAPSHOT, JSON.stringify({ generatedAt: new Date().toISOString(), projects }, null, 2) + "\n");
  console.log(`[projects] ${projects.length} projetos, ${projects.filter((p) => p.coverFile).length} com capa`);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  const hasSnapshot = await readFile(SNAPSHOT).then(() => true, () => false);
  if (!hasSnapshot) {
    console.error(`[projects] GitHub indisponível e sem snapshot: ${message}`);
    process.exit(1);
  }
  console.warn(`[projects] GitHub indisponível (${message}); usando o snapshot salvo`);
}
