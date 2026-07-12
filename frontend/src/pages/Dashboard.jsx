import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import StatsCards from "../components/StatsCards";
import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import SearchSort from "../components/SearchSort";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const totalProjects = projects.length;

  const totalFiles = projects.reduce(
    (sum, project) => sum + (project.file_count || 0),
    0
  );

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const userResponse = await fetch(
        "http://127.0.0.1:8000/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = await userResponse.json();
      setUser(userData);

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
            description,
          }),
        }
      );

      if (!response.ok) return;

      await fetchDashboard();

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

      await fetchDashboard();

      setEditingProject(null);

    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen bg-black text-white flex">

      <Sidebar />

      <div className="flex-1 p-10 overflow-y-auto">

        <div className="mb-10">

          <h1 className="text-5xl font-extrabold">
            🚀 Nav3D Dashboard
          </h1>

          <p className="text-gray-400 mt-3">
            Manage your AI & 3D projects from one place.
          </p>

        </div>

        {user ? (
          <>

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

            <ProjectForm
              projectName={projectName}
              setProjectName={setProjectName}
              description={description}
              setDescription={setDescription}
              createProject={createProject}
            />

            <StatsCards
              totalProjects={totalProjects}
              totalFiles={totalFiles}
            />

            <SearchSort
              search={search}
              setSearch={setSearch}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />

            <h2 className="text-2xl font-bold mb-6">
              📁 My Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {projects
                .filter((project) =>
                  project.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .sort((a, b) =>
                  sortOrder === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
                )
                .map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    deleteProject={deleteProject}
                    openEditProject={openEditProject}
                    editingProject={editingProject}
                    editName={editName}
                    editDescription={editDescription}
                    setEditName={setEditName}
                    setEditDescription={setEditDescription}
                    saveProjectEdit={saveProjectEdit}
                  />
                ))}

            </div>

            <div className="mt-10">

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl transition"
              >
                Logout
              </button>

            </div>

          </>
        ) : (
          <div className="text-center text-xl">
            Loading...
          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;