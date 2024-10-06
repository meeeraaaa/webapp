// src/components/AdminDashboard/AddEmployee.js
import React, { useState, useEffect } from "react";
import "./../../styles/App.css";
import axios from "axios"; 
import Navbar from "./../Layout/NavBar";

const AddEmployee = () => {
  const [user, setEmployee] = useState({
    name: "",
    email: "",
    designationId: "",
    experience: "",
    password: "",  
    sex: "",
  });

  const [designationOptions, setDesignationOptions] = useState([]);

  // Fetch designation options from the database
  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await axios.get("http://localhost:1200/admin/designations");
        setDesignationOptions(response.data); // Assuming the response is an array of { id, title }
      } catch (error) {
        console.error("Error fetching designations:", error);
      }
    };

    fetchDesignations();
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleDesignationChange = (e) => {
    const selectedId = e.target.value;
    setEmployee({ ...user, designationId: selectedId }); // Update designationId state
  };

  const handleChange = (e) => {
    setEmployee({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const response = await axios.post("http://localhost:1200/admin/add-employee", {
            name: user.name,
            email: user.email,
            password: user.password, 
            designationId: parseInt(user.designationId, 10),
            sex: user.sex,
            experience: parseInt(user.experience, 10),
        });

        console.log(response.data); // response for success
        // Reset form
        setEmployee({
            name: "",
            email: "",
            designationId: "",
            experience: "",
            password: "",
            sex: "",
        });
    } 
    catch (error) {
        console.error("Error adding employee:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container mt-5">
      <Navbar />
      <h2 className="text-center mb-4">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="add-employee-form">
        <div className="form-group mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Designation</label>
          <select
            className="form-control"
            name="designation"
            value={user.designationId}
            onChange={handleDesignationChange}
            required
          >
            <option value="">Select Designation</option>
            {designationOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.title}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group mb-3">
          <label>Experience (in years)</label>
          <input
            type="number"
            className="form-control"
            name="experience"
            value={user.experience}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Sex</label>
          <select
            className="form-control"
            name="sex"
            value={user.sex}
            onChange={handleChange}
          >
            <option value="" disabled>Select Sex</option>
            <option value="m">Male</option>
            <option value="f">Female</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary custom-btn">
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
