import './App.css';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Footer from './components/Footer';

function App() {   

const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users'); // Backend URL
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  return (
    <>
      <Header />
      
 
      <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/about" element={<About />}/>
          <Route path="/contact" element={<Contact />}/>
          <Route path="/Login" element={<Login />}/>
      </Routes>
           <Footer />
    </>
  )
}

export default App
