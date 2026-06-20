function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Nav3D</h1>

        <div className="flex gap-6">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Login</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6">
        <h1 className="text-6xl font-bold mb-6">
          Generate 3D Models With AI
        </h1>

        <p className="text-gray-400 text-xl max-w-2xl">
          Create game-ready assets from text prompts,
          images, or multiple reference images.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold">
            Get Started
          </button>

          <button className="border border-gray-600 px-6 py-3 rounded-lg">
            Learn More
          </button>
        </div>
      </section>

    </div>
  );
}

export default App;