import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Modal, Spinner, Badge, Pagination } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaCalendarAlt, FaFilePdf } from "react-icons/fa";

const ManageResearches = () => {
  const { auth, logout, refreshAccessToken, checkAuthentication, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // State for research items
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success"); // 'success' or 'danger'
  const [showAlert, setShowAlert] = useState(false);

  // Modal state for editing
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);

  // Modal state for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form state for editing
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    pdf_files: null
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Base URL for API
  const API_BASE_URL = "https://mahadevaaya.com/trilokayurveda/trilokabackend";

  // Function to get the full PDF URL
  const getPdfUrl = (pdfPath) => {
    if (!pdfPath) return null;
    
    // If the PDF path already includes the full URL, return as is
    if (pdfPath.startsWith('http')) {
      return pdfPath;
    }
    
    // If the PDF path starts with a slash, prepend the base URL
    if (pdfPath.startsWith('/')) {
      return `${API_BASE_URL}${pdfPath}`;
    }
    
    // Otherwise, prepend the base URL with a slash
    return `${API_BASE_URL}/${pdfPath}`;
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

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      // Wait for auth context to finish initializing
      if (authLoading) return;
      
      try {
        // Check if user is authenticated using the new method
        const isAuth = await checkAuthentication();
        
        if (!isAuth) {
          // If not authenticated, redirect to login
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

  // Fetch research items when auth is checked
  useEffect(() => {
    if (authChecked && auth.access) {
      fetchItems();
    }
  }, [authChecked, auth.access]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch research items from API
  const fetchItems = async () => {
    // Don't fetch if auth is not checked yet
    if (!authChecked || !auth.access) return;
    
    setIsLoading(true);
    setIsFetching(true);
    try {
      const url = `${API_BASE_URL}/api/researches-items/`;
      let response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.access}`,
        },
      });

      // If unauthorized, try refreshing token and retry once
      if (response.status === 401) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) {
          // If refresh fails, redirect to login
          setMessage("Your session has expired. Please log in again.");
          setVariant("danger");
          setShowAlert(true);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
          return;
        }
        
        response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${newAccess}`,
          },
        });
      }

      if (!response.ok) {
        throw new Error("Failed to fetch research items");
      }

      const result = await response.json();
      console.log("GET API Response:", result);

      if (result.success && result.data) {
        // Process data to format dates
        const processedItems = result.data.map(item => {
          const processedItem = { ...item };
          
          // Format created_at date
          if (item.created_at) {
            const createdDate = new Date(item.created_at);
            processedItem.formatted_created_at = createdDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          }
          
          // Format updated_at date
          if (item.updated_at) {
            const updatedDate = new Date(item.updated_at);
            processedItem.formatted_updated_at = updatedDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          }
          
          // Add full PDF URL
          if (item.pdf_files) {
            processedItem.fullPdfUrl = getPdfUrl(item.pdf_files);
          }
          
          return processedItem;
        });

        setItems(processedItems);
      } else {
        throw new Error("No research items found");
      }
    } catch (error) {
      console.error("Error fetching research items:", error);
      setMessage(error.message || "An error occurred while fetching research items");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  // Start editing an item
  const startEditing = (item) => {
    setCurrentEditItem(item);
    setEditFormData({
      title: item.title,
      description: item.description,
      pdf_files: null
    });
    setShowEditModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file change
  const handleFileChange = (e) => {
    setEditFormData(prev => ({
      ...prev,
      pdf_files: e.target.files[0]
    }));
  };

  // Cancel editing
  const cancelEditing = () => {
    setShowEditModal(false);
    setCurrentEditItem(null);
    setEditFormData({
      title: "",
      description: "",
      pdf_files: null
    });
  };

  // Save edited item
  const saveEditedItem = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowAlert(false);

    try {
      const dataToSend = new FormData();
      dataToSend.append("id", currentEditItem.id);
      dataToSend.append("title", editFormData.title);
      dataToSend.append("description", editFormData.description);
      
      if (editFormData.pdf_files) {
        dataToSend.append("pdf_files", editFormData.pdf_files);
      }
      
      const url = `${API_BASE_URL}/api/researches-items/`;
      let response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${auth.access}`,
        },
        body: dataToSend,
      });

      // If unauthorized, try refreshing token and retry once
      if (response.status === 401) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) {
          // If refresh fails, redirect to login
          setMessage("Your session has expired. Please log in again.");
          setVariant("danger");
          setShowAlert(true);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
          return;
        }
        
        response = await fetch(url, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${newAccess}`,
          },
          body: dataToSend,
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorData = null;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          /* not JSON */
        }
        throw new Error(
          (errorData && errorData.message) || "Failed to update research item"
        );
      }

      const result = await response.json();
      console.log("Response data:", result);
      
      if (result.success) {
        setMessage("Research item updated successfully!");
        setVariant("success");
        setShowAlert(true);
        setShowEditModal(false);
        fetchItems(); // Refresh items list
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        throw new Error(result.message || "Failed to update research item");
      }
    } catch (error) {
      console.error("Error updating research item:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }
      setMessage(`Error: ${errorMessage}`);
      setVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete
  const confirmDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  // Delete an item
  const deleteItem = async () => {
    if (!itemToDelete) return;

    setIsSubmitting(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append("id", itemToDelete);
      
      const url = `${API_BASE_URL}/api/researches-items/`;
      let response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.access}`,
        },
        body: dataToSend,
      });

      // If unauthorized, try refreshing token and retry once
      if (response.status === 401) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) {
          // If refresh fails, redirect to login
          setMessage("Your session has expired. Please log in again.");
          setVariant("danger");
          setShowAlert(true);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
          return;
        }
        
        response = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${newAccess}`,
          },
          body: dataToSend,
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorData = null;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          /* not JSON */
        }
        throw new Error(
          (errorData && errorData.message) || "Failed to delete research item"
        );
      }

      const result = await response.json();
      console.log("Response data:", result);
      
      if (result.success) {
        setMessage("Research item deleted successfully!");
        setVariant("success");
        setShowAlert(true);
        setItemToDelete(null);
        setShowDeleteModal(false);
        fetchItems(); // Refresh items list
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        throw new Error(result.message || "Failed to delete research item");
      }
    } catch (error) {
      console.error("Error deleting research item:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }
      setMessage(`Error: ${errorMessage}`);
      setVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
              <h1 className="page-title mb-0">Manage Research Items</h1>
             
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

            {/* Research Items Cards */}
            {isLoading ? (
              <div className="text-center my-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <>
                {isFetching && (
                  <div className="d-flex justify-content-center mb-3">
                    <Spinner animation="border" size="sm" role="status">
                      <span className="visually-hidden">Refreshing...</span>
                    </Spinner>
                  </div>
                )}
                
                <Row>
                  {currentItems.length === 0 ? (
                    <Col xs={12} className="text-center my-5">
                      <p>No research items found.</p>
                    </Col>
                  ) : (
                    currentItems.map((item) => (
                      <Col lg={6} md={12} sm={12} className="mb-4" key={item.id}>
                        <Card className="h-100">
                          <Card.Body>
                           
                               <div className="d-flex justify-content-between">
                               <h3> {item.title}</h3>
                                  <a 
                                    href={item.fullPdfUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-primary"
                                  >
                                    View PDF
                                  </a>
                                </div>
                            <Card.Text>
                              {item.description}
                            </Card.Text>
                            
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <small className="text-muted">
                                <FaCalendarAlt className="me-1" />
                                Created: {item.formatted_created_at}
                              </small>
                              {item.updated_at !== item.created_at && (
                                <small className="text-muted">
                                  Updated: {item.formatted_updated_at}
                                </small>
                              )}
                            </div>
                            
                            {item.pdf_files && (
                              <div className="mb-3">
                              
                             
                              </div>
                            )}
                               <div className="d-flex justify-content-between">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => startEditing(item)}
                                disabled={isSubmitting}
                              >
                                <FaEdit /> Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => confirmDelete(item.id)}
                                disabled={isSubmitting}
                              >
                                <FaTrash /> Delete
                              </Button>
                            </div>
                          </Card.Body>
                          
                          {/* Edit and Delete Buttons */}
                        
                         
                        
                        </Card>
                      </Col>
                    ))
                  )}
                </Row>
                
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
          </Container>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={cancelEditing} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Research Item #{currentEditItem?.id}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={saveEditedItem}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter title"
                value={editFormData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={4}
                placeholder="Enter description"
                value={editFormData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>PDF File</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
              {currentEditItem?.pdf_files && (
                <div className="mt-2">
                  <small className="text-muted">
                    Current file: <a href={getPdfUrl(currentEditItem.pdf_files)} target="_blank" rel="noopener noreferrer">
                      {currentEditItem.pdf_files.split('/').pop()}
                    </a>
                  </small>
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={cancelEditing}
              type="button"
            >
              <FaTimes /> Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
            >
              <FaSave /> {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this research item? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={deleteItem}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageResearches;