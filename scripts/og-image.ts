// Gera public/og.png (1200x630), a imagem de prévia de link.
import sharp from "sharp";
import { LOGO_PATHS } from "../src/components/logoPaths.ts";

const logo = LOGO_PATHS.map((d) => `<path d="${d}" fill="#FFA737"/>`).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#161412"/>
  <circle cx="930" cy="315" r="260" fill="#FFA737" opacity="0.10"/>
  <g transform="translate(820 145) scale(4.5)">${logo}</g>
  <text x="80" y="300" font-family="Chillax, Arial, sans-serif" font-weight="700" font-size="112" fill="#F4EFEA">Lucas</text>
  <text x="80" y="410" font-family="Chillax, Arial, sans-serif" font-weight="700" font-size="112" fill="#F4EFEA">Grecco<tspan fill="#FFA737">.</tspan></text>
  <text x="84" y="480" font-family="Chillax, Arial, sans-serif" font-weight="500" font-size="30" fill="#B9B2AB">Full stack developer · Asaas · FIAP</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(new URL("../public/og.png", import.meta.url).pathname);
console.log("[og] public/og.png");
