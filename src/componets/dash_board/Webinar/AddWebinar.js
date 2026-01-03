import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useAuth } from "../../context/AuthContext";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaVideo, FaLink } from "react-icons/fa";

const AddWebinar = () => {
  const { auth, refreshAccessToken } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Form state matching the API structure
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_link: "", // For video link
    video_file: null, // For video file upload
  });

  // State for video file name display
  const [videoFileName, setVideoFileName] = useState("");

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

  // Handle video file change
  const handleVideoFileChange = (file) => {
    setFormData((prev) => ({ ...prev, video_file: file }));
    if (formErrors.video_file) {
      setFormErrors((prev) => ({ ...prev, video_file: "" }));
    }
    
    // Store the file name for display
    if (file) {
      setVideoFileName(file.name);
    } else {
      setVideoFileName("");
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
      video_link: "",
      video_file: null,
    });
    setVideoFileName("");
    setShowAlert(false);
    setFormErrors({});
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Webinar title is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Webinar description is required";
    }
    
    // At least one of video_link or video_file is required
    if (!formData.video_file && !formData.video_link.trim()) {
      errors.media = "Either a video file or video link is required";
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
      const url = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/webinars-items/";
      const dataToSend = new FormData();

      // Append data to match the API structure
      dataToSend.append("title", formData.title);
      dataToSend.append("description", formData.description);
      
      if (formData.video_file) {
        dataToSend.append("video_file", formData.video_file);
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
      let webinarData;
      if (responseData.data && Array.isArray(responseData.data) && responseData.data.length > 0) {
        // If the response has a data property with an array containing the webinar item
        webinarData = responseData.data[0];
      } else if (responseData.title) {
        // If the response directly contains the webinar item
        webinarData = responseData;
      } else {
        // Fallback for unexpected response structure
        webinarData = { title: formData.title, id: "unknown" };
      }

      // Success handling with fallbacks
      const title = webinarData.title || formData.title;
      const id = webinarData.id || "unknown";
      
      setMessage(`Success! Webinar "${title}" (ID: ${id}) has been added.`);
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
            <h1 className="page-title">Add Webinar</h1>

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
                    <Form.Label>Webinar Title</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter webinar title"
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
                    <Form.Label>Webinar Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Enter a detailed description of the webinar"
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
                    <Form.Label>Video File (Optional)</Form.Label>
                    <Form.Control
                      type="file"
                      name="video_file"
                      accept="video/*"
                      onChange={(e) => handleVideoFileChange(e.target.files[0])}
                      isInvalid={!!formErrors.video_file}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.video_file}
                    </Form.Control.Feedback>
                    {videoFileName && (
                      <div className="mt-2 d-flex align-items-center text-success">
                        <FaVideo className="me-2" />
                        <span>{videoFileName}</span>
                      </div>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
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
                    {formData.video_link && (
                      <div className="mt-2 d-flex align-items-center text-info">
                        <FaLink className="me-2" />
                        <span>{formData.video_link}</span>
                      </div>
                    )}
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
                  {isSubmitting ? "Submitting..." : "Submit Webinar"}
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

export default AddWebinar;