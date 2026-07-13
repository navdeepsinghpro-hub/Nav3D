import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";

import SceneLights from "./SceneLights";
import Model from "./Model";

export default function ViewerCanvas({ modelUrl }) {

  const orbit = useRef();

  return (
    <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>

      <SceneLights />

      {modelUrl && (
        <Model
          url={modelUrl}
          orbit={orbit}
        />
      )}

      <OrbitControls ref={orbit} />

    </Canvas>
  );
}