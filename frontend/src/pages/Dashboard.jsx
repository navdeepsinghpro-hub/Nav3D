import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const totalProjects = projects.length;

  const totalFiles = projects.reduce(
    (sum, project) =>
      sum + (project.file_count || 0),
    0
  );
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

       const data = await response.json();
setUser(data);

console.log("Token:", token);

const projectsResponse = await fetch(
  "http://127.0.0.1:8000/projects",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const projectsData = await projectsResponse.json();

console.log(projectsData);
setProjects(projectsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const createProject = async () => {
  if (!projectName.trim()) return;

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/projects",
      {
        method: "POST",
       headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
},
        body: JSON.stringify({
          name: projectName,
          description: description,
        }),
      }
    );

const newProject = await response.json();

setProjects([
  ...projects,
  {
    id: newProject.project_id,
    name: newProject.name,
    description: description,
    file_count: 0,
  },
]);

    setProjectName("");
    setDescription("");
  } catch (error) {
    console.error(error);
  }
};

const deleteProject = async (id) => {
  try {
    await fetch(
  `http://127.0.0.1:8000/projects/${id}`,
  {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

    setProjects(
      projects.filter(
        (project) => project.id !== id
      )
    );
  } catch (error) {
    console.error(error);
  }
};

const openEditProject = (project) => {
  setEditingProject(project.id);
  setEditName(project.name);
  setEditDescription(project.description || "");
};

const saveProjectEdit = async () => {
  try {
    await fetch(
      `http://127.0.0.1:8000/projects/${editingProject}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
        }),
      }
    );

    setProjects(
      projects.map((project) =>
        project.id === editingProject
          ? {
              ...project,
              name: editName,
              description: editDescription,
            }
          : project
      )
    );

    setEditingProject(null);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="min-h-screen bg-black text-white p-10">
     <div className="mb-10">
        <h1 className="text-5xl font-extrabold tracking-wide">
          🚀 Nav3D Dashboard
        </h1>

        <p className="text-gray-400 mt-2 text-lg">
          Welcome back! Manage your AI & 3D projects from one place.
        </p>
      </div>

      {user ? (
        <div className="border border-gray-800 rounded-xl p-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 mb-8 shadow-xl">

            <h2 className="text-3xl font-bold">
              👋 Welcome Back
            </h2>

            <p className="mt-3 text-blue-100">
              Logged in as
            </p>

            <p className="text-2xl font-semibold mt-1">
              {user.email}
            </p>

          </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) =>
              setProjectName(e.target.value)
            }
            className="bg-gray-900 p-3 rounded mr-3"
          />

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Project description"
            className="w-full p-3 rounded text-black mt-3"
          />

          <button
            onClick={createProject}
            className="bg-white text-black px-4 py-3 rounded"
          >
            Create Project
          </button>
        </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl hover:scale-105 transition">
              <p className="text-gray-400">
                📁 Projects
              </p>
              <h2 className="text-5xl font-bold text-blue-400 mt-3">
                {totalProjects}
              </h2>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl hover:scale-105 transition">
              <p className="text-gray-400">
                📄 Files
              </p>
              <h2 className="text-5xl font-bold text-green-400 mt-3">
                {totalFiles}
              </h2>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl hover:scale-105 transition">
              <p className="text-gray-400">
                💾 Storage
              </p>
              <h2 className="text-5xl font-bold text-yellow-400 mt-3">
                {(totalFiles * 2).toFixed(0)} MB
              </h2>
            </div>
          </div>

          <h3 className="text-xl mt-6 mb-3">
            My Projects
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects
          .filter((project) =>
            project.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )
          )
          .sort((a, b) =>
            sortOrder === "asc"
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name)
          )
          .map((project) => (

            <div
              key={project.id}
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
                  onClick={() =>
                    navigate(`/projects/${project.id}`)
                  }
                  className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-xl transition"
                >
                  Open
                </button>

                <button
                  onClick={() =>
                    deleteProject(project.id)
                  }
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

                {editingProject === project.id && (
                  <div className="border border-gray-700 p-4 rounded mt-6">
                    <h3 className="text-xl mb-3">
                      Edit Project
                    </h3>

                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-3 rounded text-black mb-3"
                      placeholder="Project Name"
                    />

                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-3 rounded text-black mb-3"
                      placeholder="Project Description"
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
            </div>
          ))}
        </div>

        <div className="mb-4">
          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value)
            }
            className="bg-gray-900 border border-gray-700 p-3 rounded"
          >
            <option value="asc">
              A → Z
            </option>

            <option value="desc">
              Z → A
            </option>
          </select>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search Projects..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="bg-gray-900 border border-gray-700 p-3 rounded w-full"
          />
        </div>

          <button
            onClick={handleLogout}
            className="bg-white text-black px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;