import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please fill all fields.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setLoading(false);
        setMessage(data.detail || data.message || "Login failed");
        setMessageType("error");
        return;
      }

      localStorage.setItem("token", data.token);

      setLoading(false);

      setMessage("✅ Login Successful!");
      setMessageType("success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      console.error(error);

      setLoading(false);

      setMessage("Server Error");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="w-full max-w-md border border-gray-800 rounded-xl p-8">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

        {message && (
          <div
            className={`mb-4 p-3 rounded font-semibold text-center ${
              messageType === "success"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-900 rounded outline-none"
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-2 bg-gray-900 rounded outline-none"
        />

        <label className="flex items-center gap-2 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() =>
              setShowPassword(!showPassword)
            }
          />
          Show Password
        </label>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-black p-3 rounded font-semibold disabled:bg-gray-500"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>

    </div>
  );
}

export default Login;