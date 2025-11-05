import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useCallback, useEffect } from "react";
function Header() {
  const { user, logout, loading } = useAuth();
  const [searchMessages, setSearchMessages] = useState('');
  const [searchResults, setSearchResults] = useState([])

  if (loading) {
    return null;
  }



  return (
    <header className="flex items-center pt-2">
      <div className="logo">Talk To Yourself</div>

      <div className="userSpace max-w-3xl flex items-center gap-5">
        <Link to="/">Home</Link>
        <Link to="/about">How It Works</Link>
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
