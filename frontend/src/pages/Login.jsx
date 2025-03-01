import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/custom.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Logged In:", formData);
    navigate("/home");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg login-card">
        <h2 className="text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" className="form-control my-2" placeholder="Email" required onChange={handleChange} />
          <input type="password" name="password" className="form-control my-2" placeholder="Password" required onChange={handleChange} />
          <button type="submit" className="btn btn-primary w-100 mt-2">Login</button>
        </form>
        <p className="text-center mt-3">New user? <span className="text-primary" onClick={() => navigate("/register")}>Register</span></p>
      </div>
    </div>
  );
};

export default Login;
