import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  Badge,
} from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";
import { FaPlus, FaTrash, FaEdit, FaArrowLeft } from "react-icons/fa";

const ManageWellnessolution = () => {
  const { auth, refreshAccessToken } = useAuth();
  const authFetch = useAuthFetch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // State for all wellness solution items
  const [wellnessItems, setWellnessItems] = useState([]);

  // Form state for selected wellness solution item
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    icon: null,
    gallery_images: [], // Changed from image to gallery_images array
    modules: [{ key: "", value: "" }],
  });

  // State for image previews
  const [iconPreview, setIconPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]); // Changed from imagePreview
  const [existingIcon, setExistingIcon] = useState(null);
  const [existingGalleryImages, setExistingGalleryImages] = useState([]); // Changed from existingImage
  const [removedGalleryImageIndices, setRemovedGalleryImageIndices] = useState(
    [],
  ); // Track removed images by index

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

  // Fetch all wellness solution items on component mount
  useEffect(() => {
    fetchAllWellnessItems();
  }, []);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (iconPreview) URL.revokeObjectURL(iconPreview);
      if (galleryPreviews && galleryPreviews.length > 0) {
        galleryPreviews.forEach((preview) => URL.revokeObjectURL(preview));
      }
    };
  }, [iconPreview, galleryPreviews]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch all wellness solution items from API
  const fetchAllWellnessItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/ourfocus-wellnesssolutions-items/",
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wellness solution items data");
      }

      const result = await response.json();
      console.log("GET All Wellness Solution Items API Response:", result);

      if (result.success && result.data && result.data.length > 0) {
        // Ensure all gallery_images arrays are properly initialized
        const itemsWithGallery = result.data.map(item => ({
          ...item,
          gallery_images: item.gallery_images || []
        }));
        setWellnessItems(itemsWithGallery);
        console.log("Wellness items with gallery images:", itemsWithGallery);
      } else {
        throw new Error("No wellness solution items found");
      }
    } catch (error) {
      console.error("Error fetching wellness solution items data:", error);
      setMessage(error.message || "An error occurred while fetching data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch specific wellness solution item data by ID
  const fetchWellnessItemData = async (itemId) => {
    setIsLoading(true);
    try {
      console.log("Fetching wellness solution item with ID:", itemId);
      const response = await fetch(
        `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/ourfocus-wellnesssolutions-items/?id=${itemId}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch wellness solution item data. Status: ${response.status}`,
        );
      }

      const result = await response.json();
      console.log("GET Wellness Solution Item API Response:", result);

      if (result.success) {
        let itemData;

        // Check if data is an array (like in the get all response) or a single object
        if (Array.isArray(result.data)) {
          // If it's an array, find the wellness solution item with matching ID
          itemData = result.data.find(
            (item) => item.id.toString() === itemId.toString(),
          );
          if (!itemData) {
            throw new Error(
              `Wellness solution item with ID ${itemId} not found in response array`,
            );
          }
        } else if (result.data && result.data.id) {
          // If data is a single object, check if it's the one we want
          if (result.data.id.toString() === itemId.toString()) {
            itemData = result.data;
          } else {
            throw new Error(
              `Returned wellness solution item ID ${result.data.id} does not match requested ID ${itemId}`,
            );
          }
        } else {
          throw new Error(
            "Invalid wellness solution item data structure in response",
          );
        }

        // Convert modules from array of arrays to array of objects
        let modulesData = [];
        if (itemData.module && Array.isArray(itemData.module)) {
          modulesData = itemData.module.map((item) => ({
            key: item[0] || "",
            value: item[1] || "",
          }));
        } else {
          modulesData = [{ key: "", value: "" }];
        }

        setFormData({
          id: itemData.id,
          title: itemData.title,
          icon: null,
          gallery_images: [],
          modules: modulesData,
        });

        // Set existing gallery images and icon URLs for preview
        setExistingIcon(itemData.icon);
        const galleryImages = itemData.gallery_images || [];
        setExistingGalleryImages(galleryImages);
        console.log("Fetched gallery images for item", itemId, ":", galleryImages);
        setSelectedItemId(itemId);
      } else {
        console.error("API Response issue:", result);
        throw new Error(
          result.message || "No wellness solution item data found in response",
        );
      }
    } catch (error) {
      console.error("Error fetching wellness solution item data:", error);
      setMessage(
        error.message ||
          "An error occurred while fetching wellness solution item data",
      );
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle wellness solution item card click
  const handleItemClick = (itemId) => {
    console.log("Wellness solution item card clicked with ID:", itemId);
    fetchWellnessItemData(itemId);
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
    } else if (name === "gallery_images") {
      // Handle multiple gallery images
      if (files && files.length > 0) {
        // Convert FileList to Array
        const filesArray = Array.from(files);
        console.log("Selected gallery images:", filesArray);

        // Add all new images to the gallery_images array
        setFormData((prev) => ({
          ...prev,
          gallery_images: [...prev.gallery_images, ...filesArray],
        }));

        // Add preview URLs for all files
        const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
        setGalleryPreviews((prev) => [...prev, ...previewUrls]);
        console.log("Gallery previews updated:", [...galleryPreviews, ...previewUrls]);
      }

      // Reset the file input so user can select more files if needed
      e.target.value = "";
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Remove a single gallery image
  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
    }));

    // Revoke the preview URL to free up memory
    if (galleryPreviews[index]) {
      URL.revokeObjectURL(galleryPreviews[index]);
    }

    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove an existing gallery image
  const removeExistingGalleryImage = (index) => {
    console.log("Removing existing gallery image at index:", index);
    setExistingGalleryImages((prev) => prev.filter((_, i) => i !== index));
    // Track the removed image index
    setRemovedGalleryImageIndices((prev) => [...prev, index]);
    console.log("Removed gallery image indices:", [...removedGalleryImageIndices, index]);
  };

  // Handle module changes
  const handleModuleChange = (index, field, value) => {
    setFormData((prev) => {
      const newModules = [...prev.modules];
      if (!newModules[index] || typeof newModules[index] !== "object") {
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
      fetchWellnessItemData(selectedItemId);
    }
    setIconPreview(null);
    setGalleryPreviews([]);
    setRemovedGalleryImageIndices([]);
    setIsEditing(false);
    setShowAlert(false);
  };

  // Go back to wellness solution item list
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

  // Delete gallery image via dedicated API endpoint
  const deleteGalleryImageViaAPI = async (itemId, index) => {
    const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/delete-wellness-gallery-image/?id=${itemId}&index=${index}`;
    console.log("Deleting gallery image at index:", index, "URL:", url);

    try {
      let response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth?.access}`,
        },
      });

      // If unauthorized, try refreshing token and retry once
      if (response.status === 401) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) throw new Error("Session expired");
        response = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${newAccess}`,
          },
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error deleting gallery image:", errorText);
        throw new Error(`Failed to delete gallery image at index ${index}`);
      }

      const result = await response.json();
      console.log("Gallery image deleted successfully:", result);
      
      // Update wellness items with the new data from the API response
      if (result.success && result.data) {
        const updatedItems = result.data;
        setWellnessItems(updatedItems);
        console.log("Wellness items updated after gallery image deletion:", updatedItems);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting gallery image via API:", error);
      throw error;
    }
  };

  // Handle form submission (PUT request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowAlert(false);

    try {
      // Delete removed gallery images first
      if (removedGalleryImageIndices.length > 0) {
        console.log(
          "Deleting removed gallery images at indices:",
          removedGalleryImageIndices,
        );

        for (const index of removedGalleryImageIndices) {
          try {
            await deleteGalleryImageViaAPI(formData.id, index);
          } catch (error) {
            console.error(
              `Failed to delete gallery image at index ${index}:`,
              error,
            );
            throw new Error(
              `Failed to delete gallery image at index ${index}: ${error.message}`,
            );
          }
        }
      }

      // Convert modules from array of objects back to array of arrays
      const modulesArray = formData.modules.map((module) => [
        module.key,
        module.value,
      ]);

      // Prepare the data for submission
      const payload = {
        id: formData.id,
        title: formData.title,
        module: modulesArray,
      };

      console.log(
        "Submitting data for wellness solution item ID:",
        formData.id,
      );
      console.log("Payload:", payload);

      // If we have new images, we need to handle them with FormData
      if (
        formData.icon ||
        (formData.gallery_images && formData.gallery_images.length > 0)
      ) {
        const dataToSend = new FormData();
        dataToSend.append("id", formData.id);
        dataToSend.append("title", formData.title);
        dataToSend.append("module", JSON.stringify(modulesArray));

        if (formData.icon) {
          dataToSend.append("icon", formData.icon, formData.icon.name);
        }

        // Add multiple gallery images
        if (formData.gallery_images && formData.gallery_images.length > 0) {
          console.log("Adding gallery images to FormData:", formData.gallery_images);
          formData.gallery_images.forEach((file, index) => {
            console.log(`Adding file ${index + 1}:`, file.name, file.size, file.type);
            dataToSend.append("gallery_images", file, file.name);
          });
        }

        console.log("FormData content:");
        for (let pair of dataToSend.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/ourfocus-wellnesssolutions-items/`;
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
        console.log("PUT Response headers:", response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Raw error response text:", errorText);

          let errorData = null;
          try {
            errorData = JSON.parse(errorText);
            console.error("Parsed JSON error data:", errorData);
          } catch (e) {
            console.error("Could not parse error response as JSON:", e.message);
            console.error("Raw error body:", errorText);
          }

          const errorMessage =
            (errorData && errorData.message) ||
            errorText ||
            `HTTP ${response.status}: Failed to update wellness solution item`;

          console.error("Final error message:", errorMessage);
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log("PUT Success response:", result);

        if (result.success) {
          setMessage("Wellness solution item updated successfully!");
          setVariant("success");
          setShowAlert(true);
          setIsEditing(false);

          // Clear removed gallery images tracker after successful update
          setRemovedGalleryImageIndices([]);

          // Update existing images if new ones were uploaded
          if (formData.icon) {
            if (result.data && result.data.icon) {
              setExistingIcon(result.data.icon);
            }
            setIconPreview(null);
            setFormData((prev) => ({ ...prev, icon: null }));
          }

          if (formData.gallery_images && formData.gallery_images.length > 0) {
            if (result.data && result.data.gallery_images) {
              setExistingGalleryImages(result.data.gallery_images);
              console.log("Updated gallery images from API:", result.data.gallery_images);
            }
            setGalleryPreviews([]);
            setFormData((prev) => ({ ...prev, gallery_images: [] }));
          }

          // Update the wellness solution item in the list
          if (result.data) {
            let updatedItem;
            if (Array.isArray(result.data)) {
              updatedItem = result.data.find((item) => item.id === formData.id);
            } else {
              updatedItem = result.data;
            }

            if (updatedItem) {
              // Ensure gallery_images is always an array
              const itemWithGallery = {
                ...updatedItem,
                gallery_images: updatedItem.gallery_images || []
              };
              
              setWellnessItems((prevItems) =>
                prevItems.map((item) =>
                  item.id === formData.id ? itemWithGallery : item,
                ),
              );
              console.log("Updated item in wellnessItems state:", itemWithGallery);
            }
          }

          setTimeout(() => setShowAlert(false), 3000);
        } else {
          throw new Error(
            result.message || "Failed to update wellness solution item",
          );
        }
      } else {
        // For updates without new images, use JSON
        const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/ourfocus-wellnesssolutions-items/`;
        console.log("PUT URL (JSON):", url);

        const response = await authFetch(url, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        console.log("PUT Response status:", response.status);
        console.log("PUT Response headers:", response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Raw error response text:", errorText);

          let errorData = null;
          try {
            errorData = JSON.parse(errorText);
            console.error("Parsed JSON error data:", errorData);
          } catch (e) {
            console.error("Could not parse error response as JSON:", e.message);
            console.error("Raw error body:", errorText);
          }

          const errorMessage =
            (errorData && errorData.message) ||
            errorText ||
            `HTTP ${response.status}: Failed to update wellness solution item`;

          console.error("Final error message:", errorMessage);
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log("PUT Success response:", result);

        if (result.success) {
          setMessage("Wellness solution item updated successfully!");
          setVariant("success");
          setShowAlert(true);
          setIsEditing(false);

          // Clear removed gallery images tracker after successful update
          setRemovedGalleryImageIndices([]);

          // Update the wellness solution item in the list
          if (result.data) {
            let updatedItem;
            if (Array.isArray(result.data)) {
              updatedItem = result.data.find((item) => item.id === formData.id);
            } else {
              updatedItem = result.data;
            }

            if (updatedItem) {
              setWellnessItems((prevItems) =>
                prevItems.map((item) =>
                  item.id === formData.id ? updatedItem : item,
                ),
              );
            }
          }

          setTimeout(() => setShowAlert(false), 3000);
        } else {
          throw new Error(
            result.message || "Failed to update wellness solution item",
          );
        }
      }
    } catch (error) {
      console.error("=== ERROR UPDATING WELLNESS SOLUTION ITEM ===");
      console.error("Error object:", error);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        errorMessage =
          "Network error: Could not connect to the server. Please check your internet connection and that the API endpoint is accessible.";
        console.error("Network error detected");
      } else if (error instanceof SyntaxError) {
        errorMessage = "Invalid response format from server. Please try again.";
        console.error("JSON parsing error:", error.message);
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error("Final error message to display:", errorMessage);
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
    if (
      !window.confirm(
        "Are you sure you want to delete this wellness solution item?",
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    setShowAlert(false);

    try {
      const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/ourfocus-wellnesssolutions-items/?id=${formData.id}`;
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
            "Failed to delete wellness solution item",
        );
      }

      const result = await response.json();
      console.log("DELETE Success response:", result);

      if (result.success) {
        setMessage("Wellness solution item deleted successfully!");
        setVariant("success");
        setShowAlert(true);

        // Remove the wellness solution item from the list
        setWellnessItems((prevItems) =>
          prevItems.filter((item) => item.id !== formData.id),
        );

        // Go back to the list view
        setTimeout(() => {
          backToItemList();
          setShowAlert(false);
        }, 2000);
      } else {
        throw new Error(
          result.message || "Failed to delete wellness solution item",
        );
      }
    } catch (error) {
      console.error("Error deleting wellness solution item:", error);
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
            <h1 className="page-title">Manage Wellness Solutions</h1>

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
                <p className="mt-2">Loading Wellness Solution Items...</p>
              </div>
            ) : (
              <>
                {!selectedItemId ? (
                  // Wellness Solution Items List View
                  <>
                    <Row className="mb-4">
                      <Col>
                        <h2 className="mb-4">
                          Select a Wellness Solution Item to Edit
                        </h2>
                        {wellnessItems.length === 0 ? (
                          <Alert variant="info">
                            No wellness solution items found. Please create
                            wellness solution items first.
                          </Alert>
                        ) : (
                          <Row>
                            {wellnessItems.map((item) => (
                              <Col md={6} lg={4} className="mb-4" key={item.id}>
                                <Card
                                  className="h-100 wellness-card profile-card"
                                  onClick={() => handleItemClick(item.id)}
                                >
                                  <Card.Body>
                                    <div className="d-flex align-items-center mb-3">
                                      {item.icon ? (
                                        <img
                                          src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${item.icon}`}
                                          alt={item.title}
                                          className="rounded me-3 img-profile"
                                        />
                                      ) : (
                                        <div className="bg-secondary rounded d-flex align-items-center justify-content-center me-3 img-profile">
                                          <span className="text-white">
                                            {item.title
                                              ? item.title.charAt(0)
                                              : "W"}
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
                                        {item.module ? item.module.length : 0}{" "}
                                        Modules
                                      </Badge>
                                      <Button
                                        variant="outline-primary"
                                        size="sm"
                                      >
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
                  // Wellness Solution Item Edit View
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Button
                        variant="outline-secondary"
                        onClick={backToItemList}
                      >
                        <FaArrowLeft /> Back to Wellness Solution Items
                      </Button>
                      {!isEditing && (
                        <Button
                          variant="danger"
                          onClick={handleDelete}
                          disabled={isSubmitting}
                        >
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
                                  className="img-wrapper"
                                />
                              </div>
                            ) : (
                              existingIcon && (
                                <div className="mt-3">
                                  <p>Current Icon:</p>
                                  <img
                                    src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingIcon}`}
                                    alt="Current Icon"
                                    className="img-wrapper"
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
                                className="img-wrapper"
                              />
                            </div>
                          )
                        )}
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          Gallery Images (Select Multiple)
                        </Form.Label>
                        {isEditing ? (
                          <>
                            <Form.Control
                              type="file"
                              name="gallery_images"
                              onChange={handleChange}
                              accept="image/*"
                              multiple
                            />

                            {/* New Gallery Images Preview */}
                            {galleryPreviews && galleryPreviews.length > 0 && (
                              <div className="mt-3">
                                <p>
                                  <strong>
                                    New Images ({galleryPreviews.length}):
                                  </strong>
                                </p>
                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "15px",
                                  }}
                                >
                                  {galleryPreviews.map((preview, index) => (
                                    <div
                                      key={index}
                                      style={{
                                        position: "relative",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      <img
                                        src={preview}
                                        alt={`New Gallery ${index + 1}`}
                                        className="img-wrapper"
                                        style={{
                                          maxWidth: "150px",
                                          height: "150px",
                                          objectFit: "cover",
                                          borderRadius: "5px",
                                        }}
                                      />
                                      <p
                                        style={{
                                          fontSize: "12px",
                                          margin: "8px 0 0 0",
                                          textAlign: "center",
                                        }}
                                      >
                                        New {index + 1}
                                      </p>
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        style={{
                                          position: "absolute",
                                          top: "-8px",
                                          right: "-8px",
                                        }}
                                        onClick={() =>
                                          removeGalleryImage(index)
                                        }
                                      >
                                        <FaTrash size={14} />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Existing Gallery Images */}
                            {existingGalleryImages &&
                              existingGalleryImages.length > 0 && (
                                <div className="mt-4">
                                  <p>
                                    <strong>
                                      Current Images (
                                      {existingGalleryImages.length}):
                                    </strong>
                                  </p>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: "15px",
                                    }}
                                  >
                                    {existingGalleryImages.map(
                                      (image, index) => (
                                        <div
                                          key={index}
                                          style={{
                                            position: "relative",
                                            marginBottom: "10px",
                                          }}
                                        >
                                          <img
                                            src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${image}`}
                                            alt={`Gallery ${index + 1}`}
                                            className="img-wrapper"
                                            style={{
                                              maxWidth: "150px",
                                              height: "150px",
                                              objectFit: "cover",
                                              borderRadius: "5px",
                                              border: "2px solid #ddd",
                                            }}
                                          />
                                          <p
                                            style={{
                                              fontSize: "12px",
                                              margin: "8px 0 0 0",
                                              textAlign: "center",
                                            }}
                                          >
                                            Image {index + 1}
                                          </p>
                                          <Button
                                            variant="outline-danger"
                                            size="sm"
                                            style={{
                                              position: "absolute",
                                              top: "-8px",
                                              right: "-8px",
                                            }}
                                            onClick={() =>
                                              removeExistingGalleryImage(index)
                                            }
                                          >
                                            <FaTrash size={14} />
                                          </Button>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}
                          </>
                        ) : (
                          existingGalleryImages &&
                          existingGalleryImages.length > 0 && (
                            <div className="mt-3">
                              <p>
                                <strong>
                                  Gallery Images ({existingGalleryImages.length}
                                  ):
                                </strong>
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "15px",
                                }}
                              >
                                {existingGalleryImages.map((image, index) => (
                                  <div key={index}>
                                    <img
                                      src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${image}`}
                                      alt={`Gallery ${index + 1}`}
                                      className="img-wrapper"
                                      style={{
                                        maxWidth: "150px",
                                        height: "150px",
                                        objectFit: "cover",
                                        borderRadius: "5px",
                                        border: "2px solid #ddd",
                                      }}
                                    />
                                    <p
                                      style={{
                                        fontSize: "12px",
                                        margin: "8px 0 0 0",
                                        textAlign: "center",
                                      }}
                                    >
                                      Image {index + 1}
                                    </p>
                                  </div>
                                ))}
                              </div>
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
                                      e.target.value,
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
                                      e.target.value,
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
                          Edit Wellness Solution Item
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

export default ManageWellnessolution;
