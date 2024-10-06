import React, { useEffect, useState } from "react";
import "./../../styles/App.css";
import axios from "axios";
import EmployeeDetailModal from "./EmployeeDetail"; 
import Navbar from "./../Layout/NavBar";

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeCourses, setEmployeeCourses] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:1200/admin/employees');
        setEmployees(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setError('Failed to load employee data');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const fetchEmployeeCourses = async (employeeId) => {
    try {
      const response = await axios.get(`http://localhost:1200/admin/employees/${employeeId}/courses`);
      setEmployeeCourses(response.data);
      setSelectedEmployee(employeeId);
    } catch (error) {
      console.error('Error fetching employee courses:', error);
      setError('Failed to load employee courses');
    }
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setEmployeeCourses([]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <Navbar />
      <h2 className="text-center mb-4">Employees List</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Joining Date</th>
            <th>Designation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{new Date(user.joindate).toLocaleDateString()}</td>
                <td>{user.designation.title}</td>
                <td>
                  <button className="btn btn-info" onClick={() => fetchEmployeeCourses(user.id)}>
                    View Employee
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No employees found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedEmployee && (
        <EmployeeDetailModal 
          employeeId={selectedEmployee} 
          courses={employeeCourses} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default EmployeesList;
