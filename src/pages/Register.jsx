import { useState, useEffect } from "react";

function Register() {
  const [Username, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Tier] = useState("Free"); // Remove setTier since it's not user-editable
  const [Error, setError] = useState("");

  const registerUser = (e) => {
    e.preventDefault();

    if (Password !== ConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(""); // Clear previous errors

    fetch("http://localhost:5000/users", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: Username.trim(),
        Email: Email.trim(),
        Password: Password.trim(),
        Tier: Tier, // Include Tier directly
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        console.log("Response:", data);
        if (res.ok) {
          // Optionally redirect or show success message
          alert("Registration successful!");
        } else {
          setError(data.error || "Registration failed");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("An error occurred. Please try again.");
      });
  };

  useEffect(() => {
    if (ConfirmPassword && Password !== ConfirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  }, [Password, ConfirmPassword]);

  return (
    <div className="flex w-full justify-center gap-10 max-w-150 m-auto">
      <div className="hook">
        <div className="hookPara">
          <h1>Why Sign Up?</h1>
          <p>
            Signing up for an account gives you multiple benefits including (but
            not limited to):
          </p>
          <ul id="hookList" className="p-0 flex flex-col gap-5 mt-10">
            <li>Saving your links</li>
            <li>Journal Writing</li>
            <li>Attaching Images</li>
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