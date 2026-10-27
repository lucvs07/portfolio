import type { Dict } from "./types.ts";

const LINKS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/lucasrgrecco/" },
  { name: "GitHub", href: "https://github.com/lucvs07" },
  { name: "HackerRank", href: "https://www.hackerrank.com/profile/lucas_rgrecco" },
  { name: "Behance", href: "https://www.behance.net/lucasgrecco1" },
];

export const en: Dict = {
  meta: {
    title: "Lucas Grecco · Full stack developer",
    description: "Portfolio of Lucas Grecco, full stack developer at Asaas and Computer Engineering student at FIAP.",
  },
  nav: {
    skip: "Skip to content", label: "Sections", about: "About", projects: "Projects", stack: "Stack", path: "Path", contact: "Contact",
    switchLang: "PT", switchLangLabel: "Ler em português", toDark: "Switch to dark theme", toLight: "Switch to light theme", home: "Lucas Grecco, home",
  },
  hero: {
    role: "Full stack developer at Asaas",
    rest: "and Computer Engineering student at FIAP. I build web products end to end, from back-end to interface.",
    scroll: "Scroll",
  },
  about: {
    title: "Technology with a product mindset.",
    body: "I work with Java, TypeScript and Python, from back-end to interface. Before the code, I go through design and agile methods, because I care about the whole product. I like using technology creatively to solve problems that change people's everyday lives.",
    languages: "English, professional working · Spanish, elementary",
  },
  projects: {
    title: "Selected work",
    code: "Code", demo: "Demo",
    codeLabel: "{name} source code on GitHub (opens in a new tab)", demoLabel: "{name} live demo (opens in a new tab)",
    techs: "Technologies",
    empty: "Projects are being updated. See everything on GitHub.",
  },
  stack: {
    title: "Tools I use",
    label: "Technologies",
    usedIn: "Used in",
    hint: "Scroll the page, use the arrow keys or click a word.",
    groups: [
      { title: "Programming", items: ["Java", "JSF", "TypeScript", "JavaScript", "React", "Node.js", "Python", "PHP", "C++"] },
      { title: "Data", items: ["SQL", "MongoDB", "Pandas", "Excel"] },
      { title: "Design and product", items: ["UX", "Figma", "Tailwind", "CSS", "Agile methods"] },
    ],
  },
  path: {
    title: "Education, experience and awards",
    items: [
      {
        org: "Asaas", role: "Skywalkers team (product invoices)", period: "May 2025 – present",
        steps: [
          { period: "May – Dec 2025", title: "Full Stack Software Engineering intern" },
          { period: "Dec 2025 – present", title: "Full Stack Developer (Junior)", full: true },
        ],
      },
      {
        org: "FIAP", role: "Computer Engineering (bachelor's degree)", period: "2024 – 2029",
        steps: [
          { period: "2024", title: "NEXT SmartFinder Challenge", partner: "John Deere", result: "Finalist and podium", full: true },
          { period: "2025", title: "Microsoft VisionBox Challenge", partner: "Aché", result: "Finalist" },
          { period: "2026", title: "Industrial Safety Vision Challenge", partner: "SPI and Metaindústria", result: "Finalist and podium", full: true },
        ],
        legend: "Filled dot: podium. Hollow: finalist.",
      },
      { org: "ISI Dublin", role: "English exchange awarded for academic merit at Etec", period: "Feb – Mar 2023" },
      { org: "Instituto Ismart", role: "Ismart Online scholar", period: "2021 – 2023", note: "Programming, math and a mental health app built as a team." },
      { org: "Etec Parque Belém", role: "Informatics for the internet (technical high school)", period: "2021 – 2023" },
    ],
  },
  contact: { title: "Let's talk.", opens: "opens in a new tab", links: LINKS },
  footer: { rights: "All rights reserved." },
  notFound: { title: "Page not found", text: "That address doesn't exist here.", home: "Back to home" },
};
