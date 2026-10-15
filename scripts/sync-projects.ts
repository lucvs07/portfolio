// Prebuild: busca os projetos no GitHub, salva o snapshot e baixa as capas.
// Se a API falhar, mantém o último snapshot. Sem snapshot, falha o build.
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { buildProjects } from "../src/lib/github/build.ts";
import { createHttpApi } from "../src/lib/github/http.ts";
import { PROJECTS_CONFIG } from "../src/data/projects.config.ts";
import { keepCover } from "../src/lib/github/snapshot.ts";
import type { Project } from "../src/lib/github/types.ts";

const SNAPSHOT = new URL("../src/data/projects.snapshot.json", import.meta.url);
const COVERS = new URL("../src/assets/projects/", import.meta.url);
const EXT: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif" };

const slug = (repo: string) => repo.toLowerCase().replace("/", "--").replace(/[^a-z0-9-]+/g, "-");

// Tenta cada imagem candidata até uma ser um formato que o site otimiza.
async function downloadCover(p: Project): Promise<string | null> {
  for (const url of p.covers) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
      const type = (res.headers.get("content-type") ?? "").split(";")[0];
      const ext = EXT[type];
      if (!res.ok || !ext) continue;
      const file = `${slug(p.repo)}.${ext}`;
      await writeFile(new URL(file, COVERS), Buffer.from(await res.arrayBuffer()));
      return file;
    } catch {
      /* tenta a próxima */
    }
  }
  return null;
}

async function previousCovers(): Promise<Map<string, string | null>> {
  try {
    const old = JSON.parse(await readFile(SNAPSHOT, "utf8")) as { projects: Project[] };
    return new Map(old.projects.map((p) => [p.repo, p.coverFile]));
  } catch {
    return new Map();
  }
}

const exists = (file: string) => access(new URL(file, COVERS)).then(() => true, () => false);

try {
  const projects = await buildProjects(createHttpApi(process.env.GITHUB_TOKEN), PROJECTS_CONFIG);
  await mkdir(COVERS, { recursive: true });
  const before = await previousCovers();
  for (const p of projects) {
    const prev = before.get(p.repo) ?? null;
    p.coverFile = keepCover(await downloadCover(p), prev, prev ? await exists(prev) : false);
  }
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
