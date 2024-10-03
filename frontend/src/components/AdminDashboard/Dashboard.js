// src/components/AdminDashboard/Dashboard.js
import React from "react";
import "./../../styles/App.css";
import Navbar from "./../Layout/NavBar";
const AdminDashboard = () => {
  return (
    <div className="container mt-5">
        <Navbar /> 
      <h2 className="text-center">Welcome to the Admin Dashboard</h2>
      <p className="text-center">Here you will see overall employee performance metrics.</p>
      
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Employees</h5>
              <p className="card-text">Number of Employees: </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Courses </h5>
              <p className="card-text">Courses Assigned: </p>
            </div>
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default AdminDashboard;
