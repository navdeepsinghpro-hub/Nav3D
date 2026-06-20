function Register() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md border border-gray-800 rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6">Register</h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 bg-gray-900 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 bg-gray-900 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 bg-gray-900 rounded"
        />

        <button className="w-full bg-white text-black p-3 rounded">
          Create Account
        </button>
      </div>
    </div>
  );
}

export default Register;