import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaPlus, FaTrash, FaFilePdf } from "react-icons/fa";

const AddResearches = () => {
  const { auth, logout, refreshAccessToken } = useAuth();
  const admin_id = auth?.unique_id;

  console.log("Admin ID:", admin_id);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Form state for research items
  const [formData, setFormData] = useState({
    title: "",
    module: [
      { file: null, description: "" },
      { file: null, description: "" }
    ]
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success"); // 'success' or 'danger'
  const [showAlert, setShowAlert] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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

  // Handle title change
  const handleTitleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      title: value
    }));
    // Clear title error if it exists
    if (formErrors.title) {
      setFormErrors(prev => ({
        ...prev,
        title: ""
      }));
    }
  };

  // Handle module item changes
  const handleModuleChange = (index, field, value) => {
    setFormData((prev) => {
      const newModule = [...prev.module];
      // Ensure module item at index exists
      if (!newModule[index]) {
        newModule[index] = { file: null, description: "" };
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
    // Clear module error if it exists
    if (formErrors.module) {
      setFormErrors(prev => ({
        ...prev,
        module: ""
      }));
    }
  };

  // Handle file change
  const handleFileChange = (index, file) => {
    setFormData((prev) => {
      const newModule = [...prev.module];
      // Ensure module item at index exists
      if (!newModule[index]) {
        newModule[index] = { file: null, description: "" };
      }
      // Update the file field
      newModule[index] = {
        ...newModule[index],
        file: file,
      };

      return {
        ...prev,
        module: newModule,
      };
    });
    // Clear module error if it exists
    if (formErrors.module) {
      setFormErrors(prev => ({
        ...prev,
        module: ""
      }));
    }
  };

  // Add a new module item
  const addModuleItem = () => {
    setFormData((prev) => ({
      ...prev,
      module: [...prev.module, { file: null, description: "" }]
    }));
    // Clear module error if it exists
    if (formErrors.module) {
      setFormErrors(prev => ({
        ...prev,
        module: ""
      }));
    }
  };

  // Remove a module item
  const removeModuleItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      module: prev.module.filter((_, i) => i !== index),
    }));
    // Clear module error if it exists
    if (formErrors.module) {
      setFormErrors(prev => ({
        ...prev,
        module: ""
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      module: [
        { file: null, description: "" },
        { file: null, description: "" }
      ]
    });
    setShowAlert(false);
    setFormErrors({});
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    
    // Validate title
    if (!formData.title.trim()) {
      errors.title = "Research title is required";
    }
    
    // Validate modules - need at least 2 with either file or description
    const validModules = formData.module.filter(item => 
      (item.file && item.file.name) || item.description.trim()
    );
    
    if (validModules.length < 2) {
      errors.module = "Please provide at least 2 modules with either a PDF file or description";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission (POST request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setShowAlert(false);

    try {
      // Prepare data for submission
      const url = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/researches-items/";
      
      // Create FormData for API
      const dataToSend = new FormData();
      
      // Add admin_id
      dataToSend.append("admin_id", admin_id);
      
      // Add title
      dataToSend.append("title", formData.title);
      
      // Filter and add only valid modules (those with file or description)
      const validModules = formData.module.filter(item => 
        (item.file && item.file.name) || item.description.trim()
      );
      
      // Add each valid module item to FormData
      validModules.forEach((item, index) => {
        if (item.file) dataToSend.append(`module[${index}][file]`, item.file);
        if (item.description) dataToSend.append(`module[${index}][description]`, item.description);
      });
      
      // Log FormData content for debugging
      console.log("Submitting FormData:");
      for (let pair of dataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      
      // Send the data as FormData
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
        throw new Error(responseData.message || "Failed to save research items");
      }

      // SUCCESS PATH
      setMessage(`Success! Research "${formData.title}" with ${validModules.length} module${validModules.length > 1 ? 's' : ''} has been added successfully.`);
      setVariant("success");
      setShowAlert(true);
      resetForm();

      // Hide success alert after 5 seconds
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      // FAILURE PATH
      console.error("Error adding research items:", error);
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

      setMessage(`Error: ${errorMessage}`);
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
            <h1 className="page-title">Add Research Items</h1>

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

            <Form onSubmit={handleSubmit}>
              {/* Research Title */}
              <Form.Group className="mb-4">
                <Form.Label>Research Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter research title"
                  value={formData.title || ""}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  isInvalid={!!formErrors.title}
                  required
                />
                {formErrors.title && (
                  <Form.Control.Feedback type="invalid">
                    {formErrors.title}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              {/* Module Items Section */}
              <Form.Group className="mb-3">
                <Form.Label>Research Modules (PDF Files & Descriptions)</Form.Label>
                {formErrors.module && (
                  <div className="text-danger mb-2">{formErrors.module}</div>
                )}

                <div className="module-container">
                  {formData.module.map((item, index) => (
                    <div
                      key={index}
                      className="module-item mb-3 p-3 border rounded"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5>Module {index + 1}</h5>

                        {formData.module.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeModuleItem(index)}
                          >
                            <FaTrash /> Remove
                          </Button>
                        )}
                      </div>

                      {/* Description */}
                      <Form.Group className="mb-2">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={`Enter description for module ${index + 1}`}
                          value={item.description || ""}
                          onChange={(e) =>
                            handleModuleChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          required
                        />
                      </Form.Group>

                      {/* PDF File */}
                      <Form.Group className="mb-2">
                        <Form.Label>PDF File</Form.Label>
                        <div className="file-input-container">
                          <Form.Control
                            type="file"
                            accept=".pdf"
                            onChange={(e) =>
                              handleFileChange(
                                index,
                                e.target.files[0]
                              )
                            }
                            required={!item.description.trim()}
                          />
                          {item.file && (
                            <div className="mt-2 file-selected">
                              <FaFilePdf className="me-2" />
                              <span>{item.file.name}</span>
                            </div>
                          )}
                        </div>
                      </Form.Group>
                    </div>
                  ))}

                  <Button
                    variant="outline-primary"
                    onClick={addModuleItem}
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
                  {isSubmitting ? "Submitting..." : "Submit Research"}
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
          </Container>
        </div>
      </div>

      <style jsx>{`
        .module-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .module-item {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
        }
        
        .file-input-container {
          position: relative;
        }
        
        .file-selected {
          display: flex;
          align-items: center;
          color: #198754;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </>
  );
};

export default AddResearches;