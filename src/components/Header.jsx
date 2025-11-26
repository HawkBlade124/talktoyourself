import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Header() {
  const { user, logout, loading } = useAuth();
  const [searchMessages, setSearchMessages] = useState('');
  const [searchResults, setSearchResults] = useState([])
  const [mobileMenu, setMobileMenu] = useState(false);

  const closeMobileMenu = () =>{
    setMobileMenu(false);
  }
  const location = useLocation();

  useEffect(() => {
    setMobileMenu(false);
  }, [location]);
  if (loading) {
    return null;
  }

  return (
    <header className="grid items-center pl-6 pr-6">
      <div className="desktopHeader flex justify-between items-center w-fulls">
        <Link to="/" className="logo">Talk To Yourself</Link>
        <div className="rightSide">
          <div className="userSpace max-w-3xl flex items-center gap-5">
            <Link to="/">Home</Link>
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
          <div className="hamburger cursor-pointer">
            <div className="top-bar"></div>
            <div className="middle-bar"></div>
            <div className="bottom-bar"></div>
          </div>
        </div>      
      </div>
      <div className="mobileHeader grid-cols-2 pt-5 pb-5">
        <Link to="/" className="logo">Talk To Yourself</Link>
        <div className="rightSide flex justify-end">
          <div className="hamburger flex flex-col cursor-pointer" onClick={() => setMobileMenu(!mobileMenu)}>
            <div className="bars top-bar"></div>
            <div className="bars middle-bar"></div>
            <div className="bars bottom-bar"></div>
          </div>
          {mobileMenu && 
          <div id="flyoutMenu" className="flex">
            <div className="bodyOverlay w-full h-full absolute right-0 top-0" onClick={closeMobileMenu}></div>
            <div className="userSpace max-w-3xl flex items-center">
              <div className="flyoutNavHead text-xl"><i className="fa-regular fa-xmark" onClick={closeMobileMenu}></i></div>
              <div className="w-full">
              <Link to="/">Home</Link>
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
            </div>
            </div>
            }
        </div>      
      </div>
    </header>
  );
}

export default Header;
