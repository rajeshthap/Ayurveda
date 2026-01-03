import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useAuth } from "../../context/AuthContext";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaFilePdf, FaImage } from "react-icons/fa";

const AddSuccessStories = () => {
  const { auth, refreshAccessToken } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Form state matching the API structure
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null, // For image upload
    pdf_file: null, // For PDF upload
    video_link: "", // For video link
  });

  // State for image preview
  const [imagePreview, setImagePreview] = useState(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
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

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Handle title change
  const handleTitleChange = (value) => {
    setFormData((prev) => ({ ...prev, title: value }));
    if (formErrors.title) {
      setFormErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  // Handle description change
  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
    if (formErrors.description) {
      setFormErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  // Handle image change
  const handleImageChange = (file) => {
    setFormData((prev) => ({ ...prev, image: file }));
    if (formErrors.image) {
      setFormErrors((prev) => ({ ...prev, image: "" }));
    }
    
    // Create a preview URL for selected image
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  // Handle PDF file change
  const handlePdfFileChange = (file) => {
    setFormData((prev) => ({ ...prev, pdf_file: file }));
    if (formErrors.pdf_file) {
      setFormErrors((prev) => ({ ...prev, pdf_file: "" }));
    }
  };

  // Handle video link change
  const handleVideoLinkChange = (value) => {
    setFormData((prev) => ({ ...prev, video_link: value }));
    if (formErrors.video_link) {
      setFormErrors((prev) => ({ ...prev, video_link: "" }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: null,
      pdf_file: null,
      video_link: "",
    });
    setImagePreview(null);
    setShowAlert(false);
    setFormErrors({});
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Success story title is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Success story description is required";
    }
    
    // At least one of image, pdf_file, or video_link is required
    if (!formData.image && !formData.pdf_file && !formData.video_link.trim()) {
      errors.media = "At least one of image, PDF file, or video link is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission (POST request)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!auth) {
      setMessage("Error: Authentication not found. Please log in again.");
      setVariant("danger");
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);
    setShowAlert(false);

    try {
      // API endpoint
      const url = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/oursuccess-stories-item/";
      const dataToSend = new FormData();

      // Append data to match the API structure
      dataToSend.append("title", formData.title);
      dataToSend.append("description", formData.description);
      
      if (formData.image) {
        dataToSend.append("image", formData.image);
      }
      
      if (formData.pdf_file) {
        dataToSend.append("pdf_file", formData.pdf_file);
      }
      
      if (formData.video_link.trim()) {
        dataToSend.append("video_link", formData.video_link);
      }

      console.log("--- Final FormData Payload ---");
      for (let [key, value] of dataToSend.entries()) {
        console.log(`${key}:`, value instanceof File ? `File: ${value.name} (Size: ${value.size} bytes)` : value);
      }
      console.log("----------------------------");

      // Make the fetch request
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth?.access}`,
        },
        body: dataToSend,
      });

      if (response.status === 401) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) throw new Error("Session expired. Please log in again.");
        response = await fetch(url, {
          method: "POST",
          headers: { Authorization: `Bearer ${newAccess}` },
          body: dataToSend,
        });
      }

      if (!response.ok) {
        let errorData;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            errorData = await response.json();
          } else {
            const text = await response.text();
            throw new Error(`Server returned ${response.status}: ${text}`);
          }
        } catch (e) {
          throw new Error(`Server returned ${response.status} but couldn't parse the response`);
        }

        // Error handling for the API structure
        if (errorData.errors) {
          console.error("Detailed API Errors:", JSON.stringify(errorData.errors, null, 2));
          const errorMessages = Object.values(errorData.errors).flat().join(" | ");
          throw new Error(errorMessages);
        } else if (errorData.message) {
          throw new Error(errorData.message);
        } else {
          throw new Error(`Server returned ${response.status} with no specific error message`);
        }
      }

      const responseData = await response.json();
      console.log("API Response:", responseData); // Debug log to see the actual response structure

      // More robust success handling to accommodate different response structures
      let successStoryData;
      if (responseData.data && Array.isArray(responseData.data) && responseData.data.length > 0) {
        // If the response has a data property with an array containing the success story item
        successStoryData = responseData.data[0];
      } else if (responseData.title) {
        // If the response directly contains the success story item
        successStoryData = responseData;
      } else {
        // Fallback for unexpected response structure
        successStoryData = { title: formData.title, id: "unknown" };
      }

      // Success handling with fallbacks
      const title = successStoryData.title || formData.title;
      const id = successStoryData.id || "unknown";
      
      setMessage(`Success! Success story "${title}" (ID: ${id}) has been added.`);
      setVariant("success");
      setShowAlert(true);
      resetForm();

      setTimeout(() => setShowAlert(false), 8000);
    } catch (error) {
      console.error("Caught error in handleSubmit:", error);
      setMessage(`Error: ${error.message}`);
      setVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 7000);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h1 className="page-title">Add Success Story</h1>

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
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Success Story Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter success story title"
                      name="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      isInvalid={!!formErrors.title}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Success Story Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Enter a detailed description of the success story"
                      name="description"
                      value={formData.description}
                      onChange={(e) => handleDescriptionChange(e.target.value)}
                      isInvalid={!!formErrors.description}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.description}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Image (Optional)</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e.target.files[0])}
                      isInvalid={!!formErrors.image}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.image}
                    </Form.Control.Feedback>
                    {imagePreview && (
                      <div className="mt-3">
                        <p>Image Preview:</p>
                        <img
                          src={imagePreview}
                          alt="Image Preview"
                          style={{ maxWidth: "300px", maxHeight: "200px" }}
                        />
                      </div>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>PDF File (Optional)</Form.Label>
                    <Form.Control
                      type="file"
                      name="pdf_file"
                      accept=".pdf"
                      onChange={(e) => handlePdfFileChange(e.target.files[0])}
                      isInvalid={!!formErrors.pdf_file}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.pdf_file}
                    </Form.Control.Feedback>
                    {formData.pdf_file && (
                      <div className="mt-2 d-flex align-items-center text-success">
                        <FaFilePdf className="me-2" />
                        <span>{formData.pdf_file.name}</span>
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Video Link (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter video link (e.g., YouTube URL)"
                      name="video_link"
                      value={formData.video_link}
                      onChange={(e) => handleVideoLinkChange(e.target.value)}
                      isInvalid={!!formErrors.video_link}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.video_link}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              {formErrors.media && (
                <Row>
                  <Col md={12}>
                    <div className="text-danger mb-3">{formErrors.media}</div>
                  </Col>
                </Row>
              )}

              <div className="d-flex gap-2 mt-3">
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Success Story"}
                </Button>
                <Button variant="secondary" onClick={resetForm} type="button">
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

export default AddSuccessStories;