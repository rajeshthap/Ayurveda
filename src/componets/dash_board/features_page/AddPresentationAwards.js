import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaPlus, FaTrash } from "react-icons/fa";

const AddPresentationAwards = () => {
  const { auth, logout, refreshAccessToken } = useAuth();
  const admin_id = auth?.unique_id;

  console.log("Admin ID:", admin_id);
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Form state for media gallery items
  const [formData, setFormData] = useState({
    items: [{ title: "", image: null, date: "" }], // Initialize with one empty item
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

  // Handle media item changes
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
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      items: [{ title: "", image: null, date: "" }],
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
      const url = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/presentationandaward-items/";
      
      // Create FormData for the API
      const dataToSend = new FormData();
      
      // Add admin_id
      dataToSend.append("admin_id", admin_id);
      
      // Add each item to the FormData with correct field names (flat structure, not nested)
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
        throw new Error(responseData.message || "Failed to save media items");
      }

      // SUCCESS PATH
      const itemCount = formData.items.length;
      setMessage(`  Success! ${itemCount} media item${itemCount > 1 ? 's have' : ' has'} been added successfully.`);
      setVariant("success");
      setShowAlert(true);
      resetForm();

      // Hide success alert after 5 seconds
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      // FAILURE PATH
      console.error("Error adding media items:", error);
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
            <h1 className="page-title">Add Media Gallery Items</h1>

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
              {/* Media Items Section */}
              <Form.Group className="mb-3">
                <Form.Label>Media Items</Form.Label>

                <div className="media-container">
                  {formData.items.map((item, index) => (
                    <div
                      key={index}
                      className="media-item mb-3 p-3 border rounded"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5>Media Item {index + 1}</h5>

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
                            <small className="text-muted">
                              Selected: {item.image.name}
                            </small>
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
                    <FaPlus /> Add Another Media Item
                  </Button>
                </div>
              </Form.Group>

              <div className="d-flex gap-2 mt-3">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Media Items"}
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

export default AddPresentationAwards;