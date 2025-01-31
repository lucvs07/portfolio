import {
  ContactShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { useControls } from "leva";
import { Avatar } from "./Avatar";

export const Experience = () => {
  const { animation } = useControls({
    animation: {
      value: "Typing",
      options: ["Typing", "Falling", "Standing", "Stretching", "Victory", "Idle", "Salute", "Rock", "Dance", "Waving"],
    },
  });
  return (
    <>
      <OrbitControls 
        enablePan={false} 
        enableZoom={false}
        enableRotate={false} 
      />
      
      <Environment preset="dawn"/>
      <group position-y={1}>
        <ContactShadows
          opacity={0.42}
          scale={10}
          blur={1}
          far={10}
          resolution={256}
          color="#000000"
        />
        <Avatar animation={animation} position-y={-0.5}/>

        <mesh scale={1} rotation-x={-Math.PI * 0.5} position-y={-0.5}>
          <circleGeometry args={[0.8, 64]} />
          <meshToonMaterial 
            color="black"          // Cor azul para aparência futurística
            gradientMap={null}       // Use um mapa de gradiente se necessário (padrão é null)
            emissive="orange"       // Sem emissão
          />
        </mesh>
      </group>
    </>
  );
};
