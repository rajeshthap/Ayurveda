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
  FaFileMedical, FaAllergies, FaPills, FaThermometer, FaHandHoldingMedical, FaCommentDots
} from "react-icons/fa";

const TotalContact = () => {
  const { auth, logout, refreshAccessToken } = useAuth();
  const admin_id = auth?.unique_id;

  console.log("Admin ID:", admin_id);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // State for contact entries
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

  // Fetch contact entries from API
  const fetchEntries = async () => {
    setIsLoading(true);
    setIsFetching(true);
    try {
      const url = `${API_BASE_URL}/api/contact-us/`;
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
        throw new Error("Failed to fetch contact entries");
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
      } else if (result.id) {
        // Single object response
        entriesData = [result];
      } else {
        throw new Error("No contact entries found");
      }

      // Process data to format dates
      const processedEntries = entriesData.map(entry => {
        const processedEntry = { ...entry };
        
        // Format created date if it exists
        if (entry.created_at) {
          const createdDate = new Date(entry.created_at);
          processedEntry.formatted_date = createdDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
        
        return processedEntry;
      });

      setEntries(processedEntries);
    } catch (error) {
      console.error("Error fetching contact entries:", error);
      setMessage(error.message || "An error occurred while fetching contact entries");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  // Fetch contact entries on component mount
  useEffect(() => {
    fetchEntries();
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = entries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
              <h1 className="page-title mb-0">Total Contact Requests</h1>
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

            {/* Contact Count Card */}
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
                            <p className="mb-0">Total Contact Requests</p>
                          </div>
                        </div>
                        <div className="text-end">
                          <h2 className="display-4 fw-bold text-success">{entries.length}</h2>
                         
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Contact Entries Accordion */}
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
                        <p>No contact entries found.</p>
                      </div>
                    ) : (
                      <>
                        <Accordion defaultActiveKey="0">
                          {currentItems.map((entry, index) => (
                            <Accordion.Item eventKey={entry.id || index.toString()} key={entry.id || index}>
                              <Accordion.Header>
                                <div className="d-flex align-items-center w-100">
                                  <div className="consultation-avatar bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                                    {entry.full_name ? entry.full_name.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                  <div className="flex-grow-1">
                                    <h5 className="mb-0">{entry.full_name}</h5>
                                    <small>{entry.email}</small>
                                  </div>
                                  <div className="text-end me-3">
                                    <FaCalendarAlt className="me-1" />
                                    <small>{entry.formatted_date || entry.created_at}</small>
                                  </div>
                                </div>
                              </Accordion.Header>
                              
                              <Accordion.Body>
                                <Card className="consultation-card shadow-sm">
                                  <Card.Body className="p-4">
                                    <Row>
                                      {/* Contact Information Section */}
                                      <Col md={12} className="mb-4">
                                        <h6 className="section-title text-success"><FaUser className="me-2" />Contact Information</h6>
                                        <div className="info-group">
                                          <Row>
                                            <Col md={6}>
                                              <div className="info-item">
                                                <span className="info-label"><FaUser className="me-2 text-success" />Full Name:</span>
                                                <span className="info-value">{entry.full_name}</span>
                                              </div>
                                              <div className="info-item">
                                                <span className="info-label"><FaEnvelope className="me-2 text-success" />Email:</span>
                                                <span className="info-value">{entry.email}</span>
                                              </div>
                                              <div className="info-item">
                                                <span className="info-label"><FaPhone className="me-2 text-success" />Mobile Number:</span>
                                                <span className="info-value">{entry.mobile_number || 'Not provided'}</span>
                                              </div>
                                            </Col>
                                            <Col md={6}>
                                              <div className="info-item">
                                                <span className="info-label"><FaCalendarAlt className="me-2 text-success" />Date Submitted:</span>
                                                <span className="info-value">{entry.formatted_date || entry.created_at}</span>
                                              </div>
                                              <div className="info-item">
                                                <span className="info-label"><FaCommentDots className="me-2 text-success" />Message:</span>
                                                <span className="info-value">{entry.message}</span>
                                              </div>
                                            </Col>
                                          </Row>
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

export default TotalContact;