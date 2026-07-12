function StatsCards({ totalProjects, totalFiles }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl hover:scale-105 transition">
        <p className="text-gray-400">📁 Projects</p>

        <h2 className="text-5xl font-bold text-blue-400 mt-3">
          {totalProjects}
        </h2>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl hover:scale-105 transition">
        <p className="text-gray-400">📄 Files</p>

        <h2 className="text-5xl font-bold text-green-400 mt-3">
          {totalFiles}
        </h2>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl hover:scale-105 transition">
        <p className="text-gray-400">💾 Storage</p>

        <h2 className="text-5xl font-bold text-yellow-400 mt-3">
          {(totalFiles * 2).toFixed(0)} MB
        </h2>
      </div>

    </div>
  );
}

export default StatsCards;