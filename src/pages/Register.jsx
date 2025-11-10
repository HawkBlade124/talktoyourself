import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // assuming you already have this

function Register() {
  const [Username, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Tier] = useState("Free");
  const [Error, setError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useAuth(); // from your AuthContext

  const registerUser = async (e) => {
    e.preventDefault();

    if (Password !== ConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Username: Username.trim(),
          Email: Email.trim(),
          Password: Password.trim(),
          Tier
        }),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      const loginRes = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: Email.trim(),
          password: Password.trim(),
        }),
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        setError(loginData.error || "Auto-login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      navigate("/dashboard");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    if (ConfirmPassword && Password !== ConfirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  }, [Password, ConfirmPassword]);


  return (
    <div id="resReg" className="grid grid-cols-2 w-full items-center max-w-3xl m-auto mt-5">
      <div className="hook">
        <div className="hookPara">
          <h1>Why Sign Up?</h1>
          <p>
            Signing up for a free account gives you multiple benefits including (but
            not limited to):
          </p>
          <ul id="hookList" className="p-0 flex flex-col gap-5 mt-10">
            <li>Holding 5 thoughts at a time</li>
            <li>Favoriting your thoughts</li>
            <li>Sorting thoughts into categories</li>
            <li>And more!</li>
          </ul>
        </div>
      </div>

      <form onSubmit={registerUser} className="flex flex-col w-full">
        <div className="flex bg-white gap-x-5 mb-5 h-8 items-center rounded-md pl-2">
          <i className="fa-regular fa-user inputIcons p-1"></i>
          <input
            type="text"
            value={Username}
            onChange={(e) => setName(e.target.value)}
            placeholder="Username"
            className="w-full"
          />
        </div>

        <div className="flex bg-white gap-5 mb-5 h-9 items-center rounded-md pl-2">
          <i className="fa-regular fa-envelope inputIcons p-1"></i>
          <input
            type="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full"
          />
        </div>

        <div className="flex bg-white gap-5 mb-5 h-9 items-center rounded-md pl-2">
          <i className="fa-regular fa-lock inputIcons p-1"></i>
          <input
            type="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full"
          />
        </div>

        <div className="flex bg-white gap-5 mb-5 h-9 items-center rounded-md pl-2">
          <input
            type="password"
            value={ConfirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full"
          />
        </div>

        {Error && (
          <p className="text-red-500 text-sm mb-3 text-center">{Error}</p>
        )}

        <button type="submit" className="bg-green-500 text-white py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Register;