import React, { useState, useEffect } from "react";
import { Container, Card, Button, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

import "../../assets/css/dashboard.css";
import DashBoardHeader from "./DashBoardHeader";
import LeftNav from "./LeftNav";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { logout, auth } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [consultationHistory, setConsultationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check device width
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setSidebarOpen(width >= 1024);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch consultation history
  const fetchConsultationHistory = async () => {
    setIsLoading(true);
    setError("");

    try {
      // First, check if we have an access token
      if (!auth.access) {
        throw new Error("Not authenticated");
      }

      // API endpoint for fetching consultation history
      const response = await axios.get(
        "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/consultation-combined/",
        {
          headers: {
            Authorization: `Bearer ${auth.access}`,
          },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        // Sort consultations by created_at date (latest first)
        const sortedHistory = [...response.data].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
          return dateB - dateA;
        });
        
        // Process dates for display
        const processedHistory = sortedHistory.map(consultation => ({
          ...consultation,
          formatted_created_at: consultation.created_at ? new Date(consultation.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : "Not available"
        }));
        
        setConsultationHistory(processedHistory);
      } else {
        console.warn("Received unexpected data format:", response.data);
        setConsultationHistory([]);
      }
    } catch (error) {
      console.error("Error fetching consultation history:", error);
      
      if (error.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        // Optionally, call logout here
      } else if (error.response?.status === 403) {
        setError("You don't have permission to access this information.");
      } else if (error.message === "Not authenticated") {
        setError("Please log in to view your consultation history.");
      } else {
        setError("Failed to fetch consultation history. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch history on component mount
  useEffect(() => {
    if (auth.access) {
      fetchConsultationHistory();
    }
  }, [auth.access]);

  // Handle starting new consultation
  const handleStartNew = () => {
    navigate("/ConsultNow");
  };

  // Handle resuming consultation
  const handleResume = (consultation) => {
    // Pass consultation data to ConsultNow component
    // We'll use query params or state to pre-fill the form
    const email = encodeURIComponent(consultation.email || "");
    navigate(`/ConsultNow?email=${email}`);
  };

  // Handle viewing consultation details
  const handleView = (consultation) => {
    // For now, redirect to ConsultNow with view mode
    const email = encodeURIComponent(consultation.email || "");
    navigate(`/ConsultNow?email=${email}&view=true`);
  };

  // Handle previewing consultation report
  const handlePreview = (consultation) => {
    // Create a preview modal or redirect to report preview
    console.log("Previewing report for consultation:", consultation);
    alert("Report preview functionality will be implemented soon!");
  };

  // Get progress percentage based on completed sections
  const getProgress = (consultation) => {
    let completedSections = 0;
    if (consultation.full_name) completedSections++; // Section 1
    if (consultation.section2?.length > 0) completedSections++; // Section 2
    if (consultation.section3?.length > 0) completedSections++; // Section 3
    if (consultation.section4?.length > 0) completedSections++; // Section 4
    
    return Math.round((completedSections / 4) * 100);
  };

  // Get status text based on progress
  const getStatus = (consultation) => {
    const progress = getProgress(consultation);
    if (progress === 100) return "Complete";
    if (progress > 0) return "In Progress";
    return "Not Started";
  };

  return (
    <>
      <div className="dashboard-container">
        {/* Left Sidebar */}
        <LeftNav
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
          isTablet={isTablet}
        />

        {/* Main Content */}
        <div className="main-content">
          <DashBoardHeader toggleSidebar={toggleSidebar} />

          <Container fluid className="dashboard-body dashboard-main-container">
            <h1 className="page-title">Dashboard</h1>
            <p>Welcome to your consultation dashboard!</p>

            {/* Error Message */}
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            {/* Start New Consultation Button */}
            <div className="mb-4">
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleStartNew}
                className="start-new-button"
              >
                <i className="fas fa-plus-circle"></i> Start New Consultation
              </Button>
            </div>

            {/* Consultation History */}
            <h2 className="section-title">Your Consultation History</h2>
            
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading consultation history...</p>
              </div>
            ) : consultationHistory.length > 0 ? (
              <Row xs={1} md={2} lg={3} className="g-4">
                {consultationHistory.map((consultation, index) => (
                  <Col key={index}>
                    <Card className="consultation-card">
                      <Card.Body>
                        <Card.Title>
                          <i className="fas fa-file-medical-alt"></i> Consultation Report
                        </Card.Title>
                        
                        <Card.Subtitle className="mb-2 text-muted">
                          <i className="fas fa-calendar-alt"></i> {consultation.formatted_created_at}
                        </Card.Subtitle>

                        <div className="consultation-details">
                          <p>
                            <strong>Name:</strong> {consultation.full_name || "Not provided"}
                          </p>
                          <p>
                            <strong>Email:</strong> {consultation.email || "Not provided"}
                          </p>
                          <p>
                            <strong>Phone:</strong> {consultation.mobile_number || "Not provided"}
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="progress-container">
                            <div className="progress-info">
                              <span>Progress: {getProgress(consultation)}%</span>
                              <span className={`status-badge status-${getStatus(consultation).toLowerCase().replace(' ', '-')}`}>
                                {getStatus(consultation)}
                              </span>
                            </div>
                            <div className="progress">
                              <div
                                className="progress-bar"
                                role="progressbar"
                                style={{
                                  width: `${getProgress(consultation)}%`,
                                  backgroundColor: getProgress(consultation) === 100 ? "#28a745" : "#007bff"
                                }}
                                aria-valuenow={getProgress(consultation)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                {getProgress(consultation)}%
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="card-actions">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleResume(consultation)}
                            className="mr-2"
                          >
                            <i className="fas fa-edit"></i> Resume
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleView(consultation)}
                          >
                            <i className="fas fa-eye"></i> View Details
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handlePreview(consultation)}
                          >
                            <i className="fas fa-file-pdf"></i> Preview Report
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="empty-state">
                <i className="fas fa-inbox-empty"></i>
                <h3>No Consultation History</h3>
                <p>You haven't started any consultations yet. Click "Start New Consultation" to begin.</p>
              </div>
            )}
          </Container>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
