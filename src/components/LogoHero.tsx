import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from "react";
import { LOGO_PATHS } from "./logoPaths";

const LogoScene = lazy(() => import("./LogoScene"));

// Se o canvas lançar erro, a logo plana continua na tela.
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function canRender3d(): boolean {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  if (saveData) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function LogoHero() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [light, setLight] = useState(false);
  const [active, setActive] = useState(true);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEnabled(canRender3d());
    const root = document.documentElement;
    const sync = () => setLight(root.dataset.theme === "light");
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    // Fora da tela o canvas para de desenhar (faíscas e calor inclusos).
    const io = "IntersectionObserver" in window && box.current ? new IntersectionObserver(([e]) => setActive(e.isIntersecting)) : null;
    if (io && box.current) io.observe(box.current);
    return () => {
      mo.disconnect();
      io?.disconnect();
    };
  }, []);

  return (
    <div ref={box} className="logo-hero" data-ready={ready ? "" : undefined} aria-hidden="true">
      <div className="glow" />
      <svg data-logo-static className="flat" viewBox="0 0 49 76" fill="currentColor">
        {LOGO_PATHS.map((d) => <path key={d.slice(0, 12)} d={d} />)}
      </svg>
      {enabled && (
        <Boundary>
          <Suspense fallback={null}>
            <div className="canvas"><LogoScene light={light} active={active} onReady={() => setReady(true)} /></div>
          </Suspense>
        </Boundary>
      )}
    </div>
  );
}
