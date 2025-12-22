import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Modal, Spinner, Badge, Table, Image, Pagination, Accordion } from "react-bootstrap"; // 1. IMPORT ACCORDION
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
  FaFileMedical, FaAllergies, FaPills, FaThermometer, FaHandHoldingMedical
} from "react-icons/fa";

const TotalConsultNow = () => {
  const { auth, logout, refreshAccessToken } = useAuth();
  const admin_id = auth?.unique_id;

  console.log("Admin ID:", admin_id);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // State for consultation entries
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

  // Fetch consultation entries from API
  const fetchEntries = async () => {
    setIsLoading(true);
    setIsFetching(true);
    try {
      const url = `${API_BASE_URL}/api/consult-entries/`;
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
        throw new Error("Failed to fetch consultation entries");
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
      } else {
        throw new Error("No consultation entries found");
      }

      // Process data to format dates
      const processedEntries = entriesData.map(entry => {
        const processedEntry = { ...entry };
        
        // Format date if it exists
        if (entry.date) {
          const entryDate = new Date(entry.date);
          processedEntry.formatted_date = entryDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
        
        // Format past treatment dates if they exist
        if (entry.past_treatment_1_date) {
          const treatment1Date = new Date(entry.past_treatment_1_date);
          processedEntry.formatted_treatment1_date = treatment1Date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
        
        if (entry.past_treatment_2_date) {
          const treatment2Date = new Date(entry.past_treatment_2_date);
          processedEntry.formatted_treatment2_date = treatment2Date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
        
        return processedEntry;
      });

      setEntries(processedEntries);
    } catch (error) {
      console.error("Error fetching consultation entries:", error);
      setMessage(error.message || "An error occurred while fetching consultation entries");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  // Fetch consultation entries on component mount
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
              <h1 className="page-title mb-0">Total Consultations</h1>
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

            {/* Consultation Count Card */}
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
                          <FaUserMd className="text-success me-3" size={36} />
                          <div>
                            <p className="mb-0">Total Consult Now</p>
                          </div>
                        </div>
                        <div className="text-end">
                          <h2 className="display-4 fw-bold text-success">{entries.length}</h2>
                         
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Consultation Entries Accordion */}
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
                        <p>No consultation entries found.</p>
                      </div>
                    ) : (
                      <>
                        {/* 2. WRAP THE ENTRIES IN AN ACCORDION COMPONENT */}
                        <Accordion defaultActiveKey="0">
                          {currentItems.map((entry, index) => (
                            // 3. EACH ENTRY IS NOW AN ACCORDION.ITEM
                            <Accordion.Item eventKey={entry.id || index.toString()} key={entry.id || index}>
                              {/* 4. CREATE A CUSTOM HEADER FOR EACH ACCORDION ITEM */}
                              <Accordion.Header>
                                <div className="d-flex align-items-center w-100">
                                  <div className="consultation-avatar bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                                    {entry.name ? entry.name.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                  <div className="flex-grow-1">
                                    <h5 className="mb-0">{entry.name}</h5>
                                    <small>{entry.contact_number} | {entry.email}</small>
                                  </div>
                                  <div className="text-end me-3">
                                    <FaCalendarAlt className="me-1" />
                                    <small>{entry.formatted_date || entry.date}</small>
                                  </div>
                                </div>
                              </Accordion.Header>
                              
                              {/* 5. MOVE THE EXISTING CARD.BODY CONTENT INTO THE ACCORDION.BODY */}
                              <Accordion.Body>
                                <Card className="consultation-card shadow-sm">
                                  <Card.Body className="p-4">
                                    <Row>
                                      {/* Left Column: Personal Information */}
                                      <Col md={6} className="mb-4 mb-md-0">
                                        <h6 className="section-title text-success"><FaUser className="me-2" />Personal Information</h6>
                                        <div className="info-group">
                                          <div className="info-item">
                                            <span className="info-label"><FaPhone className="me-2 text-success" />Contact:</span>
                                            <span className="info-value">{entry.contact_number}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaEnvelope className="me-2 text-success" />Email:</span>
                                            <span className="info-value">{entry.email}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaVenusMars className="me-2 text-success" />Gender:</span>
                                            <span className="info-value">{entry.gender}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaRulerVertical className="me-2 text-success" />Height:</span>
                                            <span className="info-value">{entry.height}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaWeight className="me-2 text-success" />Weight:</span>
                                            <span className="info-value">{entry.weight}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaHome className="me-2 text-success" />Address:</span>
                                            <span className="info-value">{entry.complete_address}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaClipboardList className="me-2 text-success" />Occupation:</span>
                                            <span className="info-value">{entry.occupation}</span>
                                          </div>
                                        </div>
                                      </Col>

                                      {/* Right Column: Medical Information */}
                                      <Col md={6} className="mb-4 mb-md-0">
                                        <h6 className="section-title text-success"><FaStethoscope className="me-2" />Medical Information</h6>
                                        <div className="info-group">
                                          <div className="info-item">
                                            <span className="info-label"><FaNotesMedical className="me-2 text-success" />Chief Complaint:</span>
                                            <span className="info-value">{entry.chief_complaint}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaUserClock className="me-2 text-success" />Duration:</span>
                                            <span className="info-value">{entry.complaint_duration}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaInfoCircle className="me-2 text-success" />Mode of Onset:</span>
                                            <span className="info-value">{entry.mode_of_onset}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaUserNurse className="me-2 text-success" />Family History:</span>
                                            <span className="info-value">{entry.family_history}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaNotesMedical className="me-2 text-success" />Past History:</span>
                                            <span className="info-value">{entry.past_history}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaCut className="me-2 text-success" />Any Surgery:</span>
                                            <span className="info-value">{entry.any_surgery}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaStethoscope className="me-2 text-success" />Current Treatment:</span>
                                            <span className="info-value">{entry.current_treatment}</span>
                                          </div>
                                        </div>
                                      </Col>
                                    </Row>
                                    
                                    <Row>
                                      {/* Women's Health Section */}
                                      <Col md={6} className="mb-4">
                                        <h6 className="section-title text-success"><FaBaby className="me-2" />Women's Health</h6>
                                        <div className="info-group">
                                          <div className="info-item">
                                            <span className="info-label">Number of Pregnancies:</span>
                                            <span className="info-value">{entry.number_of_pregnancies}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label">Number of Alive Kids:</span>
                                            <span className="info-value">{entry.number_of_alive_kids}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label">Mode of Delivery:</span>
                                            <span className="info-value">{entry.mode_of_delivery}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label">Menstrual History:</span>
                                            <span className="info-value">{entry.menstrual_history}</span>
                                          </div>
                                        </div>
                                      </Col>

                                      {/* Lifestyle & Habits Section */}
                                      <Col md={6} className="mb-4">
                                        <h6 className="section-title text-success"><FaAppleAlt className="me-2" />Lifestyle & Habits</h6>
                                        <div className="info-group">
                                          <div className="info-item">
                                            <span className="info-label">Life Style:</span>
                                            <span className="info-value">{entry.life_style}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaAppleAlt className="me-2 text-success" />Appetite:</span>
                                            <span className="info-value">{entry.appetite}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaBed className="me-2 text-success" />Sleep:</span>
                                            <span className="info-value">{entry.sleep}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label">Taste Preference:</span>
                                            <span className="info-value">{entry.taste_preference}</span>
                                          </div>
                                        </div>
                                      </Col>
                                    </Row>
                                    
                                    <Row>
                                      {/* Physical & Mental Health Section */}
                                      <Col md={6} className="mb-4">
                                        <h6 className="section-title text-success"><FaRunning className="me-2" />Physical Health</h6>
                                        <div className="info-group">
                                          <div className="info-item">
                                            <span className="info-label">Body Built:</span>
                                            <span className="info-value">{entry.body_built}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaIdCard className="me-2 text-success" />Complexion:</span>
                                            <span className="info-value">{entry.complexion}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaHandHoldingMedical className="me-2 text-success" />Joint Characteristics:</span>
                                            <span className="info-value">{entry.joint_characteristics}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaHandHoldingMedical className="me-2 text-success" />Veins Tendons:</span>
                                            <span className="info-value">{entry.veins_tendons}</span>
                                          </div>
                                        </div>
                                      </Col>

                                      <Col md={6} className="mb-4">
                                        <h6 className="section-title text-success"><FaBrain className="me-2" />Mental Health</h6>
                                        <div className="info-group">
                                          <div className="info-item">
                                            <span className="info-label"><FaThermometer className="me-2 text-success" />Temperature Preference:</span>
                                            <span className="info-value">{entry.temperature_preference}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaThermometer className="me-2 text-success" />Body Temperature:</span>
                                            <span className="info-value">{entry.patient_body_temperature}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaEye className="me-2 text-success" />Eye Condition:</span>
                                            <span className="info-value">{entry.eye_condition}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaTooth className="me-2 text-success" />Teeth & Gums:</span>
                                            <span className="info-value">{entry.teeth_gums_nature}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label"><FaAppleAlt className="me-2 text-success" />Excretory Habits:</span>
                                            <span className="info-value">{entry.excretory_habits}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label">Urination:</span>
                                            <span className="info-value">{entry.urination}</span>
                                          </div>
                                        </div>
                                      </Col>
                                    </Row>
                                    
                                    <Row>
                                      <Col md={12}>
                                        <h6 className="section-title text-success"><FaBrain className="me-2" />Psychological Status</h6>
                                        <div className="info-group">
                                          <div className="info-item">
                                            <span className="info-label">Psychological Status:</span>
                                            <span className="info-value">{entry.psychological_status}</span>
                                          </div>
                                          <div className="info-item">
                                            <span className="info-label">Memory:</span>
                                            <span className="info-value">{entry.memory}</span>
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

export default TotalConsultNow;