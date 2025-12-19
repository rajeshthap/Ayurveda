import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Badge } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaPlus, FaTrash, FaEdit, FaArrowLeft } from "react-icons/fa";

const ManageOurFocus = () => {
  const { auth, refreshAccessToken } = useAuth();
  const authFetch = useAuthFetch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // State for all focus items
  const [focusItems, setFocusItems] = useState([]);
  
  // Form state for selected Focus item
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    icon: null,
    image: null,
    modules: [{ key: "", value: "" }],
  });

  // State for image previews
  const [iconPreview, setIconPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingIcon, setExistingIcon] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFocusId, setSelectedFocusId] = useState(null);

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

  // Fetch all focus items on component mount
  useEffect(() => {
    fetchAllFocusItems();
  }, []);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (iconPreview) URL.revokeObjectURL(iconPreview);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [iconPreview, imagePreview]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch all focus items from API
  const fetchAllFocusItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/ourfocus-autoimmunediseases-items/",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch focus items data");
      }

      const result = await response.json();
      console.log("GET All Focus Items API Response:", result);

      if (result.success && result.data && result.data.length > 0) {
        setFocusItems(result.data);
      } else {
        throw new Error("No focus items found");
      }
    } catch (error) {
      console.error("Error fetching focus items data:", error);
      setMessage(error.message || "An error occurred while fetching data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch specific Focus item data by ID
  const fetchFocusItemData = async (focusId) => {
    setIsLoading(true);
    try {
      console.log("Fetching focus item with ID:", focusId);
      const response = await fetch(
        `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/ourfocus-autoimmunediseases-items/?id=${focusId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch Focus item data. Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("GET Focus Item API Response:", result);

      if (result.success) {
        let focusData;
        
        // Check if data is an array (like in the get all response) or a single object
        if (Array.isArray(result.data)) {
          // If it's an array, find the focus item with matching ID
          focusData = result.data.find(item => item.id.toString() === focusId.toString());
          if (!focusData) {
            throw new Error(`Focus item with ID ${focusId} not found in response array`);
          }
        } else if (result.data && result.data.id) {
          // If data is a single object, check if it's the one we want
          if (result.data.id.toString() === focusId.toString()) {
            focusData = result.data;
          } else {
            throw new Error(`Returned focus item ID ${result.data.id} does not match requested ID ${focusId}`);
          }
        } else {
          throw new Error("Invalid focus item data structure in response");
        }

        // Convert modules from array of arrays to array of objects
        let modulesData = [];
        if (focusData.module && Array.isArray(focusData.module)) {
          modulesData = focusData.module.map(item => ({
            key: item[0] || "",
            value: item[1] || ""
          }));
        } else {
          modulesData = [{ key: "", value: "" }];
        }

        setFormData({
          id: focusData.id,
          title: focusData.title,
          icon: null,
          image: null,
          modules: modulesData,
        });

        // Set existing image URLs for preview
        setExistingIcon(focusData.icon);
        setExistingImage(focusData.image);
        setSelectedFocusId(focusId);
      } else {
        console.error("API Response issue:", result);
        throw new Error(result.message || "No Focus item data found in response");
      }
    } catch (error) {
      console.error("Error fetching Focus item data:", error);
      setMessage(error.message || "An error occurred while fetching focus item data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle focus item card click
  const handleFocusItemClick = (focusId) => {
    console.log("Focus item card clicked with ID:", focusId);
    fetchFocusItemData(focusId);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "icon") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        icon: file,
      }));

      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setIconPreview(previewUrl);
      } else {
        setIconPreview(null);
      }
    } else if (name === "image") {
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

  // Handle module changes
  const handleModuleChange = (index, field, value) => {
    setFormData((prev) => {
      const newModules = [...prev.modules];
      if (!newModules[index] || typeof newModules[index] !== 'object') {
        newModules[index] = { key: "", value: "" };
      }
      newModules[index] = {
        ...newModules[index],
        [field]: value,
      };

      return {
        ...prev,
        modules: newModules,
      };
    });
  };

  // Add a new module
  const addModule = () => {
    setFormData((prev) => ({
      ...prev,
      modules: [...prev.modules, { key: "", value: "" }],
    }));
  };

  // Remove a module
  const removeModule = (index) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  // Reset form to original data
  const resetForm = () => {
    if (selectedFocusId) {
      fetchFocusItemData(selectedFocusId);
    }
    setIconPreview(null);
    setImagePreview(null);
    setIsEditing(false);
    setShowAlert(false);
  };

  // Go back to focus item list
  const backToFocusList = () => {
    setSelectedFocusId(null);
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
      // Convert modules from array of objects back to array of arrays
      const modulesArray = formData.modules.map(module => [module.key, module.value]);

      // Prepare the data for submission
      const payload = {
        id: formData.id,
        title: formData.title,
        module: modulesArray,
      };

      console.log("Submitting data for focus item ID:", formData.id);
      console.log("Payload:", payload);

      // If we have new images, we need to handle them with FormData
      if (formData.icon || formData.image) {
        const dataToSend = new FormData();
        dataToSend.append("id", formData.id);
        dataToSend.append("title", formData.title);
        dataToSend.append("module", JSON.stringify(modulesArray));
        
        if (formData.icon) {
          dataToSend.append("icon", formData.icon, formData.icon.name);
        }
        
        if (formData.image) {
          dataToSend.append("image", formData.image, formData.image.name);
        }

        console.log("FormData content:");
        for (let pair of dataToSend.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/ourfocus-autoimmunediseases-items/?id=${formData.id}`;
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
              "Failed to update focus item"
          );
        }

        const result = await response.json();
        console.log("PUT Success response:", result);

        if (result.success) {
          setMessage("Focus item updated successfully!");
          setVariant("success");
          setShowAlert(true);
          setIsEditing(false);

          // Update existing images if new ones were uploaded
          if (formData.icon) {
            if (result.data && result.data.icon) {
              setExistingIcon(result.data.icon);
            }
            setIconPreview(null);
            setFormData((prev) => ({ ...prev, icon: null }));
          }

          if (formData.image) {
            if (result.data && result.data.image) {
              setExistingImage(result.data.image);
            }
            setImagePreview(null);
            setFormData((prev) => ({ ...prev, image: null }));
          }

          // Update the focus item in the list
          if (result.data) {
            let updatedItem;
            if (Array.isArray(result.data)) {
              updatedItem = result.data.find(item => item.id === formData.id);
            } else {
              updatedItem = result.data;
            }
            
            if (updatedItem) {
              setFocusItems(prevItems => 
                prevItems.map(item => 
                  item.id === formData.id ? updatedItem : item
                )
              );
            }
          }

          setTimeout(() => setShowAlert(false), 3000);
        } else {
          throw new Error(
            result.message || "Failed to update focus item"
          );
        }
      } else {
        // For updates without new images, use JSON
        const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/ourfocus-autoimmunediseases-items/?id=${formData.id}`;
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
            errorData.message || "Failed to update focus item"
          );
        }

        const result = await response.json();
        console.log("PUT Success response:", result);

        if (result.success) {
          setMessage("Focus item updated successfully!");
          setVariant("success");
          setShowAlert(true);
          setIsEditing(false);
          
          // Update the focus item in the list
          if (result.data) {
            let updatedItem;
            if (Array.isArray(result.data)) {
              updatedItem = result.data.find(item => item.id === formData.id);
            } else {
              updatedItem = result.data;
            }
            
            if (updatedItem) {
              setFocusItems(prevItems => 
                prevItems.map(item => 
                  item.id === formData.id ? updatedItem : item
                )
              );
            }
          }
          
          setTimeout(() => setShowAlert(false), 3000);
        } else {
          throw new Error(
            result.message || "Failed to update focus item"
          );
        }
      }
    } catch (error) {
      console.error("Error updating focus item:", error);
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
    if (!window.confirm("Are you sure you want to delete this focus item?")) {
      return;
    }

    setIsSubmitting(true);
    setShowAlert(false);

    try {
      const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/ourfocus-autoimmunediseases-items/?id=${formData.id}`;
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
            "Failed to delete focus item"
        );
      }

      const result = await response.json();
      console.log("DELETE Success response:", result);

      if (result.success) {
        setMessage("Focus item deleted successfully!");
        setVariant("success");
        setShowAlert(true);
        
        // Remove the focus item from the list
        setFocusItems(prevItems => 
          prevItems.filter(item => item.id !== formData.id)
        );
        
        // Go back to the list view
        setTimeout(() => {
          backToFocusList();
          setShowAlert(false);
        }, 2000);
      } else {
        throw new Error(
          result.message || "Failed to delete focus item"
        );
      }
    } catch (error) {
      console.error("Error deleting focus item:", error);
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
            <h1 className="page-title">Manage Our Focus</h1>

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
                <p className="mt-2">Loading Focus Items...</p>
              </div>
            ) : (
              <>
                {!selectedFocusId ? (
                  // Focus Items List View
                  <>
                    <Row className="mb-4">
                      <Col>
                        <h2 className="mb-4">Select a Focus Item to Edit</h2>
                        {focusItems.length === 0 ? (
                          <Alert variant="info">
                            No focus items found. Please create focus items first.
                          </Alert>
                        ) : (
                          <Row>
                            {focusItems.map((item) => (
                              <Col md={6} lg={4} className="mb-4" key={item.id}>
                                <Card 
                                  className="h-100 focus-card" 
                                  onClick={() => handleFocusItemClick(item.id)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <Card.Body>
                                    <div className="d-flex align-items-center mb-3">
                                      {item.icon ? (
                                        <img
                                          src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${item.icon}`}
                                          alt={item.title}
                                          className="rounded me-3"
                                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                      ) : (
                                        <div className="bg-secondary rounded d-flex align-items-center justify-content-center me-3" 
                                             style={{ width: '50px', height: '50px' }}>
                                          <span className="text-white">
                                            {item.title ? item.title.charAt(0) : 'F'}
                                          </span>
                                        </div>
                                      )}
                                      <div>
                                        <Card.Title as="h5" className="mb-0">
                                          {item.title}
                                        </Card.Title>
                                      </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <Badge bg="primary" pill>
                                        {item.module ? item.module.length : 0} Modules
                                      </Badge>
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
                  // Focus Item Edit View
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Button variant="outline-secondary" onClick={backToFocusList}>
                        <FaArrowLeft /> Back to Focus Items
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
                        <Form.Label>Icon</Form.Label>
                        {isEditing ? (
                          <>
                            <Form.Control
                              type="file"
                              name="icon"
                              onChange={handleChange}
                              accept="image/*"
                            />
                            {iconPreview ? (
                              <div className="mt-3">
                                <p>New Icon Preview:</p>
                                <img
                                  src={iconPreview}
                                  alt="Icon Preview"
                                  style={{ maxWidth: "100px", maxHeight: "100px" }}
                                />
                              </div>
                            ) : (
                              existingIcon && (
                                <div className="mt-3">
                                  <p>Current Icon:</p>
                                  <img
                                    src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingIcon}`}
                                    alt="Current Icon"
                                    style={{ maxWidth: "100px", maxHeight: "100px" }}
                                  />
                                </div>
                              )
                            )}
                          </>
                        ) : (
                          existingIcon && (
                            <div className="mt-3">
                              <img
                                src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingIcon}`}
                                alt="Current Icon"
                                style={{ maxWidth: "100px", maxHeight: "100px" }}
                              />
                            </div>
                          )
                        )}
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
                                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                                />
                              </div>
                            ) : (
                              existingImage && (
                                <div className="mt-3">
                                  <p>Current Image:</p>
                                  <img
                                    src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingImage}`}
                                    alt="Current Image"
                                    style={{ maxWidth: "200px", maxHeight: "200px" }}
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
                                style={{ maxWidth: "200px", maxHeight: "200px" }}
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
                            <div
                              key={index}
                              className="module-item mb-3 p-3 border rounded"
                            >
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

                              {/* Module Key */}
                              <Form.Group className="mb-2">
                                <Form.Label>Module Key</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder={`Enter module ${index + 1} key`}
                                  value={module.key || ""}
                                  onChange={(e) =>
                                    handleModuleChange(
                                      index,
                                      "key",
                                      e.target.value
                                    )
                                  }
                                  required
                                  disabled={!isEditing}
                                />
                              </Form.Group>

                              {/* Module Value */}
                              <Form.Group className="mb-2">
                                <Form.Label>Module Value</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={3}
                                  placeholder={`Enter module ${
                                    index + 1
                                  } value`}
                                  value={module.value || ""}
                                  onChange={(e) =>
                                    handleModuleChange(
                                      index,
                                      "value",
                                      e.target.value
                                    )
                                  }
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
                          Edit Focus Item
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

export default ManageOurFocus;