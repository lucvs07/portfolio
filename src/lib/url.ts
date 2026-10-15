// Junta a base do site (ex.: "/portfolio") a um caminho público, com uma barra só.
export function joinBase(base: string, path: string): string {
  const b = base.replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");
  return `${b}/${p}`;
}

export const withBase = (path: string): string => joinBase(import.meta.env?.BASE_URL ?? "/", path);
