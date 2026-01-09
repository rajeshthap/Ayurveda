import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import "../../assets/css/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../context/AuthFetch";
import LeftNav from "./LeftNav";
import DashBoardHeader from "./DashBoardHeader";
import { FaTrash, FaEdit, FaArrowLeft, FaDownload } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo1 from "../../assets/images/Logo1.jpeg";

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
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success"); // 'success' or 'danger'
  const [showAlert, setShowAlert] = useState(false);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  // Ref for PDF generation
  const consentFormRef = useRef(null);

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
      } else {
        setAttendeeSignaturePreview(null);
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
      } else {
        setPhysicianSignaturePreview(null);
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
            setExistingAttendeeSignature(updatedItem.attendee_signature);
            setAttendeeSignaturePreview(null);
            setFormData((prev) => ({ ...prev, attendee_signature: null }));
          }
          
          if (formData.attendee_physician_signature && updatedItem) {
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

          // Generate and download PDF after successful update
          setTimeout(() => {
            generatePDF();
            setShowAlert(false);
          }, 1000);
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
          
          // Generate and download PDF after successful update
          setTimeout(() => {
            generatePDF();
            setShowAlert(false);
          }, 1000);
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

 // Generate PDF from the form
const generatePDF = async () => {
  try {
    // Wait a bit for any DOM updates to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const element = consentFormRef.current;
    if (!element) {
      throw new Error("Form element not found for PDF generation");
    }
    
    // Configure html2canvas for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight
    });
    
    const imgData = canvas.toDataURL('image/png', 1.0); // Maximum quality
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Define margins (in mm)
    const leftMargin = 15;
    const rightMargin = 15;
    const topMargin = 15;
    const bottomMargin = 15;
    
    // Calculate available width and height within margins
    const availableWidth = 210 - leftMargin - rightMargin; // A4 width (210mm) minus margins
    const availableHeight = 295 - topMargin - bottomMargin; // A4 height (295mm) minus margins
    
    // Calculate image dimensions to fit within available space
    const imgWidth = availableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = topMargin; // Start at top margin
    
    // Add first page
    pdf.addImage(imgData, 'PNG', leftMargin, position, imgWidth, imgHeight);
    heightLeft -= availableHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = topMargin - (imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', leftMargin, position, imgWidth, imgHeight);
      heightLeft -= availableHeight;
    }
    
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
  }
};

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
                                        <p><strong>ID:</strong> {form.id}</p>
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
                          variant="primary"
                          onClick={generatePDF}
                          type="button"
                          className="d-flex align-items-center gap-2"
                        >
                          <FaDownload /> Download PDF
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
                                <img src={Logo1} alt="Trilok Ayurveda Logo" className="img-fluid" style={{maxHeight: '150px'}} />
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
                            <li>Dietetic, lifestyle, and behavioural counseling</li>
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
                          <h3 className="form-label">10. DECLARATION AND CONSENT</h3>
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
                                        style={{maxHeight: '100px'}}
                                      />
                                    </div>
                                  ) : existingAttendeeSignature && (
                                    <div className="mt-2">
                                      <p>Current Signature:</p>
                                      <img 
                                        src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingAttendeeSignature}`} 
                                        alt="Existing Signature" 
                                        style={{maxHeight: '100px'}}
                                      />
                                    </div>
                                  )}
                                </>
                              ) : (
                                existingAttendeeSignature && (
                                  <div className="mt-2">
                                    <p>Current Signature:</p>
                                    <img 
                                      src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingAttendeeSignature}`} 
                                      alt="Existing Signature" 
                                      style={{maxHeight: '100px'}}
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
                                        style={{maxHeight: '100px'}}
                                      />
                                    </div>
                                  ) : existingPhysicianSignature && (
                                    <div className="mt-2">
                                      <p>Current Physician Signature:</p>
                                      <img 
                                        src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingPhysicianSignature}`} 
                                        alt="Existing Physician Signature" 
                                        style={{maxHeight: '100px'}}
                                      />
                                    </div>
                                  )}
                                </>
                              ) : (
                                existingPhysicianSignature && (
                                  <div className="mt-2">
                                    <p>Current Physician Signature:</p>
                                    <img 
                                      src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${existingPhysicianSignature}`} 
                                      alt="Existing Physician Signature" 
                                      style={{maxHeight: '100px'}}
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
    </>
  );
};

export default ManageConsent;