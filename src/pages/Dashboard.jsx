import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx"; // make sure this path matches your file

function Dashboard() {
  const { user } = useContext(AuthContext);

  if (!user) return <p>No user logged in.</p>;

  return (
    <div className="w-md">
      <h1>Welcome, {user.Username}!</h1>
    </div>
  );
}

export default Dashboard;
