import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaPlus, FaTrash } from "react-icons/fa";

const AddOurFocus = () => {
  const { auth, logout, refreshAccessToken } = useAuth();
  const admin_id = auth?.unique_id;
  
  console.log("Admin ID:", admin_id);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  // Form state for Our Focus
  const [formData, setFormData] = useState({
    title: "",
    icon: null,
    image: null,
    modules: [["", ""]] // Initialize with one empty module array [title, description]
  });
  
  // State for image and icon previews
  const [imagePreview, setImagePreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success"); // 'success' or 'danger'
  const [showAlert, setShowAlert] = useState(false);

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

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      if (iconPreview) {
        URL.revokeObjectURL(iconPreview);
      }
    };
  }, [imagePreview, iconPreview]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, files } = e.target;
    
    if (name === "image") {
      // Handle file input for image
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create a preview URL for selected image
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      } else {
        setImagePreview(null);
      }
    } else if (name === "icon") {
      // Handle file input for icon
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        icon: file
      }));
      
      // Create a preview URL for selected icon
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setIconPreview(previewUrl);
      } else {
        setIconPreview(null);
      }
    } else {
      // Handle text inputs
      setFormData(prev => ({
        ...prev,
        [name]: e.target.value
      }));
    }
  };

  // Handle module changes - module is an array of [title, description]
  const handleModuleChange = (index, fieldIndex, value) => {
    setFormData(prev => {
      const newModules = [...prev.modules];
      // Ensure the module at index exists and is an array
      if (!newModules[index] || !Array.isArray(newModules[index])) {
        newModules[index] = ["", ""];
      }
      // Update the specific field (0 for title, 1 for description)
      newModules[index][fieldIndex] = value;
      
      return {
        ...prev,
        modules: newModules
      };
    });
  };

  // Add a new module
  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, ["", ""]]
    }));
  };

  // Remove a module
  const removeModule = (index) => {
    if (formData.modules.length > 1) {
      setFormData(prev => ({
        ...prev,
        modules: prev.modules.filter((_, i) => i !== index)
      }));
    }
  };

  // Clear form function
  const clearForm = () => {
    setFormData({
      title: "",
      icon: null,
      image: null,
      modules: [["", ""]]
    });
    setImagePreview(null);
    setIconPreview(null);
    setMessage("");
    setShowAlert(false);
  };

  // Handle form submission (POST request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowAlert(false);
    
    try {
      // Create a FormData object to send the files
      const dataToSend = new FormData();
      dataToSend.append('title', formData.title);
      
      // Add icon if it exists
      if (formData.icon) {
        dataToSend.append('icon', formData.icon, formData.icon.name);
      }
      
      // Add image if it exists
      if (formData.image) {
        dataToSend.append('image', formData.image, formData.image.name);
      }
      
      // Add modules as JSON string
      dataToSend.append('module', JSON.stringify(formData.modules));
      
      console.log("Submitting data:");
      for (let pair of dataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      
      // Use fetch directly for FormData so the browser sets Content-Type automatically
      const url = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/ourfocus-autoimmunediseases-items/";
      let response = await fetch(url, {
        method: "POST",
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
          method: "POST",
          body: dataToSend,
          headers: {
            Authorization: `Bearer ${newAccess}`,
          },
        });
      }
      
      console.log("POST Response status:", response.status);
      
      // Handle bad API responses
      if (!response.ok) {
        const errorText = await response.text();
        let errorData = null;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          /* not JSON */
        }
        console.error("Server error response:", errorData || errorText);
        throw new Error((errorData && errorData.message) || "Failed to add focus item");
      }
      
      // SUCCESS PATH
      const result = await response.json();
      console.log("POST Success response:", result);
      
      if (result.success) {
        setMessage("Focus item added successfully!");
        setVariant("success");
        setShowAlert(true);
        clearForm();
        
        // Hide success alert after 3 seconds
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        throw new Error(result.message || "Failed to add focus item");
      }
      
    } catch (error) {
      // FAILURE PATH
      console.error("Error adding focus item:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        errorMessage = "Network error: Could not connect to the server. Please check the API endpoint.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage(errorMessage);
      setVariant("danger");
      setShowAlert(true);
      
      // Hide error alert after 5 seconds
      setTimeout(() => setShowAlert(false), 5000);
      
    } finally {
      setIsSubmitting(false);
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
            <h1 className="page-title">Add Our Focus</h1>
            
            {/* Alert for success/error messages */}
            {showAlert && (
              <Alert variant={variant} className="mb-4" onClose={() => setShowAlert(false)} dismissible>
                {message}
              </Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Icon</Form.Label>
                    <Form.Control
                      type="file"
                      name="icon"
                      onChange={handleChange}
                      accept="image/*"
                    />
                    {iconPreview && (
                      <div className="mt-3">
                        <p>Icon Preview:</p>
                        <img
                          src={iconPreview}
                          alt="Icon Preview"
                          style={{ maxWidth: "100px", maxHeight: "100px" }}
                        />
                      </div>
                    )}
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                    />
                    {imagePreview && (
                      <div className="mt-3">
                        <p>Image Preview:</p>
                        <img
                          src={imagePreview}
                          alt="Image Preview"
                          style={{ maxWidth: "200px", maxHeight: "200px" }}
                        />
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              
              {/* Modules Section */}
              <Form.Group className="mb-3">
                <Form.Label>Modules</Form.Label>
                <div className="modules-container">
                  {formData.modules.map((module, index) => (
                    <div key={index} className="module-item mb-3 p-3 border rounded">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5>Module {index + 1}</h5>
                        {formData.modules.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeModule(index)}
                          >
                            <FaTrash /> Remove
                          </Button>
                        )}
                      </div>
                      
                      {/* Module Title */}
                      <Form.Group className="mb-2">
                        <Form.Label>Module Title</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={`Enter module ${index + 1} title`}
                          value={module[0] || ""}
                          onChange={(e) => handleModuleChange(index, 0, e.target.value)}
                          required
                        />
                      </Form.Group>
                      
                      {/* Module Description */}
                      <Form.Group className="mb-2">
                        <Form.Label>Module Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder={`Enter module ${index + 1} description`}
                          value={module[1] || ""}
                          onChange={(e) => handleModuleChange(index, 1, e.target.value)}
                          required
                        />
                      </Form.Group>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline-primary"
                    onClick={addModule}
                    className="mt-2"
                  >
                    <FaPlus /> Add Another Module
                  </Button>
                </div>
              </Form.Group>
              
              <div className="d-flex gap-2 mt-3">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Add Focus Item"}
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={clearForm}
                  type="button"
                >
                  Clear
                </Button>
              </div>
            </Form>
          </Container>
        </div>
      </div>
    </>
  );
};

export default AddOurFocus;