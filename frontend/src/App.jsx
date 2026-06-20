function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Nav3D</h1>

        <div className="hidden md:flex gap-6">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Login</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-32 px-6">
        <h1 className="text-6xl font-bold mb-6">
          Generate 3D Models With AI
        </h1>

        <p className="text-gray-400 text-xl max-w-3xl mx-auto">
          Create game-ready assets from text prompts,
          images, and reference photos.
        </p>

        <button className="mt-10 bg-white text-black px-8 py-3 rounded-lg font-semibold">
          Start Creating
        </button>
      </section>

      {/* Features */}
      <section className="px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="border border-gray-800 rounded-xl p-6">
            <h3 className="text-2xl font-bold mb-3">
              Text To 3D
            </h3>

            <p className="text-gray-400">
              Generate 3D assets from natural language prompts.
            </p>
          </div>

          <div className="border border-gray-800 rounded-xl p-6">
            <h3 className="text-2xl font-bold mb-3">
              Image To 3D
            </h3>

            <p className="text-gray-400">
              Upload images and convert them into 3D models.
            </p>
          </div>

          <div className="border border-gray-800 rounded-xl p-6">
            <h3 className="text-2xl font-bold mb-3">
              Game Ready Assets
            </h3>

            <p className="text-gray-400">
              Export models for Unity, Unreal Engine, and Blender.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;