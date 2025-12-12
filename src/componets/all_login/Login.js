import React, { useState, useContext } from "react";
import { Button, Col, Container, Row, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import ModifyAlert from "../alerts/ModifyAlert";
// import DevoteeImg from "../../assets/images/login.svg";
import "../../assets/css/login.css";

export default function Login() {
//   const { login, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email_or_phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showModifyAlert, setShowModifyAlert] = useState(false);

  // Handle Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email_or_phone || !formData.password) {
      setAlertMessage("Please fill all required fields!");
      setShowModifyAlert(true);
      return;
    }

    // const response = await login(formData);

    // if (response?.success) {
    //   navigate("/dashboard");
    // } else {
    //   setAlertMessage(response?.message || "Invalid credentials");
    //   setShowModifyAlert(true);
    // }
  };

  return (
    <>
      <div className="dynamic-login">
        <Container>
          <Row className="login-box">
            <Col lg={6} className="login-left">
              {/* <img src={DevoteeImg} className="img-fluid" alt="Login" /> */}
            </Col>

            <Col lg={6} className="login-right">
              <h2 className="login-title">Login</h2>

              <Form onSubmit={handleSubmit}>
                
                {/* Email or Phone */}
                <Form.Group className="mb-3">
                  <Form.Label>Email or Mobile Number *</Form.Label>
                  <Form.Control
                    type="text"
                    name="email_or_phone"
                    placeholder="Enter Email or Mobile"
                    value={formData.email_or_phone}
                    onChange={handleChange}
                    // disabled={authLoading}
                  />
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3">
                  <Form.Label>Password *</Form.Label>
                  <div className="password-input">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={handleChange}
                    //   disabled={authLoading}
                    />
                    <i
                      className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>
                </Form.Group>

                {/* Forgot Password */}
                <p
                  className="forgot-link"
                  onClick={() => navigate("/ForgotPassword")}
                >
                  Forgot Password?
                </p>

                {/* Login Button */}
                <Button type="submit" className="login-btn" >
                 login
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>

      {/* <ModifyAlert
        message={alertMessage}
        show={showModifyAlert}
        setShow={setShowModifyAlert}
      /> */}
    </>
  );
}
