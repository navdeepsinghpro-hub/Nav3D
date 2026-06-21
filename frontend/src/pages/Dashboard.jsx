import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const navigate = useNavigate();

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

const projectsResponse = await fetch(
  "http://127.0.0.1:8000/projects",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

const projectsData = await projectsResponse.json();

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
        }),
      }
    );

    const newProject = await response.json();

    setProjects([
      ...projects,
      {
        id: newProject.project_id,
        name: newProject.name,
      },
    ]);

    setProjectName("");
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

const renameProject = async (id) => {
  const newName = prompt(
    "Enter new project name"
  );

  if (!newName) return;

  try {
    await fetch(
      `http://127.0.0.1:8000/projects/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        body: JSON.stringify({
          name: newName,
        }),
      }
    );

    setProjects(
      projects.map((project) =>
        project.id === id
          ? {
              ...project,
              name: newName,
            }
          : project
      )
    );
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

          <button
            onClick={createProject}
            className="bg-white text-black px-4 py-3 rounded"
          >
            Create Project
          </button>
        </div>

          <h3 className="text-xl mt-6 mb-3">
            My Projects
          </h3>

          <ul>
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex items-center gap-3 mb-2"
              >
                <span>
                  • {project.name}
                </span>

              <button
                onClick={() =>
                    renameProject(project.id)
                   }
                    className="bg-blue-600 px-3 py-1 rounded"
                  >
                    Rename
                  </button>

                <button
                  onClick={() =>
                    deleteProject(project.id)
                  }
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Delete
                </button>
                
              </li>
            ))}
          </ul>

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