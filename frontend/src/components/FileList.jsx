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
        files.map((file, index) => (

             <div
                key={index}
                className="bg-gray-800 rounded-xl p-3 mb-3 flex items-center justify-between"
                >

                <div className="flex items-center gap-4">

                    <img
                    src={`http://127.0.0.1:8000/uploads/project_${projectId}/${file.name}`}
                    alt={file.name}
                    className="w-20 h-20 rounded-lg object-cover"
                    />

                    <div>
                    <h3 className="font-bold">
                        {file.name}
                    </h3>

                    <p className="text-gray-400">
                        {(file.size/1024).toFixed(2)} KB
                    </p>
                    </div>

                </div>

                <div className="flex gap-2">

                    <button className="bg-blue-600 px-3 py-2 rounded-lg">
                    👁
                    </button>

                    <button className="bg-green-600 px-3 py-2 rounded-lg">
                    ⬇
                    </button>

                    <button className="bg-red-600 px-3 py-2 rounded-lg">
                    🗑
                    </button>

                </div>

                </div>
            
        ))
      )}

    </div>
  );
}

export default FileList;