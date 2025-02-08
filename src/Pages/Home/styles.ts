import { styled } from "../../styles";

export const MainContainer = styled("main", {
  display: "grid",
  gridTemplateColumns: "1fr 4fr", // 1 coluna para o Canvas e 2 colunas para o conteúdo
  height: "calc(100vh - 80px)", // Altura total menos o espaço do Header/Footer
  padding: "24px",
  width: "100%",
  marginTop: "80px", // Espaço para o Header
  alignItems: "center",
});

export const CanvasContainer = styled("div", {
  flex: 1,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  width: "100%",
});