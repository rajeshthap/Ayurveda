import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useAuth } from "../../context/AuthContext";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaFilePdf } from "react-icons/fa";

const AddResearches = () => {
  const { auth, refreshAccessToken } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Form state matching the API structure
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pdf_files: null, // Single file for PDF upload
  });

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

  // Handle file change
  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, pdf_files: file }));
    if (formErrors.pdf_files) {
      setFormErrors((prev) => ({ ...prev, pdf_files: "" }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      pdf_files: null,
    });
    setShowAlert(false);
    setFormErrors({});
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Research title is required";
    }
    if (!formData.description.trim()) {
      errors.description = "Research description is required";
    }
    if (!formData.pdf_files) {
      errors.pdf_files = "A PDF file is required";
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
      const url = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/researches-items/";
      const dataToSend = new FormData();

      // Append data to match the API structure
      dataToSend.append("title", formData.title);
      dataToSend.append("description", formData.description);
      if (formData.pdf_files) {
        dataToSend.append("pdf_files", formData.pdf_files);
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

      // FIXED: More robust success handling to accommodate different response structures
      let researchData;
      if (responseData.data) {
        // If the response has a data property with the research item
        researchData = responseData.data;
      } else if (responseData.title) {
        // If the response directly contains the research item
        researchData = responseData;
      } else {
        // Fallback for unexpected response structure
        researchData = { title: formData.title, id: "unknown" };
      }

      // Success handling with fallbacks
      const title = researchData.title || formData.title;
      const id = researchData.id || "unknown";
      
      setMessage(`Success! Research "${title}" (ID: ${id}) has been added.`);
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
            <h1 className="page-title">Add Research Item</h1>

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
              <Form.Group className="mb-4">
                <Form.Label>Research Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter research title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  isInvalid={!!formErrors.title}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.title}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Research Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Enter a detailed description of the research"
                  value={formData.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  isInvalid={!!formErrors.description}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.description}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>PDF File</Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  isInvalid={!!formErrors.pdf_files}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.pdf_files}
                </Form.Control.Feedback>
                {formData.pdf_files && (
                  <div className="mt-2 file-selected">
                    <FaFilePdf className="me-2" />
                    <span>{formData.pdf_files.name}</span>
                  </div>
                )}
              </Form.Group>

              <div className="d-flex gap-2 mt-3">
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Research"}
                </Button>
                <Button variant="secondary" onClick={resetForm} type="button">
                  Clear
                </Button>
              </div>
            </Form>
          </Container>
        </div>
      </div>

      <style jsx>{`
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