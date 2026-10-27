import type { Dict } from "./types.ts";

const LINKS = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/lucasrgrecco/" },
  { name: "GitHub", href: "https://github.com/lucvs07" },
  { name: "HackerRank", href: "https://www.hackerrank.com/profile/lucas_rgrecco" },
  { name: "Behance", href: "https://www.behance.net/lucasgrecco1" },
];

export const pt: Dict = {
  meta: {
    title: "Lucas Grecco · Desenvolvedor full stack",
    description: "Portfólio de Lucas Grecco, desenvolvedor full stack no Asaas e estudante de Engenharia da Computação na FIAP.",
  },
  nav: {
    skip: "Ir para o conteúdo", label: "Seções", about: "Sobre", projects: "Projetos", stack: "Stack", path: "Trajetória", contact: "Contato",
    switchLang: "EN", switchLangLabel: "Read in English", toDark: "Mudar para o tema escuro", toLight: "Mudar para o tema claro", home: "Lucas Grecco, início",
  },
  hero: {
    role: "Desenvolvedor full stack no Asaas",
    rest: "e estudante de Engenharia da Computação na FIAP. Construo produtos web de ponta a ponta, do back-end à interface.",
    scroll: "Role",
  },
  about: {
    title: "Tecnologia com cuidado de produto.",
    body: "Trabalho com Java, TypeScript e Python, do back-end à interface. Antes do código, passo pelo design e pelas metodologias ágeis, porque me importo com o produto inteiro. Gosto de usar tecnologia de forma criativa para resolver problemas que mudam o dia a dia das pessoas.",
    languages: "Inglês profissional · Espanhol básico",
  },
  projects: {
    title: "Trabalhos selecionados",
    code: "Código", demo: "Demo",
    codeLabel: "Código de {name} no GitHub (abre em nova aba)", demoLabel: "Demo de {name} (abre em nova aba)",
    techs: "Tecnologias",
    empty: "Os projetos estão sendo atualizados. Veja todos no GitHub.",
  },
  stack: {
    title: "Ferramentas que uso",
    label: "Tecnologias",
    usedIn: "Aparece em",
    hint: "Role a página, use as setas ou clique numa palavra.",
    groups: [
      { title: "Programação", items: ["Java", "JSF", "TypeScript", "JavaScript", "React", "Node.js", "Python", "PHP", "C++"] },
      { title: "Dados", items: ["SQL", "MongoDB", "Pandas", "Excel"] },
      { title: "Design e produto", items: ["UX", "Figma", "Tailwind", "CSS", "Métodos ágeis"] },
    ],
  },
  path: {
    title: "Formação, experiência e prêmios",
    items: [
      {
        org: "Asaas", role: "Time Skywalkers (Notas Fiscais de Produto)", period: "mai 2025 – atual",
        steps: [
          { period: "mai – dez 2025", title: "Estágio em Engenharia de Software Full Stack" },
          { period: "dez 2025 – atual", title: "Desenvolvedor Full Stack Júnior", full: true },
        ],
      },
      {
        org: "FIAP", role: "Engenharia da Computação (bacharelado)", period: "2024 – 2029",
        steps: [
          { period: "2024", title: "NEXT SmartFinder Challenge", partner: "John Deere", result: "Finalista e pódio", full: true },
          { period: "2025", title: "Microsoft VisionBox Challenge", partner: "Aché", result: "Finalista" },
          { period: "2026", title: "Industrial Safety Vision Challenge", partner: "SPI e Metaindústria", result: "Finalista e pódio", full: true },
        ],
        legend: "Ponto cheio: pódio. Vazado: finalista.",
      },
      { org: "ISI Dublin", role: "Intercâmbio de inglês por mérito acadêmico na Etec", period: "fev – mar 2023" },
      { org: "Instituto Ismart", role: "Bolsista Ismart Online", period: "2021 – 2023", note: "Programação, matemática e um app de saúde mental feito em equipe." },
      { org: "Etec Parque Belém", role: "Informática para internet (ensino médio técnico)", period: "2021 – 2023" },
    ],
  },
  contact: { title: "Vamos conversar.", opens: "abre em nova aba", links: LINKS },
  footer: { rights: "Todos os direitos reservados." },
  notFound: { title: "Página não encontrada", text: "Esse endereço não existe por aqui.", home: "Voltar para o início" },
};
