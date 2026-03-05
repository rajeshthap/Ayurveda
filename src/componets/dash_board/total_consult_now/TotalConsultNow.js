import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Card, Spinner, Pagination, Accordion, Modal, Table } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import LeftNav from "../LeftNav";
import "../../../assets/css/totalconsultnow.css";
import DashBoardHeader from "../DashBoardHeader";
import {
  FaUserMd, FaPhone, FaEnvelope, FaHome, FaVenusMars, FaRulerVertical, FaWeight, FaCalendarAlt,
  FaStethoscope, FaNotesMedical, FaUserClock, FaInfoCircle,
  FaAppleAlt, FaBed, FaBrain, FaEye, FaTooth,
  FaRunning, FaClipboardList, FaUserMd as FaUser, FaIdCard, FaBaby, FaCut, FaUserNurse,
  FaThermometer, FaHandHoldingMedical, FaFileMedical
} from "react-icons/fa";

const TotalConsultNow = () => {
  const { auth, logout, refreshAccessToken, checkAuthentication, isLoading: authLoading } = useAuth();
  const admin_id = auth?.unique_id;
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
  const [authChecked, setAuthChecked] = useState(false);

  // Submission state
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success"); // 'success' or 'danger'
  const [showAlert, setShowAlert] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // *** UPDATED: NEW API URL ***
  const API_URL = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/online-consultations/all/";

  // Function to get the full medical reports URL
  const getMedicalReportsUrl = (filePath) => {
    if (!filePath) return null;
    
    // If the file path already includes the full URL, return as is
    if (filePath.startsWith("http")) {
      return filePath;
    }
    
    // If the file path starts with a slash, combine with base URL (no extra slash)
    if (filePath.startsWith("/")) {
      return `https://mahadevaaya.com/trilokayurveda/trilokabackend/${filePath}`;
    }
    
    // Otherwise, add slash between base URL and path
    return `https://mahadevaaya.com/trilokayurveda/trilokabackend/${filePath}`;
  };

  // Helper function to safely display array values
  const displayArray = (arr) => {
    if (!arr || arr === null || arr === undefined) {
      return "None";
    }
    // Check if arr is actually an array
    const safeArray = Array.isArray(arr) ? arr : [arr];
    // Filter out empty values and join
    const nonEmptyValues = safeArray.filter(value => value && value.toString().trim() !== "");
    return nonEmptyValues.length > 0 ? nonEmptyValues.join(", ") : "None";
  };

  // Helper function to display habits with Yes/No format for specific types
  const displayHabits = (habits) => {
    const habitTypes = ['Smoking', 'Alcohol', 'Tobacco', 'Drugs', 'Non-vegetarian diet'];
    
    // Check if habits is an object (key-value pairs with Yes/No)
    if (typeof habits === 'object' && habits !== null && !Array.isArray(habits)) {
      return habitTypes.map(habitType => {
        const hasHabit = habits[habitType] === "Yes";
        return `${habitType}: ${hasHabit ? 'Yes' : 'No'}`;
      }).join(", ");
    }
    
    // Check if habits is an array
    const habitArray = Array.isArray(habits) ? habits : (habits ? [habits] : []);
    
    return habitTypes.map(habitType => {
      const hasHabit = habitArray.some(habit => 
        habit && habit.toString().toLowerCase().includes(habitType.toLowerCase())
      );
      return `${habitType}: ${hasHabit ? 'Yes' : 'No'}`;
    }).join(", ");
  };

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

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authLoading) return;

      try {
        const isAuth = await checkAuthentication();

        if (!isAuth) {
          setMessage("Your session has expired. Please log in again.");
          setVariant("danger");
          setShowAlert(true);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
          return;
        }

        setAuthChecked(true);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setMessage("Authentication error. Please log in again.");
        setVariant("danger");
        setShowAlert(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    checkAuth();
  }, [authLoading, checkAuthentication, navigate]);

  // *** UPDATED: Fetch consultation entries from new API and process nested data ***
  const fetchEntries = async () => {
    if (!authChecked || !auth.access) return;

    setIsLoading(true);
    setIsFetching(true);
    try {
      let response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.access}`,
        },
      });

      if (response.status === 401) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) {
          setMessage("Your session has expired. Please log in again.");
          setVariant("danger");
          setShowAlert(true);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
          return;
        }

        response = await fetch(API_URL, {
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

      // *** UPDATED: Process the new nested data structure with robust checks ***
      const processedEntries = result.map(entry => {
        // *** FIX: Check if the array exists and has items before accessing the first element ***
        const section2 = entry.section2 && entry.section2.length > 0 ? entry.section2[0] : {};
        const section3 = entry.section3 && entry.section3.length > 0 ? entry.section3[0] : {};
        const section4 = entry.section4 && entry.section4.length > 0 ? entry.section4[0] : {};

        // Format dates
        const formatDate = (dateString) => {
          if (!dateString) return "N/A";
          return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
          });
        };

        return {
          ...entry,
          // Flatten nested data for easier access in JSX
          main_disease_problem: section2.main_disease_problem || "N/A",
          associated_complications: section2.associated_complications || "N/A",
          mode_of_onset: section2.mode_of_onset || "N/A",
          problem_start_description: section2.problem_start_description || "N/A",
          disease_history: section2.disease_history || [],
          past_medications: section2.past_medications || "N/A",
          surgeries: section2.surgeries || "N/A",
          date_of_diagnosis: formatDate(section2.date_of_diagnosis),
          medical_reports: section2.medical_reports || "",

          habits: section3.habits || [],
          type_of_exercise: section3.type_of_exercise || "N/A",
          number_of_pregnancies: section3.number_of_pregnancies || "N/A",
          number_of_living_children: section3.number_of_living_children || "N/A",
          mode_of_delivery: section3.mode_of_delivery || "N/A",
          menstrual_history: section3.menstrual_history || "N/A",

          body_build: section4.body_build || [],
          complexion: section4.complexion || [],
          skin_nature: section4.skin_nature || [],
          hair_nature: section4.hair_nature || [],
          joint_characteristics: section4.joint_characteristics || [],
          veins_and_tendons: section4.veins_and_tendons || [],
          body_temperature: section4.body_temperature || [],
          temperature_preference: section4.temperature_preference || [],
          eyes: section4.eyes || [],
          teeth_and_gums: section4.teeth_and_gums || [],
          voice_nature: section4.voice_nature || [],
          appetite: section4.appetite || [],
          taste_preference: section4.taste_preference || [],
          sweating: section4.sweating || [],
          bowel_habits: section4.bowel_habits || [],
          urination: section4.urination || [],
          sleep: section4.sleep || [],
          memory: section4.memory || [],
          psychological_state: section4.psychological_state || [],

          // Format top-level dates
          formatted_date: formatDate(entry.created_at),
          formatted_dob: formatDate(entry.date_of_birth),
        };
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

  // Fetch consultation entries when auth is checked
  useEffect(() => {
    if (authChecked && auth.access) {
      fetchEntries();
    }
  }, [authChecked, auth.access]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = entries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(entries.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Modal handlers
  const handleViewClick = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEntry(null);
  };

  // Show loading while checking authentication
  if (authLoading || !authChecked) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Checking authentication...</span>
          </Spinner>
          <p>Verifying your session...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-container">
        <LeftNav
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
          isTablet={isTablet}
        />
        <div className="main-content">
          <DashBoardHeader toggleSidebar={toggleSidebar} />
          <Container fluid className="dashboard-body dashboard-main-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="page-title mb-0">Total Consultations</h1>
            </div>
            {showAlert && (
              <Alert variant={variant} className="mb-4" onClose={() => setShowAlert(false)} dismissible>
                {message}
              </Alert>
            )}
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
                    <Card className="h-100 shadow-sm card-hover cursor-pointer" onClick={() => setShowTable(!showTable)}>
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
                                    <small>{entry.mobile_number} | {entry.email}</small>
                                  </div>
                                  <div className="text-end me-3">
                                    <FaCalendarAlt className="me-1" />
                                    <small>{entry.formatted_date}</small>
                                  </div>
                                  <button 
                                    className="btn btn-sm btn-primary ms-3"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewClick(entry);
                                    }}
                                  >
                                    View
                                  </button>
                                </div>
                              </Accordion.Header>
                              <Accordion.Body>
                                <Card className="consultation-card shadow-sm">
                                  <Card.Body className="p-4">
                                    <Row>
                                      <Col md={6} className="mb-4 mb-md-0">
                                        <h6 className="section-title text-success"><FaUser className="me-2" />Personal Information</h6>
                                        <div className="info-group">
                                          <div className="info-item"><span className="info-label"><FaPhone className="me-2 text-success" />Contact:</span><span className="info-value">{entry.mobile_number}</span></div>
                                          <div className="info-item"><span className="info-label"><FaEnvelope className="me-2 text-success" />Email:</span><span className="info-value">{entry.email}</span></div>
                                          <div className="info-item"><span className="info-label"><FaVenusMars className="me-2 text-success" />Gender:</span><span className="info-value">{entry.gender}</span></div>
                                          <div className="info-item"><span className="info-label"><FaRulerVertical className="me-2 text-success" />Height:</span><span className="info-value">{entry.height} cm</span></div>
                                          <div className="info-item"><span className="info-label"><FaWeight className="me-2 text-success" />Weight:</span><span className="info-value">{entry.weight} kg</span></div>
                                          <div className="info-item"><span className="info-label"><FaHome className="me-2 text-success" />Address:</span><span className="info-value">{entry.address}</span></div>
                                          <div className="info-item"><span className="info-label"><FaClipboardList className="me-2 text-success" />Occupation:</span><span className="info-value">{entry.occupation}</span></div>
                                          <div className="info-item"><span className="info-label"><FaCalendarAlt className="me-2 text-success" />DOB:</span><span className="info-value">{entry.formatted_dob}</span></div>
                                        </div>
                                      </Col>
                                       <Col md={6} className="mb-4 mb-md-0">
                                        <h6 className="section-title text-success"><FaStethoscope className="me-2" />Medical Information</h6>
                                        <div className="info-group">
                                          <div className="info-item"><span className="info-label"><FaNotesMedical className="me-2 text-success" />Chief Complaint:</span><span className="info-value">{entry.main_disease_problem}</span></div>
                                          <div className="info-item"><span className="info-label"><FaUserClock className="me-2 text-success" />Problem Description:</span><span className="info-value">{entry.problem_start_description}</span></div>
                                          <div className="info-item"><span className="info-label"><FaInfoCircle className="me-2 text-success" />Mode of Onset:</span><span className="info-value">{entry.mode_of_onset}</span></div>
                                          <div className="info-item"><span className="info-label"><FaUserNurse className="me-2 text-success" />Disease History:</span><span className="info-value">{displayArray(entry.disease_history)}</span></div>
                                          <div className="info-item"><span className="info-label"><FaNotesMedical className="me-2 text-success" />Past Medications:</span><span className="info-value">{entry.past_medications}</span></div>
                                          <div className="info-item"><span className="info-label"><FaCut className="me-2 text-success" />Surgeries:</span><span className="info-value">{entry.surgeries}</span></div>
                                          <div className="info-item"><span className="info-label"><FaCalendarAlt className="me-2 text-success" />Diagnosis Date:</span><span className="info-value">{entry.date_of_diagnosis}</span></div>
                                          {/* Show view button if medical reports file path exists */}
                                          {entry.medical_reports && (
                                            <div className="info-item">
                                              <span className="info-label"><FaFileMedical className="me-2 text-success" />Medical Reports:</span>
                                              <a
                                                href={getMedicalReportsUrl(entry.medical_reports)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-primary ms-2"
                                              >
                                                <FaEye className="me-1" /> View
                                              </a>
                                            </div>
                                          )}
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col md={6} className="mb-4">
                                        <h6 className="section-title text-success"><FaBaby className="me-2" />Women's Health</h6>
                                        <div className="info-group">
                                          <div className="info-item"><span className="info-label">Number of Pregnancies:</span><span className="info-value">{entry.number_of_pregnancies}</span></div>
                                          <div className="info-item"><span className="info-label">Living Children:</span><span className="info-value">{entry.number_of_living_children}</span></div>
                                          <div className="info-item"><span className="info-label">Mode of Delivery:</span><span className="info-value">{entry.mode_of_delivery}</span></div>
                                          <div className="info-item"><span className="info-label">Menstrual History:</span><span className="info-value">{entry.menstrual_history}</span></div>
                                        </div>
                                      </Col>
                                      <Col md={6} className="mb-4">
                                        <h6 className="section-title text-success"><FaAppleAlt className="me-2" />Lifestyle & Habits</h6>
                                        <div className="info-group">
                                           <div className="info-item"><span className="info-label">Habits:</span><span className="info-value">{displayHabits(entry.habits)}</span></div>
                                          <div className="info-item"><span className="info-label">Exercise Type:</span><span className="info-value">{entry.type_of_exercise}</span></div>
                                          <div className="info-item"><span className="info-label"><FaAppleAlt className="me-2 text-success" />Appetite:</span><span className="info-value">{displayArray(entry.appetite)}</span></div>
                                          <div className="info-item"><span className="info-label"><FaBed className="me-2 text-success" />Sleep:</span><span className="info-value">{displayArray(entry.sleep)}</span></div>
                                          <div className="info-item"><span className="info-label">Taste Preference:</span><span className="info-value">{displayArray(entry.taste_preference)}</span></div>
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col md={6} className="mb-4">
                                        <h6 className="section-title text-success"><FaRunning className="me-2" />Physical Health</h6>
                                        <div className="info-group">
                                          <div className="info-item"><span className="info-label">Body Build:</span><span className="info-value">{displayArray(entry.body_build)}</span></div>
                                          <div className="info-item"><span className="info-label"><FaIdCard className="me-2 text-success" />Complexion:</span><span className="info-value">{displayArray(entry.complexion)}</span></div>
                                          <div className="info-item"><span className="info-label">Skin Nature:</span><span className="info-value">{displayArray(entry.skin_nature)}</span></div>
                                          <div className="info-item"><span className="info-label">Hair Nature:</span><span className="info-value">{displayArray(entry.hair_nature)}</span></div>
                                          <div className="info-item"><span className="info-label"><FaHandHoldingMedical className="me-2 text-success" />Joints:</span><span className="info-value">{displayArray(entry.joint_characteristics)}</span></div>
                                          <div className="info-item"><span className="info-label"><FaHandHoldingMedical className="me-2 text-success" />Veins/Tendons:</span><span className="info-value">{displayArray(entry.veins_and_tendons)}</span></div>
                                        </div>
                                      </Col>
                                      <Col md={6} className="mb-4">
                                        <h6 className="section-title text-success"><FaBrain className="me-2" />General Health</h6>
                                        <div className="info-group">
                                          <div className="info-item"><span className="info-label"><FaThermometer className="me-2 text-success" />Body Temp.:</span><span className="info-value">{displayArray(entry.body_temperature)}</span></div>
                                          <div className="info-item"><span className="info-label"><FaThermometer className="me-2 text-success" />Temp. Preference:</span><span className="info-value">{displayArray(entry.temperature_preference)}</span></div>
                                          <div className="info-item"><span className="info-label"><FaEye className="me-2 text-success" />Eyes:</span><span className="info-value">{displayArray(entry.eyes)}</span></div>
                                          <div className="info-item"><span className="info-label"><FaTooth className="me-2 text-success" />Teeth & Gums:</span><span className="info-value">{displayArray(entry.teeth_and_gums)}</span></div>
                                          <div className="info-item"><span className="info-label">Voice Nature:</span><span className="info-value">{displayArray(entry.voice_nature)}</span></div>
                                          <div className="info-item"><span className="info-label">Sweating:</span><span className="info-value">{displayArray(entry.sweating)}</span></div>
                                        </div>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col md={6} className="mb-4">
                                        <h6 className="section-title text-success"><FaAppleAlt className="me-2" />Excretory Habits</h6>
                                        <div className="info-group">
                                          <div className="info-item"><span className="info-label">Bowel Habits:</span><span className="info-value">{displayArray(entry.bowel_habits)}</span></div>
                                          <div className="info-item"><span className="info-label">Urination:</span><span className="info-value">{displayArray(entry.urination)}</span></div>
                                        </div>
                                      </Col>
                                      <Col md={6} className="mb-4">
                                        <h6 className="section-title text-success"><FaBrain className="me-2" />Psychological Status</h6>
                                        <div className="info-group">
                                          <div className="info-item"><span className="info-label">Psychological State:</span><span className="info-value">{displayArray(entry.psychological_state)}</span></div>
                                          <div className="info-item"><span className="info-label">Memory:</span><span className="info-value">{displayArray(entry.memory)}</span></div>
                                        </div>
                                      </Col>
                                    </Row>
                                  </Card.Body>
                                </Card>
                              </Accordion.Body>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                        {totalPages > 1 && (
                          <div className="d-flex justify-content-center mt-4">
                            <Pagination>
                              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                              {[...Array(totalPages).keys()].map(page => (
                                <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
                                  {page + 1}
                                </Pagination.Item>
                              ))}
                              <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                            </Pagination>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
               </>
            )}

            {/* View Details Modal */}
            <Modal
              show={showModal}
              onHide={handleCloseModal}
              size="lg"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Consultation Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedEntry && (
                  <Table striped bordered hover responsive>
                    <tbody>
                      {/* Personal Information */}
                      <tr>
                        <th colSpan={2} className="bg-light">Personal Information</th>
                      </tr>
                      <tr>
                        <td><strong>Full Name:</strong></td>
                        <td>{selectedEntry.full_name}</td>
                      </tr>
                      <tr>
                        <td><strong>Contact:</strong></td>
                        <td>{selectedEntry.mobile_number}</td>
                      </tr>
                      <tr>
                        <td><strong>Email:</strong></td>
                        <td>{selectedEntry.email}</td>
                      </tr>
                      <tr>
                        <td><strong>Gender:</strong></td>
                        <td>{selectedEntry.gender}</td>
                      </tr>
                      <tr>
                        <td><strong>Height:</strong></td>
                        <td>{selectedEntry.height} cm</td>
                      </tr>
                      <tr>
                        <td><strong>Weight:</strong></td>
                        <td>{selectedEntry.weight} kg</td>
                      </tr>
                      <tr>
                        <td><strong>Address:</strong></td>
                        <td>{selectedEntry.address}</td>
                      </tr>
                      <tr>
                        <td><strong>Occupation:</strong></td>
                        <td>{selectedEntry.occupation}</td>
                      </tr>
                      <tr>
                        <td><strong>DOB:</strong></td>
                        <td>{selectedEntry.formatted_dob}</td>
                      </tr>

                      {/* Medical Information */}
                      <tr>
                        <th colSpan={2} className="bg-light">Medical Information</th>
                      </tr>
                      <tr>
                        <td><strong>Chief Complaint:</strong></td>
                        <td>{selectedEntry.main_disease_problem}</td>
                      </tr>
                      <tr>
                        <td><strong>Problem Description:</strong></td>
                        <td>{selectedEntry.problem_start_description}</td>
                      </tr>
                      <tr>
                        <td><strong>Mode of Onset:</strong></td>
                        <td>{selectedEntry.mode_of_onset}</td>
                      </tr>
                      <tr>
                        <td><strong>Disease History:</strong></td>
                        <td>{displayArray(selectedEntry.disease_history)}</td>
                      </tr>
                      <tr>
                        <td><strong>Past Medications:</strong></td>
                        <td>{selectedEntry.past_medications}</td>
                      </tr>
                      <tr>
                        <td><strong>Surgeries:</strong></td>
                        <td>{selectedEntry.surgeries}</td>
                      </tr>
                      <tr>
                        <td><strong>Diagnosis Date:</strong></td>
                        <td>{selectedEntry.date_of_diagnosis}</td>
                      </tr>
                      {selectedEntry.medical_reports && (
                        <tr>
                          <td><strong>Medical Reports:</strong></td>
                          <td>
                            <a
                              href={getMedicalReportsUrl(selectedEntry.medical_reports)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              <FaEye className="me-1" /> View Reports
                            </a>
                          </td>
                        </tr>
                      )}

                      {/* Women's Health */}
                      <tr>
                        <th colSpan={2} className="bg-light">Women's Health</th>
                      </tr>
                      <tr>
                        <td><strong>Number of Pregnancies:</strong></td>
                        <td>{selectedEntry.number_of_pregnancies}</td>
                      </tr>
                      <tr>
                        <td><strong>Living Children:</strong></td>
                        <td>{selectedEntry.number_of_living_children}</td>
                      </tr>
                      <tr>
                        <td><strong>Mode of Delivery:</strong></td>
                        <td>{selectedEntry.mode_of_delivery}</td>
                      </tr>
                      <tr>
                        <td><strong>Menstrual History:</strong></td>
                        <td>{selectedEntry.menstrual_history}</td>
                      </tr>

                      {/* Lifestyle & Habits */}
                      <tr>
                        <th colSpan={2} className="bg-light">Lifestyle & Habits</th>
                      </tr>
                      <tr>
                        <td><strong>Habits:</strong></td>
                        <td>{displayHabits(selectedEntry.habits)}</td>
                      </tr>
                      <tr>
                        <td><strong>Exercise Type:</strong></td>
                        <td>{selectedEntry.type_of_exercise}</td>
                      </tr>
                      <tr>
                        <td><strong>Appetite:</strong></td>
                        <td>{displayArray(selectedEntry.appetite)}</td>
                      </tr>
                      <tr>
                        <td><strong>Sleep:</strong></td>
                        <td>{displayArray(selectedEntry.sleep)}</td>
                      </tr>
                      <tr>
                        <td><strong>Taste Preference:</strong></td>
                        <td>{displayArray(selectedEntry.taste_preference)}</td>
                      </tr>

                      {/* Physical Health */}
                      <tr>
                        <th colSpan={2} className="bg-light">Physical Health</th>
                      </tr>
                      <tr>
                        <td><strong>Body Build:</strong></td>
                        <td>{displayArray(selectedEntry.body_build)}</td>
                      </tr>
                      <tr>
                        <td><strong>Complexion:</strong></td>
                        <td>{displayArray(selectedEntry.complexion)}</td>
                      </tr>
                      <tr>
                        <td><strong>Skin Nature:</strong></td>
                        <td>{displayArray(selectedEntry.skin_nature)}</td>
                      </tr>
                      <tr>
                        <td><strong>Hair Nature:</strong></td>
                        <td>{displayArray(selectedEntry.hair_nature)}</td>
                      </tr>
                      <tr>
                        <td><strong>Joints:</strong></td>
                        <td>{displayArray(selectedEntry.joint_characteristics)}</td>
                      </tr>
                      <tr>
                        <td><strong>Veins/Tendons:</strong></td>
                        <td>{displayArray(selectedEntry.veins_and_tendons)}</td>
                      </tr>

                      {/* General Health */}
                      <tr>
                        <th colSpan={2} className="bg-light">General Health</th>
                      </tr>
                      <tr>
                        <td><strong>Body Temp:</strong></td>
                        <td>{displayArray(selectedEntry.body_temperature)}</td>
                      </tr>
                      <tr>
                        <td><strong>Temp Preference:</strong></td>
                        <td>{displayArray(selectedEntry.temperature_preference)}</td>
                      </tr>
                      <tr>
                        <td><strong>Eyes:</strong></td>
                        <td>{displayArray(selectedEntry.eyes)}</td>
                      </tr>
                      <tr>
                        <td><strong>Teeth & Gums:</strong></td>
                        <td>{displayArray(selectedEntry.teeth_and_gums)}</td>
                      </tr>
                      <tr>
                        <td><strong>Voice Nature:</strong></td>
                        <td>{displayArray(selectedEntry.voice_nature)}</td>
                      </tr>
                      <tr>
                        <td><strong>Sweating:</strong></td>
                        <td>{displayArray(selectedEntry.sweating)}</td>
                      </tr>

                      {/* Excretory Habits */}
                      <tr>
                        <th colSpan={2} className="bg-light">Excretory Habits</th>
                      </tr>
                      <tr>
                        <td><strong>Bowel Habits:</strong></td>
                        <td>{displayArray(selectedEntry.bowel_habits)}</td>
                      </tr>
                      <tr>
                        <td><strong>Urination:</strong></td>
                        <td>{displayArray(selectedEntry.urination)}</td>
                      </tr>

                      {/* Psychological Status */}
                      <tr>
                        <th colSpan={2} className="bg-light">Psychological Status</th>
                      </tr>
                      <tr>
                        <td><strong>Psychological State:</strong></td>
                        <td>{displayArray(selectedEntry.psychological_state)}</td>
                      </tr>
                      <tr>
                        <td><strong>Memory:</strong></td>
                        <td>{displayArray(selectedEntry.memory)}</td>
                      </tr>
                    </tbody>
                  </Table>
                )}
              </Modal.Body>
              <Modal.Footer>
                <button className="btn btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
              </Modal.Footer>
            </Modal>
          </Container>
        </div>
      </div>
    </>
  );
};

export default TotalConsultNow;
