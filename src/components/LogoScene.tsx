import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { LOGO_PATHS } from "./logoPaths";
import Sparks from "./Sparks";

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useGeometry() {
  return useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49 76">${LOGO_PATHS.map((d) => `<path d="${d}"/>`).join("")}</svg>`;
    const shapes = new SVGLoader().parse(svg).paths.flatMap((p) => SVGLoader.createShapes(p));
    const g = new THREE.ExtrudeGeometry(shapes, { depth: 9, bevelEnabled: true, bevelThickness: 1.4, bevelSize: 0.9, bevelSegments: 8, curveSegments: 32 });
    g.center();
    return g;
  }, []);
}

/* Bronze de forja: metal escuro com calor nas bordas (fresnel emissivo). O calor respira devagar e
   sobe quando o cursor chega perto da logo, junto com as faíscas. */
function useForgeMaterial() {
  return useMemo(() => {
    const heat = { value: 0.5 };
    const material = new THREE.MeshPhysicalMaterial({ color: "#A8561A", metalness: 0.95, roughness: 0.3, clearcoat: 0.4, clearcoatRoughness: 0.25 });
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uHeat = heat;
      shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\nuniform float uHeat;").replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        float fres = pow(1.0 - saturate(dot(normalize(vNormal), normalize(vViewPosition))), 2.4);
        totalEmissiveRadiance += vec3(1.0, 0.42, 0.08) * fres * uHeat * 2.6;`,
      );
    };
    return { material, heat };
  }, []);
}

/* Luz de estúdio: faixas duras sobre fundo escuro, que é o que faz o metal ler como metal; um softbox
   frontal desenha a faixa que corre pela face quando a logo inclina; contraluz laranja nas bordas. */
function StudioLight({ light }: { light: boolean }) {
  const k = light ? 0.8 : 1;
  return (
    <Environment resolution={512} frames={1}>
      <color attach="background" args={["#0b0907"]} />
      <Lightformer form="rect" intensity={7 * k} color="#fff3e2" position={[-3.2, 1.5, 3.5]} rotation-y={0.7} scale={[0.55, 7, 1]} />
      <Lightformer form="rect" intensity={3.2 * k} color="#ffffff" position={[3.6, 0, 2.6]} rotation-y={-0.9} scale={[0.35, 6, 1]} />
      <Lightformer form="rect" intensity={2.2 * k} color="#ffe6c4" position={[0, 4.5, 1.5]} rotation-x={Math.PI / 2} scale={[5, 0.6, 1]} />
      <Lightformer form="rect" intensity={1.6 * k} color="#ffe9cf" position={[0, 2.2, 6]} rotation-x={0.35} scale={[9, 2.6, 1]} />
      <Lightformer form="rect" intensity={0.35 * k} color="#ffb366" position={[0, -2.4, 6]} rotation-x={-0.35} scale={[9, 2, 1]} />
      <Lightformer form="ring" intensity={5 * k} color="#ff8a1f" position={[0, 0.5, -4]} scale={4.5} />
      <Lightformer form="rect" intensity={0.9 * k} color="#ff7a1a" position={[0, -4, 1]} rotation-x={-Math.PI / 2} scale={[8, 3, 1]} />
    </Environment>
  );
}

function Logo({ still }: { still: boolean }) {
  const geometry = useGeometry();
  const { material, heat } = useForgeMaterial();
  const canvas = useThree((st) => st.gl.domElement);
  const near = useRef(0);
  const lastMove = useRef(0);
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const spin = useRef(still ? 0 : -Math.PI * 1.5);
  const flip = useRef(0);

  useEffect(() => {
    if (still) return;
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      // proximidade do cursor ao centro do canvas, para o calor da forja
      lastMove.current = performance.now();
      const r = canvas.getBoundingClientRect();
      near.current = Math.max(0, 1 - Math.hypot((e.clientX - (r.left + r.width / 2)) / (r.width / 2), (e.clientY - (r.top + r.height / 2)) / (r.height / 2)) / 0.9);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [still, canvas]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);
  const warmth = useRef(0);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const damp = THREE.MathUtils.damp;
    pointer.current.x = damp(pointer.current.x, target.current.x, 4, delta);
    pointer.current.y = damp(pointer.current.y, target.current.y, 4, delta);
    spin.current = damp(spin.current, 0, 2.2, delta); // chegada: gira até encarar o visitante
    const turn = still ? 0 : Math.min(window.scrollY / window.innerHeight, 1) * Math.PI; // rolar: b vira q
    flip.current = damp(flip.current, turn, 6, delta);
    const t = state.clock.elapsedTime;
    g.rotation.set(pointer.current.y * 0.35 + (still ? 0 : Math.sin(t * 0.6) * 0.04), spin.current + pointer.current.x * 0.55 - 0.35, flip.current);
    g.position.y = still ? 0 : Math.sin(t * 0.8) * 0.06;
    const recent = performance.now() - lastMove.current < 1500;
    warmth.current = damp(warmth.current, still || !recent ? 0 : near.current, 3, delta);
    heat.value = still ? 0.5 : 0.45 + 0.15 * Math.sin(t * 1.4) + warmth.current * 0.9;
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={material} scale={0.029} rotation-x={Math.PI} />
    </group>
  );
}

// active: falso quando o hero sai da tela; o canvas para de desenhar (frameloop "never").
export default function LogoScene({ light, active = true, onReady }: { light: boolean; active?: boolean; onReady: () => void }) {
  const still = reduceMotion();
  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ alpha: true, antialias: true }}
      onCreated={() => requestAnimationFrame(onReady)}
    >
      <StudioLight light={light} />
      <Logo still={still} />
      {!still && <Sparks light={light} />}
    </Canvas>
  );
}
