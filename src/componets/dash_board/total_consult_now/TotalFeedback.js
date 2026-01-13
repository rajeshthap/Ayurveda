import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Modal, Spinner, Badge, Table, Image, Pagination, Accordion } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import LeftNav from "../LeftNav";
import "../../../assets/css/totalconsultnow.css"
import DashBoardHeader from "../DashBoardHeader";
import {
  FaUserMd, FaPhone, FaEnvelope, FaHome, FaVenusMars, FaRulerVertical, FaWeight, FaCalendarAlt,
  FaHospital, FaStethoscope, FaNotesMedical, FaUserClock, FaInfoCircle, FaExclamationTriangle,
  FaHeartbeat, FaAppleAlt, FaBed, FaBrain, FaEye, FaTooth,
  FaRunning, FaClipboardList, FaUserMd as FaUser, FaIdCard, FaBaby, FaCut, FaUserNurse,
  FaFileMedical, FaAllergies, FaPills, FaThermometer, FaHandHoldingMedical, FaStar, FaCommentDots,
  FaCheckCircle, FaTimesCircle, FaQuoteLeft, FaQuoteRight
} from "react-icons/fa";

const TotalFeedback = () => {
  const { auth, logout, refreshAccessToken } = useAuth();
  const admin_id = auth?.unique_id;

  console.log("Admin ID:", admin_id);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // State for feedback entries
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [showTable, setShowTable] = useState(false);

  // Submission state
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success"); // 'success' or 'danger'
  const [showAlert, setShowAlert] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Base URL for API
  const API_BASE_URL = "https://mahadevaaya.com/trilokayurveda/trilokabackend";

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

  // Fetch feedback entries from API
  const fetchEntries = async () => {
    setIsLoading(true);
    setIsFetching(true);
    try {
      const url = `${API_BASE_URL}/api/patient-feedback/`;
      let response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth?.access}`,
        },
      });

      // If unauthorized, try refreshing token and retry once
      if (response.status === 401) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) throw new Error("Session expired");
        response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${newAccess}`,
          },
        });
      }

      if (!response.ok) {
        throw new Error("Failed to fetch feedback entries");
      }

      const result = await response.json();
      console.log("GET API Response:", result);

      // Handle both response formats: direct array or wrapped in success/data object
      let entriesData = [];
      if (Array.isArray(result)) {
        // Direct array response
        entriesData = result;
      } else if (result.success && result.data) {
        // Wrapped response
        entriesData = result.data;
      } else if (result.name) {
        // Single object response
        entriesData = [result];
      } else {
        throw new Error("No feedback entries found");
      }

      // Process data to format dates
      const processedEntries = entriesData.map(entry => {
        const processedEntry = { ...entry };
        
        // Format visit date if it exists
        if (entry.visit_date) {
          const entryDate = new Date(entry.visit_date);
          processedEntry.formatted_visit_date = entryDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
        
        return processedEntry;
      });

      setEntries(processedEntries);
    } catch (error) {
      console.error("Error fetching feedback entries:", error);
      setMessage(error.message || "An error occurred while fetching feedback entries");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  // Fetch feedback entries on component mount
  useEffect(() => {
    fetchEntries();
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = entries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Function to render star rating
  const renderStarRating = (rating) => {
    if (!rating) return null;
    
    let stars = [];
    const ratingValue = typeof rating === 'string' ? rating.toLowerCase() : rating;
    
    // Convert text rating to number
    let numericRating = 0;
    if (ratingValue === 'excellent') numericRating = 5;
    else if (ratingValue === 'very good') numericRating = 4;
    else if (ratingValue === 'good') numericRating = 3;
    else if (ratingValue === 'average') numericRating = 2;
    else if (ratingValue === 'poor') numericRating = 1;
    else if (typeof ratingValue === 'number') numericRating = ratingValue;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i <= numericRating ? "text-warning" : "text-secondary"} 
        />
      );
    }
    
    return <div className="star-rating">{stars}</div>;
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
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="page-title mb-0">Patient Feedback</h1>
            </div>

            {/* Alert for success/error messages */}
            {showAlert && (
              <Alert
                variant={variant}
                className="mb-4"
                onClose={() => setShowAlert(false)}
                dismissible
              >
                {message}
              </Alert>
            )}

            {/* Feedback Count Card */}
            {isLoading ? (
              <div className="text-center my-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <>
                <Row className="mb-4">
                  <Col md={6} lg={4}>
                    <Card 
                      className="h-100 shadow-sm card-hover cursor-pointer" 
                      onClick={() => setShowTable(!showTable)}
                    >
                      <Card.Body className="d-flex flex-row align-items-center justify-content-between p-3">
                        <div className="d-flex align-items-center">
                          <FaCommentDots className="text-success me-3" size={36} />
                          <div>
                            <p className="mb-0">Total Patient Feedback</p>
                          </div>
                        </div>
                        <div className="text-end">
                          <h2 className="display-4 fw-bold text-success">{entries.length}</h2>
                         
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Feedback Entries Accordion */}
                {showTable && (
                  <>
                    {isFetching && (
                      <div className="d-flex justify-content-center mb-3">
                        <Spinner animation="border" size="sm" role="status">
                          <span className="visually-hidden">Refreshing...</span>
                        </Spinner>
                      </div>
                    )}
                    
                    {entries.length === 0 ? (
                      <div className="text-center my-5">
                        <p>No feedback entries found.</p>
                      </div>
                    ) : (
                      <>
                        <Accordion defaultActiveKey="0">
                          {currentItems.map((entry, index) => (
                            <Accordion.Item eventKey={entry.id || index.toString()} key={entry.id || index}>
                              <Accordion.Header>
                                <div className="d-flex align-items-center w-100">
                                  <div className="consultation-avatar bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                                    {entry.name ? entry.name.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                  <div className="flex-grow-1">
                                    <h5 className="mb-0">{entry.name}</h5>
                                    <small>DOB: {entry.age}</small>
                                  </div>
                                  <div className="text-end me-3">
                                    <FaCalendarAlt className="me-1" />
                                    <small>{entry.formatted_visit_date || entry.visit_date}</small>
                                  </div>
                                  <div className="text-end">
                                    {renderStarRating(entry.overall_experience)}
                                  </div>
                                </div>
                              </Accordion.Header>
                              
                              <Accordion.Body>
                                <Card className="consultation-card shadow-sm">
                                  <Card.Body className="p-4">
                                    <Row>
                                      {/* Left Column: Patient Information */}
                                      <Col md={6} className="mb-4 mb-md-0">
                                        <h6 className="section-title text-success"><FaUser className="me-2" />Patient Information</h6>
                                        <div className="info-group">
                                          <div className="info-item">
                                            <span className="info-label"><FaUser className="me-2 text-success" />Name:</span>
                                            <span className="info-value">{entry.name}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label">DOB:</span>
                                            <span className="info-value">{entry.age}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaCalendarAlt className="me-2 text-success" />Visit Date:</span>
                                            <span className="info-value">{entry.formatted_visit_date || entry.visit_date}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaStethoscope className="me-2 text-success" />Treatment Taken:</span>
                                            <span className="info-value">{entry.treatment_taken}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label">Permission to Use:</span>
                                            <span className="info-value">
                                              {entry.permission_to_use ? 
                                                <span className="text-success"><FaCheckCircle /> Yes</span> : 
                                                <span className="text-danger"><FaTimesCircle /> No</span>
                                              }
                                            </span>
                                          </div>
                                        </div>
                                      </Col>

                                      {/* Right Column: Treatment Experience */}
                                      <Col md={6} className="mb-4 mb-md-0">
                                        <h6 className="section-title text-success"><FaNotesMedical className="me-2" />Treatment Experience</h6>
                                        <div className="info-group">
                                          <div className="info-item">
                                            <span className="info-label">Before Treatment:</span>
                                            <span className="info-value">{entry.before_treatment}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label">Experience During Treatment:</span>
                                            <span className="info-value">{entry.experience_during_treatment}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label">Improvement Notice:</span>
                                            <span className="info-value">{entry.improvement_notice}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label">Improvement Helped:</span>
                                            <span className="info-value">{entry.improvement_helped}</span>
                                          </div>
                                        </div>
                                      </Col>
                                    </Row>
                                    
                                    <Row>
                                      <Col md={12}>
                                        <h6 className="section-title text-success"><FaStar className="me-2" />Overall Experience</h6>
                                        <div className="info-group">
                                          <div className="info-item">
                                            <span className="info-label">Rating:</span>
                                            <span className="info-value">
                                              {renderStarRating(entry.overall_experience)}
                                              <span className="ms-2">{entry.overall_experience}</span>
                                            </span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaQuoteLeft className="me-2 text-success" />Message to Others:</span>
                                            <span className="info-value">
                                              <div className="mt-2 p-3 bg-light rounded">
                                                {entry.message_to_other}
                                              </div>
                                            </span>
                                          </div>
                                        </div>
                                      </Col>
                                    </Row>
                                  </Card.Body>
                                </Card>
                              </Accordion.Body>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="d-flex justify-content-center mt-4">
                            <Pagination>
                              <Pagination.Prev 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                              />
                              {[...Array(totalPages).keys()].map(page => (
                                <Pagination.Item 
                                  key={page + 1} 
                                  active={page + 1 === currentPage}
                                  onClick={() => handlePageChange(page + 1)}
                                >
                                  {page + 1}
                                </Pagination.Item>
                              ))}
                              <Pagination.Next 
                                onClick={() => handlePageChange(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                              />
                            </Pagination>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </Container>
        </div>
      </div>
    </>
  );
};

export default TotalFeedback;