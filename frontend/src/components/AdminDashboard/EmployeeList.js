// src/components/AdminDashboard/EmployeesList.js
import React, { useEffect, useState } from "react";
import "./../../styles/App.css";
import axios from "axios"; 

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]); // State to hold employee data
  const [loading, setLoading] = useState(true); 
  //const [error, setError] = useState(null); // State to handle any errors

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:1200/admin/employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
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
          {employees.length > 0 ? (
            employees.map((employee, index) => (
              <tr key={employee.userId}>
                <td>{index + 1}</td>
                <td>{employee.name}</td>
                <td>{employee.designation}</td>
                <td>{employee.total_courses}</td>
                <td>{employee.active_courses}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No employees found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeesList;
