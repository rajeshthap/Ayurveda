import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../../assets/css/login.css";
import loginimg from '../../assets/images/login-img.png';

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email_or_phone: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 🔁 Redirect if logged in
  useEffect(() => {
    if (isAuthenticated) navigate("/Dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

// Login.js - Update the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email_or_phone || !formData.password) {
    setError("कृपया सभी फ़ील्ड भरें");
    return;
  }

  setIsLoading(true);
  setError("");

  try {
    const response = await fetch(
      "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/login/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();
    
    // Add these debug logs
    console.log("Full API Response:", data);
    console.log("Response status:", response.status);
    console.log("Access token:", data.access || data.token);
    console.log("Refresh token:", data.refresh);
    console.log("Role:", data.role);
    console.log("Unique ID:", data.unique_id || data.user_id || data.id);

    if (response.ok) {
      login(data);
      navigate("/Dashboard", { replace: true });
    } else {
      setError(data.message || "लॉगिन विफल");
    }
  } catch {
    setError("सर्वर से कनेक्ट नहीं हो पाया");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="login-box">

      <Container className="dashboard-body">
        <div className="ay-box-container">
          <div className="br-registration-heading">
            <Form onSubmit={handleSubmit}>
              <Row className="mt-3">
                <Col lg={6} md={6} sm={12} className="d-flex justify-content-center align-items-center login-img">
                  <img src={loginimg} className="img-fluid" alt="Login" />
                </Col>
                <Col lg={6} md={6} sm={12} className="p-4">
                  <div><h1 className="pb-4">Login</h1></div>

                  {/* Email / Mobile */}
                  <Form.Group className="mb-3">
                    <Form.Label className="br-label">
                      Email or Mobile Number <span className="br-span-star">*</span>
                    </Form.Label>
                    <Form.Control
                      className="mb-3"
                      name="email_or_phone"
                      placeholder="Email or Phone"
                      onChange={handleChange}
                    />
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3">
                    <Form.Label className="br-label">
                      Password <span className="br-span-star">*</span>
                    </Form.Label>
                    <div className="password-wrapper" style={{ position: "relative" }}>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                      />
                      <span
                        onClick={() => !isLoading && setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: isLoading ? "not-allowed" : "pointer",
                        }}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </Form.Group>

                  <div>
                    <span
                      className="forgot-btn mx-1"
                      type="button"
                      onClick={() => navigate("/ForgotPassword")}
                      disabled={isLoading}
                    >
                      Forgot Password ?
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className=" text-center mt-3">
                    <Button disabled={isLoading} type="submit" className="w-100 trilok-submit-btn">
                      {isLoading ? <Spinner size="sm" /> : "Login"}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Container>
    </div>
  );
}