import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
      <h1 className="text-2xl font-bold">Nav3D</h1>

<div className="hidden md:flex gap-6">
  <Link to="/">Home</Link>
  <Link to="/login">Login</Link>
  <Link to="/register">Register</Link>
</div>
    </nav>
  );
}

export default Navbar;