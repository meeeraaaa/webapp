import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "./../../styles/App.css"; // Import global styles

const Navbar = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    navigate("/"); // Redirect to login page using navigate
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/admin-dashboard">
          Admin Dashboard
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
              <Link className="nav-link custom-nav-link" to="/employees">
                Employees List
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link custom-nav-link" to="/add-employee">
                Add Employee
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link custom-nav-link" to="/manage-courses">
                Manage Courses
              </Link>
            </li>
          </ul>

          {/* Logout button on the right end of the navbar */}
          <button className="btn btn-danger ms-auto" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
