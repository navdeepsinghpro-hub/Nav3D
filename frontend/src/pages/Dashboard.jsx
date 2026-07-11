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
      <h1 className="text-4xl font-bold mb-6">
        Dashboard
      </h1>

      {user ? (
        <div className="border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl mb-4">
            Welcome 👋
          </h2>

          <p className="mb-2">
            User ID: {user.user_id}
          </p>

          <p className="mb-6">
            Email: {user.email}
          </p>
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

          <input
            type="text"
            placeholder="Project Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
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

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900 p-5 rounded-xl">
                <h2 className="text-lg font-bold">
                  📁 Total Projects
                </h2>

                <p className="text-3xl mt-2">
                  {totalProjects}
                </p>
              </div>

              <div className="bg-gray-900 p-5 rounded-xl">
                <h2 className="text-lg font-bold">
                  📄 Total Files
                </h2>

                <p className="text-3xl mt-2">
                  {totalFiles}
                </p>
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
              className="border border-gray-700 rounded-xl p-5 bg-gray-900"
            >
             <h3 className="text-xl font-bold mb-2">
                📁 {project.name} (ID: {project.id})
              </h3>

              <p className="text-gray-400 mt-2">
                {project.description}
              </p>

              <p className="text-gray-400 text-sm mb-2">
                Project ID: {project.id}
              </p>

              <p className="text-blue-400 text-sm mb-4">
                📄 Files: {project.file_count || 0}
              </p>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() =>
                    navigate(`/projects/${project.id}`)
                  }
                  className="bg-green-600 px-3 py-1 rounded"
                >
                  Open
                </button>

                <button
                  onClick={() =>
                    deleteProject(project.id)
                  }
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Delete
                </button>

                <button
                  onClick={() => openEditProject(project)}
                  className="bg-blue-600 px-3 py-1 rounded"
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