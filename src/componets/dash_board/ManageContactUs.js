import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Badge } from "react-bootstrap";
import "../../assets/css/dashboard.css";
import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../context/AuthFetch";
import LeftNav from "./LeftNav";
import DashBoardHeader from "./DashBoardHeader";
import { FaPlus, FaTrash, FaEdit, FaArrowLeft } from "react-icons/fa";

const ManageContactUs = () => {
  const { auth, refreshAccessToken } = useAuth();
  const authFetch = useAuthFetch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // State for all contact us items
  const [contactItems, setContactItems] = useState([]);
  
  // Form state for selected contact us item
  const [formData, setFormData] = useState({
    id: null,
    address_module_1: [""],
    address_module_2: [""],
    phone_module: [""],
    email_module: [""],
    clinic_hours_module: [""],
    consultations_available_module: [""],
    disclaimer_module: [""],
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

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

  // Fetch all contact us items on component mount
  useEffect(() => {
    fetchAllContactItems();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch all contact us items from API
  const fetchAllContactItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/contactus-info-items/",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch contact us items data");
      }

      const result = await response.json();
      console.log("GET All Contact Us Items API Response:", result);

      if (result.success && result.data && result.data.length > 0) {
        setContactItems(result.data);
      } else {
        throw new Error("No contact us items found");
      }
    } catch (error) {
      console.error("Error fetching contact us items data:", error);
      setMessage(error.message || "An error occurred while fetching data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch specific contact us item data by ID
  const fetchContactItemData = async (itemId) => {
    setIsLoading(true);
    try {
      console.log("Fetching contact us item with ID:", itemId);
      const response = await fetch(
        `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/contactus-info-items/?id=${itemId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch contact us item data. Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("GET Contact Us Item API Response:", result);

      if (result.success) {
        let itemData;
        
        // Check if data is an array (like in the get all response) or a single object
        if (Array.isArray(result.data)) {
          // If it's an array, find the contact us item with matching ID
          itemData = result.data.find(item => item.id.toString() === itemId.toString());
          if (!itemData) {
            throw new Error(`Contact us item with ID ${itemId} not found in response array`);
          }
        } else if (result.data && result.data.id) {
          // If data is a single object, check if it's the one we want
          if (result.data.id.toString() === itemId.toString()) {
            itemData = result.data;
          } else {
            throw new Error(`Returned contact us item ID ${result.data.id} does not match requested ID ${itemId}`);
          }
        } else {
          throw new Error("Invalid contact us item data structure in response");
        }

        setFormData({
          id: itemData.id,
          address_module_1: itemData.address_module_1 || [""],
          address_module_2: itemData.address_module_2 || [""],
          phone_module: itemData.phone_module || [""],
          email_module: itemData.email_module || [""],
          clinic_hours_module: itemData.clinic_hours_module || [""],
          consultations_available_module: itemData.consultations_available_module || [""],
          disclaimer_module: itemData.disclaimer_module || [""],
        });

        setSelectedItemId(itemId);
      } else {
        console.error("API Response issue:", result);
        throw new Error(result.message || "No contact us item data found in response");
      }
    } catch (error) {
      console.error("Error fetching contact us item data:", error);
      setMessage(error.message || "An error occurred while fetching contact us item data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle contact us item card click
  const handleItemClick = (itemId) => {
    console.log("Contact us item card clicked with ID:", itemId);
    fetchContactItemData(itemId);
  };

  // Handle module changes
  const handleModuleChange = (moduleName, index, value) => {
    setFormData((prev) => {
      const newModule = [...prev[moduleName]];
      newModule[index] = value;

      return {
        ...prev,
        [moduleName]: newModule,
      };
    });
  };

  // Add a new item to a module
  const addModuleItem = (moduleName) => {
    setFormData((prev) => ({
      ...prev,
      [moduleName]: [...prev[moduleName], ""],
    }));
  };

  // Remove an item from a module
  const removeModuleItem = (moduleName, index) => {
    setFormData((prev) => ({
      ...prev,
      [moduleName]: prev[moduleName].filter((_, i) => i !== index),
    }));
  };

  // Reset form to original data
  const resetForm = () => {
    if (selectedItemId) {
      fetchContactItemData(selectedItemId);
    }
    setIsEditing(false);
    setShowAlert(false);
  };

  // Go back to contact us item list
  const backToItemList = () => {
    setSelectedItemId(null);
    setIsEditing(false);
    setShowAlert(false);
  };

  // Enable editing mode
  const enableEditing = (e) => {
    e.preventDefault();
    setIsEditing(true);
    setShowAlert(false);
  };

  // Handle form submission (PUT request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowAlert(false);

    try {
      // Prepare the data for submission
      const payload = {
        id: formData.id,
        address_module_1: formData.address_module_1,
        address_module_2: formData.address_module_2,
        phone_module: formData.phone_module,
        email_module: formData.email_module,
        clinic_hours_module: formData.clinic_hours_module,
        consultations_available_module: formData.consultations_available_module,
        disclaimer_module: formData.disclaimer_module,
      };

      console.log("Submitting data for contact us item ID:", formData.id);
      console.log("Payload:", payload);

      // Use JSON for updates
      const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/contactus-info-items/?id=${formData.id}`;
      console.log("PUT URL:", url);
      
      const response = await authFetch(url, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      console.log("PUT Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error(
          errorData.message || "Failed to update contact us item"
        );
      }

      const result = await response.json();
      console.log("PUT Success response:", result);

      if (result.success) {
        setMessage("Contact us item updated successfully!");
        setVariant("success");
        setShowAlert(true);
        setIsEditing(false);
        
        // Update the contact us item in the list
        if (result.data) {
          let updatedItem;
          if (Array.isArray(result.data)) {
            updatedItem = result.data.find(item => item.id === formData.id);
          } else {
            updatedItem = result.data;
          }
          
          if (updatedItem) {
            setContactItems(prevItems => 
              prevItems.map(item => 
                item.id === formData.id ? updatedItem : item
              )
            );
          }
        }
        
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        throw new Error(
          result.message || "Failed to update contact us item"
        );
      }
    } catch (error) {
      console.error("Error updating contact us item:", error);
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

      setMessage(errorMessage);
      setVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render module items
  const renderModuleItems = (moduleName, moduleTitle) => {
    return (
      <Form.Group className="mb-4">
        <Form.Label>{moduleTitle}</Form.Label>
        <div className="modules-container">
          {formData[moduleName].map((item, index) => (
            <div
              key={index}
              className="module-item mb-3 p-3 border rounded"
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>{moduleTitle} {index + 1}</h5>

                {isEditing && formData[moduleName].length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeModuleItem(moduleName, index)}
                  >
                    <FaTrash /> Remove
                  </Button>
                )}
              </div>

              <Form.Group className="mb-2">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder={`Enter ${moduleTitle.toLowerCase()} ${index + 1}`}
                  value={item || ""}
                  onChange={(e) =>
                    handleModuleChange(
                      moduleName,
                      index,
                      e.target.value
                    )
                  }
                  required
                  disabled={!isEditing}
                />
              </Form.Group>
            </div>
          ))}

          {isEditing && (
            <Button
              variant="outline-primary"
              onClick={() => addModuleItem(moduleName)}
              className="mt-2"
            >
              <FaPlus /> Add Another {moduleTitle}
            </Button>
          )}
        </div>
      </Form.Group>
    );
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
            <h1 className="page-title">Manage Contact Us</h1>

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

            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading Contact Us Items...</p>
              </div>
            ) : (
              <>
                {!selectedItemId ? (
                  // Contact Us Items List View
                  <>
                    <Row className="mb-4">
                      <Col>
                        <h2 className="mb-4">Select a Contact Us Item to Edit</h2>
                        {contactItems.length === 0 ? (
                          <Alert variant="info">
                            No contact us items found. Please create contact us items first.
                          </Alert>
                        ) : (
                          <Row>
                            {contactItems.map((item) => (
                              <Col md={6} lg={4} className="mb-4" key={item.id}>
                                <Card 
                                  className="h-100 contact-card profile-card" 
                                  onClick={() => handleItemClick(item.id)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <Card.Body>
                                    <div className="d-flex flex-column">
                                      <Card.Title as="h5" className="mb-3">
                                        Contact Information
                                      </Card.Title>
                                      <Card.Text className="text-muted mb-3">
                                        {item.address_module_1 && item.address_module_1.length > 0 
                                          ? `${item.address_module_1[0].substring(0, 100)}...` 
                                          : "Contact information"}
                                      </Card.Text>
                                      
                                    
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                     
                                      <Button variant="outline-primary" size="sm">
                                        <FaEdit /> Edit
                                      </Button>
                                    </div>
                                  </Card.Body>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        )}
                      </Col>
                    </Row>
                  </>
                ) : (
                  // Contact Us Item Edit View
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Button variant="outline-secondary" onClick={backToItemList}>
                        <FaArrowLeft /> Back to Contact Us Items
                      </Button>
                    </div>

                    <Form onSubmit={handleSubmit}>
                      {renderModuleItems("address_module_1", "Address Module 1")}
                      {renderModuleItems("address_module_2", "Address Module 2")}
                      {renderModuleItems("phone_module", "Phone Module")}
                      {renderModuleItems("email_module", "Email Module")}
                      {renderModuleItems("clinic_hours_module", "Clinic Hours Module")}
                      {renderModuleItems("consultations_available_module", "Consultations Available Module")}
                      {renderModuleItems("disclaimer_module", "Disclaimer Module")}
                    </Form>

                    <div className="d-flex gap-2 mt-3">
                      {isEditing ? (
                        <>
                          <Button
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                          >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={resetForm}
                            type="button"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={enableEditing}
                          type="button"
                        >
                          Edit Contact Us Item
                        </Button>
                      )}
                    </div>
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

export default ManageContactUs;