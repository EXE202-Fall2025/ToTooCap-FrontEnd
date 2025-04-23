import React, { useState } from "react";
import image_login from "../assets/image_login.png";
import image_google from "../assets/image_google.png";
import logo from "../assets/logo.png";
import "../assets/loginPage.css";
import { useNavigate } from "react-router-dom";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = () => {
    navigate("/register");
  };
  return (
    <div className="login-page">
      <div className="image-container">
        <img className="login-logo" src={logo} alt="logo" />
        <img className="login-image" src={image_login} alt="login visual" />
      </div>

      <div className="login-form">
        <h1
          style={{ fontSize: "50px", fontWeight: "bold", marginBottom: "20px" }}
        >
          Log in to Totoocap
        </h1>
        <p className="login-subtitle">Enter your account with us</p>

        <div className="form-container">
          <input
            className="login-input"
            type={showPassword}
            placeholder="Email or Phone Number"
          />
          <div style={{ position: "relative", width: "50%" }}>
            <input
              className="login-input"
              style={{ width: "100%", paddingRight: "40px" }}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />
            <span onClick={togglePassword} className="login-eye-icon">
              {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
            </span>
          </div>
          <div className="login-button-container">
            <div>
              <button className="login-button">Login</button>
            </div>
            <div className="login-forgot-password">Forget Password?</div>
          </div>

          <button className="login-google-button">
            <img
              className="login-google-image"
              src={image_google}
              alt="Google"
            />
            Sign up with Google
          </button>

          <p style={{ fontSize: "14px" }}>
            Already have an account?{" "}
            <span onClick={handleRegister} className="login-signin">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
