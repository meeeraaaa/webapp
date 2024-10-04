import React, { useEffect, useState } from "react";
import "./../../styles/App.css";
import axios from "axios";
import EmployeeDetailModal from "./EmployeeDetail";  // Import the modal component

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]); // State to hold employee data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to handle any errors
  const [selectedEmployee, setSelectedEmployee] = useState(null); // State to hold selected employee ID for modal
  const [employeeCourses, setEmployeeCourses] = useState([]); // State to hold selected employee's course data

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:1200/admin/employees');
        setEmployees(response.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching employees:', error);
        setError('Failed to load employee data');
        setLoading(false); // Even if an error occurs, stop the loading state
      }
    };

    fetchEmployees();
  }, []);

  // Function to fetch employee's detailed course information
  const fetchEmployeeCourses = async (employeeId) => {
    try {
      const response = await axios.get(`http://localhost:1200/admin/employees/${employeeId}/courses`);
      setEmployeeCourses(response.data);
      setSelectedEmployee(employeeId);  // Set the selected employee ID
    } catch (error) {
      console.error('Error fetching employee courses:', error);
      setError('Failed to load employee courses');
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setEmployeeCourses([]);  // Clear course data when modal is closed
  };

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
            <th>Joining Date</th>
            <th>Designation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td> {/* Display the row index */}
                <td>{user.name}</td> {/* Display employee name */}
                <td>{new Date(user.joindate).toLocaleDateString()}</td> {/* Display joining date */}
                <td>{user.designation.title}</td> {/* Display employee designation */}
                <td>
                  <button className="btn btn-info" onClick={() => fetchEmployeeCourses(user.id)}>
                    View Employee
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No employees found.</td> {/* Handle case with no employees */}
            </tr>
          )}
        </tbody>
      </table>

      {/* Render the employee details modal if an employee is selected */}
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
