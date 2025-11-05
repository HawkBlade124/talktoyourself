// frontend/src/pages/Login.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function buildApiUrl() {
  const base = (import.meta.env.VITE_API_URL || window.location.origin).replace(/\/+$/, "");
  return base.includes("/api") ? base : `${base}/api`;
}



function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess(false);

  const apiBase = buildApiUrl(); 
  try {
    const res = await axios.post(
      `${apiBase}/login`,   // 👈 Always /api/login
      { identifier: identifier.trim(), password },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Response data:", res.data);

    if (res.data?.success) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setSuccess(true);
      window.location.href = "/dashboard";
      return;
    }

    setError(res.data?.message || "Unexpected API response.");
  } catch (err) {
    console.error("Login error:", err);
    
    setError(
      err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
    );
  }
};

  return (
    <>
      <div className="bodyHeight">
        <div id="login" className="w-full flex justify-center">
          <div id="loginWrapper" className="justify-center">
            <form className="flex flex-col w-xs gap-5" onSubmit={handleLogin}>
              <div className="flex items-center bg-white rounded-md h-8">
                <i className="fa-regular fa-user inputIcons"></i>
                <input
                  type="text"
                  value={identifier}
                  className="rounded-md h-8 pl-5 w-full"
                  name="identifier"
                  placeholder="Username or Email"
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center bg-white rounded-md h-8">
                <i className="fa-regular fa-lock inputIcons"></i>
                <input
                  type="password"
                  value={password}
                  className="rounded-md h-8 pl-5 w-full"
                  name="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-400 hover:border-sky-500"
              >
                Login
              </button>
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              {success && (
                <p className="text-green-600 text-sm mt-3">Login successful!</p>
              )}
            </form>
            Don't Have An Account? <Link to="/register">Register For One!</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
