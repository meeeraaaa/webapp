import './styles/App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login"; 
import Dashboard from "./components/AdminDashboard/Dashboard";
import EmployeeList from "./components/AdminDashboard/EmployeeList";
import AddEmployee from "./components/AdminDashboard/AddEmployee";
import ManageCourses from "./components/AdminDashboard/ManageCourses";
import React from "react";
function App() {
  return (
    < >
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/manage-courses" element={<ManageCourses />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
