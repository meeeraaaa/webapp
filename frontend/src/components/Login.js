import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Email:", email, "Password:", password);

    try {
      const response = await axios.post("http://localhost:1200/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token); 
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } 
       else {
        //navigate("/user-dashboard");
        alert("Access denied. You do not have admin privileges.");
       }
    } catch (error) {
      console.log("Login failed. Please check your credentials.");
      console.error(error);
    }
  };


  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-box">
        <div className="login-image">
          <img
            src={require("../assets/login-illustration.png")}
            alt="Login Illustration"
            className="login-image"
          />
          <div className="login-text"> Evolve. </div> 
        </div>
        <div className="login-form">
          <h2 className="text-center mb-4">Welcome Back!</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
