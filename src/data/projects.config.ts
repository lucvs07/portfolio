import type { ProjectsConfig } from "../lib/github/types.ts";

export const PROJECTS_CONFIG: ProjectsConfig = {
  owner: "lucvs07",
  topic: "portfolio",
  featuredTopic: "featured",
  // Transição: remova cada repo daqui quando ele ganhar o topic "portfolio" no GitHub.
  extraRepos: ["An4lu/DeereGO", "lucvs07/deereGO-ESP", "lucvs07/CARI", "lucvs07/Api-Hunger", "lucvs07/pokedex", "lucvs07/OneWay"],
  overrides: {
    "An4lu/DeereGO": {
      name: "DeereGo", featured: true, tech: ["React", "Node.js", "MongoDB"],
      // O repo não é nosso (sem admin para editar a descrição), então o texto fica aqui.
      description: {
        en: "Logistics tracking for a John Deere factory: ESP32 devices locate tuggers over Wi-Fi and a web dashboard shows deliveries and tugger performance in real time. React, Node.js and MongoDB.",
        pt: "Rastreamento logístico para uma fábrica da John Deere: dispositivos ESP32 localizam os rebocadores via Wi-Fi e um painel web mostra as entregas e o desempenho em tempo real. React, Node.js e MongoDB.",
      },
    },
    "lucvs07/deereGO-ESP": { name: "DeereGo · ESP32", tech: ["C++", "ESP32"] },
    "lucvs07/CARI": { name: "CARI", tech: ["PHP", "SQL", "HTML", "CSS"] },
    "lucvs07/Api-Hunger": { name: "Hungerdle", tech: ["React", "Node.js", "MongoDB"], demo: "https://front-hunger.vercel.app" },
    "lucvs07/pokedex": { name: "Pokédex", tech: ["JavaScript", "HTML", "CSS"] },
    "lucvs07/OneWay": { name: "One Way", tech: ["PHP", "SQL", "HTML", "CSS"] },
  },
};
