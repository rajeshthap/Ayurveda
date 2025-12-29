import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Badge } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaPlus, FaTrash, FaEdit, FaArrowLeft } from "react-icons/fa";

const ManageCare = () => {
  const { auth, refreshAccessToken } = useAuth();
  const authFetch = useAuthFetch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // State for all care items
  const [careItems, setCareItems] = useState([]);
  
  // Form state for selected care item
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    description: "",
    image: null,
    modules: [{ key: "", value: "" }],
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

  // Fetch all care items on component mount
  useEffect(() => {
    fetchAllCareItems();
  }, []);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch all care items from API
  const fetchAllCareItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/who-care-item/",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch care items data");
      }

      const result = await response.json();
      console.log("GET All Care Items API Response:", result);

      if (result.success && result.data && result.data.length > 0) {
        setCareItems(result.data);
      } else {
        throw new Error("No care items found");
      }
    } catch (error) {
      console.error("Error fetching care items data:", error);
      setMessage(error.message || "An error occurred while fetching data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch specific care item data by ID
  const fetchCareItemData = async (itemId) => {
    setIsLoading(true);
    try {
      console.log("Fetching care item with ID:", itemId);
      const response = await fetch(
        `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/who-care-item/?id=${itemId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch care item data. Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("GET Care Item API Response:", result);

      if (result.success) {
        let itemData;
        
        // Check if data is an array (like in the get all response) or a single object
        if (Array.isArray(result.data)) {
          // If it's an array, find the care item with matching ID
          itemData = result.data.find(item => item.id.toString() === itemId.toString());
          if (!itemData) {
            throw new Error(`Care item with ID ${itemId} not found in response array`);
          }
        } else if (result.data && result.data.id) {
          // If data is a single object, check if it's the one we want
          if (result.data.id.toString() === itemId.toString()) {
            itemData = result.data;
          } else {
            throw new Error(`Returned care item ID ${result.data.id} does not match requested ID ${itemId}`);
          }
        } else {
          throw new Error("Invalid care item data structure in response");
        }

        // Convert modules from array of arrays to array of objects
        let modulesData = [];
        if (itemData.module && Array.isArray(itemData.module)) {
          modulesData = itemData.module.map(item => ({
            key: item[0] || "",
            value: item[1] || ""
          }));
        } else {
          modulesData = [{ key: "", value: "" }];
        }

        setFormData({
          id: itemData.id,
          title: itemData.title,
          description: itemData.description,
          image: null,
          modules: modulesData,
        });

        // Set existing image URL for preview
        setExistingImage(itemData.image);
        setSelectedItemId(itemId);
      } else {
        console.error("API Response issue:", result);
        throw new Error(result.message || "No care item data found in response");
      }
    } catch (error) {
      console.error("Error fetching care item data:", error);
      setMessage(error.message || "An error occurred while fetching care item data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle care item card click
  const handleItemClick = (itemId) => {
    console.log("Care item card clicked with ID:", itemId);
    fetchCareItemData(itemId);
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
    if (selectedItemId) {
      fetchCareItemData(selectedItemId);
    }
    setImagePreview(null);
    setIsEditing(false);
    setShowAlert(false);
  };

  // Go back to care item list
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
      // Convert modules from array of objects back to array of arrays
      const modulesArray = formData.modules.map(module => [module.key, module.value]);

      // Prepare the data for submission
      const payload = {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        module: modulesArray,
      };

      console.log("Submitting data for care item ID:", formData.id);
      console.log("Payload:", payload);

      // If we have a new image, we need to handle it with FormData
      if (formData.image) {
        const dataToSend = new FormData();
        dataToSend.append("id", formData.id);
        dataToSend.append("title", formData.title);
        dataToSend.append("description", formData.description);
        dataToSend.append("module", JSON.stringify(modulesArray));
        
        if (formData.image) {
          dataToSend.append("image", formData.image, formData.image.name);
        }

        console.log("FormData content:");
        for (let pair of dataToSend.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/who-care-item/?id=${formData.id}`;
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
              "Failed to update care item"
          );
        }

        const result = await response.json();
        console.log("PUT Success response:", result);

        if (result.success) {
          setMessage("Care item updated successfully!");
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

          // Update the care item in the list
          if (result.data) {
            let updatedItem;
            if (Array.isArray(result.data)) {
              updatedItem = result.data.find(item => item.id === formData.id);
            } else {
              updatedItem = result.data;
            }
            
            if (updatedItem) {
              setCareItems(prevItems => 
                prevItems.map(item => 
                  item.id === formData.id ? updatedItem : item
                )
              );
            }
          }

          setTimeout(() => setShowAlert(false), 3000);
        } else {
          throw new Error(
            result.message || "Failed to update care item"
          );
        }
      } else {
        // For updates without new image, use JSON
        const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/who-care-item/?id=${formData.id}`;
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
            errorData.message || "Failed to update care item"
          );
        }

        const result = await response.json();
        console.log("PUT Success response:", result);

        if (result.success) {
          setMessage("Care item updated successfully!");
          setVariant("success");
          setShowAlert(true);
          setIsEditing(false);
          
          // Update the care item in the list
          if (result.data) {
            let updatedItem;
            if (Array.isArray(result.data)) {
              updatedItem = result.data.find(item => item.id === formData.id);
            } else {
              updatedItem = result.data;
            }
            
            if (updatedItem) {
              setCareItems(prevItems => 
                prevItems.map(item => 
                  item.id === formData.id ? updatedItem : item
                )
              );
            }
          }
          
          setTimeout(() => setShowAlert(false), 3000);
        } else {
          throw new Error(
            result.message || "Failed to update care item"
          );
        }
      }
    } catch (error) {
      console.error("Error updating care item:", error);
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
            <h1 className="page-title">Manage Care</h1>

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
                <p className="mt-2">Loading Care Items...</p>
              </div>
            ) : (
              <>
                {!selectedItemId ? (
                  // Care Items List View
                  <>
                    <Row className="mb-4">
                      <Col>
                        <h2 className="mb-4">Select a Care Item to Edit</h2>
                        {careItems.length === 0 ? (
                          <Alert variant="info">
                            No care items found. Please create care items first.
                          </Alert>
                        ) : (
                          <Row>
                            {careItems.map((item) => (
                              <Col md={6} lg={4} className="mb-4" key={item.id}>
                                <Card 
                                  className="h-100 care-card profile-card" 
                                  onClick={() => handleItemClick(item.id)}
                              
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
                                      {item.image ? (
                                        <img
                                          src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${item.image}`}
                                          alt={item.title}
                                          className="rounded mb-3 img-wrapper"
                                        
                                        />
                                      ) : (
                                        <div className="bg-secondary rounded d-flex align-items-center justify-content-center mb-3 img-wrapper" >
                                          <span className="text-white">
                                            No Image
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-auto">
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
                  // Care Item Edit View
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Button variant="outline-secondary" onClick={backToItemList}>
                        <FaArrowLeft /> Back to Care Items
                      </Button>
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
                                  className="img-current"
                                />
                              </div>
                            ) : (
                              existingImage && (
                                <div className="mt-3">
                                  <p>Current Image:</p>
                                  <img
                                    src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingImage}`}
                                    alt="Current Image"
                                   className="img-current"
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
                              className="img-current"
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
                          Edit Care Item
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

export default ManageCare;