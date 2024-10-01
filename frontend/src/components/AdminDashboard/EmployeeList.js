// src/components/AdminDashboard/EmployeesList.js
import React, { useEffect, useState } from "react";
import "./../../styles/App.css";
import axios from "axios"; 

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]); // State to hold employee data
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); // State to handle any errors

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:1200/admin/employees');
        const data = await response.json();
        setEmployees(data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching employees:', error);
        setLoading(false); // Even if an error occurs, stop the loading state
      }
    };
  
    fetchEmployees();
  }, []);
  if (loading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Employees List</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Total Courses</th>
            <th>Active Courses</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (  // Check if there are employees to display
            employees.map((user, index) => (  // Map through each employee
              <tr key={user.userId}>
                <td>{index + 1}</td>  {/* Display the row index */}
                <td>{user.name}</td>  {/* Display employee name */}
                <td>{user.designation}</td>  {/* Display employee designation */}
                <td>{user.total_courses}</td>  {/* Display total courses */}
                <td>{user.active_courses}</td>  {/* Display active courses */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No employees found.</td>  {/* Handle case with no employees */}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeesList;
