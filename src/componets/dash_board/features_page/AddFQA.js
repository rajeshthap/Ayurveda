import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaPlus, FaTrash } from "react-icons/fa";

const AddFAQ = () => {
  const { auth, logout, refreshAccessToken } = useAuth();
  const admin_id = auth?.unique_id;

  console.log("Admin ID:", admin_id);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Form state for FAQ items
  const [formData, setFormData] = useState({
    module: [{ question: "", answer: "" }], // Initialize with one empty FAQ item
  });

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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Handle FAQ item changes
  const handleFAQChange = (index, field, value) => {
    setFormData((prev) => {
      const newModule = [...prev.module];
      // Ensure the FAQ item at index exists and is an object
      if (!newModule[index] || typeof newModule[index] !== "object") {
        newModule[index] = { question: "", answer: "" };
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
  };

  // Add a new FAQ item
  const addFAQItem = () => {
    setFormData((prev) => ({
      ...prev,
      module: [...prev.module, { question: "", answer: "" }],
    }));
  };

  // Remove a FAQ item
  const removeFAQItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      module: prev.module.filter((_, i) => i !== index),
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      module: [{ question: "", answer: "" }],
    });
    setShowAlert(false);
  };

  // Handle form submission (POST request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowAlert(false);

    try {
      // Prepare the data for submission
      const url = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/faq-items/";
      
      // Create FormData for the API
      const dataToSend = new FormData();
      
      // Add admin_id
      dataToSend.append("admin_id", admin_id);
      
      // Create a properly indexed module array
      const moduleArray = formData.module.map((item, index) => ({
        question: item.question,
        answer: item.answer
      }));
      
      // Add the module array as a JSON string
      dataToSend.append("module", JSON.stringify(moduleArray));
      
      // Log the FormData content for debugging
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
        throw new Error(responseData.message || "Failed to save FAQ items");
      }

      // SUCCESS PATH
      const faqCount = formData.module.length;
      setMessage(`✅ Success! ${faqCount} FAQ item${faqCount > 1 ? 's have' : ' has'} been added successfully.`);
      setVariant("success");
      setShowAlert(true);
      resetForm();

      // Hide success alert after 5 seconds
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      // FAILURE PATH
      console.error("Error adding FAQ items:", error);
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
            <h1 className="page-title">Add FAQ Items</h1>

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
              {/* FAQ Items Section */}
              <Form.Group className="mb-3">
                <Form.Label>FAQ Items</Form.Label>

                <div className="faq-container">
                  {formData.module.map((faq, index) => (
                    <div
                      key={index}
                      className="faq-item mb-3 p-3 border rounded"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5>FAQ Item {index + 1}</h5>

                        {formData.module.length > 1 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeFAQItem(index)}
                          >
                            <FaTrash /> Remove
                          </Button>
                        )}
                      </div>

                      {/* Question */}
                      <Form.Group className="mb-2">
                        <Form.Label>Question</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={`Enter question ${index + 1}`}
                          value={faq.question || ""}
                          onChange={(e) =>
                            handleFAQChange(
                              index,
                              "question",
                              e.target.value
                            )
                          }
                          required
                        />
                      </Form.Group>

                      {/* Answer */}
                      <Form.Group className="mb-2">
                        <Form.Label>Answer</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder={`Enter answer ${index + 1}`}
                          value={faq.answer || ""}
                          onChange={(e) =>
                            handleFAQChange(
                              index,
                              "answer",
                              e.target.value
                            )
                          }
                          required
                        />
                      </Form.Group>
                    </div>
                  ))}

                  <Button
                    variant="outline-primary"
                    onClick={addFAQItem}
                    className="mt-2"
                  >
                    <FaPlus /> Add Another FAQ Item
                  </Button>
                </div>
              </Form.Group>

              <div className="d-flex gap-2 mt-3">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit FAQ Items"}
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
    </>
  );
};

export default AddFAQ;