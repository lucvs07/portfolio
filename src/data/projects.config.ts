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
      description: {
        en: "System for IoT-based logistics optimization in manufacturing, integrating IoT devices to monitor and optimize the flow of materials and products.",
        pt: "Sistema de otimização logística com IoT para a indústria, integrando dispositivos IoT para monitorar e otimizar o fluxo de materiais e produtos.",
      },
    },
    "lucvs07/deereGO-ESP": {
      name: "DeereGo · ESP32", tech: ["C++", "ESP32"],
      description: {
        en: "IoT solution that uses ESP32 microcontrollers to locate and monitor assets in real time.",
        pt: "Solução IoT com microcontroladores ESP32 para localizar e monitorar ativos em tempo real.",
      },
    },
    "lucvs07/CARI": {
      name: "CARI", tech: ["PHP", "SQL", "HTML", "CSS"],
      description: {
        en: "System for sustainable food organization and consumption, connecting consumers with local food sources to reduce waste.",
        pt: "Sistema para organização e consumo sustentável de alimentos, conectando consumidores a fontes locais para reduzir o desperdício.",
      },
    },
    "lucvs07/Api-Hunger": {
      name: "Hungerdle", tech: ["React", "Node.js", "MongoDB"], demo: "https://front-hunger.vercel.app",
      description: {
        en: "Web game where players guess a Hunger Games character from clues.",
        pt: "Jogo web em que o jogador descobre um personagem de Jogos Vorazes a partir de pistas.",
      },
    },
    "lucvs07/pokedex": {
      name: "Pokédex", tech: ["JavaScript", "HTML", "CSS"],
      description: {
        en: "Web app to search for Pokémon and learn about different species.",
        pt: "Aplicativo web para buscar Pokémon e conhecer diferentes espécies.",
      },
    },
    "lucvs07/OneWay": {
      name: "One Way", tech: ["PHP", "SQL", "HTML", "CSS"],
      description: {
        en: "E-commerce web system for a clothing store, with product listings, cart and checkout.",
        pt: "Sistema web de e-commerce para uma loja de roupas, com listagem de produtos, carrinho e checkout.",
      },
    },
  },
};
