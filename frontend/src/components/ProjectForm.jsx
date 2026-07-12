function ProjectForm({
  projectName,
  setProjectName,
  description,
  setDescription,
  createProject,
}) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-8 shadow-lg">

      <h2 className="text-2xl font-bold mb-6">
        ➕ Create New Project
      </h2>

      <input
        type="text"
        placeholder="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="w-full bg-black border border-gray-700 rounded-xl p-3 mb-4"
      />

      <textarea
        placeholder="Project Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-black border border-gray-700 rounded-xl p-3 h-32 mb-4"
      />

      <button
        onClick={createProject}
        className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl transition"
      >
        🚀 Create Project
      </button>

    </div>
  );
}

export default ProjectForm;