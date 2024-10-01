// src/components/AdminDashboard/AddEmployee.js
import React, { useState } from "react";
import "./../../styles/App.css";
import axios from "axios"; 

const AddEmployee = () => {
  const [user, setEmployee] = useState({
    name: "",
    email: "",
    designationId: "",
    experience: "",
    password: "",  
    sex: "",
  });

  const designationOptions = [
    { title: 'SDE', id: 26 },
    { title: 'SDE2', id: 27 },
    { title: 'Enabler', id: 28 },
    { title: 'Consultant', id: 29 },
    { title: 'Architect', id: 30 }
  ];

  const handleDesignationChange = (e) => {
    const selectedId = e.target.value;
    setEmployee({ ...user, designationId: selectedId }); // Update designationId state
  };

  const handleChange = (e) => {
    setEmployee({ ...user, [e.target.name]: e.target.value });
  };
  console.log(user);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Employee to be added");
    console.log(user);
    
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
        console.error("Error:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add New Employee</h2>
      <form onSubmit={handleSubmit}>
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
            onChange={handleDesignationChange} // Handle selection change
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
        <button type="submit" className="btn btn-primary">
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
