import { useViewer } from "./ViewerContext";

export default function ViewerToolbar() {

  const { mode, setMode } = useViewer();

  return (

    <div className="flex gap-4 mb-4">

      <button
        onClick={() => setMode("translate")}
        className={`px-4 py-2 rounded-xl ${
          mode === "translate"
            ? "bg-blue-600"
            : "bg-gray-700"
        }`}
      >
        🖱 Move
      </button>

      <button
        onClick={() => setMode("rotate")}
        className={`px-4 py-2 rounded-xl ${
          mode === "rotate"
            ? "bg-green-600"
            : "bg-gray-700"
        }`}
      >
        🔄 Rotate
      </button>

      <button
        onClick={() => setMode("scale")}
        className={`px-4 py-2 rounded-xl ${
          mode === "scale"
            ? "bg-yellow-600"
            : "bg-gray-700"
        }`}
      >
        📏 Scale
      </button>

    </div>

  );

}