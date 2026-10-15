// Faíscas do hero: saem do cursor quando ele se move sobre a logo e, paradas, escapam de vez em
// quando da borda da logo. Elas se apagam até a cor do fundo do tema.
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createPool, fade, spawn, step } from "../lib/sparks";

const PALETTE = ["#FFA737", "#FFC66B", "#FF7A2E", "#FFD9A0"];
const PALETTE_LIGHT = ["#C2610F", "#A34E08", "#E07B1A"];

// Sprite redondo e suave, desenhado num canvas (sem arquivo de imagem).
function makeSprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.55)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export default function Sparks({ light }: { light: boolean }) {
  const n = window.innerWidth < 700 ? 260 : 600;
  const { gl, viewport } = useThree();
  const points = useRef<THREE.Points>(null);
  const pool = useMemo(() => createPool(n), [n]);
  const sprite = useMemo(makeSprite, []);
  const colors = useMemo(() => {
    const pal = (light ? PALETTE_LIGHT : PALETTE).map((c) => new THREE.Color(c));
    const base = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) pal[i % pal.length].toArray(base, i * 3);
    return { base, live: new Float32Array(n * 3), bg: new THREE.Color(light ? "#F6F1EB" : "#000000"), tmp: new THREE.Color() };
  }, [n, light]);
  const cursor = useRef({ x: 0, y: 0, vx: 0, vy: 0, inside: false, moved: 0 });
  const acc = useRef(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const r = gl.domElement.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * viewport.width;
      const y = -((e.clientY - r.top) / r.height - 0.5) * viewport.height;
      const c = cursor.current;
      c.vx = x - c.x;
      c.vy = y - c.y;
      c.x = x;
      c.y = y;
      c.inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      c.moved = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [gl, viewport.width, viewport.height]);

  useEffect(() => () => sprite.dispose(), [sprite]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20); // uma aba que volta do fundo não dispara uma rajada
    const c = cursor.current;
    const moving = c.inside && performance.now() - c.moved < 80;
    acc.current += dt * (moving ? 140 : 14);
    while (acc.current > 1) {
      acc.current -= 1;
      if (moving) spawn(pool, c.x, c.y, c.vx * 18, c.vy * 18);
      else {
        const a = Math.random() * Math.PI * 2;
        spawn(pool, Math.cos(a) * 1.1, Math.sin(a) * 1.5, 0, 0);
      }
    }
    step(pool, dt);
    const { base, live, bg, tmp } = colors;
    for (let i = 0; i < n; i++) tmp.fromArray(base, i * 3).lerp(bg, 1 - fade(pool, i)).toArray(live, i * 3);
    const g = points.current?.geometry;
    if (!g) return;
    (g.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    (g.getAttribute("color") as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pool.pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors.live, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        size={light ? 0.07 : 0.06}
        sizeAttenuation
        vertexColors
        transparent
        depthWrite={false}
        blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}
