import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Modal, Spinner, Badge, Pagination, Accordion } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";

const ManageFAQ = () => {
  const { auth, logout, refreshAccessToken, checkAuthentication, isLoading: authLoading } = useAuth();
  const admin_id = auth?.unique_id;

  console.log("Admin ID:", admin_id);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Form state for FAQ items
  const [formData, setFormData] = useState({
    module: [{ question: "", answer: "" }], // Initialize with one empty FAQ item
  });

  // State for FAQ items from API
  const [faqItems, setFaqItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemData, setEditingItemData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success"); // 'success' or 'danger'
  const [showAlert, setShowAlert] = useState(false);

  // Modal state for editing
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

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

  // Fetch FAQ items when auth is checked
  useEffect(() => {
    if (authChecked && auth.access) {
      fetchFaqItems();
    }
  }, [authChecked, auth.access]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch FAQ items from API
  const fetchFaqItems = async () => {
    // Don't fetch if auth is not checked yet
    if (!authChecked || !auth.access) return;
    
    setIsLoading(true);
    try {
      const url = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/faq-items/";
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
        throw new Error("Failed to fetch FAQ items");
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
          
          return processedItem;
        });

        setFaqItems(processedItems);
      } else {
        throw new Error("No FAQ items found");
      }
    } catch (error) {
      console.error("Error fetching FAQ items:", error);
      setMessage(error.message || "An error occurred while fetching FAQ items");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle FAQ item changes
  const handleFAQChange = (index, field, value) => {
    setFormData((prev) => {
      const newModule = [...prev.module];
      // Ensure the FAQ item at index exists and is an object
      if (!newModule[index] || typeof newModule[index] !== "object") {
        newModule[index] = { question: "", answer: "" };
      }
      // Update the specific field
      newModule[index] = {
        ...newModule[index],
        [field]: value,
      };

      return {
        ...prev,
        module: newModule,
      };
    });
  };

  // Handle editing FAQ item changes
  const handleEditingFAQChange = (index, field, value) => {
    setEditingItemData((prev) => {
      const newModule = [...prev.module];
      // Ensure the FAQ item at index exists and is an object
      if (!newModule[index] || typeof newModule[index] !== "object") {
        newModule[index] = { question: "", answer: "" };
      }
      // Update the specific field
      newModule[index] = {
        ...newModule[index],
        [field]: value,
      };

      return {
        ...prev,
        module: newModule,
      };
    });
  };

  // Add a new FAQ item
  const addFAQItem = () => {
    setFormData((prev) => ({
      ...prev,
      module: [...prev.module, { question: "", answer: "" }],
    }));
  };

  // Add a new FAQ item to editing item
  const addEditingFAQItem = () => {
    setEditingItemData((prev) => ({
      ...prev,
      module: [...prev.module, { question: "", answer: "" }],
    }));
  };

  // Remove a FAQ item
  const removeFAQItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      module: prev.module.filter((_, i) => i !== index),
    }));
  };

  // Remove a FAQ item from editing item
  const removeEditingFAQItem = (index) => {
    setEditingItemData((prev) => ({
      ...prev,
      module: prev.module.filter((_, i) => i !== index),
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      module: [{ question: "", answer: "" }],
    });
    setShowAlert(false);
  };

  // Start editing an item
  const startEditing = (item) => {
    setCurrentEditItem(item);
    setEditingItemId(item.id);
    setEditingItemData({
      id: item.id,
      module: item.module && item.module.length > 0 
        ? item.module 
        : [{ question: "", answer: "" }]
    });
    setShowEditModal(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingItemId(null);
    setEditingItemData(null);
    setShowEditModal(false);
  };

  // Save edited item
  const saveEditedItem = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowAlert(false);

    try {
      const dataToSend = new FormData();
      dataToSend.append("id", editingItemData.id);
      dataToSend.append("module", JSON.stringify(editingItemData.module));

      const url = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/faq-items/";
      let response = await fetch(url, {
        method: "PUT",
        body: dataToSend,
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
          method: "PUT",
          body: dataToSend,
          headers: {
            Authorization: `Bearer ${newAccess}`,
          },
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
          (errorData && errorData.message) || "Failed to update FAQ item"
        );
      }

      const result = await response.json();
      if (result.success) {
        setMessage("FAQ item updated successfully!");
        setVariant("success");
        setShowAlert(true);
        setEditingItemId(null);
        setEditingItemData(null);
        setShowEditModal(false);
        fetchFaqItems(); // Refresh the FAQ items list
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        throw new Error(result.message || "Failed to update FAQ item");
      }
    } catch (error) {
      console.error("Error updating FAQ item:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }
      setMessage(errorMessage);
      setVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete an FAQ item - Updated to use FormData like PUT
  const deleteFaqItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ item?")) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for the request (similar to PUT)
      const dataToSend = new FormData();
      dataToSend.append("id", id);
      
      const url = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/faq-items/";
      let response = await fetch(url, {
        method: "DELETE",
        body: dataToSend, // Include the FormData in the body
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
          method: "DELETE",
          body: dataToSend, // Include the FormData in the body
          headers: {
            Authorization: `Bearer ${newAccess}`,
          },
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
          (errorData && errorData.message) || "Failed to delete FAQ item"
        );
      }

      const result = await response.json();
      if (result.success) {
        setMessage("FAQ item deleted successfully!");
        setVariant("success");
        setShowAlert(true);
        fetchFaqItems(); // Refresh the FAQ items list
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        throw new Error(result.message || "Failed to delete FAQ item");
      }
    } catch (error) {
      console.error("Error deleting FAQ item:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }
      setMessage(errorMessage);
      setVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission (POST request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowAlert(false);

    try {
      // Create FormData for the API
      const dataToSend = new FormData();
      
      // Add admin_id
      dataToSend.append("admin_id", admin_id);
      
      // Add each FAQ item to the module array
      formData.module.forEach((item, index) => {
        dataToSend.append(`module[${index}][question]`, item.question);
        dataToSend.append(`module[${index}][answer]`, item.answer);
      });
      
      // Log the FormData content for debugging
      console.log("Submitting FormData:");
      for (let pair of dataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      
      // Send the data as FormData
      const url = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/faq-items/";
      let response = await fetch(url, {
        method: "POST",
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
          method: "POST",
          headers: {
            Authorization: `Bearer ${newAccess}`,
          },
          body: dataToSend,
        });
      }

      console.log("Response status:", response.status);
      
      // Parse the response
      const responseData = await response.json();
      console.log("Response data:", responseData);
      
      // Check if the API call was successful
      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || "Failed to save FAQ items");
      }

      // SUCCESS PATH
      const faqCount = formData.module.length;
      setMessage(`Success! ${faqCount} FAQ item${faqCount > 1 ? 's have' : ' has'} been added successfully.`);
      setVariant("success");
      setShowAlert(true);
      resetForm();
      fetchFaqItems(); // Refresh the FAQ items list

      // Hide success alert after 5 seconds
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      // FAILURE PATH
      console.error("Error adding FAQ items:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        errorMessage =
          "Network error: Could not connect to the server. Please check the API endpoint.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMessage(` Error: ${errorMessage}`);
      setVariant("danger");
      setShowAlert(true);

      // Hide error alert after 5 seconds
      setTimeout(() => setShowAlert(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = faqItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(faqItems.length / itemsPerPage);
  
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
              <h1 className="page-title mb-0">Manage FAQ Items</h1>
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

            {/* FAQ Items Cards */}
            {isLoading ? (
              <div className="text-center my-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <>
                <Row>
                  {currentItems.length === 0 ? (
                    <Col xs={12} className="text-center my-5">
                      <p>No FAQ items found.</p>
                    </Col>
                  ) : (
                    currentItems.map((item) => (
                      <Col lg={4} md={6} sm={12} className="mb-4" key={item.id}>
                        <Card className="h-100">
                          <Card.Header className="d-flex justify-content-between align-items-center">
                            <Card.Title className="mb-0">FAQ Item #{item.id}</Card.Title>
                          </Card.Header>
                          <Card.Body>
                            {item.module && item.module.length > 0 ? (
                              <div>
                                {item.module.map((faq, faqIndex) => (
                                  <div key={faqIndex} className="mb-3">
                                    <h6>Q{faqIndex + 1}: {faq.question}</h6>
                                    <p>A: {faq.answer}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p>No questions in this FAQ item.</p>
                            )}
                            <div className="mt-2">
                              <small className="text-muted">Created: {item.formatted_created_at}</small>
                            </div>
                          </Card.Body>
                          <div className="d-flex justify-content-between p-3">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => startEditing(item)}
                            >
                              <FaEdit /> Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => deleteFaqItem(item.id)}
                              disabled={isSubmitting}
                            >
                              <FaTrash /> Delete
                            </Button>
                          </div>
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
          <Modal.Title>Edit FAQ Item #{currentEditItem?.id}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={saveEditedItem}>
          <Modal.Body>
            <div className="faq-container">
              {editingItemData?.module.map((faq, index) => (
                <div
                  key={index}
                  className="faq-item mb-3 p-3 border rounded"
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5>Question {index + 1}</h5>
                    {editingItemData.module.length > 1 && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeEditingFAQItem(index)}
                      >
                        <FaTrash /> Remove
                      </Button>
                    )}
                  </div>

                  {/* Question */}
                  <Form.Group className="mb-2">
                    <Form.Label>Question</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={`Enter question ${index + 1}`}
                      value={faq.question || ""}
                      onChange={(e) =>
                        handleEditingFAQChange(
                          index,
                          "question",
                          e.target.value
                        )
                      }
                      required
                    />
                  </Form.Group>

                  {/* Answer */}
                  <Form.Group className="mb-2">
                    <Form.Label>Answer</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder={`Enter answer for question ${
                        index + 1
                      }`}
                      value={faq.answer || ""}
                      onChange={(e) =>
                        handleEditingFAQChange(
                          index,
                          "answer",
                          e.target.value
                        )
                      }
                      required
                    />
                  </Form.Group>
                </div>
              ))}

              <Button
                variant="outline-primary"
                onClick={addEditingFAQItem}
                className="mt-2"
              >
                <FaPlus /> Add Another Question
              </Button>
            </div>
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
    </>
  );
};

export default ManageFAQ;