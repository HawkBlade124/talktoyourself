import { Link } from "react-router-dom";
import { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();
console.log("API URL:", import.meta.env.VITE_API_URL);

  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
      identifier: trimmedEmail,
      password: trimmedPassword,
    });

      if (res.data.success) {
        // Save token & user info
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
    return(
    <>
    <div className="bodyHeight">
        <div id="login" className="w-full flex justify-center">
            <div id="loginWrapper" className="justify-center">            
                <form className="flex flex-col w-xs gap-5" onSubmit={handleLogin}>                
                    <div className="flex items-center bg-white rounded-md h-8">
                        <i className="fa-regular fa-user inputIcons"></i>
                        <input type="text" value={email} className="rounded-md h-8 pl-5 w-full" name="identifier" placeholder="Username or Email" onChange={(e) => setEmail(e.target.value)}required/>
                    </div>
                    <div className="flex items-center bg-white rounded-md h-8">
                    <i className="fa-regular fa-lock inputIcons"></i>
                    <input type="password" value={password} className="rounded-md h-8 pl-5 w-full" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-400 hover:border-sky-500">Login</button>
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
    )
}

export default Login