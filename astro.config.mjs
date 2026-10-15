import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  // Domínio próprio (GitHub Pages + name.com): o site mora na raiz.
  site: "https://lucasgrecco.dev",
  trailingSlash: "ignore",
  integrations: [react()],
  // Pré-empacota o runtime JSX do React no dev; sem isso o Vite às vezes serve a ilha
  // antes de otimizar react/jsx-dev-runtime e a hidratação falha ("_jsxDEV is not a function").
  vite: { optimizeDeps: { include: ["react", "react-dom", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime"] } },
  i18n: {
    defaultLocale: "pt",
    locales: ["pt", "en"],
    routing: { prefixDefaultLocale: false },
  },
});
