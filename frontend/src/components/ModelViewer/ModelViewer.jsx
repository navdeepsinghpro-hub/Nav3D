import ViewerCanvas from "./ViewerCanvas";
import ViewerToolbar from "./ViewerToolbar";
import { ViewerProvider } from "./ViewerContext";

export default function ModelViewer({ modelUrl }) {

  if(!modelUrl){

    return(

<div className="bg-gray-900 rounded-2xl p-10 text-center">

<h2 className="text-gray-400 text-2xl">
📦 No 3D Model Selected
</h2>

</div>

);

  }

return (
  <ViewerProvider>

    <div>

      <ViewerToolbar />

      <div className="h-[600px] rounded-2xl overflow-hidden bg-gray-900">
        <ViewerCanvas modelUrl={modelUrl} />
      </div>

    </div>

  </ViewerProvider>
);

}