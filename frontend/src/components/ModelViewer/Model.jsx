import { useGLTF, TransformControls } from "@react-three/drei";
import { useViewer } from "./ViewerContext";
import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Model({ url }) {

  const { scene } = useGLTF(url);

  const group = useRef(null);
  const { mode } = useViewer();
  const { id } = useParams();

useEffect(() => {
  const loadScene = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://127.0.0.1:8000/projects/${id}/scene`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const objects = await response.json();

        const current = objects.find(
      obj => obj.filename === url.split("/").pop()
    );

    if (!current || !group.current) return;

    group.current.position.set(
      current.pos_x,
      current.pos_y,
      current.pos_z
    );

    group.current.rotation.set(
      current.rot_x,
      current.rot_y,
      current.rot_z
    );

    group.current.scale.set(
      current.scale_x,
      current.scale_y,
      current.scale_z
    );

  };

  loadScene();

}, [url, id]);

  const saveScene = async () => {
    if (!group.current) return;

    const token = localStorage.getItem("token");

    await fetch(`http://127.0.0.1:8000/projects/${id}/scene`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        filename: url.split("/").pop(),
        pos_x: group.current.position.x,
        pos_y: group.current.position.y,
        pos_z: group.current.position.z,
        rot_x: group.current.rotation.x,
        rot_y: group.current.rotation.y,
        rot_z: group.current.rotation.z,
        scale_x: group.current.scale.x,
        scale_y: group.current.scale.y,
        scale_z: group.current.scale.z,
      }),
    });
  };

  return (

  <TransformControls
    mode={mode}
    onMouseUp={saveScene}
>

   <group
    ref={group}
    onUpdate={(g) => {
        group.current = g;
    }}
>

        <primitive object={scene} />

    </group>

</TransformControls>

  );

}