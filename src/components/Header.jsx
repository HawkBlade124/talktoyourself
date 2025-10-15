import { Link } from "react-router-dom";
import { useContext } from "react";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout, loading } = useAuth();

  if (loading) {

    return null;
  }

  return (
    <header className="flex items-center pt-2">
      <div className="logo">Talk To Yourself</div>
      <div className="searchMessages flex align-center w-full max-w-lg border-b-2 border-blue-400 text-white">
        <i className="fa-regular fa-magnifying-glass "/>
        <input type="text" placeholder="Search Previous " className="w-full"/>
      </div>
      <div className="userSpace max-w-3xl flex items-center gap-5">
        <Link to="/">Home</Link>
        <Link to="/about">How It Works</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/contact">Contact</Link>

        {user ? (
          <>
            <Link to="/dashboard">{user.Username}</Link>
            <span onClick={logout}>Logout</span>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
