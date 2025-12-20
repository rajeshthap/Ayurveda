import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Badge } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaTrash, FaEdit, FaArrowLeft } from "react-icons/fa";

const ManageTestinomial = () => {
  const { auth, refreshAccessToken } = useAuth();
  const authFetch = useAuthFetch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // State for all testimonial items
  const [testimonialItems, setTestimonialItems] = useState([]);
  
  // Form state for selected testimonial item
  const [formData, setFormData] = useState({
    id: null,
    full_name: "",
    description: "",
    image: null,
  });

  // State for image preview
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

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

  // Fetch all testimonial items on component mount
  useEffect(() => {
    fetchAllTestimonialItems();
  }, []);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch all testimonial items from API
  const fetchAllTestimonialItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/testimonials-items/",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch testimonial items data");
      }

      const result = await response.json();
      console.log("GET All Testimonial Items API Response:", result);

      if (result.success && result.data && result.data.length > 0) {
        setTestimonialItems(result.data);
      } else {
        throw new Error("No testimonial items found");
      }
    } catch (error) {
      console.error("Error fetching testimonial items data:", error);
      setMessage(error.message || "An error occurred while fetching data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch specific testimonial item data by ID
  const fetchTestimonialItemData = async (itemId) => {
    setIsLoading(true);
    try {
      console.log("Fetching testimonial item with ID:", itemId);
      const response = await fetch(
        `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/testimonials-items/?id=${itemId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch testimonial item data. Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("GET Testimonial Item API Response:", result);

      if (result.success) {
        let itemData;
        
        // Check if data is an array (like in the get all response) or a single object
        if (Array.isArray(result.data)) {
          // If it's an array, find the testimonial item with matching ID
          itemData = result.data.find(item => item.id.toString() === itemId.toString());
          if (!itemData) {
            throw new Error(`Testimonial item with ID ${itemId} not found in response array`);
          }
        } else if (result.data && result.data.id) {
          // If data is a single object, check if it's the one we want
          if (result.data.id.toString() === itemId.toString()) {
            itemData = result.data;
          } else {
            throw new Error(`Returned testimonial item ID ${result.data.id} does not match requested ID ${itemId}`);
          }
        } else {
          throw new Error("Invalid testimonial item data structure in response");
        }

        setFormData({
          id: itemData.id,
          full_name: itemData.full_name,
          description: itemData.description,
          image: null,
        });

        // Set existing image URL for preview
        setExistingImage(itemData.image);
        setSelectedItemId(itemId);
      } else {
        console.error("API Response issue:", result);
        throw new Error(result.message || "No testimonial item data found in response");
      }
    } catch (error) {
      console.error("Error fetching testimonial item data:", error);
      setMessage(error.message || "An error occurred while fetching testimonial item data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle testimonial item card click
  const handleItemClick = (itemId) => {
    console.log("Testimonial item card clicked with ID:", itemId);
    fetchTestimonialItemData(itemId);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Reset form to original data
  const resetForm = () => {
    if (selectedItemId) {
      fetchTestimonialItemData(selectedItemId);
    }
    setImagePreview(null);
    setIsEditing(false);
    setShowAlert(false);
  };

  // Go back to testimonial item list
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
        full_name: formData.full_name,
        description: formData.description,
      };

      console.log("Submitting data for testimonial item ID:", formData.id);
      console.log("Payload:", payload);

      // If we have a new image, we need to handle it with FormData
      if (formData.image) {
        const dataToSend = new FormData();
        dataToSend.append("id", formData.id);
        dataToSend.append("full_name", formData.full_name);
        dataToSend.append("description", formData.description);
        
        if (formData.image) {
          dataToSend.append("image", formData.image, formData.image.name);
        }

        console.log("FormData content:");
        for (let pair of dataToSend.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/testimonials-items/?id=${formData.id}`;
        console.log("PUT URL:", url);
        
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

        console.log("PUT Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          let errorData = null;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            /* not JSON */
          }
          console.error("Server error response:", errorData || errorText);
          throw new Error(
            (errorData && errorData.message) ||
              "Failed to update testimonial item"
          );
        }

        const result = await response.json();
        console.log("PUT Success response:", result);

        if (result.success) {
          setMessage("Testimonial item updated successfully!");
          setVariant("success");
          setShowAlert(true);
          setIsEditing(false);

          // Update existing image if new one was uploaded
          if (formData.image) {
            if (result.data && result.data.image) {
              setExistingImage(result.data.image);
            }
            setImagePreview(null);
            setFormData((prev) => ({ ...prev, image: null }));
          }

          // Update the testimonial item in the list
          if (result.data) {
            let updatedItem;
            if (Array.isArray(result.data)) {
              updatedItem = result.data.find(item => item.id === formData.id);
            } else {
              updatedItem = result.data;
            }
            
            if (updatedItem) {
              setTestimonialItems(prevItems => 
                prevItems.map(item => 
                  item.id === formData.id ? updatedItem : item
                )
              );
            }
          }

          setTimeout(() => setShowAlert(false), 3000);
        } else {
          throw new Error(
            result.message || "Failed to update testimonial item"
          );
        }
      } else {
        // For updates without new image, use JSON
        const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/testimonials-items/?id=${formData.id}`;
        console.log("PUT URL (JSON):", url);
        
        const response = await authFetch(url, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        console.log("PUT Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server error response:", errorData);
          throw new Error(
            errorData.message || "Failed to update testimonial item"
          );
        }

        const result = await response.json();
        console.log("PUT Success response:", result);

        if (result.success) {
          setMessage("Testimonial item updated successfully!");
          setVariant("success");
          setShowAlert(true);
          setIsEditing(false);
          
          // Update the testimonial item in the list
          if (result.data) {
            let updatedItem;
            if (Array.isArray(result.data)) {
              updatedItem = result.data.find(item => item.id === formData.id);
            } else {
              updatedItem = result.data;
            }
            
            if (updatedItem) {
              setTestimonialItems(prevItems => 
                prevItems.map(item => 
                  item.id === formData.id ? updatedItem : item
                )
              );
            }
          }
          
          setTimeout(() => setShowAlert(false), 3000);
        } else {
          throw new Error(
            result.message || "Failed to update testimonial item"
          );
        }
      }
    } catch (error) {
      console.error("Error updating testimonial item:", error);
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

  // Handle delete request
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this testimonial item?")) {
      return;
    }

    setIsSubmitting(true);
    setShowAlert(false);

    try {
      const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/testimonials-items/?id=${formData.id}`;
      console.log("DELETE URL:", url);
      
      // Create request body with the ID
      const payload = { id: formData.id };
      
      let response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.access}`,
        },
        body: JSON.stringify(payload),
      });

      // If unauthorized, try refreshing token and retry once
      if (response.status === 401) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) throw new Error("Session expired");
        response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${newAccess}`,
          },
          body: JSON.stringify(payload),
        });
      }

      console.log("DELETE Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData = null;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          /* not JSON */
        }
        console.error("Server error response:", errorData || errorText);
        throw new Error(
          (errorData && errorData.message) ||
            "Failed to delete testimonial item"
        );
      }

      const result = await response.json();
      console.log("DELETE Success response:", result);

      if (result.success) {
        setMessage("Testimonial item deleted successfully!");
        setVariant("success");
        setShowAlert(true);
        
        // Remove the testimonial item from the list
        setTestimonialItems(prevItems => 
          prevItems.filter(item => item.id !== formData.id)
        );
        
        // Go back to the list view
        setTimeout(() => {
          backToItemList();
          setShowAlert(false);
        }, 2000);
      } else {
        throw new Error(
          result.message || "Failed to delete testimonial item"
        );
      }
    } catch (error) {
      console.error("Error deleting testimonial item:", error);
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
            <h1 className="page-title">Manage Testimonials</h1>

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
                <p className="mt-2">Loading Testimonial Items...</p>
              </div>
            ) : (
              <>
                {!selectedItemId ? (
                  // Testimonial Items List View
                  <>
                    <Row className="mb-4">
                      <Col>
                        <h2 className="mb-4">Select a Testimonial to Edit</h2>
                        {testimonialItems.length === 0 ? (
                          <Alert variant="info">
                            No testimonials found. Please create testimonials first.
                          </Alert>
                        ) : (
                          <Row>
                            {testimonialItems.map((item) => (
                              <Col md={6} lg={4} className="mb-4" key={item.id}>
                                <Card 
                                  className="h-100 testimonial-card" 
                                  onClick={() => handleItemClick(item.id)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <Card.Body>
                                    <div className="d-flex flex-column">
                                      <Card.Title as="h5" className="mb-3">
                                        {item.full_name}
                                      </Card.Title>
                                      <Card.Text className="text-muted mb-3">
                                        {item.description.length > 100 
                                          ? `${item.description.substring(0, 100)}...` 
                                          : item.description}
                                      </Card.Text>
                                      {item.image ? (
                                        <img
                                          src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${item.image}`}
                                          alt={item.full_name}
                                          className="rounded mb-3"
                                          style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                        />
                                      ) : (
                                        <div className="bg-secondary rounded d-flex align-items-center justify-content-center mb-3" 
                                             style={{ width: '100%', height: '150px' }}>
                                          <span className="text-white">
                                            No Image
                                          </span>
                                        </div>
                                      )}
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
                  // Testimonial Item Edit View
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Button variant="outline-secondary" onClick={backToItemList}>
                        <FaArrowLeft /> Back to Testimonials
                      </Button>
                      {!isEditing && (
                        <Button variant="danger" onClick={handleDelete} disabled={isSubmitting}>
                          <FaTrash /> Delete Item
                        </Button>
                      )}
                    </div>

                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter full name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          required
                          disabled={!isEditing}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          placeholder="Enter testimonial description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                          disabled={!isEditing}
                        />
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
                                <img
                                  src={imagePreview}
                                  alt="Image Preview"
                                  style={{ maxWidth: "300px", maxHeight: "200px" }}
                                />
                              </div>
                            ) : (
                              existingImage && (
                                <div className="mt-3">
                                  <p>Current Image:</p>
                                  <img
                                    src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingImage}`}
                                    alt="Current Image"
                                    style={{ maxWidth: "300px", maxHeight: "200px" }}
                                  />
                                </div>
                              )
                            )}
                          </>
                        ) : (
                          existingImage && (
                            <div className="mt-3">
                              <img
                                src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingImage}`}
                                alt="Current Image"
                                style={{ maxWidth: "300px", maxHeight: "200px" }}
                              />
                            </div>
                          )
                        )}
                      </Form.Group>
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
                          Edit Testimonial
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

export default ManageTestinomial;