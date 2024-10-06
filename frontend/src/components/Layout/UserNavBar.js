import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./../../styles/App.css"; // Import global styles

const UserNavBar = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    navigate("/"); // Redirect to login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/user-dashboard">
          User Dashboard
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link custom-nav-link" to="/profile">
                Profile
              </Link>
            </li>
            
            <li className="nav-item">
              <button className="nav-link custom-nav-link" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default UserNavBar;
