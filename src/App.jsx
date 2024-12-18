import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Header } from "./components/Header/Header";

function App() {
  return (
    <>
      <Header/>
      <Canvas shadows camera={{ position: [0, 2, 4.5], fov: 70 }}>
        <Experience />
      </Canvas>
      <div>
        <h1>Lucas</h1>
      </div>
    </>
  );
}

export default App;
