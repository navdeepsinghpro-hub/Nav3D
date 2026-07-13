export default function SceneLights() {
  return (
    <>
      <ambientLight intensity={2} />

      <directionalLight
        position={[5,5,5]}
        intensity={2}
      />

      <directionalLight
        position={[-5,5,-5]}
        intensity={1}
      />
    </>
  );
}