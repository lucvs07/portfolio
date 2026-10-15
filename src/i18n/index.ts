import { en } from "./en.ts";
import { pt } from "./pt.ts";
import type { Dict, Lang } from "./types.ts";

export const getDict = (lang: Lang): Dict => (lang === "pt" ? pt : en);

export const fmt = (template: string, vars: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (m, k: string) => (Object.hasOwn(vars, k) ? vars[k] : m));
