import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ModelViewer from "../components/ModelViewer";

function ProjectDetails() {
  const { id } = useParams();

const [project, setProject] = useState(null);
const [file, setFile] = useState(null);
const [files, setFiles] = useState([]);
const [dragging, setDragging] = useState(false);
const [progress, setProgress] = useState(0);
const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
 const fetchProject = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://127.0.0.1:8000/projects/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  setProject(data);

  const filesResponse = await fetch(
    `http://127.0.0.1:8000/projects/${id}/files`
  );

  const filesData = await filesResponse.json();

  setFiles(filesData);

  const firstModel = filesData.find(
  (file) =>
    file.name.endsWith(".glb") ||
    file.name.endsWith(".gltf")
);

if (firstModel) {
  setSelectedModel(firstModel.name);
}
};
    fetchProject();
  }, [id]);

    const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await axios.post(
      `http://127.0.0.1:8000/projects/${id}/upload`,
      formData,
      {
        onUploadProgress: (event) => {
          const percent = Math.round(
            (event.loaded * 100) / event.total
          );

          setProgress(percent);
        },
      }
    );

    alert("File uploaded!");
    window.location.reload();
  };

  if (!project) {
    return (
      <div className="text-white p-10">
        Loading...
      </div>
    );
  }

  const renameFile = async (filename) => {
  const newName = prompt(
    "Enter new filename"
  );

  if (!newName) return;

  await fetch(
  `http://127.0.0.1:8000/projects/${id}/files/${filename}?new_filename=${newName}`,
  {
    method: "PUT",
  }
);

  window.location.reload();
};

const deleteFile = async (filename) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
    `http://127.0.0.1:8000/projects/${id}/files/${filename}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Status:", response.status);

    const result = await response.text();
    console.log("Response:", result);

    if (!response.ok) {
      alert("Delete failed");
      return;
    }

    setFiles(files.filter((file) => file.name !== filename));
    window.location.reload();

    alert("✅ File Deleted");
  } catch (err) {
    console.error(err);
  }
};

const getFileIcon = (name) => {
  const ext = name.split(".").pop().toLowerCase();

  if (["glb", "gltf", "fbx", "obj"].includes(ext))
    return "🧊";

  if (["png","jpg","jpeg","gif","webp"].includes(ext))
    return "🖼";

  if (["mp4","mov","avi"].includes(ext))
    return "🎥";

  if (["mp3","wav"].includes(ext))
    return "🎵";

  if (["pdf"].includes(ext))
    return "📄";

  if (["zip","rar"].includes(ext))
    return "🗜";

  return "📁";
};

const getFileType = (name) => {
  const ext = name.split(".").pop().toLowerCase();

  if (["glb","gltf","fbx","obj"].includes(ext))
    return "3D Model";

  if (["png","jpg","jpeg","gif","webp"].includes(ext))
    return "Image";

  if (["mp4","mov","avi"].includes(ext))
    return "Video";

  if (["mp3","wav"].includes(ext))
    return "Audio";

  if (["pdf"].includes(ext))
    return "PDF";

  return "File";
};



  return (
    <div className="min-h-screen bg-black text-white p-10">
     <div className="mb-10">

        <h1 className="text-5xl font-extrabold">
          🚀 Project Workspace
        </h1>

        <p className="text-gray-400 mt-2">
          Manage your files, models and AI assets.
        </p>

      </div>

      <div className="bg-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700">
        <div className="mb-8">

  <h2 className="text-3xl font-bold">
    📁 {project.name}
  </h2>

        <p className="text-gray-400 mt-2">
          {project.description || "No description"}
        </p>

      </div>

      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-gray-800 rounded-2xl p-5">
          <p className="text-gray-400">
            Files
          </p>

          <h2 className="text-4xl font-bold text-blue-400">
            {files.length}
          </h2>
        </div>

        <div className="bg-gray-800 rounded-2xl p-5">
          <p className="text-gray-400">
            Owner
          </p>

          <h2 className="text-2xl text-green-400">
            You
          </h2>
          </div>

        <div className="bg-gray-800 rounded-2xl p-5">
          <p className="text-gray-400">
            Storage
          </p>

          <h2 className="text-2xl text-green-400">
            {(files.reduce((a,b)=>a+b.size,0)/1024/1024).toFixed(2)} MB
          </h2>
        </div>

      </div>

       <div className="mt-6">
        <div
          className={`p-8 border-2 border-dashed rounded-xl text-center ${
            dragging
              ? "border-blue-500 bg-gray-800"
              : "border-gray-600"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() =>
            setDragging(false)
          }
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);

            const droppedFile =
              e.dataTransfer.files[0];

            if (droppedFile) {
              setFile(droppedFile);
            }
          }}
        >
          <p>📁 Drag & Drop File Here</p>

          <p className="text-gray-400 mt-2">
            or choose manually below
          </p>

          <input
            type="file"
            className="mt-4"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
          />

          {file && (
            <p className="mt-3 text-green-400">
              Selected: {file.name}
            </p>
          )}

        </div>

        <button
          onClick={uploadFile}
          className="bg-white text-black px-4 py-2 rounded mt-4"
        >
          Upload
        </button>

        {progress > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded">
              <div
                className="bg-green-500 h-4 rounded"
                style={{
                  width: `${progress}%`,
                }}
              ></div>
            </div>

            <p className="mt-1">
              {progress}%
            </p>
          </div>
        )}

          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">
              🧊 3D Viewer
            </h2>

              <ModelViewer
                modelUrl={
                  selectedModel
                    ? `http://127.0.0.1:8000/uploads/project_${id}/${selectedModel}`
                    : null
                }
              />
          </div>

          <h2 className="text-xl mt-6 mb-3">
             Uploaded Files
          </h2>


          <div className="grid md:grid-cols-2 gap-5">

            {files.map((file,index)=>(

            <div
              key={index}
              onClick={() => {
                if (
                  file.name.endsWith(".glb") ||
                  file.name.endsWith(".gltf")
                ) {
                  setSelectedModel(file.name);
                }
              }}
              className={`
                bg-gray-800
                rounded-2xl
                p-5
                border
                cursor-pointer
                transition

                ${
                  selectedModel === file.name
                    ? "border-blue-500 bg-gray-700"
                    : "border-gray-700 hover:border-blue-400"
                }
              `}
            >

            <div className="flex items-center gap-4">

            <div className="text-5xl">
            {getFileIcon(file.name)}
            </div>

            <div>

            <h2 className="font-bold text-lg break-all">
            {file.name}
            </h2>

            <p className="text-gray-400">
            {getFileType(file.name)}
            </p>

            <p className="text-green-400">
            {(file.size/1024).toFixed(2)} KB
            </p>

            </div>

            </div>

            <div className="flex gap-3 mt-5">

            <button
            onClick={()=>window.open(
            `http://127.0.0.1:8000/projects/${id}/download/${file.name}`
            )}
            className="bg-blue-600 px-4 py-2 rounded-xl"
            >
            👁
            </button>

            <button
            onClick={()=>window.open(
            `http://127.0.0.1:8000/projects/${id}/download/${file.name}`
            )}
            className="bg-green-600 px-4 py-2 rounded-xl"
            >
            ⬇
            </button>

            <button
            onClick={()=>renameFile(file.name)}
            className="bg-yellow-600 px-4 py-2 rounded-xl"
            >
            ✏️
            </button>

            <button
            onClick={()=>deleteFile(file.name)}
            className="bg-red-600 px-4 py-2 rounded-xl"
            >
            🗑
            </button>

            </div>

            </div>

            ))}

            </div>
        </div>
      </div>
    </div>
  );
}
export default ProjectDetails;