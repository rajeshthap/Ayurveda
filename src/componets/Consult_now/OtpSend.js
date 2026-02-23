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
import "../../assets/css/login.css";

export default function OTPFlow() {
  const navigate = useNavigate();
  
  // State to track current step: 'email' or 'otp'
  const [currentStep, setCurrentStep] = useState('email');
  
  // Form data
  const [formData, setFormData] = useState({
    email: "",
    code: "",
  });

  // UI states
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (currentStep === 'otp' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, currentStep]);

  // Reset timer when moving to OTP step
  useEffect(() => {
    if (currentStep === 'otp') {
      setTimeLeft(60);
      setCanResend(false);
    }
  }, [currentStep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'code') {
      // Only allow numbers for OTP code
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 6) {
        setFormData({ ...formData, [name]: numericValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setError("Please enter your email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/send-otp/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("OTP has been sent to your email!");
        // Move to OTP step after 1.5 seconds
        setTimeout(() => {
          setCurrentStep('otp');
          setSuccessMessage("");
        }, 1500);
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Could not connect to server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code) {
      setError("Please enter OTP");
      return;
    }

    if (formData.code.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/verify-otp/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            code: formData.code
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("OTP successfully verified!");
        
        // Store user data if provided
        if (data.token || data.user) {
          localStorage.setItem('token', data.token || '');
          localStorage.setItem('user', JSON.stringify(data.user || {}));
        }
        
        // Redirect to consultation form after successful verification
        setTimeout(() => {
          navigate(`/ConsultNow?email=${encodeURIComponent(formData.email)}`, { replace: true });
        }, 1500);
      } else {
        setError(data.message || "OTP verification failed. Please try again.");
      }
    } catch (err) {
      setError("Could not connect to server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/send-otp/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("OTP has been resent!");
        setTimeLeft(60);
        setCanResend(false);
        setFormData({ ...formData, code: "" });
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Could not connect to server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Format time for countdown
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Go back to email step
  const handleBackToEmail = () => {
    setCurrentStep('email');
    setFormData({ ...formData, code: "" });
    setError("");
    setSuccessMessage("");
  };

  return (
    <div className="login-box">
      <Container className="dashboard-body">
        <div className="ay-box-container">
          <div className="br-registration-heading">
            <Form onSubmit={currentStep === 'email' ? handleEmailSubmit : handleOTPSubmit}>
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12} className="p-4">
                  
                  {/* Email Step */}
                  {currentStep === 'email' && (
                    <>
                      <div>
                        <h1 className="pb-4">Send OTP</h1>
                        <p className="text-muted mb-4">
                          Enter your email address and we will send you an OTP
                        </p>
                      </div>

                      {/* Error Alert */}
                      {error && (
                        <Alert variant="danger" className="mb-3">
                          {error}
                        </Alert>
                      )}

                      {/* Success Alert */}
                      {successMessage && (
                        <Alert variant="success" className="mb-3">
                          {successMessage}
                        </Alert>
                      )}

                      {/* Email Field */}
                      <Form.Group className="mb-4">
                        <Form.Label className="br-label">
                          Email Address <span className="br-span-star">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          className="mb-3"
                          name="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={isLoading}
                        />
                        <Form.Text className="text-muted">
                          We will send OTP to this email
                        </Form.Text>
                      </Form.Group>

                      {/* Submit Button */}
                      <div className="text-center mt-4">
                        <Button 
                          disabled={isLoading} 
                          type="submit" 
                          className=" trilok-otp-btn"
                          size="lg"
                        >
                          {isLoading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              Sending OTP...
                            </>
                          ) : (
                            "Send OTP"
                          )}
                        </Button>
                      </div>

                   
                    </>
                  )}

                  {/* OTP Step */}
                  {currentStep === 'otp' && (
                    <>
                      <div>
                        <h1 className="pb-4 ">Verify OTP</h1>
                        <p className="text-muted mb-2">
                          We have sent OTP to: <strong>{formData.email}</strong>
                        </p>
                        <p className="text-muted mb-4">
                          Please enter the 6-digit OTP
                        </p>
                      </div>

                      {/* Error Alert */}
                      {error && (
                        <Alert variant="danger" className="mb-3">
                          {error}
                        </Alert>
                      )}

                      {/* Success Alert */}
                      {successMessage && (
                        <Alert variant="success" className="mb-3">
                          {successMessage}
                        </Alert>
                      )}

                      {/* OTP Input Field */}
                      <Form.Group className="mb-4">
                        <Form.Label className="br-label">
                          OTP Code <span className="br-span-star">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          className="mb-3 text-center"
                          style={{ fontSize: '14px',  }}
                          name="code"
                          placeholder="Enter Code"
                          value={formData.code}
                          onChange={handleChange}
                          maxLength={6}
                          required
                          disabled={isLoading}
                          autoComplete="one-time-code"
                        />
                        <Form.Text className="text-muted">
                          Enter 6-digit OTP
                        </Form.Text>
                      </Form.Group>

                      {/* Submit Button */}
                      <div className="text-center mt-4">
                        <Button 
                          disabled={isLoading || formData.code.length !== 6} 
                          type="submit" 
                          className="trilok-otp-btn"
                          size="lg"
                        >
                          {isLoading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                              />
                              Verifying...
                            </>
                          ) : (
                            "Verify OTP"
                          )}
                        </Button>
                      </div>

                      {/* Resend OTP */}
                      <div className="text-center mt-3">
                        {canResend ? (
                          <Button 
                            variant="link" 
                            className="p-0 text-decoration-none"
                            onClick={handleResendOTP}
                            disabled={isLoading}
                          >
                            Resend OTP
                          </Button>
                        ) : (
                          <span className="text-muted">
                            Resend OTP ({formatTime(timeLeft)})
                          </span>
                        )}
                      </div>

                      {/* Back Button */}
                      <div className="text-center mt-2">
                        <Button 
                          variant="link" 
                          className="p-0 text-decoration-none"
                          onClick={handleBackToEmail}
                        >
                          <i className="fas fa-arrow-left me-2"></i>
                          Change Email
                        </Button>
                      </div>
                    </>
                  )}

                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Container>
    </div>
  );
}