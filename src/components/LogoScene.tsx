import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { LOGO_PATHS } from "./logoPaths";

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

function Logo({ still }: { still: boolean }) {
  const geometry = useGeometry();
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
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [still]);

  useEffect(() => () => geometry.dispose(), [geometry]);

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
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} scale={0.029} rotation-x={Math.PI}>
        <meshPhysicalMaterial color="#FFA737" metalness={0.55} roughness={0.26} clearcoat={0.8} clearcoatRoughness={0.2} />
      </mesh>
    </group>
  );
}

export default function LogoScene({ light, onReady }: { light: boolean; onReady: () => void }) {
  const still = reduceMotion();
  const k = light ? 0.75 : 1; // no tema claro a luz ambiente já é alta; reduz para o objeto não lavar
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 35 }} gl={{ alpha: true, antialias: true }} onCreated={() => requestAnimationFrame(onReady)}>
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3 * k} color="#fff1dd" position={[-4, 3, 3]} scale={[5, 3, 1]} />
        <Lightformer form="rect" intensity={1.4 * k} color="#ffffff" position={[4, -1, 3]} scale={[3, 5, 1]} />
        <Lightformer form="ring" intensity={2.5 * k} color="#ff8a1f" position={[0, 0, -4]} scale={5} />
        <Lightformer form="rect" intensity={0.8 * k} color="#ffd29a" position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} />
      </Environment>
      <Logo still={still} />
    </Canvas>
  );
}
