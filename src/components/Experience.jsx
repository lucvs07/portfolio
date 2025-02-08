import {
  ContactShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { Avatar } from "./Avatar";

export const Experience = ({ animation }) => {
  return (
    <>
      <OrbitControls 
        enablePan={false} 
        enableZoom={false}
        enableRotate={false} 
      />
      
      <Environment preset="dawn"/>
      <group position={[-0.09, -0.2, 0]} scale={[1.5, 1.5, 1.5]}>
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
            color="#f39b2b"          // Cor azul para aparência futurística
            gradientMap={null}       // Use um mapa de gradiente se necessário (padrão é null)
            emissive="#cc852c"       // Sem emissão
          />
        </mesh>
      </group>
    </>
  );
};
