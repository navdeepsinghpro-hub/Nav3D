import { useEffect, useState } from "react";

function FileList({ projectId }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://127.0.0.1:8000/projects/${projectId}/files`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    setFiles(data);
  };

  return (
    <div className="mt-5">

      <h3 className="text-lg font-bold mb-3">
        📁 Uploaded Files
      </h3>

      {files.length === 0 ? (
        <p className="text-gray-400">
          No files uploaded
        </p>
      ) : (
        
       <div className="bg-gray-800 rounded-xl p-4">

          {/* First image only */}
          <img
            src={`http://127.0.0.1:8000/uploads/project_${projectId}/${files[0].name}`}
            alt={files[0].name}
            className="w-full h-40 object-cover rounded-xl"
          />

          <h3 className="font-bold mt-4 truncate">
            {files[0].name}
          </h3>

          <p className="text-gray-400">
            {(files[0].size / 1024).toFixed(2)} KB
          </p>

          {files.length > 1 && (
            <p className="text-blue-400 mt-2">
              +{files.length - 1} more files
            </p>
          )}

          <div className="flex gap-2 mt-4">

            <button className="flex-1 bg-blue-600 hover:bg-blue-700 p-2 rounded-xl">
              👁 Preview
            </button>

            <button className="flex-1 bg-green-600 hover:bg-green-700 p-2 rounded-xl">
              ⬇ Download
            </button>

            <button className="flex-1 bg-red-600 hover:bg-red-700 p-2 rounded-xl">
              🗑 Delete
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default FileList;