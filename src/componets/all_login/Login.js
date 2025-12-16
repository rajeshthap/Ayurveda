import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../../assets/css/login.css";

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

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/Dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        /*
          Expected backend response example:
          {
            "token": "xxxxx",
            "user": { ... }
          }
        */

        // Save token
        localStorage.setItem("token", data.token);

        // Update auth context
        login(data);

        // Redirect
        navigate("/Dashboard", { replace: true });
      } else {
        setError(
          data.message ||
            data.error ||
            "लॉगिन विफल। कृपया सही जानकारी दर्ज करें।"
        );
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("सर्वर से कनेक्ट नहीं हो पाया");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col md={10} lg={8} xl={6} className="mt-5">
            <div className="login-container shadow-lg">
              <Row className="g-0">
                <Col md={6} className="login-image d-none d-md-block">
                  <div className="image-overlay">
                    <h2>स्वागत है</h2>
                    <p>कृपया अपने खाते में लॉगिन करें</p>
                  </div>
                </Col>

                <Col md={6} className="p-4 p-md-5">
                  <h3 className="mb-4 text-center">Login</h3>

                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email or Phone</Form.Label>
                      <Form.Control
                        type="text"
                        name="email_or_phone"
                        value={formData.email_or_phone}
                        onChange={handleChange}
                        placeholder="ईमेल या मोबाइल दर्ज करें"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <div className="password-input-container">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="पासवर्ड दर्ज करें"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </Form.Group>

                    <Button
                      type="submit"
                      className="login-btn w-100"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" animation="border" /> लॉगिन हो रहा है...
                        </>
                      ) : (
                        "लॉगिन"
                      )}
                    </Button>
                  </Form>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
