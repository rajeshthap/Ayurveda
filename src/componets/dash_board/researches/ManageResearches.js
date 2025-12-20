import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Modal, Spinner, Badge, Pagination, Accordion, Image } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaSearch, FaCalendarAlt, FaImage } from "react-icons/fa";

const ManageResearches = () => {
  const { auth, logout, refreshAccessToken } = useAuth();
  const admin_id = auth?.unique_id;

  console.log("Admin ID:", admin_id);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Form state for presentation and award items
  const [formData, setFormData] = useState({
    items: [{ title: "", image: null, date: "" }], // Initialize with one empty item
  });

  // State for presentation and award items from API
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

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id'); // 'id', 'title', 'date'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

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

  // Fetch presentation and award items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Create image preview when a new image is selected
  useEffect(() => {
    const previews = {};
    
    // Create previews for form data images
    formData.items.forEach((item, index) => {
      if (item.image && item.image instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => ({
            ...prev,
            [`form-${index}`]: reader.result
          }));
        };
        reader.readAsDataURL(item.image);
      }
    });
    
    // Create preview for editing image
    if (editingItemData?.image && editingItemData.image instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => ({
          ...prev,
          'edit': reader.result
        }));
      };
      reader.readAsDataURL(editingItemData.image);
    }
  }, [formData, editingItemData]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch presentation and award items from API
  const fetchItems = async () => {
    setIsLoading(true);
    setIsFetching(true);
    try {
      const url = `${API_BASE_URL}/api/presentationandaward-items/`;
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
        throw new Error("Failed to fetch presentation and award items");
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
          
          // Format date field
          if (item.date) {
            const itemDate = new Date(item.date);
            processedItem.formatted_date = itemDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          }
          
          // Add full image URL
          if (item.image) {
            processedItem.fullImageUrl = getImageUrl(item.image);
          }
          
          return processedItem;
        });

        setItems(processedItems);
      } else {
        throw new Error("No presentation and award items found");
      }
    } catch (error) {
      console.error("Error fetching presentation and award items:", error);
      setMessage(error.message || "An error occurred while fetching presentation and award items");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      // Ensure the item at index exists and is an object
      if (!newItems[index] || typeof newItems[index] !== "object") {
        newItems[index] = { title: "", image: null, date: "" };
      }
      // Update the specific field
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };

      return {
        ...prev,
        items: newItems,
      };
    });
  };

  // Handle image file change
  const handleImageChange = (index, file) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      // Ensure the item at index exists and is an object
      if (!newItems[index] || typeof newItems[index] !== "object") {
        newItems[index] = { title: "", image: null, date: "" };
      }
      // Update the image field
      newItems[index] = {
        ...newItems[index],
        image: file,
      };

      return {
        ...prev,
        items: newItems,
      };
    });
  };

  // Handle editing item changes
  const handleEditingItemChange = (field, value) => {
    setEditingItemData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle editing image file change
  const handleEditingImageChange = (file) => {
    setEditingItemData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  // Add a new item
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { title: "", image: null, date: "" }],
    }));
  };

  // Remove an item
  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    
    // Clean up image preview
    setImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[`form-${index}`];
      return newPreviews;
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      items: [{ title: "", image: null, date: "" }],
    });
    setImagePreviews({});
    setShowAlert(false);
  };

  // Start editing an item
  const startEditing = (item) => {
    setCurrentEditItem(item);
    setEditingItemId(item.id);
    setEditingItemData({
      id: item.id,
      title: item.title,
      image: null, // We'll use null initially and update if a new image is selected
      date: item.date,
      existing_image: item.image, // Keep track of the existing image
      existing_image_url: getImageUrl(item.image) // Store the full URL
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
      dataToSend.append("date", editingItemData.date);
      
      // Only append image if a new one is selected
      if (editingItemData.image) {
        dataToSend.append("image", editingItemData.image);
      }

      const url = `${API_BASE_URL}/api/presentationandaward-items/`;
      let response = await fetch(url, {
        method: "PUT",
        body: dataToSend,
        headers: {
          Authorization: `Bearer ${auth?.access}`,
        },
      });

      // If unauthorized, try refreshing token and retry once
      if (response.status === 401) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) throw new Error("Session expired");
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
          (errorData && errorData.message) || "Failed to update presentation and award item"
        );
      }

      const result = await response.json();
      if (result.success) {
        setMessage("Presentation and award item updated successfully!");
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
        fetchItems(); // Refresh the items list
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        throw new Error(result.message || "Failed to update presentation and award item");
      }
    } catch (error) {
      console.error("Error updating presentation and award item:", error);
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
      // Create FormData for the request
      const dataToSend = new FormData();
      dataToSend.append("id", itemToDelete);
      
      const url = `${API_BASE_URL}/api/presentationandaward-items/`;
      let response = await fetch(url, {
        method: "DELETE",
        body: dataToSend,
        headers: {
          Authorization: `Bearer ${auth?.access}`,
        },
      });

      // If unauthorized, try refreshing token and retry once
      if (response.status === 401) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) throw new Error("Session expired");
        response = await fetch(url, {
          method: "DELETE",
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
          (errorData && errorData.message) || "Failed to delete presentation and award item"
        );
      }

      const result = await response.json();
      if (result.success) {
        setMessage("Presentation and award item deleted successfully!");
        setVariant("success");
        setShowAlert(true);
        setShowDeleteModal(false);
        setItemToDelete(null);
        fetchItems(); // Refresh the items list
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        throw new Error(result.message || "Failed to delete presentation and award item");
      }
    } catch (error) {
      console.error("Error deleting presentation and award item:", error);
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
      
      // Add each item to the FormData
      formData.items.forEach((item, index) => {
        if (item.title) dataToSend.append(`title`, item.title);
        if (item.image) dataToSend.append(`image`, item.image);
        if (item.date) dataToSend.append(`date`, item.date);
      });
      
      // Log the FormData content for debugging
      console.log("Submitting FormData:");
      for (let pair of dataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      
      // Send the data as FormData
      const url = `${API_BASE_URL}/api/presentationandaward-items/`;
      let response = await fetch(url, {
        method: "POST",
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
        throw new Error(responseData.message || "Failed to save presentation and award items");
      }

      // SUCCESS PATH
      const itemCount = formData.items.length;
      setMessage(`✅ Success! ${itemCount} presentation and award item${itemCount > 1 ? 's have' : ' has'} been added successfully.`);
      setVariant("success");
      setShowAlert(true);
      resetForm();
      fetchItems(); // Refresh the items list

      // Hide success alert after 5 seconds
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      // FAILURE PATH
      console.error("Error adding presentation and award items:", error);
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

      setMessage(`❌ Error: ${errorMessage}`);
      setVariant("danger");
      setShowAlert(true);

      // Hide error alert after 5 seconds
      setTimeout(() => setShowAlert(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sort items
  const sortItems = useCallback((itemsToSort) => {
    return [...itemsToSort].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
          break;
        case 'date':
          aValue = new Date(a.date || 0);
          bValue = new Date(b.date || 0);
          break;
        case 'id':
        default:
          aValue = a.id || 0;
          bValue = b.id || 0;
          break;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [sortBy, sortOrder]);

  // Filter and sort items
  const filteredItems = searchTerm.trim() === '' 
    ? items 
    : items.filter((item) => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
          item.id?.toString().includes(lowerSearch) ||
          item.title?.toLowerCase().includes(lowerSearch) ||
          item.date?.includes(lowerSearch)
        );
      });
    
  const sortedItems = sortItems(filteredItems);
  
  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

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
              <h1 className="page-title mb-0">Manage Presentation & Award Items</h1>
              <div className="d-flex gap-2">
               
                <Button 
                  variant="outline-secondary" 
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  disabled={!searchTerm}
                >
                  Clear
                </Button>
              </div>
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

            {/* Presentation & Award Items Cards */}
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
                
                <div className="d-flex justify-content-end mb-3">
                 
                </div>
                
                <Row>
                  {currentItems.length === 0 ? (
                    <Col xs={12} className="text-center my-5">
                      <p>{searchTerm ? 'No presentation and award items match your search.' : 'No presentation and award items found.'}</p>
                    </Col>
                  ) : (
                    currentItems.map((item) => (
                      <Col lg={4} md={6} sm={12} className="mb-4" key={item.id}>
                        <Card className="h-100">
                          <Card.Header className="d-flex justify-content-between align-items-center">
                            <Card.Title className="mb-0">Item #{item.id}</Card.Title>
                           
                          </Card.Header>
                          <Card.Body>
                            {item.image && (
                              <div className="mb-3 text-center">
                                {imageLoadErrors[item.id] ? (
                                  <div className="text-center p-3 bg-light rounded">
                                    <FaImage className="mb-2" size={32} />
                                    <p className="mb-0 text-muted">Image not available</p>
                                  </div>
                                ) : (
                                  <Image 
                                    src={item.fullImageUrl || getImageUrl(item.image)} 
                                    alt={item.title} 
                                    fluid 
                                    style={{ maxHeight: '200px' }}
                                    thumbnail
                                    onError={() => handleImageError(item.id)}
                                  />
                                )}
                                
                              </div>
                            )}
                            <h5>{item.title}</h5>
                            <p><FaCalendarAlt className="me-2" />{item.formatted_date}</p>
                            <div className="mt-2">
                              <small className="text-muted">Created: {item.formatted_created_at}</small>
                            </div>
                          </Card.Body>
                           <div>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
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

            {/* Add New Presentation & Award Item Form */}
            <Row className="mt-4">
              <Col>
                <h2>Add New Presentation & Award Item</h2>
                <Form onSubmit={handleSubmit}>
                  {/* Items Section */}
                  <Form.Group className="mb-3">
                    <Form.Label>Presentation & Award Items</Form.Label>

                    <div className="item-container">
                      {formData.items.map((item, index) => (
                        <div
                          key={index}
                          className="item mb-3 p-3 border rounded"
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5>Item {index + 1}</h5>

                            {formData.items.length > 1 && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeItem(index)}
                              >
                                <FaTrash /> Remove
                              </Button>
                            )}
                          </div>

                          {/* Title */}
                          <Form.Group className="mb-2">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder={`Enter title ${index + 1}`}
                              value={item.title || ""}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </Form.Group>

                          {/* Date */}
                          <Form.Group className="mb-2">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                              type="date"
                              value={item.date || ""}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "date",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </Form.Group>

                          {/* Image */}
                          <Form.Group className="mb-2">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageChange(
                                  index,
                                  e.target.files[0]
                                )
                              }
                            />
                            {item.image && (
                              <div className="mt-2">
                                {item.image instanceof File ? (
                                  <div>
                                    <small className="text-muted">
                                      Selected: {item.image.name}
                                    </small>
                                    {imagePreviews[`form-${index}`] && (
                                      <div className="mt-2">
                                        <Image 
                                          src={imagePreviews[`form-${index}`]} 
                                          alt="Preview" 
                                          fluid 
                                          style={{ maxHeight: '150px' }}
                                          thumbnail
                                        />
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <small className="text-muted">
                                    Current: {item.image}
                                  </small>
                                )}
                              </div>
                            )}
                          </Form.Group>
                        </div>
                      ))}

                      <Button
                        variant="outline-primary"
                        onClick={addItem}
                        className="mt-2"
                      >
                        <FaPlus /> Add Another Item
                      </Button>
                    </div>
                  </Form.Group>

                  <div className="d-flex gap-2 mt-3">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Item"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={resetForm}
                      type="button"
                    >
                      Clear
                    </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={cancelEditing} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Presentation & Award Item #{currentEditItem?.id}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={saveEditedItem}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                {editingItemData?.existing_image && (
                  <div className="mb-3 text-center">
                    <h5>Current Image</h5>
                    {imageLoadErrors[`edit-${editingItemData.id}`] ? (
                      <div className="text-center p-3 bg-light rounded">
                        <FaImage className="mb-2" size={32} />
                        <p className="mb-0 text-muted">Image not available</p>
                      </div>
                    ) : (
                      <Image 
                        src={editingItemData.existing_image_url || getImageUrl(editingItemData.existing_image)} 
                        alt={editingItemData.title} 
                        fluid 
                        style={{ maxHeight: '200px' }}
                        thumbnail
                        onError={() => handleImageError(`edit-${editingItemData.id}`)}
                      />
                    )}
                  </div>
                )}
              </Col>
              <Col md={6}>
                {imagePreviews['edit'] && (
                  <div className="mb-3 text-center">
                    <h5>New Image Preview</h5>
                    <Image 
                      src={imagePreviews['edit']} 
                      alt="Preview" 
                      fluid 
                      style={{ maxHeight: '200px' }}
                      thumbnail
                    />
                  </div>
                )}
              </Col>
            </Row>
            
            {/* Title */}
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={editingItemData?.title || ""}
                onChange={(e) =>
                  handleEditingItemChange(
                    "title",
                    e.target.value
                  )
                }
                required
              />
            </Form.Group>

            {/* Date */}
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={editingItemData?.date || ""}
                onChange={(e) =>
                  handleEditingItemChange(
                    "date",
                    e.target.value
                  )
                }
                required
              />
            </Form.Group>

            {/* Image */}
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleEditingImageChange(e.target.files[0])
                }
              />
              {editingItemData?.image && (
                <div className="mt-2">
                  <small className="text-muted">
                    Selected: {editingItemData.image.name}
                  </small>
                </div>
              )}
              <Form.Text className="text-muted">
                Leave this field empty to keep the current image.
              </Form.Text>
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
          Are you sure you want to delete this presentation and award item? This action cannot be undone.
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