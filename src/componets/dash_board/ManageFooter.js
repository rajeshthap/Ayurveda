import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Badge } from "react-bootstrap";
import "../../assets/css/dashboard.css";
import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../context/AuthFetch";
import DashBoardHeader from "./DashBoardHeader";
import LeftNav  from "./LeftNav";
import { FaPlus, FaTrash, FaEdit, FaArrowLeft } from "react-icons/fa";

const ManageFooter = () => {
  const { auth, refreshAccessToken } = useAuth();
  const authFetch = useAuthFetch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // State for all footer items
  const [footerItems, setFooterItems] = useState([]);
  
  // Form state for selected footer item
  const [formData, setFormData] = useState({
    id: null,
    description: "",
    image: null,
    module_useful_links: [{ url: "", text: "" }],
    module_contact_info: [{ info: "" }],
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

  // Fetch all footer items on component mount
  useEffect(() => {
    fetchAllFooterItems();
  }, []);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch all footer items from API
  const fetchAllFooterItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/footer-items/",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch footer items data");
      }

      const result = await response.json();
      console.log("GET All Footer Items API Response:", result);

      if (result.success && result.data && result.data.length > 0) {
        setFooterItems(result.data);
      } else {
        throw new Error("No footer items found");
      }
    } catch (error) {
      console.error("Error fetching footer items data:", error);
      setMessage(error.message || "An error occurred while fetching data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch specific footer item data by ID
  const fetchFooterItemData = async (itemId) => {
    setIsLoading(true);
    try {
      console.log("Fetching footer item with ID:", itemId);
      const response = await fetch(
        `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/footer-items/?id=${itemId}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch footer item data. Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("GET Footer Item API Response:", result);

      if (result.success) {
        let itemData;
        
        // Check if data is an array (like in the get all response) or a single object
        if (Array.isArray(result.data)) {
          // If it's an array, find the footer item with matching ID
          itemData = result.data.find(item => item.id.toString() === itemId.toString());
          if (!itemData) {
            throw new Error(`Footer item with ID ${itemId} not found in response array`);
          }
        } else if (result.data && result.data.id) {
          // If data is a single object, check if it's the one we want
          if (result.data.id.toString() === itemId.toString()) {
            itemData = result.data;
          } else {
            throw new Error(`Returned footer item ID ${result.data.id} does not match requested ID ${itemId}`);
          }
        } else {
          throw new Error("Invalid footer item data structure in response");
        }

        // Convert useful links from array of arrays to array of objects
        let usefulLinksData = [];
        if (itemData.module_useful_links && Array.isArray(itemData.module_useful_links)) {
          usefulLinksData = itemData.module_useful_links.map(item => ({
            url: item[0] || "",
            text: item[1] || ""
          }));
        } else {
          usefulLinksData = [{ url: "", text: "" }];
        }

        // Convert contact info from array of arrays to array of objects
        let contactInfoData = [];
        if (itemData.module_contact_info && Array.isArray(itemData.module_contact_info)) {
          contactInfoData = itemData.module_contact_info.map(item => ({
            info: item[0] || ""
          }));
        } else {
          contactInfoData = [{ info: "" }];
        }

        setFormData({
          id: itemData.id,
          description: itemData.description,
          image: null,
          module_useful_links: usefulLinksData,
          module_contact_info: contactInfoData,
        });

        // Set existing image URL for preview
        setExistingImage(itemData.image);
        setSelectedItemId(itemId);
      } else {
        console.error("API Response issue:", result);
        throw new Error(result.message || "No footer item data found in response");
      }
    } catch (error) {
      console.error("Error fetching footer item data:", error);
      setMessage(error.message || "An error occurred while fetching footer item data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle footer item card click
  const handleItemClick = (itemId) => {
    console.log("Footer item card clicked with ID:", itemId);
    fetchFooterItemData(itemId);
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

  // Handle useful link changes
  const handleUsefulLinkChange = (index, field, value) => {
    setFormData((prev) => {
      const newLinks = [...prev.module_useful_links];
      if (!newLinks[index] || typeof newLinks[index] !== 'object') {
        newLinks[index] = { url: "", text: "" };
      }
      newLinks[index] = {
        ...newLinks[index],
        [field]: value,
      };

      return {
        ...prev,
        module_useful_links: newLinks,
      };
    });
  };

  // Handle contact info changes
  const handleContactInfoChange = (index, value) => {
    setFormData((prev) => {
      const newContactInfo = [...prev.module_contact_info];
      if (!newContactInfo[index] || typeof newContactInfo[index] !== 'object') {
        newContactInfo[index] = { info: "" };
      }
      newContactInfo[index] = {
        ...newContactInfo[index],
        info: value,
      };

      return {
        ...prev,
        module_contact_info: newContactInfo,
      };
    });
  };

  // Add a new useful link
  const addUsefulLink = () => {
    setFormData((prev) => ({
      ...prev,
      module_useful_links: [...prev.module_useful_links, { url: "", text: "" }],
    }));
  };

  // Remove a useful link
  const removeUsefulLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      module_useful_links: prev.module_useful_links.filter((_, i) => i !== index),
    }));
  };

  // Add a new contact info
  const addContactInfo = () => {
    setFormData((prev) => ({
      ...prev,
      module_contact_info: [...prev.module_contact_info, { info: "" }],
    }));
  };

  // Remove a contact info
  const removeContactInfo = (index) => {
    setFormData((prev) => ({
      ...prev,
      module_contact_info: prev.module_contact_info.filter((_, i) => i !== index),
    }));
  };

  // Reset form to original data
  const resetForm = () => {
    if (selectedItemId) {
      fetchFooterItemData(selectedItemId);
    }
    setImagePreview(null);
    setIsEditing(false);
    setShowAlert(false);
  };

  // Go back to footer item list
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
      // Convert useful links from array of objects back to array of arrays
      const usefulLinksArray = formData.module_useful_links.map(link => [link.url, link.text]);
      
      // Convert contact info from array of objects back to array of arrays
      const contactInfoArray = formData.module_contact_info.map(info => [info.info]);

      // Prepare the data for submission
      const payload = {
        id: formData.id,
        description: formData.description,
        module_useful_links: usefulLinksArray,
        module_contact_info: contactInfoArray,
      };

      console.log("Submitting data for footer item ID:", formData.id);
      console.log("Payload:", payload);

      // If we have a new image, we need to handle it with FormData
      if (formData.image) {
        const dataToSend = new FormData();
        dataToSend.append("id", formData.id);
        dataToSend.append("description", formData.description);
        dataToSend.append("module_useful_links", JSON.stringify(usefulLinksArray));
        dataToSend.append("module_contact_info", JSON.stringify(contactInfoArray));
        
        if (formData.image) {
          dataToSend.append("image", formData.image, formData.image.name);
        }

        console.log("FormData content:");
        for (let pair of dataToSend.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/footer-items/?id=${formData.id}`;
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
              "Failed to update footer item"
          );
        }

        const result = await response.json();
        console.log("PUT Success response:", result);

        if (result.success) {
          setMessage("Footer item updated successfully!");
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

          // Update the footer item in the list
          if (result.data) {
            let updatedItem;
            if (Array.isArray(result.data)) {
              updatedItem = result.data.find(item => item.id === formData.id);
            } else {
              updatedItem = result.data;
            }
            
            if (updatedItem) {
              setFooterItems(prevItems => 
                prevItems.map(item => 
                  item.id === formData.id ? updatedItem : item
                )
              );
            }
          }

          setTimeout(() => setShowAlert(false), 3000);
        } else {
          throw new Error(
            result.message || "Failed to update footer item"
          );
        }
      } else {
        // For updates without new image, use JSON
        const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/footer-items/?id=${formData.id}`;
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
            errorData.message || "Failed to update footer item"
          );
        }

        const result = await response.json();
        console.log("PUT Success response:", result);

        if (result.success) {
          setMessage("Footer item updated successfully!");
          setVariant("success");
          setShowAlert(true);
          setIsEditing(false);
          
          // Update the footer item in the list
          if (result.data) {
            let updatedItem;
            if (Array.isArray(result.data)) {
              updatedItem = result.data.find(item => item.id === formData.id);
            } else {
              updatedItem = result.data;
            }
            
            if (updatedItem) {
              setFooterItems(prevItems => 
                prevItems.map(item => 
                  item.id === formData.id ? updatedItem : item
                )
              );
            }
          }
          
          setTimeout(() => setShowAlert(false), 3000);
        } else {
          throw new Error(
            result.message || "Failed to update footer item"
          );
        }
      }
    } catch (error) {
      console.error("Error updating footer item:", error);
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
            <h1 className="page-title">Manage Footer</h1>

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
                <p className="mt-2">Loading Footer Items...</p>
              </div>
            ) : (
              <>
                {!selectedItemId ? (
                  // Footer Items List View
                  <>
                    <Row className="mb-4">
                      <Col>
                        <h2 className="mb-4">Select a Footer Item to Edit</h2>
                        {footerItems.length === 0 ? (
                          <Alert variant="info">
                            No footer items found. Please create footer items first.
                          </Alert>
                        ) : (
                          <Row>
                            {footerItems.map((item) => (
                              <Col md={6} lg={4} className="mb-4" key={item.id}>
                                <Card 
                                  className="h-100 footer-card profile-card " 
                                  onClick={() => handleItemClick(item.id)}
                                >
                                  <Card.Body>
                                    <div className="d-flex flex-column">
                                      <Card.Title as="h5" className="mb-3">
                                        Footer Item #{item.id}
                                      </Card.Title>
                                      <Card.Text className="text-muted mb-3">
                                        {item.description.length > 100 
                                          ? `${item.description.substring(0, 100)}...` 
                                          : item.description}
                                      </Card.Text>
                                      <div className="mb-3">
                                        <h6>Useful Links ({item.module_useful_links ? item.module_useful_links.length : 0})</h6>
                                        <ul className="list-unstyled">
                                          {item.module_useful_links && item.module_useful_links.slice(0, 3).map((link, idx) => (
                                            <li key={idx}>
                                              <small>{link[1] || 'No title'}</small>
                                            </li>
                                          ))}
                                          {item.module_useful_links && item.module_useful_links.length > 3 && (
                                            <li><small>...and {item.module_useful_links.length - 3} more</small></li>
                                          )}
                                        </ul>
                                      </div>
                                      <div>
                                        <h6>Contact Info ({item.module_contact_info ? item.module_contact_info.length : 0})</h6>
                                        <ul className="list-unstyled">
                                          {item.module_contact_info && item.module_contact_info.slice(0, 3).map((info, idx) => (
                                            <li key={idx}>
                                              <small>{info[0] || 'No info'}</small>
                                            </li>
                                          ))}
                                          {item.module_contact_info && item.module_contact_info.length > 3 && (
                                            <li><small>...and {item.module_contact_info.length - 3} more</small></li>
                                          )}
                                        </ul>
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
                  // Footer Item Edit View
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Button variant="outline-secondary" onClick={backToItemList}>
                        <FaArrowLeft /> Back to Footer Items
                      </Button>
                    </div>

                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Enter footer description"
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

                      {/* Useful Links Section */}
                      <Form.Group className="mb-3">
                        <Form.Label>Useful Links</Form.Label>

                        <div className="modules-container">
                          {formData.module_useful_links.map((link, index) => (
                            <div
                              key={index}
                              className="module-item mb-3 p-3 border rounded"
                            >
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5>Link {index + 1}</h5>

                                {isEditing && formData.module_useful_links.length > 1 && (
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeUsefulLink(index)}
                                  >
                                    <FaTrash /> Remove
                                  </Button>
                                )}
                              </div>

                              {/* Link URL */}
                              <Form.Group className="mb-2">
                                <Form.Label>URL</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder={`Enter link ${index + 1} URL`}
                                  value={link.url || ""}
                                  onChange={(e) =>
                                    handleUsefulLinkChange(
                                      index,
                                      "url",
                                      e.target.value
                                    )
                                  }
                                  required
                                  disabled={!isEditing}
                                />
                              </Form.Group>

                              {/* Link Text */}
                              <Form.Group className="mb-2">
                                <Form.Label>Text</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder={`Enter link ${index + 1} text`}
                                  value={link.text || ""}
                                  onChange={(e) =>
                                    handleUsefulLinkChange(
                                      index,
                                      "text",
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
                              onClick={addUsefulLink}
                              className="mt-2"
                            >
                              <FaPlus /> Add Another Link
                            </Button>
                          )}
                        </div>
                      </Form.Group>

                      {/* Contact Info Section */}
                      <Form.Group className="mb-3">
                        <Form.Label>Contact Information</Form.Label>

                        <div className="modules-container">
                          {formData.module_contact_info.map((info, index) => (
                            <div
                              key={index}
                              className="module-item mb-3 p-3 border rounded"
                            >
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5>Contact Info {index + 1}</h5>

                                {isEditing && formData.module_contact_info.length > 1 && (
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeContactInfo(index)}
                                  >
                                    <FaTrash /> Remove
                                  </Button>
                                )}
                              </div>

                              {/* Contact Info Value */}
                              <Form.Group className="mb-2">
                                <Form.Label>Information</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder={`Enter contact info ${index + 1}`}
                                  value={info.info || ""}
                                  onChange={(e) =>
                                    handleContactInfoChange(
                                      index,
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
                              onClick={addContactInfo}
                              className="mt-2"
                            >
                              <FaPlus /> Add Another Contact Info
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
                          Edit Footer Item
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

export default ManageFooter;