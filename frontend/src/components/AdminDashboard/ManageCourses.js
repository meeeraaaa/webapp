// src/components/AdminDashboard/ManageCourses.js
import React, { useState } from "react";
import "./../../styles/App.css";

const ManageCourses = () => {
  const [course, setCourse] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Course added:", course);
    // Call API to add course to the database
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Manage Courses</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Course Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={course.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Course Description</label>
          <textarea
            className="form-control"
            name="description"
            value={course.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Course
        </button>
      </form>
    </div>
  );
};

export default ManageCourses;
