// src/components/AdminDashboard/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./../../styles/App.css";
import Navbar from "./../Layout/NavBar";

const AdminDashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch total employees
        const employeeResponse = await axios.get("http://localhost:1200/admin/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalEmployees(employeeResponse.data.length); // Assuming the response contains an array of employees

        // Fetch total courses
        const courseResponse = await axios.get("http://localhost:1200/admin/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalCourses(courseResponse.data.length); // Assuming the response contains an array of courses
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Could not fetch dashboard data. Please try again.");
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mt-5">
      <Navbar />
      <h2 className="text-center">Welcome to the Admin Dashboard</h2>
      <p className="text-center">Here you will see overall employee performance metrics.</p>
      
      {error && <div className="alert alert-danger text-center">{error}</div>}
      
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Employees</h5>
              <p className="card-text">Number of Employees: {totalEmployees}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Courses</h5>
              <p className="card-text">Courses Assigned: {totalCourses}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
