import { styled } from "../../styles";

export const MainContainer = styled("main", {
  display: "grid",
  gridTemplateColumns: "1fr 4fr",
  height: "calc(100vh - 80px)",
  padding: "24px",
  width: "100%",
  marginTop: "80px",
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