import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaPlus, FaTrash } from "react-icons/fa";
 
const ManageAboutUs = () => {
  const { logout, token } = useAuth(); // Get token from auth context
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
 
  // Form state for About Us
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    image: null,
    modules: [""] // Initialize with one empty module
  });
 
  // State for image preview
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
 
  // State for description validation error
  const [descriptionError, setDescriptionError] = useState("");
 
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success"); // 'success' or 'danger'
  const [showAlert, setShowAlert] = useState(false);
 
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
 
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
 
  // Fetch About Us data on component mount
  useEffect(() => {
    fetchAboutUsData();
  }, []);
 
  // Cleanup object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
 
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
 
  // Fetch About Us data from API
  const fetchAboutUsData = async () => {
    setIsLoading(true);
    try {
      // Simple GET request without credentials
      const response = await fetch('https://mahadevaaya.com/trilokayurveda/trilokabackend/api/aboutus-item/', {
        method: 'GET',
      });
     
      if (!response.ok) {
        throw new Error('Failed to fetch About Us data');
      }
     
      const result = await response.json();
      if (result.success && result.data.length > 0) {
        const aboutData = result.data[0]; // Get the first item
       
        setFormData({
          id: aboutData.id,
          title: aboutData.title,
          description: aboutData.description,
          image: null, // We don't have the actual file, just the URL
          modules: aboutData.module.length > 0 ? [...aboutData.module] : [""]
        });
       
        // Set existing image URL for preview
        setExistingImage(aboutData.image);
      } else {
        throw new Error('No About Us data found');
      }
    } catch (error) {
      console.error('Error fetching About Us data:', error);
      setMessage(error.message || "An error occurred while fetching data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };
 
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
   
    if (name === 'image') {
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
    } else {
      // Handle text inputs
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
     
      // Validate description length
      if (name === 'description') {
        const wordCount = value.trim().split(/\s+/).length;
        if (value.trim() === '') {
          setDescriptionError("Description is required.");
        } else if (wordCount <= 10) {
          setDescriptionError(`Description must be more than 10 words. You have entered ${wordCount} words.`);
        } else {
          setDescriptionError(""); // Clear error if valid
        }
      }
    }
  };
 
  // Handle module changes
  const handleModuleChange = (index, value) => {
    setFormData(prev => {
      const newModules = [...prev.modules];
      newModules[index] = value;
     
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
      modules: [...prev.modules, ""]
    }));
  };
 
  // Remove a module
  const removeModule = (index) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index)
    }));
  };
 
  // Reset form to original data
  const resetForm = () => {
    fetchAboutUsData();
    setImagePreview(null);
    setIsEditing(false);
    setDescriptionError("");
    setShowAlert(false);
  };
 
  // Enable editing mode
  const enableEditing = () => {
    setIsEditing(true);
  };
 
  // Handle form submission (PUT request)
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    // Check for validation errors before submitting
    if (descriptionError) {
      setMessage("Please fix the validation errors before submitting.");
      setVariant("danger");
      setShowAlert(true);
      return;
    }
   
    setIsSubmitting(true);
    setShowAlert(false);
   
    // Create a FormData object to send the file
    const dataToSend = new FormData();
    dataToSend.append('title', formData.title);
    dataToSend.append('description', formData.description);
   
    // Add image if a new one was selected
    if (formData.image) {
      dataToSend.append('image', formData.image, formData.image.name);
    }
   
    // Add modules as JSON string
    dataToSend.append('module', JSON.stringify(formData.modules));
   
    try {
      // Using the provided API endpoint for about us with Bearer token
      const response = await fetch('https://mahadevaaya.com/trilokayurveda/trilokabackend/api/aboutus-item/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: dataToSend,
      });
     
      // Handle bad API responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }));
        throw new Error(errorData.message || 'Failed to update about us content');
      }
     
      // SUCCESS PATH
      const result = await response.json();
      if (result.success) {
        setMessage("About Us content updated successfully!");
        setVariant("success");
        setShowAlert(true);
        setIsEditing(false);
       
        // Update existing image if a new one was uploaded
        if (formData.image) {
          setExistingImage(result.data[0].image);
          setImagePreview(null);
        }
       
        // Hide success alert after 3 seconds
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        throw new Error(result.message || 'Failed to update about us content');
      }
     
    } catch (error) {
      // FAILURE PATH
      console.error('Error updating about us content:', error);
      let errorMessage = "An unexpected error occurred. Please try again.";
     
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
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
          <h1 className="page-title">Manage About Us Content</h1>
         
          {/* Alert for success/error messages */}
          {showAlert && (
            <Alert variant={variant} className="mb-4" onClose={() => setShowAlert(false)} dismissible>
              {message}
            </Alert>
          )}
         
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading About Us content...</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={!isEditing}
                />
              </Form.Group>
             
              <Form.Group className="mb-3">
                <Form.Label>Description (must be more than 10 words)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  isInvalid={!!descriptionError}
                  disabled={!isEditing}
                />
                <Form.Control.Feedback type="invalid">
                  {descriptionError}
                </Form.Control.Feedback>
              </Form.Group>
             
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                {isEditing ? (
                  <>
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                    />
                    {imagePreview ? (
                      <div className="mt-3">
                        <p>New Image Preview:</p>
                        <img src={imagePreview} alt="Image Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                      </div>
                    ) : existingImage && (
                      <div className="mt-3">
                        <p>Current Image:</p>
                        <img
                          src={`https://mahadevaaya.com${existingImage}`}
                          alt="Current About Us"
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  existingImage && (
                    <div className="mt-3">
                      <img
                        src={`https://mahadevaaya.com${existingImage}`}
                        alt="Current About Us"
                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                      />
                    </div>
                  )
                )}
              </Form.Group>
             
              {/* Modules Section */}
              <Form.Group className="mb-3">
                <Form.Label>Modules</Form.Label>
                <div className="modules-container">
                  {formData.modules.map((module, index) => (
                    <div key={index} className="module-item mb-3 p-3 border rounded">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5>Module {index + 1}</h5>
                        {isEditing && formData.modules.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeModule(index)}
                          >
                            <FaTrash /> Remove
                          </Button>
                        )}
                      </div>
                     
                      <Form.Group className="mb-2">
                        <Form.Label>Module Content</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={`Enter module ${index + 1} content`}
                          value={module}
                          onChange={(e) => handleModuleChange(index, e.target.value)}
                          required
                          disabled={!isEditing}
                        />
                      </Form.Group>
                    </div>
                  ))}
                 
                  {isEditing && (
                    <Button
                      variant="outline-primary"
                      onClick={addModule}
                      className="mt-2"
                    >
                      <FaPlus /> Add Another Module
                    </Button>
                  )}
                </div>
              </Form.Group>
             
              <div className="d-flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
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
                    Edit About Us
                  </Button>
                )}
              </div>
            </Form>
          )}
        </Container>
      </div>
    </div>
    </>
  );
};
 
export default ManageAboutUs;