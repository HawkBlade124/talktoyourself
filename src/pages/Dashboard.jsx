import { useAuth } from "../context/AuthContext.jsx";

function Dashboard() {
   const { user } = useAuth();

  if (!user) return <p>No user logged in.</p>;

  return (
    <div className="w-md">
      <h1>Welcome, {user.Username}!</h1>
    </div>
  );
}

export default Dashboard;
