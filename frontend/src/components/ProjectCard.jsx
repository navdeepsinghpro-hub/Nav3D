import { useNavigate } from "react-router-dom";
import UploadPanel from "./UploadPanel";
import FileList from "./FileList";

function ProjectCard({
  project,
  deleteProject,
  openEditProject,
  editingProject,
  editName,
  editDescription,
  setEditName,
  setEditDescription,
  saveProjectEdit,
}) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-gradient-to-br from-gray-900 to-gray-800
      border border-gray-700
      rounded-3xl
      p-6
      shadow-xl
      hover:shadow-blue-500/20
      hover:scale-[1.03]
      transition-all
      duration-300"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">
          📁 {project.name}
        </h3>

        <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
          #{project.id}
        </span>
      </div>

      <p className="text-gray-300 mt-4 leading-relaxed min-h-[60px]">
        {project.description
          ? project.description
          : "No description added yet."}
      </p>

      <p className="text-gray-400 text-sm mb-2">
        Project ID: {project.id}
      </p>

      <div className="flex justify-between items-center mt-5">
        <span className="text-green-400">
          📄 {project.file_count || 0} Files
        </span>

        <span className="text-yellow-400">
          ⭐ Active
        </span>
      </div>

      <div className="flex gap-3 justify-center mt-6">

        <button
          onClick={() => navigate(`/projects/${project.id}`)}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-xl transition"
        >
          Open
        </button>

        <button
          onClick={() => deleteProject(project.id)}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl transition"
        >
          Delete
        </button>

        <button
          onClick={() => openEditProject(project)}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl transition"
        >
          Edit
        </button>

     </div>

      {editingProject === project.id && (
        <div className="border border-gray-700 rounded-xl p-4 mt-6">

          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full p-3 rounded text-black mb-3"
          />

          <textarea
            value={editDescription}
            onChange={(e) =>
              setEditDescription(e.target.value)
            }
            className="w-full p-3 rounded text-black mb-3"
          />

          <button
            onClick={saveProjectEdit}
            className="bg-green-600 px-4 py-2 rounded"
          >
            Save Changes
          </button>

        </div>
      )}
    </div>
  );
}

export default ProjectCard;