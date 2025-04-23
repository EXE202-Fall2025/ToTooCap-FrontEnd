import React from "react";
import image_login from "../assets/image_login.png";
import image_google from "../assets/image_google.png";
import logo from "../assets/logo.png";
import "../assets/registerPage.css";
import { useNavigate } from "react-router-dom";
const RegisterPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };
  return (
    <div className="register-page">
      <div className="image-container">
        <img className="register-logo" src={logo} alt="logo" />
        <img
          className="register-image"
          src={image_login}
          alt="register visual"
        />
      </div>

      <div className="register-form">
        <h1
          style={{ fontSize: "50px", fontWeight: "bold", marginBottom: "20px" }}
        >
          Let's get started!
        </h1>
        <p className="register-subtitle">Create your account</p>

        <div className="form-container">
          <input className="register-input" type="text" placeholder="Name" />
          <input
            className="register-input"
            type="text"
            placeholder="Email or Phone Number"
          />
          <input
            className="register-input"
            type="password"
            placeholder="Password"
          />

          <button className="register-button">Create Account</button>

          <button className="register-google-button">
            <img
              className="register-google-image"
              src={image_google}
              alt="Google"
            />
            Sign up with Google
          </button>

          <p style={{ fontSize: "14px" }}>
            Already have an account?{" "}
            <span onClick={handleLogin} className="register-signin">
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
