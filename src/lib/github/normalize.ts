import type { Project } from "./types.ts";

const ALIASES: Record<string, string> = {
  js: "JavaScript", javascript: "JavaScript", ts: "TypeScript", typescript: "TypeScript",
  react: "React", reactjs: "React", node: "Node.js", nodejs: "Node.js", "node.js": "Node.js",
  esp32: "ESP32", cpp: "C++", "c++": "C++", mongodb: "MongoDB", php: "PHP", html: "HTML", css: "CSS",
  python: "Python", java: "Java", sql: "SQL", jsf: "JSF", figma: "Figma", tailwind: "Tailwind", tailwindcss: "Tailwind",
};

const label = (raw: string) => {
  const key = raw.toLowerCase();
  if (ALIASES[key]) return ALIASES[key];
  if (/[A-Z]/.test(raw)) return raw; // já veio com a grafia da linguagem (API de languages)
  const words = raw.replace(/[-_]+/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};

// Linguagens que o GitHub reporta mas não dizem nada sobre a stack do projeto.
const NOISE = new Set(["dockerfile", "shell", "makefile", "batchfile", "procfile", "powershell", "cmake"]);

export function normalizeTech(names: string[], ignore: string[] = ["portfolio", "featured"]): string[] {
  const out: string[] = [];
  for (const n of names) {
    if (ignore.includes(n.toLowerCase()) || NOISE.has(n.toLowerCase())) continue;
    const l = label(n);
    if (!out.includes(l)) out.push(l);
  }
  return out;
}

export function orderProjects(list: Project[]): Project[] {
  return [...list].sort((a, b) => Number(b.featured) - Number(a.featured) || b.pushedAt.localeCompare(a.pushedAt));
}
