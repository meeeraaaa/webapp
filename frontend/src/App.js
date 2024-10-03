import './styles/App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login"; 
import AdminDashboard from "./components/AdminDashboard/Dashboard.js";
import EmployeeList from "./components/AdminDashboard/EmployeeList";
import AddEmployee from "./components/AdminDashboard/AddEmployee";
import ManageCourses from "./components/AdminDashboard/ManageCourses";
import UserDashboard from "./components/UserDashboard/UserDashboard.js";
import UserProfile from "./components/UserDashboard/Profile";
import UserCourses from "./components/UserDashboard/UserCourses";
import React from "react";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* user routes */}
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<UserProfile />} /> 
          <Route path="/user/course/:id" element={<UserCourses />} /> {/* Assuming you have a CourseDetails component */}

          {/* admin routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/add-employee" element={<AddEmployee />} />
          <Route path="/manage-courses" element={<ManageCourses />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
