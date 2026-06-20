function Features() {
  return (
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
            Generate 3D assets from prompts.
          </p>
        </div>

        <div className="border border-gray-800 rounded-xl p-6">
          <h3 className="text-2xl font-bold mb-3">
            Image To 3D
          </h3>

          <p className="text-gray-400">
            Convert images into 3D models.
          </p>
        </div>

        <div className="border border-gray-800 rounded-xl p-6">
          <h3 className="text-2xl font-bold mb-3">
            Game Ready
          </h3>

          <p className="text-gray-400">
            Export for Unity and Unreal Engine.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Features;