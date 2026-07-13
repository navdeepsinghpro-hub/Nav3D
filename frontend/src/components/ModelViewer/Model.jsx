import { useGLTF, TransformControls } from "@react-three/drei";
import { useViewer } from "./ViewerContext";

export default function Model({ url, orbit }) {

  const { scene } = useGLTF(url);

  const { mode } = useViewer();

  return (
    <TransformControls
      object={scene}
      mode={mode}

      onMouseDown={() => {
        if (orbit.current) orbit.current.enabled = false;
      }}

      onMouseUp={() => {
        if (orbit.current) orbit.current.enabled = true;
      }}
    >
      <primitive object={scene} />
    </TransformControls>
  );
}