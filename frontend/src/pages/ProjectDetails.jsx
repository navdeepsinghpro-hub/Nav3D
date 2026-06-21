import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProjectDetails() {
  const { id } = useParams();

const [project, setProject] = useState(null);
const [file, setFile] = useState(null);
const [files, setFiles] = useState([]);

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
};
    fetchProject();
  }, [id]);

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch(
      `http://127.0.0.1:8000/projects/${id}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    console.log(data);

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

const deleteFile = async (filename) => {
  try {
    await fetch(
      `http://127.0.0.1:8000/files/${filename}`,
      {
        method: "DELETE",
      }
    );

    setFiles(
      files.filter(
        (file) => file !== filename
      )
    );
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-6">
        Project Details
      </h1>

      <div className="border border-gray-800 rounded-xl p-6">
        <p>
          Project ID: {project.id}
        </p>

        <p>
          Project Name: {project.name}
        </p>

        <p>
          Owner ID: {project.owner_id}
        </p>

        <div className="mt-6">
          <input
            type="file"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
          />

          <button
            onClick={uploadFile}
            className="bg-white text-black px-4 py-2 rounded ml-3"
          >
            Upload
          </button>
          <h2 className="text-xl mt-6 mb-3">
             Uploaded Files
          </h2>

          <ul>
            {files.map((file, index) => (
                <li
                key={index}
                className="mb-6"
                >
                <img
                    src={`http://127.0.0.1:8000/uploads/project_${id}/${file}`}
                    alt={file}
                    className="w-40 rounded border"
                    />

                <div className="flex items-center gap-3 mt-2">
                <p>{file}</p>

                <button
                    onClick={() =>
                    deleteFile(file)
                    }
                    className="bg-red-600 px-3 py-1 rounded"
                >
                    Delete
                </button>
                </div>
                </li>
            ))}
            </ul>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;