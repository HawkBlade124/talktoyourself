import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Thought from "./pages/Thought";
import PageNotFound from "./pages/PageNotFound";
import Unauthorized from "./pages/Unauthorized";
import Lists from "./pages/Lists"
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const noLayoutRoutes = ["/dashboard", "/thought", "/lists"];

  const hideLayout = noLayoutRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!hideLayout && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lists" element={<Lists />} />
        <Route path="/lists/:ListName" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/thought/:ThoughtName" element={<Thought />} />
        <Route path="/404" element={<PageNotFound />} />
        <Route path="/Unauthorized" element={<Unauthorized />} />
      </Routes>      
      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
