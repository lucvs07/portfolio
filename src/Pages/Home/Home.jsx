import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "../../components/Experience";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { MainSection } from "../../components/MainSection/MainSection";
import { MainContainer, CanvasContainer} from "./styles";

function Home() {
  const [animation, setAnimation] = useState('Idle');
  return (
    <>
      <Header/>
      <MainContainer>
        <CanvasContainer>
          <Canvas shadows camera={{ position: [0, 2, 5], fov: 55 }} gl={{ preserveDrawingBuffer: true }}>
            <Experience animation={animation}/>
          </Canvas>
        </CanvasContainer>
        <MainSection setAnimation={setAnimation}/>
      </MainContainer>
      <Footer/>
    </>
  );
}

export default Home;
