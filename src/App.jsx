import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { MainSection } from "./components/MainSection/MainSection";
import { styled } from "./styles";
function App() {
  return (
    <>
      <Header/>
      <MainContainer>
        <CanvasContainer>
          <Canvas shadows camera={{ position: [0, 1.5, 5], fov: 55 }}>
            <Experience />
          </Canvas>
        </CanvasContainer>
        <MainSection/>
      </MainContainer>
      <Footer/>
    </>
  );
}

export default App;

const MainContainer = styled("div", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start", // Alinha os itens ao topo
  padding: "24px",
  overflowY: "auto", // Permite scroll vertical
  height: "calc(100vh - 80px)", // Altura total menos o espaço do Header/Footer
  marginTop: "80px", // Evita que o conteúdo seja cortado pelo Header
});

const CanvasContainer = styled("div", {
  flex: "1",
  height: "100vh", // Preenche a altura total da tela
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});