import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-72 bg-gray-950 border-r border-gray-800 min-h-screen p-6">

      <h1 className="text-3xl font-bold mb-10">
        🚀 Nav3D
      </h1>

      <div className="space-y-3">

        <Link
          to="/dashboard"
          className="block w-full text-left bg-blue-600 p-3 rounded-xl"
        >
          🏠 Dashboard
        </Link>

        <button className="w-full text-left hover:bg-gray-800 p-3 rounded-xl">
          📁 Projects
        </button>

        <button className="w-full text-left hover:bg-gray-800 p-3 rounded-xl">
          📤 Uploads
        </button>

        <button className="w-full text-left hover:bg-gray-800 p-3 rounded-xl">
          📊 Analytics
        </button>

        <button className="w-full text-left hover:bg-gray-800 p-3 rounded-xl">
          🤖 AI Studio
        </button>

        <button className="w-full text-left hover:bg-gray-800 p-3 rounded-xl">
          ⚙ Settings
        </button>

      </div>

      <div className="mt-12 p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700">

        <h3 className="font-bold text-lg">
          Nav3D
        </h3>

        <p className="text-sm mt-2 text-blue-100">
          AI-powered 3D Website Builder
        </p>

      </div>

    </div>
  );
}

export default Sidebar;