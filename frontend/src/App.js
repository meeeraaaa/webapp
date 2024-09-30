import './styles/App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login"; 
import React from "react";
function App() {
  return (
    < >
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
      </Routes>
    </Router>
    </>
  );
}

export default App;
