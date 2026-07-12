import { useState } from "react";

function UploadPanel({ projectId, onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

 const uploadFile = async () => {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  setUploading(true);
  setProgress(0);

  // Fake progress animation
  const timer = setInterval(() => {
    setProgress((old) => {
      if (old >= 90) {
        clearInterval(timer);
        return old;
      }
      return old + 10;
    });
  }, 150);

  const response = await fetch(
    `http://127.0.0.1:8000/projects/${projectId}/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    }
  );

  clearInterval(timer);

  setProgress(100);

  setTimeout(() => {
    setUploading(false);
    setProgress(0);
  }, 400);

  if (response.ok) {
    alert("✅ File Uploaded!");
    setFile(null);

    if (onUpload) onUpload();
  }
};

  return (
    <div className="mt-6">

            <label
            onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragging(false);

                if (e.dataTransfer.files.length > 0) {
                setFile(e.dataTransfer.files[0]);
                }
            }}
            className={`
                flex
                flex-col
                items-center
                justify-center
                border-2
                rounded-2xl
                h-52
                cursor-pointer
                transition-all
                ${
                dragging
                    ? "border-green-500 bg-green-900/20 scale-105"
                    : "border-blue-500 hover:bg-gray-800"
                }
            `}
            >

        <div className="text-6xl">
          📤
        </div>

       <p className="text-xl font-bold mt-4">
        {dragging
            ? "Drop File Here 🚀"
            : "Drag & Drop Files"}
        </p>

        <p className="text-gray-400">
          or Click to Browse
        </p>

        {file && (
          <p className="mt-4 text-green-400">
            {file.name}
          </p>
        )}

        <input
          type="file"
          hidden
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

      </label>

      <button
        onClick={uploadFile}
        disabled={uploading}
        className="
        mt-5
        w-full
        bg-blue-600
        hover:bg-blue-700
        p-3
        rounded-xl
        text-lg
        font-bold
        transition
        "
      >

        {uploading ? "Uploading..." : "Upload"}

      </button>

      {uploading && (
  <div className="mt-4">

    <div className="w-full bg-gray-700 rounded-full h-4">

      <div
        className="bg-green-500 h-4 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>

    </div>

    <p className="text-center mt-2">
      {progress}%
    </p>

  </div>
)}

    </div>
  );
}

export default UploadPanel;