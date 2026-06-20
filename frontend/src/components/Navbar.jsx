function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
      <h1 className="text-2xl font-bold">Nav3D</h1>

      <div className="hidden md:flex gap-6">
        <a href="#">Features</a>
        <a href="#">Pricing</a>
        <a href="#">Login</a>
      </div>
    </nav>
  );
}

export default Navbar;