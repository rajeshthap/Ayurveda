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
    <Container className="login-page">
      <Row className="justify-content-center">
        <Col md={6}>
          <h3 className="text-center mb-3">Login</h3>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Control
              className="mb-3"
              name="email_or_phone"
              placeholder="Email or Phone"
              onChange={handleChange}
            />

            <div className="password-input-container mb-3">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <Button disabled={isLoading} type="submit" className="w-100">
              {isLoading ? <Spinner size="sm" /> : "Login"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
