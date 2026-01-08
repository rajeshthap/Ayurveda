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
  FaCheckCircle, FaTimesCircle, FaQuoteLeft, FaQuoteRight, FaChartLine, FaHeart
} from "react-icons/fa";

const TotalQol = () => {
  const { auth, logout, refreshAccessToken } = useAuth();
  const admin_id = auth?.unique_id;

  console.log("Admin ID:", admin_id);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // State for QoL entries
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

  // Fetch QoL entries from API
  const fetchEntries = async () => {
    setIsLoading(true);
    setIsFetching(true);
    try {
      const url = `${API_BASE_URL}/api/heart-failure-qol/`;
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
        throw new Error("Failed to fetch QoL entries");
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
        throw new Error("No QoL entries found");
      }

      // Process data to format dates
      const processedEntries = entriesData.map(entry => {
        const processedEntry = { ...entry };
        
        // Format diagnosis date if it exists
        if (entry.diagnosis_date) {
          const entryDate = new Date(entry.diagnosis_date);
          processedEntry.formatted_diagnosis_date = entryDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
        
        // Format created date if it exists
        if (entry.created_at) {
          const createdDate = new Date(entry.created_at);
          processedEntry.formatted_created_date = createdDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
        
        return processedEntry;
      });

      setEntries(processedEntries);
    } catch (error) {
      console.error("Error fetching QoL entries:", error);
      setMessage(error.message || "An error occurred while fetching QoL entries");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  // Fetch QoL entries on component mount
  useEffect(() => {
    fetchEntries();
  }, []);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = entries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Updated question labels mapping
  const questionLabels = {
    "q1_swelling": "Causing swelling in your ankles or legs?",
    "q2_rest_needed": "Making you sit or lie down to rest during the day?",
    "q3_walking_difficulty": "Making your walking about or climbing stairs difficult?",
    "q4_going_out_difficulty": "Making your going places away from home difficult?",
    "q5_shortness_of_breath": "Making you short of breath?",
    "q6_fatigue": "Making you tired, fatigued, or low on energy?",
    "q7_burden_feeling": "Making you feel you are a burden to your family or friends?",
    "q8_loss_of_control": "Making you feel a loss of self-control in your life?",
    "q9_worry": "Making you worry?",
    "q10_concentration_issue": "Making it difficult for you to concentrate or remember things?",
    "q11_depression": "Making you feel depressed?",
    "q12_social_difficulty": "Making your relating to or doing things with your friends or family difficult?",
    "q13_work_difficulty": "Making your working to earn a living difficult?",
    "q14_hobby_difficulty": "Making your recreational pastimes, sports, or hobbies difficult?",
    "q15_sexual_difficulty": "Making your sexual activities difficult?",
    "q16_sleep_difficulty": "Making your sleeping well at night difficult?",
    "q17_hospitalization": "Making you stay in a hospital?",
    "q18_financial_burden": "Costing you money for medical care?",
    "q19_treatment_side_effects": "Giving you side effects from treatments?",
    "q20_management_quality": "In general, how well do you feel your heart failure is managed?",
    "q21_overall_health": "How would you rate your overall health?"
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
              <h1 className="page-title mb-0">Heart Failure Quality of Life</h1>
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

            {/* QoL Count Card */}
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
                          <FaHeart className="text-success me-3" size={36} />
                          <div>
                            <p className="mb-0">Total QoL Assessments</p>
                          </div>
                        </div>
                        <div className="text-end">
                          <h2 className="display-4 fw-bold text-success">{entries.length}</h2>
                         
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* QoL Entries Accordion */}
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
                        <p>No QoL entries found.</p>
                      </div>
                    ) : (
                      <>
                        <Accordion defaultActiveKey="0">
                          {currentItems.map((entry, index) => (
                            <Accordion.Item eventKey={entry.id || index.toString()} key={entry.id || index}>
                              <Accordion.Header>
                                <div className="d-flex align-items-center w-100">
                                  <div className="consultation-avatar bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                                    {entry.patient_name ? entry.patient_name.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                  <div className="flex-grow-1">
                                    <h5 className="mb-0">{entry.patient_name}</h5>
                                    <small>{entry.gender}, {entry.age} years</small>
                                  </div>
                                  <div className="text-end me-3">
                                    <FaCalendarAlt className="me-1" />
                                    <small>{entry.formatted_diagnosis_date || entry.diagnosis_date}</small>
                                  </div>
                                  <div className="text-end">
                                    <h5 className="mb-0 text-success">Score: {entry.total_sum_section}</h5>
                                  </div>
                                </div>
                              </Accordion.Header>
                              
                              <Accordion.Body>
                                <Card className="consultation-card shadow-sm">
                                  <Card.Body className="p-4">
                                    {/* Patient Information Section */}
                                    <Row>
                                      <Col md={12} className="mb-4">
                                        <h6 className="section-title text-success"><FaUser className="me-2" />Patient Information</h6>
                                        <div className="info-group">
                                          <Row>
                                            <Col md={6}>
                                              <div className="info-item">
                                                <span className="info-label"><FaUser className="me-2 text-success" />Name:</span>
                                                <span className="info-value">{entry.patient_name}</span>
                                              </div>
                                              <div className="info-item">
                                                <span className="info-label"><FaVenusMars className="me-2 text-success" />Gender:</span>
                                                <span className="info-value">{entry.gender}</span>
                                              </div>
                                              <div className="info-item">
                                                <span className="info-label">Age:</span>
                                                <span className="info-value">{entry.age} years</span>
                                              </div>
                                            </Col>
                                            <Col md={6}>
                                              <div className="info-item">
                                                <span className="info-label"><FaCalendarAlt className="me-2 text-success" />Diagnosis Date:</span>
                                                <span className="info-value">{entry.formatted_diagnosis_date || entry.diagnosis_date}</span>
                                              </div>
                                              <div className="info-item">
                                                <span className="info-label"><FaPills className="me-2 text-success" />Current Medications:</span>
                                                <span className="info-value">{entry.current_medications}</span>
                                              </div>
                                              <div className="info-item">
                                                <span className="info-label"><FaNotesMedical className="me-2 text-success" />Additional Comments:</span>
                                                <span className="info-value">{entry.additional_comments}</span>
                                              </div>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                    
                                    {/* Questions Section */}
                                    <Row>
                                      <Col md={12} className="mb-4">
                                        <h6 className="section-title text-success"><FaClipboardList className="me-2" />Assessment Questions</h6>
                                        <div className="info-group">
                                          <Row>
                                            {Object.entries(questionLabels).map(([key, label]) => (
                                              <Col md={6} lg={4} key={key} className="mb-3">
                                                <div className="info-item">
                                                  <span className="info-label">{label}</span>
                                                  <span className="info-value">
                                                    <Badge bg="secondary" >
                                                      {entry[key]}/{(key === 'q20_management_quality' || key === 'q21_overall_health') ? '5' : '6'}
                                                    </Badge>
                                                  </span>
                                                </div>
                                              </Col>
                                            ))}
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                    
                                    {/* Score Section */}
                                    <Row>
                                      <Col md={12}>
                                        <h6 className="section-title text-success"><FaChartLine className="me-2" />Score Based on Sections</h6>
                                        <div className="info-group">
                                          <Row>
                                            <Col md={6} lg={4} className="mb-3">
                                              <div className="info-item">
                                                <span className="info-label">Physical Total (Section 1):</span>
                                                <span className="info-value">
                                                  <Badge bg="secondary" >
                                                    {entry.physical_total}/36
                                                  </Badge>
                                                </span>
                                              </div>
                                            </Col>
                                            <Col md={6} lg={4} className="mb-3">
                                              <div className="info-item">
                                                <span className="info-label">Emotional Total (Section 2):</span>
                                                <span className="info-value">
                                                  <Badge bg="secondary" >
                                                    {entry.emotional_total}/30
                                                  </Badge>
                                                </span>
                                              </div>
                                            </Col>
                                            <Col md={6} lg={4} className="mb-3">
                                              <div className="info-item">
                                                <span className="info-label">Social Total (Section 3):</span>
                                                <span className="info-value">
                                                  <Badge bg="secondary" >
                                                    {entry.social_total}/24
                                                  </Badge>
                                                </span>
                                              </div>
                                            </Col>
                                            <Col md={6} lg={4} className="mb-3">
                                              <div className="info-item">
                                                <span className="info-label">Sleep Total (Section 4):</span>
                                                <span className="info-value">
                                                  <Badge bg="secondary" >
                                                    {entry.sleep_total}/6
                                                  </Badge>
                                                </span>
                                              </div>
                                            </Col>
                                            <Col md={6} lg={4} className="mb-3">
                                              <div className="info-item">
                                                <span className="info-label">Treatment Total (Section 5):</span>
                                                <span className="info-value">
                                                  <Badge bg="secondary" >
                                                    {entry.treatment_total}/18
                                                  </Badge>
                                                </span>
                                              </div>
                                            </Col>
                                            <Col md={6} lg={4} className="mb-3">
                                              <div className="info-item">
                                                <span className="info-label">General Total (Section 6):</span>
                                                <span className="info-value">
                                                  <Badge bg="secondary">
                                                    {entry.general_total}/10
                                                  </Badge>
                                                </span>
                                              </div>
                                            </Col>
                                            <Col md={12} className="mt-3">
                                              <div className="info-item grand-total">
                                                <span className="info-label"><strong>Grand Total Score:</strong></span>
                                                <span className="info-value">
                                                  <h3 className="mb-0 text-success">
                                                    {entry.total_sum_section}/124
                                                  </h3>
                                                </span>
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

export default TotalQol;