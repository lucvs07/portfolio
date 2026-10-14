import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from "react";
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

  useEffect(() => {
    setEnabled(canRender3d());
    const root = document.documentElement;
    const sync = () => setLight(root.dataset.theme === "light");
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);

  return (
    <div className="logo-hero" data-ready={ready ? "" : undefined} aria-hidden="true">
      <div className="glow" />
      <svg data-logo-static className="flat" viewBox="0 0 49 76" fill="currentColor">
        {LOGO_PATHS.map((d) => <path key={d.slice(0, 12)} d={d} />)}
      </svg>
      {enabled && (
        <Boundary>
          <Suspense fallback={null}>
            <div className="canvas"><LogoScene light={light} onReady={() => setReady(true)} /></div>
          </Suspense>
        </Boundary>
      )}
    </div>
  );
}
