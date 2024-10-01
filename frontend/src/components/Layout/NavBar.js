// src/components/Layout/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./../../styles/App.css"; // Import global styles

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">
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
              <Link className="nav-link" to="/employees">
                Employees List
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add-employee">
                Add Employee
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/manage-courses">
                Manage Courses
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
