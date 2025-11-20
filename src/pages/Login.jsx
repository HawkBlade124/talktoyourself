// frontend/src/pages/Login.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function buildApiUrl() {
  const base = (import.meta.env.VITE_API_URL || window.location.origin).replace(/\/+$/, "");
  return base.includes("/api") ? base : `${base}/api`;
}



function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hasError, setHasError] = useState("");
  const [success, setSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess(false);

  const apiBase = buildApiUrl(); 
  try {
    const res = await axios.post(
      `${apiBase}/login`,
      { identifier: identifier.trim(), password },
      { headers: { "Content-Type": "application/json" } }
    );    

if (res.data?.success) {
  if (rememberMe) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  } else {
    sessionStorage.setItem("token", res.data.token);
    sessionStorage.setItem("user", JSON.stringify(res.data.user));
  }

  setSuccess(true);
  navigate("/dashboard");

  setTimeout(() => {
    window.location.reload();
  }, 50);

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
const UserSubmitErrors = () => {
  if (!identifier.trim() || !password.trim()) {
    setError("Username and password fields cannot be empty.");
    setHasError(true);
    return false;
  }

  setError("");
  setHasError(false);  
  return true;
};;


  return (
    <>
      <div className="bodyHeight">
        <div id="login" className="w-full flex justify-center">
          <div id="loginWrapper" className="flex flex-col justify-center gap-6">
            <h1> Login</h1>
            <form className="flex flex-col w-xs gap-5" onSubmit={handleLogin}>
              <div className="flex items-center bg-white rounded-md h-8">
                <i className="fa-regular fa-user inputIcons"></i>
                <input type="text" className="loginInput rounded-md h-8 pl-5 w-full" name="identifier" placeholder="Username or Email" value={identifier} onChange={(e) => { setIdentifier(e.target.value);   setHasError(false); setError("");}} required />
              </div>
              <div className="flex items-center bg-white rounded-md h-8">
                <i className="fa-regular fa-lock inputIcons"></i>
                <input type="password" value={password} className="loginInput rounded-md h-8 pl-5 w-full" name="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value); setHasError(false); setError(""); }} required />
                <i className="fa-solid fa-eye"></i>
              </div>
              <div id="rememberMe">Remember Me? <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} name="remember" /></div>
              <button type="submit" className="bg-green-500 hover:bg-green-400 hover:border-sky-500 p-2 rounded-md cursor-pointer" onClick={() => { const ok = UserSubmitErrors(); if (ok) handleLogin();}} >
                Login
              </button>              
              {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
              {success && (
                <p className="text-green-600 text-sm mt-3">Login successful!</p>
              )}
            </form>
            <div className="flex justify-between">Don't Have An Account? <Link to="/register">Register For One!</Link></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
