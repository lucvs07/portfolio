import type { Lang } from "../i18n/types.ts";

export const SECTION_IDS: Record<Lang, { about: string; projects: string; stack: string; path: string; contact: string }> = {
  pt: { about: "sobre", projects: "projetos", stack: "stack", path: "trajetoria", contact: "contato" },
  en: { about: "about", projects: "projects", stack: "stack", path: "path", contact: "contact" },
};
