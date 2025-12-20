import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Modal, Spinner, Badge, Pagination, Accordion, Image } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaSearch, FaCalendarAlt, FaImage } from "react-icons/fa";

const ManageDisclaimer = () => {
  const { auth, logout, refreshAccessToken } = useAuth();
  const admin_id = auth?.unique_id;

  console.log("Admin ID:", admin_id);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Form state for disclaimer items
  const [formData, setFormData] = useState({
    items: [{ title: "", module: [{ name: "", description: "" }] }], // Initialize with one empty item with one module
  });

  // State for disclaimer items from API
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

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('id'); // 'id', 'title', 'created_at'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

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

  // Fetch disclaimer items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch disclaimer items from API
  const fetchItems = async () => {
    setIsLoading(true);
    setIsFetching(true);
    try {
      const url = `${API_BASE_URL}/api/disclamier-items/`;
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
        throw new Error("Failed to fetch disclaimer items");
      }

      const result = await response.json();
      console.log("GET API Response:", result);

      if (result.success && result.data) {
        // Process data to format dates and normalize module structure
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
          
          // Normalize module structure if needed
          if (item.module && Array.isArray(item.module)) {
            // Check if modules are strings (old format) or objects (new format)
            if (item.module.length > 0 && typeof item.module[0] === 'string') {
              // Convert old format to new format
              processedItem.module = item.module.map(mod => ({
                name: mod,
                description: ""
              }));
            }
          }
          
          return processedItem;
        });

        setItems(processedItems);
      } else {
        throw new Error("No disclaimer items found");
      }
    } catch (error) {
      console.error("Error fetching disclaimer items:", error);
      setMessage(error.message || "An error occurred while fetching disclaimer items");
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
        newItems[index] = { title: "", module: [{ name: "", description: "" }] };
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

  // Handle module array changes
  const handleModuleChange = (index, moduleIndex, field, value) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      // Ensure the item at index exists and is an object
      if (!newItems[index] || typeof newItems[index] !== "object") {
        newItems[index] = { title: "", module: [{ name: "", description: "" }] };
      }
      
      // Create a copy of the module array
      const newModule = [...(newItems[index].module || [])];
      // Ensure the module at moduleIndex exists and is an object
      if (!newModule[moduleIndex] || typeof newModule[moduleIndex] !== "object") {
        newModule[moduleIndex] = { name: "", description: "" };
      }
      // Update the specific field in the module
      newModule[moduleIndex] = {
        ...newModule[moduleIndex],
        [field]: value,
      };
      
      // Update the module array
      newItems[index] = {
        ...newItems[index],
        module: newModule,
      };

      return {
        ...prev,
        items: newItems,
      };
    });
  };

  // Add a new module to an item
  const addModule = (index) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      // Ensure the item at index exists and is an object
      if (!newItems[index] || typeof newItems[index] !== "object") {
        newItems[index] = { title: "", module: [{ name: "", description: "" }] };
      }
      
      // Add a new empty module
      const newModule = [...(newItems[index].module || []), { name: "", description: "" }];
      
      // Update the module array
      newItems[index] = {
        ...newItems[index],
        module: newModule,
      };

      return {
        ...prev,
        items: newItems,
      };
    });
  };

  // Remove a module from an item
  const removeModule = (itemIndex, moduleIndex) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      // Ensure the item at index exists and is an object
      if (!newItems[itemIndex] || typeof newItems[itemIndex] !== "object") {
        newItems[itemIndex] = { title: "", module: [{ name: "", description: "" }] };
      }
      
      // Remove the module at the specified index
      const newModule = [...(newItems[itemIndex].module || [])];
      newModule.splice(moduleIndex, 1);
      
      // Update the module array
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        module: newModule,
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

  // Handle editing module array changes
  const handleEditingModuleChange = (moduleIndex, field, value) => {
    setEditingItemData((prev) => {
      // Create a copy of the module array
      const newModule = [...(prev.module || [])];
      // Ensure the module at moduleIndex exists and is an object
      if (!newModule[moduleIndex] || typeof newModule[moduleIndex] !== "object") {
        newModule[moduleIndex] = { name: "", description: "" };
      }
      // Update the specific field in the module
      newModule[moduleIndex] = {
        ...newModule[moduleIndex],
        [field]: value,
      };
      
      // Update the module array
      return {
        ...prev,
        module: newModule,
      };
    });
  };

  // Add a new module to the editing item
  const addEditingModule = () => {
    setEditingItemData((prev) => {
      // Add a new empty module
      const newModule = [...(prev.module || []), { name: "", description: "" }];
      
      // Update the module array
      return {
        ...prev,
        module: newModule,
      };
    });
  };

  // Remove a module from the editing item
  const removeEditingModule = (moduleIndex) => {
    setEditingItemData((prev) => {
      // Remove the module at the specified index
      const newModule = [...(prev.module || [])];
      newModule.splice(moduleIndex, 1);
      
      // Update the module array
      return {
        ...prev,
        module: newModule,
      };
    });
  };

  // Add a new item
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { title: "", module: [{ name: "", description: "" }] }],
    }));
  };

  // Remove an item
  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      items: [{ title: "", module: [{ name: "", description: "" }] }],
    });
    setShowAlert(false);
  };

  // Start editing an item
  const startEditing = (item) => {
    setCurrentEditItem(item);
    setEditingItemId(item.id);
    
    // Normalize module structure if needed
    let normalizedModules = [];
    if (item.module && Array.isArray(item.module)) {
      // Check if modules are strings (old format) or objects (new format)
      if (item.module.length > 0 && typeof item.module[0] === 'string') {
        // Convert old format to new format
        normalizedModules = item.module.map(mod => ({
          name: mod,
          description: ""
        }));
      } else {
        // Already in new format
        normalizedModules = [...item.module];
      }
    }
    
    setEditingItemData({
      id: item.id,
      title: item.title,
      module: normalizedModules,
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
      dataToSend.append("title", editingItemData.title);
      
      // Convert module array to JSON string
      dataToSend.append("module", JSON.stringify(editingItemData.module));

      const url = `${API_BASE_URL}/api/disclamier-items/`;
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
          (errorData && errorData.message) || "Failed to update disclaimer item"
        );
      }

      const result = await response.json();
      if (result.success) {
        setMessage("Disclaimer item updated successfully!");
        setVariant("success");
        setShowAlert(true);
        setEditingItemId(null);
        setEditingItemData(null);
        setShowEditModal(false);
        fetchItems(); // Refresh the items list
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        throw new Error(result.message || "Failed to update disclaimer item");
      }
    } catch (error) {
      console.error("Error updating disclaimer item:", error);
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
      
      const url = `${API_BASE_URL}/api/disclamier-items/`;
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
          (errorData && errorData.message) || "Failed to delete disclaimer item"
        );
      }

      const result = await response.json();
      if (result.success) {
        setMessage("Disclaimer item deleted successfully!");
        setVariant("success");
        setShowAlert(true);
        setShowDeleteModal(false);
        setItemToDelete(null);
        fetchItems(); // Refresh the items list
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        throw new Error(result.message || "Failed to delete disclaimer item");
      }
    } catch (error) {
      console.error("Error deleting disclaimer item:", error);
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
        if (item.module && item.module.length > 0) {
          dataToSend.append(`module`, JSON.stringify(item.module));
        }
      });
      
      // Log the FormData content for debugging
      console.log("Submitting FormData:");
      for (let pair of dataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      
      // Send the data as FormData
      const url = `${API_BASE_URL}/api/disclamier-items/`;
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
        throw new Error(responseData.message || "Failed to save disclaimer items");
      }

      // SUCCESS PATH
      const itemCount = formData.items.length;
      setMessage(`✅ Success! ${itemCount} disclaimer item${itemCount > 1 ? 's have' : ' has'} been added successfully.`);
      setVariant("success");
      setShowAlert(true);
      resetForm();
      fetchItems(); // Refresh the items list

      // Hide success alert after 5 seconds
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      // FAILURE PATH
      console.error("Error adding disclaimer items:", error);
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
        case 'created_at':
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
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
          item.module?.some(m => 
            (typeof m === 'string' && m.toLowerCase().includes(lowerSearch)) ||
            (typeof m === 'object' && m.name && m.name.toLowerCase().includes(lowerSearch))
          )
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
              <h1 className="page-title mb-0">Manage Disclaimer Items</h1>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-auto"
                />
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

            {/* Disclaimer Items Cards */}
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
                      <p>{searchTerm ? 'No disclaimer items match your search.' : 'No disclaimer items found.'}</p>
                    </Col>
                  ) : (
                    currentItems.map((item) => (
                      <Col lg={12} md={12} sm={12} className="mb-4" key={item.id}>
                        <Card className="h-100">
                          <Card.Header className="d-flex justify-content-between align-items-center">
                            <Card.Title className="mb-0">Item #{item.id}</Card.Title>
                            <Badge bg="secondary">
                              {item.module?.length || 0} module{item.module?.length !== 1 ? 's' : ''}
                            </Badge>
                          </Card.Header>
                          <Card.Body>
                            <h5>{item.title}</h5>
                            <div className="mt-3">
                              <h6>Modules:</h6>
                              {item.module && item.module.length > 0 ? (
                                <Accordion>
                                  {item.module.map((mod, index) => (
                                    <Accordion.Item key={index} eventKey={index.toString()}>
                                      <Accordion.Header>
                                        {typeof mod === 'string' ? mod : mod.name}
                                      </Accordion.Header>
                                      <Accordion.Body>
                                        {typeof mod === 'string' ? (
                                          <p>No description available</p>
                                        ) : (
                                          <p>{mod.description || "No description available"}</p>
                                        )}
                                      </Accordion.Body>
                                    </Accordion.Item>
                                  ))}
                                </Accordion>
                              ) : (
                                <p className="text-muted">No modules</p>
                              )}
                            </div>
                            <div className="mt-3">
                              <small className="text-muted">
                                Created: {item.formatted_created_at}
                              </small>
                            </div>
                            <div className="mt-1">
                              <small className="text-muted">
                                Updated: {item.formatted_updated_at}
                              </small>
                            </div>
                          </Card.Body>
                          <Card.Footer className="d-flex justify-content-between">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => startEditing(item)}
                              disabled={isSubmitting}
                            >
                              <FaEdit /> Edit
                            </Button>
                          
                          </Card.Footer>
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
          <Modal.Title>Edit Disclaimer Item #{currentEditItem?.id}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={saveEditedItem}>
          <Modal.Body>
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

            {/* Modules */}
            <Form.Group className="mb-3">
              <Form.Label>Modules</Form.Label>
              {editingItemData?.module && editingItemData.module.map((mod, modIndex) => (
                <div key={modIndex} className="mb-3 p-2 border rounded">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6>Module {modIndex + 1}</h6>
                    {editingItemData.module.length > 1 && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeEditingModule(modIndex)}
                      >
                        <FaTrash />
                      </Button>
                    )}
                  </div>
                  <Form.Group className="mb-2">
                    <Form.Label>Module Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={`Enter module name ${modIndex + 1}`}
                      value={typeof mod === 'string' ? mod : (mod.name || "")}
                      onChange={(e) =>
                        handleEditingModuleChange(
                          modIndex,
                          "name",
                          e.target.value
                        )
                      }
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Module Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder={`Enter module description ${modIndex + 1}`}
                      value={typeof mod === 'string' ? "" : (mod.description || "")}
                      onChange={(e) =>
                        handleEditingModuleChange(
                          modIndex,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </Form.Group>
                </div>
              ))}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={addEditingModule}
              >
                <FaPlus /> Add Module
              </Button>
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
          Are you sure you want to delete this disclaimer item? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageDisclaimer;