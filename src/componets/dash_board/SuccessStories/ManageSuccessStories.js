import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card,  } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaTrash, FaEdit, FaArrowLeft, FaFilePdf, FaYoutube } from "react-icons/fa";

const ManageSuccessStories = () => {
  const { auth, refreshAccessToken } = useAuth();
  const authFetch = useAuthFetch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // State for all success story items
  const [successStoryItems, setSuccessStoryItems] = useState([]);
  
  // Form state for selected success story item
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    image: null,
    pdf_file: null,
    video_link: "",
  });

  // State for file previews
  const [imagePreview, setImagePreview] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [existingPdf, setExistingPdf] = useState(null);

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

  // Fetch all success story items on component mount
  useEffect(() => {
    fetchAllSuccessStoryItems();
  }, []);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (pdfPreview) URL.revokeObjectURL(pdfPreview);
    };
  }, [imagePreview, pdfPreview]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch all success story items from API
  const fetchAllSuccessStoryItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/oursuccess-stories-item/",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch success story items data");
      }

      const result = await response.json();
      console.log("GET All Success Story Items API Response:", result);

      if (result.success && result.data && result.data.length > 0) {
        setSuccessStoryItems(result.data);
      } else {
        throw new Error("No success story items found");
      }
    } catch (error) {
      console.error("Error fetching success story items data:", error);
      setMessage(error.message || "An error occurred while fetching data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch specific success story item data by ID
  const fetchSuccessStoryItemData = async (itemId) => {
    setIsLoading(true);
    try {
      console.log("Fetching success story item with ID:", itemId);
      const response = await fetch(
        `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/oursuccess-stories-item/?id=${itemId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch success story item data. Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("GET Success Story Item API Response:", result);

      if (result.success) {
        let itemData;
        
        // Check if data is an array (like in the get all response) or a single object
        if (Array.isArray(result.data)) {
          // If it's an array, find the success story item with matching ID
          itemData = result.data.find(item => item.id.toString() === itemId.toString());
          if (!itemData) {
            throw new Error(`Success story item with ID ${itemId} not found in response array`);
          }
        } else if (result.data && result.data.id) {
          // If data is a single object, check if it's the one we want
          if (result.data.id.toString() === itemId.toString()) {
            itemData = result.data;
          } else {
            throw new Error(`Returned success story item ID ${result.data.id} does not match requested ID ${itemId}`);
          }
        } else {
          throw new Error("Invalid success story item data structure in response");
        }

        setFormData({
          id: itemData.id,
          title: itemData.title,
          description: itemData.description,
          image: null,
          pdf_file: null,
          video_link: itemData.video_link || "",
        });

        // Set existing file URLs for preview
        setExistingImage(itemData.image);
        setExistingPdf(itemData.pdf_file);
        setSelectedItemId(itemId);
      } else {
        console.error("API Response issue:", result);
        throw new Error(result.message || "No success story item data found in response");
      }
    } catch (error) {
      console.error("Error fetching success story item data:", error);
      setMessage(error.message || "An error occurred while fetching success story item data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle success story item card click
  const handleItemClick = (itemId) => {
    console.log("Success story item card clicked with ID:", itemId);
    fetchSuccessStoryItemData(itemId);
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
    } else if (name === "pdf_file") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        pdf_file: file,
      }));

      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPdfPreview(previewUrl);
      } else {
        setPdfPreview(null);
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
      fetchSuccessStoryItemData(selectedItemId);
    }
    setImagePreview(null);
    setPdfPreview(null);
    setIsEditing(false);
    setShowAlert(false);
  };

  // Go back to success story item list
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
        title: formData.title,
        description: formData.description,
        video_link: formData.video_link,
      };

      console.log("Submitting data for success story item ID:", formData.id);
      console.log("Payload:", payload);

      // If we have new files, we need to handle them with FormData
      if (formData.image || formData.pdf_file) {
        const dataToSend = new FormData();
        dataToSend.append("id", formData.id);
        dataToSend.append("title", formData.title);
        dataToSend.append("description", formData.description);
        dataToSend.append("video_link", formData.video_link);
        
        if (formData.image) {
          dataToSend.append("image", formData.image, formData.image.name);
        }
        
        if (formData.pdf_file) {
          dataToSend.append("pdf_file", formData.pdf_file, formData.pdf_file.name);
        }

        console.log("FormData content:");
        for (let pair of dataToSend.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/oursuccess-stories-item/?id=${formData.id}`;
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
              "Failed to update success story item"
          );
        }

        const result = await response.json();
        console.log("PUT Success response:", result);

        if (result.success) {
          setMessage("Success story item updated successfully!");
          setVariant("success");
          setShowAlert(true);
          setIsEditing(false);

          // Update existing files if new ones were uploaded
          if (formData.image) {
            if (result.data && result.data.image) {
              setExistingImage(result.data.image);
            }
            setImagePreview(null);
            setFormData((prev) => ({ ...prev, image: null }));
          }

          if (formData.pdf_file) {
            if (result.data && result.data.pdf_file) {
              setExistingPdf(result.data.pdf_file);
            }
            setPdfPreview(null);
            setFormData((prev) => ({ ...prev, pdf_file: null }));
          }

          // Update the success story item in the list
          if (result.data) {
            let updatedItem;
            if (Array.isArray(result.data)) {
              updatedItem = result.data.find(item => item.id === formData.id);
            } else {
              updatedItem = result.data;
            }
            
            if (updatedItem) {
              setSuccessStoryItems(prevItems => 
                prevItems.map(item => 
                  item.id === formData.id ? updatedItem : item
                )
              );
            }
          }

          setTimeout(() => setShowAlert(false), 3000);
        } else {
          throw new Error(
            result.message || "Failed to update success story item"
          );
        }
      } else {
        // For updates without new files, use JSON
        const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/oursuccess-stories-item/?id=${formData.id}`;
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
            errorData.message || "Failed to update success story item"
          );
        }

        const result = await response.json();
        console.log("PUT Success response:", result);

        if (result.success) {
          setMessage("Success story item updated successfully!");
          setVariant("success");
          setShowAlert(true);
          setIsEditing(false);
          
          // Update the success story item in the list
          if (result.data) {
            let updatedItem;
            if (Array.isArray(result.data)) {
              updatedItem = result.data.find(item => item.id === formData.id);
            } else {
              updatedItem = result.data;
            }
            
            if (updatedItem) {
              setSuccessStoryItems(prevItems => 
                prevItems.map(item => 
                  item.id === formData.id ? updatedItem : item
                )
              );
            }
          }
          
          setTimeout(() => setShowAlert(false), 3000);
        } else {
          throw new Error(
            result.message || "Failed to update success story item"
          );
        }
      }
    } catch (error) {
      console.error("Error updating success story item:", error);
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
    if (!window.confirm("Are you sure you want to delete this success story item?")) {
      return;
    }

    setIsSubmitting(true);
    setShowAlert(false);

    try {
      const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/oursuccess-stories-item/?id=${formData.id}`;
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
            "Failed to delete success story item"
        );
      }

      const result = await response.json();
      console.log("DELETE Success response:", result);

      if (result.success) {
        setMessage("Success story item deleted successfully!");
        setVariant("success");
        setShowAlert(true);
        
        // Remove the success story item from the list
        setSuccessStoryItems(prevItems => 
          prevItems.filter(item => item.id !== formData.id)
        );
        
        // Go back to the list view
        setTimeout(() => {
          backToItemList();
          setShowAlert(false);
        }, 2000);
      } else {
        throw new Error(
          result.message || "Failed to delete success story item"
        );
      }
    } catch (error) {
      console.error("Error deleting success story item:", error);
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
            <h1 className="page-title">Manage Success Stories</h1>

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
                <p className="mt-2">Loading Success Story Items...</p>
              </div>
            ) : (
              <>
                {!selectedItemId ? (
                  // Success Story Items List View
                  <>
                    <Row className="mb-4">
                      <Col>
                        <h2 className="mb-4">Select a Success Story to Edit</h2>
                        {successStoryItems.length === 0 ? (
                          <Alert variant="info">
                            No success story items found. Please create success story items first.
                          </Alert>
                        ) : (
                          <Row>
                            {successStoryItems.map((item) => (
                              <Col md={6} lg={4} className="mb-4" key={item.id}>
                                <Card 
                                  className="h-100 success-story-card" 
                                  onClick={() => handleItemClick(item.id)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <Card.Body>
                                    <div className="d-flex flex-column">
                                      <Card.Title as="h5" className="mb-3">
                                        {item.title}
                                      </Card.Title>
                                      <Card.Text className="text-muted mb-3">
                                        {item.description.length > 100 
                                          ? `${item.description.substring(0, 100)}...` 
                                          : item.description}
                                      </Card.Text>
                                      
                                      <div className="d-flex flex-wrap gap-2 mb-3">
                                        {item.image && (
                                          <div className="file-indicator">
                                            <img
                                              src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${item.image}`}
                                              alt={item.title}
                                              className="rounded"
                                              style={{ width: '100px', height: '60px', objectFit: 'cover' }}
                                            />
                                          </div>
                                        )}
                                        
                                        {item.pdf_file && (
                                          <div className="file-indicator d-flex align-items-center">
                                            <FaFilePdf className="text-danger me-1" />
                                            <small>PDF</small>
                                          </div>
                                        )}
                                        
                                        {item.video_link && (
                                          <div className="file-indicator d-flex align-items-center">
                                            <FaYoutube className="text-danger me-1" />
                                            <small>Video</small>
                                          </div>
                                        )}
                                      </div>
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
                  // Success Story Item Edit View
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Button variant="outline-secondary" onClick={backToItemList}>
                        <FaArrowLeft /> Back to Success Stories
                      </Button>
                      {!isEditing && (
                        <Button variant="danger" onClick={handleDelete} disabled={isSubmitting}>
                          <FaTrash /> Delete Item
                        </Button>
                      )}
                    </div>

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
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Enter description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                          disabled={!isEditing}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Video Link</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter video link (e.g., YouTube URL)"
                          name="video_link"
                          value={formData.video_link}
                          onChange={handleChange}
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

                      <Form.Group className="mb-3">
                        <Form.Label>PDF File</Form.Label>
                        {isEditing ? (
                          <>
                            <Form.Control
                              type="file"
                              name="pdf_file"
                              onChange={handleChange}
                              accept=".pdf"
                            />
                            {pdfPreview ? (
                              <div className="mt-3">
                                <p>New PDF Preview:</p>
                                <a href={pdfPreview} target="_blank" rel="noopener noreferrer">
                                  <Button variant="outline-primary" size="sm">
                                    <FaFilePdf /> View PDF
                                  </Button>
                                </a>
                              </div>
                            ) : (
                              existingPdf && (
                                <div className="mt-3">
                                  <p>Current PDF:</p>
                                  <a href={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingPdf}`} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline-primary" size="sm">
                                      <FaFilePdf /> View PDF
                                    </Button>
                                  </a>
                                </div>
                              )
                            )}
                          </>
                        ) : (
                          existingPdf && (
                            <div className="mt-3">
                              <a href={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingPdf}`} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline-primary" size="sm">
                                  <FaFilePdf /> View PDF
                                </Button>
                              </a>
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
                          Edit Success Story
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

export default ManageSuccessStories;