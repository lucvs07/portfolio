export type Lang = "pt" | "en";

export interface PathItem {
  org: string;
  role: string;
  period: string;
  note?: string;
  group?: string; // entradas com o mesmo group aparecem juntas
}

export interface Dict {
  meta: { title: string; description: string };
  nav: {
    skip: string; label: string; about: string; projects: string; stack: string; path: string; contact: string;
    switchLang: string; switchLangLabel: string; toDark: string; toLight: string; home: string;
  };
  hero: { role: string; rest: string; scroll: string };
  about: { title: string; body: string; languages: string };
  projects: { title: string; code: string; demo: string; codeLabel: string; demoLabel: string; techs: string; empty: string };
  stack: { title: string; groups: { title: string; items: string[] }[] };
  path: { title: string; items: PathItem[] };
  contact: { title: string; opens: string; links: { name: string; href: string }[] };
  footer: { rights: string };
  notFound: { title: string; text: string; home: string };
}
