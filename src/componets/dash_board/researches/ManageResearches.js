import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Modal, Spinner, Badge, Pagination, Accordion, Image } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaCalendarAlt, FaImage, FaFilePdf } from "react-icons/fa";

const ManageResearches = () => {
  const { auth, logout, refreshAccessToken } = useAuth();
  const admin_id = auth?.unique_id;

  console.log("Admin ID:", admin_id);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // State for research items
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemData, setEditingItemData] = useState(null);

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

  // Image preview state
  const [imagePreviews, setImagePreviews] = useState({});
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Base URL for API
  const API_BASE_URL = "https://mahadevaaya.com/trilokayurveda/trilokabackend";

  // Function to get the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If the image path already includes the full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If the image path starts with a slash, prepend the base URL
    if (imagePath.startsWith('/')) {
      return `${API_BASE_URL}${imagePath}`;
    }
    
    // Otherwise, prepend the base URL with a slash
    return `${API_BASE_URL}/${imagePath}`;
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

  // Fetch research items from API
  const fetchItems = async () => {
    setIsLoading(true);
    setIsFetching(true);
    try {
      const url = `${API_BASE_URL}/api/researches-items/`;
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
        throw new Error("Failed to fetch research items");
      }

      const result = await response.json();
      console.log("GET API Response:", result);

      if (result.success && result.data) {
        // Process data to format dates and image URLs
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
          
          // Add full image URL for the first image in module
          if (item.module && item.module.length > 0 && item.module[0] && item.module[0][0]) {
            processedItem.firstImageUrl = getImageUrl(item.module[0][0]);
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

  // Fetch research items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    setEditingItemData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle image file change
  const handleImageChange = (file) => {
    setEditingItemData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // Start editing an item
  const startEditing = (item) => {
    setCurrentEditItem(item);
    setEditingItemData({
      id: item.id,
      title: item.title,
      module: item.module ? [...item.module] : [],
      existing_images: item.module ? item.module.map(m => m[0]) : []
    });
    setShowEditModal(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingItemId(null);
    setEditingItemData(null);
    setShowEditModal(false);
    setImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews['edit'];
      return newPreviews;
    });
  };

  // Save edited item
  const saveEditedItem = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowAlert(false);

    try {
      const dataToSend = new FormData();
      dataToSend.append("id", editingItemData.id);
      dataToSend.append("title", editingItemData.title);
      
      // Add each module to FormData
      editingItemData.module.forEach((module, index) => {
        if (module[0]) dataToSend.append(`module[${index}][0]`, module[0]);
        if (module[1]) dataToSend.append(`module[${index}][1]`, module[1]);
      });
      
      const url = `${API_BASE_URL}/api/researches-items/`;
      let response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${auth?.access}`,
        },
        body: dataToSend,
      });

      // If unauthorized, try refreshing token and retry once
      if (response.status === 401) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) throw new Error("Session expired");
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
        setEditingItemId(null);
        setEditingItemData(null);
        setShowEditModal(false);
        setImagePreviews(prev => {
          const newPreviews = { ...prev };
          delete newPreviews['edit'];
          return newPreviews;
        });
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
          Authorization: `Bearer ${auth?.access}`,
        },
        body: dataToSend,
      });

      // If unauthorized, try refreshing token and retry once
      if (response.status === 401) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) throw new Error("Session expired");
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

  // Handle image load error
  const handleImageError = (itemId) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
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
                      <Col lg={12} md={12} sm={12} className="mb-4" key={item.id}>
                        <Card className="h-100">
                         
                          <Card.Body>
                            {/* {item.firstImageUrl && (
                                <div className="mb-3 text-center">
                                  <Image 
                                    src={item.firstImageUrl} 
                                    alt={item.title} 
                                    fluid 
                                    style={{ maxHeight: '200px' }}
                                    thumbnail
                                  />
                                </div>
                            )} */}
                            <h5>{item.title}</h5>
                            <p><FaCalendarAlt className="me-2" />{item.formatted_created_at}</p>
                            <div className="mt-2">
                              <small className="text-muted">Created: {item.formatted_created_at}</small>
                              {item.updated_at !== item.created_at && (
                                <small className="text-muted">Updated: {item.formatted_updated_at}</small>
                              )}
                            </div>
                            
                            {/* Display Modules */}
                            {item.module && item.module.length > 0 && (
                              <div className="mt-3">
                                <h6>Research Modules:</h6>
                                <Accordion defaultActiveKey="0">
                                  {item.module.map((module, index) => (
                                    <Accordion.Item eventKey={index.toString()} key={index}>
                                      <Accordion.Header>
                                        <div className="d-flex justify-content-between align-items-center">
                                          <span>
                                            {module[0] && (
                                              <>
                                                <FaFilePdf className="me-2" />
                                                {module[0].split('/').pop()}
                                              </>
                                            )}
                                            {!module[0] && (
                                              <span>No file</span>
                                            )}
                                          </span>
                                          <span className="text-muted">
                                            {module[1] || 'No description'}
                                          </span>
                                        </div>
                                      </Accordion.Header>
                                      <Accordion.Body>
                                        <div className="d-flex">
                                          <div className="me-3">
                                            <strong>File:</strong>
                                            <div>
                                              {module[0] ? (
                                                <Badge bg="success" className="me-2">
                                                  Available
                                                </Badge>
                                              ) : (
                                                <Badge bg="secondary" className="me-2">
                                                  Not Available
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                          <div>
                                            <strong>Description:</strong>
                                            <div>{module[1] || 'No description'}</div>
                                          </div>
                                        </div>
                                      </Accordion.Body>
                                    </Accordion.Item>
                                  ))}
                                </Accordion>
                              </div>
                            )}
                          </Card.Body>
                          
                          {/* Edit and Delete Buttons */}
                          <div className="d-flex justify-content-between p-4 mt-3">
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
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={editingItemData?.title || ""}
                    onChange={(e) => handleItemChange("title", e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={12}>
                <h5 className="mb-3">Research Modules</h5>
                
                {editingItemData?.module && editingItemData.module.map((module, index) => (
                  <div key={index} className="border rounded p-3 mb-3">
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>PDF File</Form.Label>
                          <Form.Control
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const newModules = [...editingItemData.module];
                              newModules[index] = [e.target.files[0], module[1]];
                              handleItemChange("module", newModules);
                            }}
                          />
                          {module[0] && (
                            <div className="mt-2">
                              <small className="text-muted">
                                Current: {module[0].split('/').pop()}
                              </small>
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter description"
                            value={module[1] || ""}
                            onChange={(e) => {
                              const newModules = [...editingItemData.module];
                              newModules[index] = [module[0], e.target.value];
                              handleItemChange("module", newModules);
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Col>
            </Row>
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