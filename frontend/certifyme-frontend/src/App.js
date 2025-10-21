import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard"; // Add Dashboard
import "./styles/App.css";

function App() {
  return (
    <Router>
      {/* Navbar */}
      <div className="navbar">
        <h1 className="logo">CertifyMe</h1>
        <div className="links">
          <Link to="/signup" className="nav-link">Signup</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link> {/* Dashboard link */}
        </div>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard route */}
      </Routes>
    </Router>
  );
}

export default App;
