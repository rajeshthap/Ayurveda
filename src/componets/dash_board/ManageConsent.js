import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Modal } from "react-bootstrap";
import "../../assets/css/dashboard.css";
import "../../assets/css/Consent.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../context/AuthFetch";
import LeftNav from "./LeftNav";
import DashBoardHeader from "./DashBoardHeader";
import { FaTrash, FaEdit, FaArrowLeft, FaEye, FaPrint, FaDownload } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo1 from "../../assets/images/Logo1.jpeg";

// Utility function to reliably convert image to data URL
const loadImageAsDataUrl = async (imageUrl, maxRetries = 3) => {
  if (!imageUrl) return null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Add timestamp to prevent caching issues
      const urlWithTimestamp = imageUrl.includes('?')
        ? `${imageUrl}&_t=${Date.now()}`
        : `${imageUrl}?_t=${Date.now()}`;

      const img = new Image();
      img.crossOrigin = 'Anonymous';

      return new Promise((resolve, reject) => {
        // Set a timeout for image loading
        const timeout = setTimeout(() => {
          reject(new Error('Image load timeout'));
        }, 5000);

        img.onload = () => {
          clearTimeout(timeout);
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Image failed to load'));
        };

        img.src = urlWithTimestamp;
      });
    } catch (error) {
      console.warn(`Attempt ${attempt + 1} failed to load image:`, imageUrl, error);
      // Wait before retrying
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
  }

  // If all retries fail, return null instead of a placeholder
  console.error(`Failed to load image after ${maxRetries} attempts:`, imageUrl);
  return null;
};

const ManageConsent = () => {
  const { auth, refreshAccessToken } = useAuth();
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // State for all consent forms
  const [consentForms, setConsentForms] = useState([]);

  // Form state for selected consent form
  const [formData, setFormData] = useState({
    id: null,
    patient_name: "",
    date_of_birth: "",
    gender: "",
    address: "",
    mobile_number: "",
    diagnosis_name: "",
    gurdian_name: "",
    relationship_to_patient: "",
    attendee_signature: null,
    attendee_name: "",
    attendee_physician_signature: null,
    attendee_physician_name: "",
    visit_date: new Date().toISOString().split('T')[0]
  });

  // State for signature previews
  const [attendeeSignaturePreview, setAttendeeSignaturePreview] = useState(null);
  const [physicianSignaturePreview, setPhysicianSignaturePreview] = useState(null);
  const [existingAttendeeSignature, setExistingAttendeeSignature] = useState(null);
  const [existingPhysicianSignature, setExistingPhysicianSignature] = useState(null);
  const [attendeeSignatureDataUrl, setAttendeeSignatureDataUrl] = useState(null);
  const [physicianSignatureDataUrl, setPhysicianSignatureDataUrl] = useState(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success"); // 'success' or 'danger'
  const [showAlert, setShowAlert] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Modal state for view
  const [showViewModal, setShowViewModal] = useState(false);

  // Refs
  const consentFormRef = useRef(null);
  const viewFormRef = useRef(null);

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

  // Fetch all consent forms on component mount
  useEffect(() => {
    fetchAllConsentForms();
  }, []);

  // Convert signature image to data URL when it becomes available
  useEffect(() => {
    const convertSignatureToDataUrl = async (signaturePath, setter) => {
      if (!signaturePath) return;

      try {
        // Create the full URL
        const imageUrl = `https://mahadevaaya.com/trilokayurveda/trilokabackend${signaturePath}`;
        console.log("Converting signature to data URL:", imageUrl);

        // Use a proxy approach to avoid CORS issues
        const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const blob = await response.blob();
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });

        setter(dataUrl);
        console.log("Signature converted successfully");
      } catch (error) {
        console.error("Error converting signature to data URL:", error);

        // Fallback: try direct conversion with CORS handling
        try {
          const img = new Image();
          img.crossOrigin = 'Anonymous';

          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            setter(dataUrl);
          };

          img.onerror = () => {
            console.error("Fallback also failed for signature:", signaturePath);
            // Create a placeholder
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, 200, 100);
            ctx.fillStyle = '#666';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Signature', 100, 50);
            setter(canvas.toDataURL('image/png'));
          };

          img.src = `https://mahadevaaya.com/trilokayurveda/trilokabackend${signaturePath}?_t=${Date.now()}`;
        } catch (fallbackError) {
          console.error("Fallback error:", fallbackError);
        }
      }
    };

    if (existingAttendeeSignature) {
      convertSignatureToDataUrl(existingAttendeeSignature, setAttendeeSignatureDataUrl);
    }

    if (existingPhysicianSignature) {
      convertSignatureToDataUrl(existingPhysicianSignature, setPhysicianSignatureDataUrl);
    }
  }, [existingAttendeeSignature, existingPhysicianSignature]);

  // Cleanup object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (attendeeSignaturePreview) {
        URL.revokeObjectURL(attendeeSignaturePreview);
      }
      if (physicianSignaturePreview) {
        URL.revokeObjectURL(physicianSignaturePreview);
      }
    };
  }, [attendeeSignaturePreview, physicianSignaturePreview]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch all consent forms from API
  const fetchAllConsentForms = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/consent-form/",
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            ...(auth?.access && { 'Authorization': `Bearer ${auth.access}` })
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch consent forms data");
      }

      const result = await response.json();
      console.log("GET All Consent Forms API Response:", result);

      // Handle different response structures
      let consentDataArray = [];

      if (Array.isArray(result)) {
        // Direct array response
        consentDataArray = result;
      } else if (result && typeof result === 'object') {
        // Object response
        if (result.success && Array.isArray(result.data)) {
          // Standard response with success and data
          consentDataArray = result.data;
        } else if (Array.isArray(result.data)) {
          // Response with data but no success flag
          consentDataArray = result.data;
        }
      }

      if (consentDataArray && consentDataArray.length > 0) {
        setConsentForms(consentDataArray);
      } else {
        throw new Error("No consent forms found");
      }
    } catch (error) {
      console.error("Error fetching consent forms data:", error);
      setMessage(error.message || "An error occurred while fetching data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch specific consent form data by ID
  const fetchConsentFormDetails = async (itemId) => {
    setIsLoading(true);
    try {
      console.log("Fetching consent form with ID:", itemId);
      const response = await fetch(
        `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/consent-form/?id=${itemId}`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            ...(auth?.access && { 'Authorization': `Bearer ${auth.access}` })
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch consent form data. Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("GET Consent Form API Response:", result);

      let itemData;

      // Handle different response structures
      if (Array.isArray(result)) {
        // Direct array response - find the item with matching ID
        itemData = result.find(item => item.id.toString() === itemId.toString());
        if (!itemData) {
          throw new Error(`Consent form with ID ${itemId} not found in response array`);
        }
      } else if (result && typeof result === 'object') {
        if (result.success) {
          // Standard response with success flag
          if (Array.isArray(result.data)) {
            // If data is an array, find the item with matching ID
            itemData = result.data.find(item => item.id.toString() === itemId.toString());
            if (!itemData) {
              throw new Error(`Consent form with ID ${itemId} not found in response array`);
            }
          } else if (result.data && result.data.id) {
            // If data is a single object, check if it's the one we want
            if (result.data.id.toString() === itemId.toString()) {
              itemData = result.data;
            } else {
              throw new Error(`Returned consent form ID ${result.data.id} does not match requested ID ${itemId}`);
            }
          } else {
            throw new Error("Invalid consent form data structure in response");
          }
        } else if (result.data) {
          // Response without success flag but with data
          if (Array.isArray(result.data)) {
            // If data is an array, find the item with matching ID
            itemData = result.data.find(item => item.id.toString() === itemId.toString());
            if (!itemData) {
              throw new Error(`Consent form with ID ${itemId} not found in response array`);
            }
          } else if (result.data.id) {
            // If data is a single object, check if it's the one we want
            if (result.data.id.toString() === itemId.toString()) {
              itemData = result.data;
            } else {
              throw new Error(`Returned consent form ID ${result.data.id} does not match requested ID ${itemId}`);
            }
          } else {
            throw new Error("Invalid consent form data structure in response");
          }
        } else {
          throw new Error("Invalid response structure");
        }
      }

      setFormData({
        id: itemData.id || null,
        patient_name: itemData.patient_name || "",
        date_of_birth: itemData.date_of_birth || "",
        gender: itemData.gender || "",
        address: itemData.address || "",
        mobile_number: itemData.mobile_number || "",
        diagnosis_name: itemData.diagnosis_name || "",
        gurdian_name: itemData.gurdian_name || "",
        relationship_to_patient: itemData.relationship_to_patient || "",
        attendee_signature: null, // We don't have the actual file, just the URL
        attendee_name: itemData.attendee_name || "",
        attendee_physician_signature: null, // We don't have the actual file, just the URL
        attendee_physician_name: itemData.attendee_physician_name || "",
        visit_date: itemData.visit_date || new Date().toISOString().split('T')[0]
      });

      // Set existing signature URLs for preview
      setExistingAttendeeSignature(itemData.attendee_signature);
      setExistingPhysicianSignature(itemData.attendee_physician_signature);

      setSelectedItemId(itemId);
    } catch (error) {
      console.error("Error fetching consent form details:", error);
      setMessage(error.message || "An error occurred while fetching consent form details");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle consent form card click
  const handleItemClick = (itemId) => {
    console.log("Consent form card clicked with ID:", itemId);
    fetchConsentFormDetails(itemId);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'attendee_signature') {
      // Handle file input for attendee signature
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        attendee_signature: file
      }));

      // Create a preview URL for selected signature
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setAttendeeSignaturePreview(previewUrl);
        // Also read as data URL immediately for real-time display
        const reader = new FileReader();
        reader.onloadend = () => {
          setAttendeeSignatureDataUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setAttendeeSignaturePreview(null);
        setAttendeeSignatureDataUrl(null);
      }
    } else if (name === 'attendee_physician_signature') {
      // Handle file input for physician signature
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        attendee_physician_signature: file
      }));

      // Create a preview URL for selected signature
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPhysicianSignaturePreview(previewUrl);
        // Also read as data URL immediately for real-time display
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhysicianSignatureDataUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPhysicianSignaturePreview(null);
        setPhysicianSignatureDataUrl(null);
      }
    } else {
      // Handle text inputs
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Reset form to original data
  const resetForm = () => {
    if (selectedItemId) {
      fetchConsentFormDetails(selectedItemId);
    }
    setAttendeeSignaturePreview(null);
    setPhysicianSignaturePreview(null);
    setIsEditing(false);
    setShowAlert(false);
  };

  // Go back to consent form list
  const backToItemList = () => {
    setSelectedItemId(null);
    setIsEditing(false);
    setAttendeeSignaturePreview(null);
    setPhysicianSignaturePreview(null);
    setAttendeeSignatureDataUrl(null);
    setPhysicianSignatureDataUrl(null);
  };

  // Enable editing mode
  const enableEditing = (e) => {
    e.preventDefault(); // Prevent form submission
    setIsEditing(true);
    setShowAlert(false); // Hide any existing alerts when entering edit mode
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
        patient_name: formData.patient_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        address: formData.address,
        mobile_number: formData.mobile_number,
        diagnosis_name: formData.diagnosis_name,
        gurdian_name: formData.gurdian_name,
        relationship_to_patient: formData.relationship_to_patient,
        attendee_name: formData.attendee_name,
        attendee_physician_name: formData.attendee_physician_name,
        visit_date: formData.visit_date
      };

      console.log("Submitting data for consent form ID:", formData.id);
      console.log("Payload:", payload);

      // If we have new signatures, we need to handle them with FormData
      if (formData.attendee_signature || formData.attendee_physician_signature) {
        const dataToSend = new FormData();

        // Add all text fields
        Object.keys(payload).forEach(key => {
          dataToSend.append(key, payload[key]);
        });

        // Add file fields if they exist
        if (formData.attendee_signature) {
          dataToSend.append('attendee_signature', formData.attendee_signature);
        }

        if (formData.attendee_physician_signature) {
          dataToSend.append('attendee_physician_signature', formData.attendee_physician_signature);
        }

        console.log("FormData content:");
        for (let pair of dataToSend.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/consent-form/?id=${formData.id}`;
        console.log("PUT URL:", url);

        let response = await fetch(url, {
          method: "PUT",
          body: dataToSend,
          headers: {
            // Remove Content-Type to let browser set it automatically for FormData
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
            (errorData && errorData.message) || 'Failed to update consent form'
          );
        }

        const result = await response.json();
        console.log("PUT Success response:", result);

        // Handle different response structures for PUT
        let isSuccess = false;
        let updatedItem = null;

        if (Array.isArray(result)) {
          // Direct array response
          isSuccess = result.length > 0;
          updatedItem = result.find(item => item.id === formData.id) || result[0];
        } else if (result && typeof result === 'object') {
          if (result.success) {
            isSuccess = result.success;
            if (Array.isArray(result.data)) {
              updatedItem = result.data.find(item => item.id === formData.id) || result.data[0];
            } else {
              updatedItem = result.data;
            }
          } else if (result.id) {
            // Response without success flag but with ID
            isSuccess = true;
            updatedItem = result;
          }
        }

        if (isSuccess) {
          setMessage("Consent form updated successfully!");
          setVariant("success");
          setShowAlert(true);
          setIsEditing(false);

          // Update existing signatures if new ones were uploaded
          if (formData.attendee_signature && updatedItem) {
            // Keep the data URL in state so it displays the uploaded image immediately
            // Don't clear it, just update the existing signature path for future loads
            setExistingAttendeeSignature(updatedItem.attendee_signature);
            setAttendeeSignaturePreview(null);
            setFormData((prev) => ({ ...prev, attendee_signature: null }));
          }

          if (formData.attendee_physician_signature && updatedItem) {
            // Keep the data URL in state so it displays the uploaded image immediately
            // Don't clear it, just update the existing signature path for future loads
            setExistingPhysicianSignature(updatedItem.attendee_physician_signature);
            setPhysicianSignaturePreview(null);
            setFormData((prev) => ({ ...prev, attendee_physician_signature: null }));
          }

          // Update the consent form in the list
          if (updatedItem) {
            setConsentForms(prevItems =>
              prevItems.map(item =>
                item.id === formData.id ? updatedItem : item
              )
            );
          }

          // Add hard refresh after successful save with signatures
          setTimeout(() => {
            window.location.reload();
          }, 2000); // Wait 2 seconds to show the success message before refreshing
        } else {
          throw new Error("Failed to update consent form");
        }
      } else {
        // For updates without new signatures, use JSON
        const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/consent-form/?id=${formData.id}`;
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
            errorData.message || "Failed to update consent form"
          );
        }

        const result = await response.json();
        console.log("PUT Success response:", result);

        // Handle different response structures for PUT
        let isSuccess = false;
        let updatedItem = null;

        if (Array.isArray(result)) {
          // Direct array response
          isSuccess = result.length > 0;
          updatedItem = result.find(item => item.id === formData.id) || result[0];
        } else if (result && typeof result === 'object') {
          if (result.success) {
            isSuccess = result.success;
            if (Array.isArray(result.data)) {
              updatedItem = result.data.find(item => item.id === formData.id) || result.data[0];
            } else {
              updatedItem = result.data;
            }
          } else if (result.id) {
            // Response without success flag but with ID
            isSuccess = true;
            updatedItem = result;
          }
        }

        if (isSuccess) {
          setMessage("Consent form updated successfully!");
          setVariant("success");
          setShowAlert(true);
          setIsEditing(false);

          // Update the consent form in the list
          if (updatedItem) {
            setConsentForms(prevItems =>
              prevItems.map(item =>
                item.id === formData.id ? updatedItem : item
              )
            );
          }

          // Add hard refresh after successful save without signatures
          setTimeout(() => {
            window.location.reload();
          }, 2000); // Wait 2 seconds to show the success message before refreshing
        } else {
          throw new Error("Failed to update consent form");
        }
      }
    } catch (error) {
      console.error('Error updating consent form:', error);
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = "Network error: Could not connect to the server. Please check the API endpoint.";
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
    if (!window.confirm("Are you sure you want to delete this consent form?")) {
      return;
    }

    setIsSubmitting(true);
    setShowAlert(false);

    try {
      const url = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/consent-form/?id=${formData.id}`;
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
          "Failed to delete consent form"
        );
      }

      const result = await response.json();
      console.log("DELETE Success response:", result);

      // Handle different response structures for DELETE
      let isSuccess = false;

      if (Array.isArray(result)) {
        // Direct array response
        isSuccess = result.length > 0;
      } else if (result && typeof result === 'object') {
        if (result.success) {
          isSuccess = result.success;
        } else if (result.id || result.deleted) {
          // Response without success flag but with ID or deleted flag
          isSuccess = true;
        }
      }

      if (isSuccess) {
        setMessage("Consent form deleted successfully!");
        setVariant("success");
        setShowAlert(true);

        // Remove the consent form from the list
        setConsentForms(prevItems =>
          prevItems.filter(item => item.id !== formData.id)
        );

        // Go back to the list view
        setTimeout(() => {
          backToItemList();
          setShowAlert(false);
        }, 2000);
      } else {
        throw new Error("Failed to delete consent form");
      }
    } catch (error) {
      console.error("Error deleting consent form:", error);
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

  // Handle view modal
  const handleView = () => {
    setShowViewModal(true);
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = viewFormRef.current;
      if (!element) {
        throw new Error("Form element not found for PDF generation");
      }

      // Scroll to top to ensure all elements are visible
      element.scrollTop = 0;

      console.log("Starting PDF generation...");

      // Function to convert image to data URL
      const imageToDataUrl = async (imageUrl) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'Anonymous';

          // Add timestamp to prevent caching issues
          const urlWithTimestamp = imageUrl.includes('?')
            ? `${imageUrl}&_t=${Date.now()}`
            : `${imageUrl}?_t=${Date.now()}`;

          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          };

          img.onerror = () => {
            console.warn('Failed to load image:', urlWithTimestamp);
            // Instead of returning null, create a placeholder image
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 100;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#f0f0f0';
            ctx.fillRect(0, 0, 200, 100);
            ctx.fillStyle = '#666';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Signature', 100, 50);
            resolve(canvas.toDataURL('image/png'));
          };

          img.src = urlWithTimestamp;
        });
      };

      // Create a temporary container to split content
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = element.scrollWidth + 'px';
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(tempContainer);

      // Clone the original element
      const clonedElement = element.cloneNode(true);
      tempContainer.appendChild(clonedElement);

      // Get all sections
      const sections = clonedElement.querySelectorAll('.consult-form-step');

      // Find the section with "7. EMERGENCY AND LIMITATION OF CARE" title
      let pageBreakIndex = -1;
      for (let i = 0; i < sections.length; i++) {
        const sectionTitle = sections[i].querySelector('h3')?.textContent;
        if (sectionTitle && sectionTitle.includes('7. EMERGENCY AND LIMITATION OF CARE')) {
          pageBreakIndex = i;
          break;
        }
      }

      // Create two containers for the two pages
      const page1Container = document.createElement('div');
      page1Container.style.width = element.scrollWidth + 'px';
      page1Container.style.backgroundColor = '#ffffff';

      const page2Container = document.createElement('div');
      page2Container.style.width = element.scrollWidth + 'px';
      page2Container.style.backgroundColor = '#ffffff';

      // Add sections to the appropriate page containers
      for (let i = 0; i < sections.length; i++) {
        if (i <= pageBreakIndex) {
          page1Container.appendChild(sections[i].cloneNode(true));
        } else {
          page2Container.appendChild(sections[i].cloneNode(true));
        }
      }

      // Add the page containers to the temporary container
      tempContainer.appendChild(page1Container);
      tempContainer.appendChild(page2Container);

      // Process images in the page containers using the same logic as your original function
      const processImages = async (container) => {
        const images = container.querySelectorAll('img');
        const imageData = [];

        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          const originalSrc = img.src;
          console.log(`Processing image ${i + 1}:`, originalSrc);

          // Skip the logo image as it's local and should work fine
          if (originalSrc.includes('Logo1.jpeg')) {
            console.log(`Skipping logo image ${i + 1}`);
            continue;
          }

          try {
            // Check if it's an external URL
            if (originalSrc.startsWith('http')) {
              // Show loading indicator
              img.style.opacity = '0.5';

              const dataUrl = await imageToDataUrl(originalSrc);
              if (dataUrl) {
                imageData.push({ element: img, originalSrc, dataUrl });
                img.src = dataUrl;
                img.style.opacity = '1';
                console.log(`Image ${i + 1} converted to data URL`);
              }
            } else {
              console.log(`Image ${i + 1} is already local or data URL`);
            }
          } catch (error) {
            console.error(`Error processing image ${i + 1}:`, error);
            img.style.opacity = '1';
          }
        }

        return imageData;
      };

      // Process images in both page containers
      const page1ImageData = await processImages(page1Container);
      const page2ImageData = await processImages(page2Container);

      // Wait for images to update in DOM
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate canvas for page 1
      const canvas1 = await html2canvas(page1Container, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: page1Container.scrollWidth,
        height: page1Container.scrollHeight,
        onclone: (clonedDocument) => {
          const clonedImages = clonedDocument.querySelectorAll('img');
          clonedImages.forEach(img => {
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
            img.style.maxWidth = '100%';
          });
        }
      });

      // Generate canvas for page 2
      const canvas2 = await html2canvas(page2Container, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: page2Container.scrollWidth,
        height: page2Container.scrollHeight,
        onclone: (clonedDocument) => {
          const clonedImages = clonedDocument.querySelectorAll('img');
          clonedImages.forEach(img => {
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
            img.style.maxWidth = '100%';
          });
        }
      });

      // Clean up
      document.body.removeChild(tempContainer);

      // Restore original image sources
      page1ImageData.forEach(({ element: img, originalSrc }) => {
        img.src = originalSrc;
      });

      page2ImageData.forEach(({ element: img, originalSrc }) => {
        img.src = originalSrc;
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Define margins (in mm)
      const leftMargin = 15;
      const rightMargin = 15;
      const topMargin = 15;
      const bottomMargin = 15;

      // Calculate available width and height within margins
      const availableWidth = 210 - leftMargin - rightMargin;
      const availableHeight = 295 - topMargin - bottomMargin;

      // Add page 1
      const imgData1 = canvas1.toDataURL('image/png', 1.0);
      const imgWidth1 = availableWidth;
      const imgHeight1 = (canvas1.height * imgWidth1) / canvas1.width;

      pdf.addImage(imgData1, 'PNG', leftMargin, topMargin, imgWidth1, imgHeight1);

      // Add page 2
      const imgData2 = canvas2.toDataURL('image/png', 1.0);
      const imgWidth2 = availableWidth;
      const imgHeight2 = (canvas2.height * imgWidth2) / canvas2.width;

      pdf.addPage();
      pdf.addImage(imgData2, 'PNG', leftMargin, topMargin, imgWidth2, imgHeight2);

      // Save the PDF
      pdf.save(`consent-form-${formData.patient_name || 'patient'}-${new Date().toISOString().split('T')[0]}.pdf`);

      setMessage("PDF downloaded successfully!");
      setVariant("success");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setMessage("Failed to generate PDF. Please try again.");
      setVariant("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // *** NEW PRINT FUNCTION ***
  const handlePrint = () => {
    if (!viewFormRef.current) return;

    const content = viewFormRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');

    printWindow.document.write('<html><head><title>Print Consent Form</title>');

    // Add styles to make it look like a clean document
    printWindow.document.write(`
    <style>
      @page { size: A4; margin: 20mm; }
      body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; color: #000; }
      .consult-form-step { margin-bottom: 20px; page-break-inside: avoid; }
      h3.form-label { font-size: 16px; font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; margin-top: 20px; }
      .clinic-info { margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
      .row { display: flex; flex-wrap: wrap; }
      .col-md-3, .col-md-6, .col-md-9 { width: 100%; margin-bottom: 10px; }
      @media (min-width: 768px) {
        .col-md-3 { width: 25%; }
        .col-md-6 { width: 50%; }
        .col-md-9 { width: 75%; }
      }
      img { max-width: 100%; height: auto; }
      /* Remove borders from inputs for a cleaner look */
      input, textarea, select { border: none !important; background: transparent !important; padding: 0 !important; width: auto !important; display: block !important; font-weight: bold; color: #000; }
      .signature-image { height: 80px; border: 1px solid #ddd; }
      /* Ensure labels are visible */
      label { font-weight: bold; display: block; margin-bottom: 2px; }
    </style>
  `);

    printWindow.document.write('</head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');

    printWindow.document.close();
    printWindow.focus();

    // Call print after a short delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
      // printWindow.close(); // Uncomment if you want the window to close immediately after print dialog
    }, 500);
  };
  // *************************

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
            <h1 className="page-title">Manage Consent Forms</h1>

            {/* Alert for success/error messages */}
            {showAlert && (
              <Alert variant={variant} className="mb-4" onClose={() => setShowAlert(false)} dismissible>
                {message}
              </Alert>
            )}

            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading Consent Forms...</p>
              </div>
            ) : (
              <>
                {!selectedItemId ? (
                  // Consent Forms List View
                  <>
                    <Row className="mb-4">
                      <Col>
                        <h2 className="mb-4">Select a Consent Form to Edit</h2>
                        {consentForms.length === 0 ? (
                          <Alert variant="info">
                            No consent forms found. Please create consent forms first.
                          </Alert>
                        ) : (
                          <Row>
                            {consentForms.map(form => (
                              <Col md={6} lg={4} className="mb-4" key={form.id}>
                                <Card
                                  className="h-100 consent-card profile-card"
                                  onClick={() => handleItemClick(form.id)}
                                >
                                  <Card.Body>
                                    <div className="d-flex flex-column">
                                      <Card.Title as="h5" className="mb-3">
                                        {form.patient_name || "Unknown Patient"}
                                      </Card.Title>
                                      <Card.Text className="text-muted">

                                        <p><strong>Date of Birth:</strong> {formatDate(form.date_of_birth)}</p>
                                        <p><strong>Gender:</strong> {form.gender || "N/A"}</p>
                                        <p><strong>Mobile:</strong> {form.mobile_number || "N/A"}</p>
                                        <p><strong>Diagnosis:</strong> {form.diagnosis_name || "N/A"}</p>
                                        <p><strong>Visit Date:</strong> {formatDate(form.visit_date)}</p>
                                      </Card.Text>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                      <Button variant="outline-primary" size="sm">
                                        <FaEdit /> View & Edit
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
                  // Consent Form Edit View
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Button variant="outline-secondary" onClick={backToItemList}>
                        <FaArrowLeft /> Back to Consent Forms
                      </Button>
                      <div className="d-flex gap-2">
                        <Button
                          variant="info"
                          onClick={handleView}
                          type="button"
                          className="d-flex align-items-center gap-2"
                        >
                          <FaEye /> View Form
                        </Button>
                        {!isEditing && (
                          <Button variant="danger" onClick={handleDelete} disabled={isSubmitting}>
                            <FaTrash /> Delete Form
                          </Button>
                        )}
                      </div>
                    </div>

                    <div ref={consentFormRef} className="consent-form-container">
                      <Form onSubmit={handleSubmit}>
                        {/* Static Clinic Information */}
                        <div className="consult-form-step">
                          <div className="clinic-info mb-4">
                            {/* New layout with logo and address */}
                            <div className="row align-items-center">
                              <div className="col-md-3">
                                <img src={Logo1} alt="Trilok Ayurveda Logo" className="img-fluid logo-trilok" />
                              </div>
                              <div className="col-md-9 d-flex justify-content-end">
                                <div className="text-end">
                                  <h3 className="form-label">Informed medical consent for Ayurvedic treatment</h3>
                                  <p><strong>Name of the Clinic:</strong> Trilok Ayurveda</p>
                                  <p><strong>Address:</strong> 475, Street-8, Rajendra Nagar, Dehradun, U.K.</p>
                                  <p><strong>Contact Details:</strong> +91-9837071030, +91-9758253472</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Patient Identification Section */}
                        <div className="consult-form-step">
                          <h3 className="form-label">PATIENT IDENTIFICATION</h3>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <Form.Label>Patient Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="patient_name"
                                value={formData.patient_name}
                                onChange={handleChange}
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <Form.Label>Date of Birth</Form.Label>
                              <Form.Control
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <Form.Label>Gender</Form.Label>
                              <Form.Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                disabled={!isEditing}
                              >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </Form.Select>
                            </div>
                            <div className="col-md-6 mb-3">
                              <Form.Label>Contact Number</Form.Label>
                              <Form.Control
                                type="tel"
                                name="mobile_number"
                                value={formData.mobile_number}
                                onChange={handleChange}
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="col-12 mb-3">
                              <Form.Label>Address</Form.Label>
                              <Form.Control
                                as="textarea"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="2"
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <Form.Label>Diagnosis</Form.Label>
                              <Form.Control
                                type="text"
                                name="diagnosis_name"
                                value={formData.diagnosis_name}
                                onChange={handleChange}
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <Form.Label>Name of Parent/Legal Guardian</Form.Label>
                              <Form.Control
                                type="text"
                                name="gurdian_name"
                                value={formData.gurdian_name}
                                onChange={handleChange}
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <Form.Label>Relationship</Form.Label>
                              <Form.Control
                                type="text"
                                name="relationship_to_patient"
                                value={formData.relationship_to_patient}
                                onChange={handleChange}
                                disabled={!isEditing}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Guidelines Sections */}
                        <div className="consult-form-step">
                          <h3 className="form-label">1. SCOPE OF CONSENT</h3>
                          <p className="mb-3">I hereby provide my informed, and voluntary consent to receive Ayurvedic medical care at the above-mentioned facility for the management of my health condition as deemed appropriate by the attending Ayurvedic physician.</p>
                          <p className="mb-3">The scope of care may include, but is not limited to:</p>
                          <ul>
                            <li>Ayurvedic clinical consultation and assessment</li>
                            <li>Oral Ayurvedic medications (herbal and/or herbo-mineral formulations)</li>
                            <li>External therapies and procedures</li>
                            <li>Panchakarma therapies (if indicated)</li>
                            <li>Dietetic, lifestyle, and behavioral counseling</li>
                            <li>Medicines dispensed through the clinic's in-house Ayurvedic pharmacy</li>
                          </ul>
                        </div>

                        <div className="consult-form-step">
                          <h3 className="form-label">2. EXPLANATION OF TREATMENT</h3>
                          <p className="mb-3">I acknowledge that:</p>
                          <ul>
                            <li>The nature, purpose, expected benefits, duration, and limitations of the proposed Ayurvedic treatment have been explained to me in a language I understand.</li>
                            <li>Ayurvedic management is individualized and may require long-term treatment and follow-up, especially in chronic conditions.</li>
                            <li>Outcomes vary between individuals, and no guarantee of cure or specific result has been made.</li>
                          </ul>
                        </div>

                        <div className="consult-form-step">
                          <h3 className="form-label">3. RISKS, DISCOMFORTS, AND LIMITATIONS</h3>
                          <p className="mb-3">I understand that, despite appropriate care, unforeseen reactions or lack of desired response may occur.</p>
                          <p className="mb-3">Any medico-legal dispute or issue arising from this consent or treatment shall be subject to the jurisdiction of the courts in Dehradun.</p>
                        </div>

                        <div className="consult-form-step">
                          <h3 className="form-label">4. ALTERNATIVE TREATMENT OPTIONS</h3>
                          <p className="mb-3">I understand that, I have the right to seek a second opinion or opt for alternative or supportive care at any time.</p>
                        </div>

                        <div className="consult-form-step">
                          <h3 className="form-label">5. PATIENT DISCLOSURE AND RESPONSIBILITIES</h3>
                          <p className="mb-3">I confirm that:</p>
                          <ul>
                            <li>I have disclosed complete and accurate information regarding my medical history, ongoing treatments, medications, allergies, prior procedures, pregnancy or lactation status, and any other relevant health conditions.</li>
                            <li>I understand that withholding or misrepresenting information may affect treatment outcomes.</li>
                            <li>I agree to comply with prescribed medications, therapies, dietary guidelines, lifestyle advice, and follow-up schedules.</li>
                          </ul>
                        </div>

                        <div className="consult-form-step">
                          <h3 className="form-label">6. IN-HOUSE AYURVEDIC PHARMACY</h3>
                          <p className="mb-3">I acknowledge that:</p>
                          <ul>
                            <li>Medicines prescribed are dispensed from the clinic's in-house Ayurvedic pharmacy.</li>
                            <li>I have been informed about dosage, method of administration, and precautions related to the medicines prescribed.</li>
                          </ul>
                        </div>

                        <div className="consult-form-step">
                          <h3 className="form-label">7. EMERGENCY AND LIMITATION OF CARE</h3>
                          <p className="mb-3">I understand that, in case of medical emergencies, I may be advised to seek immediate care at an appropriate emergency medical facility.</p>
                        </div>

                        <div className="consult-form-step">
                          <h3 className="form-label">8. RIGHT TO WITHDRAW CONSENT</h3>
                          <p className="mb-3">I understand that:</p>
                          <ul>
                            <li>I have the right to withdraw my consent and discontinue treatment at any time, after informing the treating physician.</li>
                            <li>Withdrawal of consent will not affect my right to future consultation or care.</li>
                          </ul>
                        </div>

                        <div className="consult-form-step">
                          <h3 className="form-label">9. DECLARATION AND CONSENT</h3>
                          <p className="mb-3">I certify that:</p>
                          <ul>
                            <li>I have read, understood, and been explained the contents of this consent form.</li>
                            <li>I have had the opportunity to ask questions, and all my questions have been answered to my satisfaction.</li>
                            <li>I voluntarily consent to undergo Ayurvedic consultation, medications, and therapeutic procedures including Panchakarma, as advised.</li>
                          </ul>
                        </div>

                        {/* Signature Section */}
                        <div className="consult-form-step">
                          <h3 className="form-label">SIGNATURES</h3>
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <Form.Label>Patient / Guardian Signature</Form.Label>
                              {isEditing ? (
                                <>
                                  <Form.Control
                                    type="file"
                                    name="attendee_signature"
                                    onChange={handleChange}
                                    accept="image/*"
                                  />
                                  {attendeeSignaturePreview ? (
                                    <div className="mt-2">
                                      <p>New Signature Preview:</p>
                                      <img
                                        src={attendeeSignaturePreview}
                                        alt="Signature Preview"
                                        className="signature-image"
                                      />
                                    </div>
                                  ) : attendeeSignatureDataUrl ? (
                                    <div className="mt-2">
                                      <p>Current Signature:</p>
                                      <img
                                        src={attendeeSignatureDataUrl}
                                        alt="Existing Signature"
                                        className="signature-image"

                                      />
                                    </div>
                                  ) : existingAttendeeSignature && (
                                    <div className="mt-2">
                                      <p>Current Signature:</p>
                                      <img
                                        src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingAttendeeSignature}`}
                                        alt="Existing Signature"
                                        className="signature-image"
                                        onError={(e) => {
                                          console.error("Error loading signature image:", e);
                                          // Create a placeholder
                                          const canvas = document.createElement('canvas');
                                          canvas.width = 200;
                                          canvas.height = 100;
                                          const ctx = canvas.getContext('2d');
                                          ctx.fillStyle = '#f0f0f0';
                                          ctx.fillRect(0, 0, 200, 100);
                                          ctx.fillStyle = '#666';
                                          ctx.font = '14px Arial';
                                          ctx.textAlign = 'center';
                                          ctx.fillText('Signature', 100, 50);
                                          e.target.src = canvas.toDataURL('image/png');
                                        }}
                                      />
                                    </div>
                                  )}
                                </>
                              ) : (
                                attendeeSignatureDataUrl ? (
                                  <div className="mt-2">
                                    <p>Current Signature:</p>
                                    <img
                                      src={attendeeSignatureDataUrl}
                                      alt="Existing Signature"
                                      className="signature-image"
                                    />
                                  </div>
                                ) : existingAttendeeSignature && (
                                  <div className="mt-2">
                                    <p>Current Signature:</p>
                                    <img
                                      src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingAttendeeSignature}`}
                                      alt="Existing Signature"
                                      className="signature-image"
                                      onError={(e) => {
                                        console.error("Error loading signature image:", e);
                                        // Create a placeholder
                                        const canvas = document.createElement('canvas');
                                        canvas.width = 200;
                                        canvas.height = 100;
                                        const ctx = canvas.getContext('2d');
                                        ctx.fillStyle = '#f0f0f0';
                                        ctx.fillRect(0, 0, 200, 100);
                                        ctx.fillStyle = '#666';
                                        ctx.font = '14px Arial';
                                        ctx.textAlign = 'center';
                                        ctx.fillText('Signature', 100, 50);
                                        e.target.src = canvas.toDataURL('image/png');
                                      }}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                            <div className="col-md-6 mb-3">
                              <Form.Label>Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="attendee_name"
                                value={formData.attendee_name}
                                onChange={handleChange}
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <Form.Label>Physician Signature</Form.Label>
                              {isEditing ? (
                                <>
                                  <Form.Control
                                    type="file"
                                    name="attendee_physician_signature"
                                    onChange={handleChange}
                                    accept="image/*"
                                  />
                                  {physicianSignaturePreview ? (
                                    <div className="mt-2">
                                      <p>New Physician Signature Preview:</p>
                                      <img
                                        src={physicianSignaturePreview}
                                        alt="Physician Signature Preview"
                                        className="signature-image"
                                      />
                                    </div>
                                  ) : physicianSignatureDataUrl ? (
                                    <div className="mt-2">
                                      <p>Current Physician Signature:</p>
                                      <img
                                        src={physicianSignatureDataUrl}
                                        alt="Existing Physician Signature"
                                        className="signature-image"
                                      />
                                    </div>
                                  ) : existingPhysicianSignature && (
                                    <div className="mt-2">
                                      <p>Current Physician Signature:</p>
                                      <img
                                        src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingPhysicianSignature}`}
                                        alt="Existing Physician Signature"
                                        className="signature-image"
                                        onError={(e) => {
                                          console.error("Error loading physician signature image:", e);
                                          // Create a placeholder
                                          const canvas = document.createElement('canvas');
                                          canvas.width = 200;
                                          canvas.height = 100;
                                          const ctx = canvas.getContext('2d');
                                          ctx.fillStyle = '#f0f0f0';
                                          ctx.fillRect(0, 0, 200, 100);
                                          ctx.fillStyle = '#666';
                                          ctx.font = '14px Arial';
                                          ctx.textAlign = 'center';
                                          ctx.fillText('Physician Signature', 100, 50);
                                          e.target.src = canvas.toDataURL('image/png');
                                        }}
                                      />
                                    </div>
                                  )}
                                </>
                              ) : (
                                physicianSignatureDataUrl ? (
                                  <div className="mt-2">
                                    <p>Current Physician Signature:</p>
                                    <img
                                      src={physicianSignatureDataUrl}
                                      alt="Existing Physician Signature"
                                      className="signature-image"
                                    />
                                  </div>
                                ) : existingPhysicianSignature && (
                                  <div className="mt-2">
                                    <p>Current Physician Signature:</p>
                                    <img
                                      src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingPhysicianSignature}`}
                                      alt="Existing Physician Signature"
                                      className="signature-image"
                                      onError={(e) => {
                                        console.error("Error loading physician signature image:", e);
                                        // Create a placeholder
                                        const canvas = document.createElement('canvas');
                                        canvas.width = 200;
                                        canvas.height = 100;
                                        const ctx = canvas.getContext('2d');
                                        ctx.fillStyle = '#f0f0f0';
                                        ctx.fillRect(0, 0, 200, 100);
                                        ctx.fillStyle = '#666';
                                        ctx.font = '14px Arial';
                                        ctx.textAlign = 'center';
                                        ctx.fillText('Physician Signature', 100, 50);
                                        e.target.src = canvas.toDataURL('image/png');
                                      }}
                                    />
                                  </div>
                                )
                              )}
                            </div>
                            <div className="col-md-6 mb-3">
                              <Form.Label>Physician Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="attendee_physician_name"
                                value={formData.attendee_physician_name}
                                onChange={handleChange}
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="col-md-6 mb-3">
                              <Form.Label>Date</Form.Label>
                              <Form.Control
                                type="date"
                                name="visit_date"
                                value={formData.visit_date}
                                onChange={handleChange}
                                disabled={!isEditing}
                              />
                            </div>
                          </div>
                        </div>
                      </Form>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      {isEditing ? (
                        <>
                          <Button
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                          >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
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
                          Edit Consent Form
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

      {/* View Modal with Form */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="xl"
        fullscreen="lg-down"
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>Consent Form - {formData.patient_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-end mb-3 gap-2">
            <Button
              variant="primary"
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="no-print"
            >
              {isGeneratingPDF ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating PDF...
                </>
              ) : (
                <>
                  <FaDownload className="me-2" /> Download PDF
                </>
              )}
            </Button>

            {/* *** NEW PRINT BUTTON *** */}
            {/* <Button
              variant="secondary"
              onClick={handlePrint}
              className="no-print"
            >
              <FaPrint className="me-2" /> Print1
            </Button> */}
            {/* ************************* */}

          </div>
          <div ref={viewFormRef} className="consent-form-container">
            <Form>
              {/* Static Clinic Information */}
              <div className="consult-form-step">
                <div className="clinic-info mb-4">
                  {/* New layout with logo and address */}
                  <div className="row align-items-center">
                    <div className="col-md-3">
                      <img src={Logo1} alt="Trilok Ayurveda Logo" className="img-fluid logo-trilok" />
                    </div>
                    <div className="col-md-9 d-flex justify-content-end">
                      <div className="text-end">
                        <h3 className="form-label">Informed medical consent for Ayurvedic treatment</h3>
                        <p><strong>Name of the Clinic:</strong> Trilok Ayurveda</p>
                        <p><strong>Address:</strong> 475, Street-8, Rajendra Nagar, Dehradun, U.K.</p>
                        <p><strong>Contact Details:</strong> +91-9837071030, +91-9758253472</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Identification Section */}
              <div className="consult-form-step">
                <h3 className="form-label">PATIENT IDENTIFICATION</h3>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Form.Label>Patient Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.patient_name}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.date_of_birth}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.gender}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control
                      type="tel"
                      value={formData.mobile_number}
                      disabled
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={formData.address}
                      rows="2"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Form.Label>Diagnosis</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.diagnosis_name}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Form.Label>Name of Parent/Legal Guardian</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.gurdian_name}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Form.Label>Relationship</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.relationship_to_patient}
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Guidelines Sections */}
              <div className="consult-form-step">
                <h3 className="form-label">1. SCOPE OF CONSENT</h3>
                <p className="mb-3">I hereby provide my informed, and voluntary consent to receive Ayurvedic medical care at the above-mentioned facility for the management of my health condition as deemed appropriate by the attending Ayurvedic physician.</p>
                <p className="mb-3">The scope of care may include, but is not limited to:</p>
                <ul>
                  <li>Ayurvedic clinical consultation and assessment</li>
                  <li>Oral Ayurvedic medications (herbal and/or herbo-mineral formulations)</li>
                  <li>External therapies and procedures</li>
                  <li>Panchakarma therapies (if indicated)</li>
                  <li>Dietetic, lifestyle, and behavioral counseling</li>
                  <li>Medicines dispensed through the clinic's in-house Ayurvedic pharmacy</li>
                </ul>
              </div>

              <div className="consult-form-step">
                <h3 className="form-label">2. EXPLANATION OF TREATMENT</h3>
                <p className="mb-3">I acknowledge that:</p>
                <ul>
                  <li>The nature, purpose, expected benefits, duration, and limitations of the proposed Ayurvedic treatment have been explained to me in a language I understand.</li>
                  <li>Ayurvedic management is individualized and may require long-term treatment and follow-up, especially in chronic conditions.</li>
                  <li>Outcomes vary between individuals, and no guarantee of cure or specific result has been made.</li>
                </ul>
              </div>

              <div className="consult-form-step">
                <h3 className="form-label">3. RISKS, DISCOMFORTS, AND LIMITATIONS</h3>
                <p className="mb-3">I understand that, despite appropriate care, unforeseen reactions or lack of desired response may occur.</p>
                <p className="mb-3">Any medico-legal dispute or issue arising from this consent or treatment shall be subject to the jurisdiction of the courts in Dehradun.</p>
              </div>

              <div className="consult-form-step">
                <h3 className="form-label">4. ALTERNATIVE TREATMENT OPTIONS</h3>
                <p className="mb-3">I understand that, I have the right to seek a second opinion or opt for alternative or supportive care at any time.</p>
              </div>

              <div className="consult-form-step">
                <h3 className="form-label">5. PATIENT DISCLOSURE AND RESPONSIBILITIES</h3>
                <p className="mb-3">I confirm that:</p>
                <ul>
                  <li>I have disclosed complete and accurate information regarding my medical history, ongoing treatments, medications, allergies, prior procedures, pregnancy or lactation status, and any other relevant health conditions.</li>
                  <li>I understand that withholding or misrepresenting information may affect treatment outcomes.</li>
                  <li>I agree to comply with prescribed medications, therapies, dietary guidelines, lifestyle advice, and follow-up schedules.</li>
                </ul>
              </div>

              <div className="consult-form-step">
                <h3 className="form-label">6. IN-HOUSE AYURVEDIC PHARMACY</h3>
                <p className="mb-3">I acknowledge that:</p>
                <ul>
                  <li>Medicines prescribed are dispensed from the clinic's in-house Ayurvedic pharmacy.</li>
                  <li>I have been informed about dosage, method of administration, and precautions related to the medicines prescribed.</li>
                </ul>
              </div>

              <div className="consult-form-step">
                <h3 className="form-label">7. EMERGENCY AND LIMITATION OF CARE</h3>
                <p className="mb-3">I understand that, in case of medical emergencies, I may be advised to seek immediate care at an appropriate emergency medical facility.</p>
              </div>

              <div className="consult-form-step">
                <h3 className="form-label">8. RIGHT TO WITHDRAW CONSENT</h3>
                <p className="mb-3">I understand that:</p>
                <ul>
                  <li>I have the right to withdraw my consent and discontinue treatment at any time, after informing the treating physician.</li>
                  <li>Withdrawal of consent will not affect my right to future consultation or care.</li>
                </ul>
              </div>

              <div className="consult-form-step">
                <h3 className="form-label">9. DECLARATION AND CONSENT</h3>
                <p className="mb-3">I certify that:</p>
                <ul>
                  <li>I have read, understood, and been explained the contents of this consent form.</li>
                  <li>I have had the opportunity to ask questions, and all my questions have been answered to my satisfaction.</li>
                  <li>I voluntarily consent to undergo Ayurvedic consultation, medications, and therapeutic procedures including Panchakarma, as advised.</li>
                </ul>
              </div>

              {/* Signature Section */}
              <div className="consult-form-step">
                <h3 className="form-label">SIGNATURES</h3>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Form.Label>Patient / Guardian Signature</Form.Label>
                    {attendeeSignatureDataUrl ? (
                      <img
                        src={attendeeSignatureDataUrl}
                        alt="Patient Signature"
                        className="signature-image"
                      />
                    ) : existingAttendeeSignature && (
                      <img
                        src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingAttendeeSignature}`}
                        alt="Patient Signature"
                        className="signature-image"
                        onError={(e) => {
                          console.error("Error loading signature image:", e);
                          // Create a placeholder
                          const canvas = document.createElement('canvas');
                          canvas.width = 200;
                          canvas.height = 100;
                          const ctx = canvas.getContext('2d');
                          ctx.fillStyle = '#f0f0f0';
                          ctx.fillRect(0, 0, 200, 100);
                          ctx.fillStyle = '#666';
                          ctx.font = '14px Arial';
                          ctx.textAlign = 'center';
                          ctx.fillText('Signature', 100, 50);
                          e.target.src = canvas.toDataURL('image/png');
                        }}
                      />
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.attendee_name}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Form.Label>Physician Signature</Form.Label>
                    {physicianSignatureDataUrl ? (
                      <img
                        src={physicianSignatureDataUrl}
                        alt="Physician Signature"
                        className="signature-image"

                      />
                    ) : existingPhysicianSignature && (
                      <img
                        src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingPhysicianSignature}`}
                        alt="Physician Signature"
                        className="signature-image"

                        onError={(e) => {
                          console.error("Error loading physician signature image:", e);
                          // Create a placeholder
                          const canvas = document.createElement('canvas');
                          canvas.width = 200;
                          canvas.height = 100;
                          const ctx = canvas.getContext('2d');
                          ctx.fillStyle = '#f0f0f0';
                          ctx.fillRect(0, 0, 200, 100);
                          ctx.fillStyle = '#666';
                          ctx.font = '14px Arial';
                          ctx.textAlign = 'center';
                          ctx.fillText('Physician Signature', 100, 50);
                          e.target.src = canvas.toDataURL('image/png');
                        }}
                      />
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <Form.Label>Physician Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.attendee_physician_name}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.visit_date}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>


    </>
  );
};
export default ManageConsent;