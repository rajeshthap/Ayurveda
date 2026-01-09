import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import BgShape2 from "../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../assets/images/bg-leaf2.png";
import Logo1 from "../../assets/images/Logo1.jpeg";
import "../../assets/css/PatientFeedback.css";
import { Link } from "react-router-dom";

function ConsentForm() {
  // API endpoint
  const API_URL = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/consent-form/";
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
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
    visit_date: new Date().toISOString().split('T')[0] // Default to today's date
  });

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate patient name
    if (!formData.patient_name.trim()) {
      newErrors.patient_name = "Patient name is required";
      isValid = false;
    }
    
    // Validate date of birth
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
      isValid = false;
    } else {
      const dob = new Date(formData.date_of_birth);
      const today = new Date();
      if (dob > today) {
        newErrors.date_of_birth = "Date of birth cannot be in the future";
        isValid = false;
      }
    }
    
    // Validate gender
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }
    
    // Validate mobile number
    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = "Mobile number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobile_number.replace(/\s/g, ""))) {
      newErrors.mobile_number = "Mobile number must be 10 digits";
      isValid = false;
    }
    
    // Validate diagnosis
    if (!formData.diagnosis_name.trim()) {
      newErrors.diagnosis_name = "Diagnosis name is required";
      isValid = false;
    }
    
    // Validate guardian name
    if (!formData.gurdian_name.trim()) {
      newErrors.gurdian_name = "Guardian name is required";
      isValid = false;
    }
    
    // Validate relationship
    if (!formData.relationship_to_patient.trim()) {
      newErrors.relationship_to_patient = "Relationship to patient is required";
      isValid = false;
    }
    
    // Validate attendee signature
    if (!formData.attendee_signature) {
      newErrors.attendee_signature = "Attendee signature is required";
      isValid = false;
    }
    
    // Validate attendee name
    if (!formData.attendee_name.trim()) {
      newErrors.attendee_name = "Attendee name is required";
      isValid = false;
    }
    
    // Validate visit date
    if (!formData.visit_date) {
      newErrors.visit_date = "Visit date is required";
      isValid = false;
    } else {
      const visitDate = new Date(formData.visit_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
      if (visitDate < today) {
        newErrors.visit_date = "Visit date cannot be in the past";
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    // Special handling for mobile number to only accept digits
    if (name === 'mobile_number') {
      // Only allow digits and limit to 10 characters
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData({
        ...formData,
        [name]: digitsOnly
      });
      
      // Clear error for this field if it exists
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ""
        });
      }
      return;
    }
    
    // For text fields (not textarea, not select), remove numbers
    if (type === 'text' && name !== 'mobile_number') {
      const textOnly = value.replace(/[0-9]/g, '');
      setFormData({
        ...formData,
        [name]: textOnly
      });
      
      // Clear error for this field if it exists
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ""
        });
      }
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  // Handle file upload for signatures
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      
      // Clear error for this field if it exists
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ""
        });
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    
    setValidated(true);
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const submissionData = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'attendee_signature' && key !== 'attendee_physician_signature') {
          submissionData.append(key, formData[key]);
        }
      });
      
      // Add file fields if they exist
      if (formData.attendee_signature) {
        submissionData.append('attendee_signature', formData.attendee_signature);
      }
      
      if (formData.attendee_physician_signature) {
        submissionData.append('attendee_physician_signature', formData.attendee_physician_signature);
      }
      
      console.log("Submitting form data");
      
      const response = await axios.post(API_URL, submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("API response:", response.data);
      setSubmitMessage("Your consent form has been submitted successfully!");
      
      // Reset form after successful submission
      setFormData({
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
      setErrors({});
      setValidated(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // More detailed error logging
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        
        // Try to extract specific error messages from the response
        if (error.response.data && typeof error.response.data === 'object') {
          const errorMessages = [];
          for (const field in error.response.data) {
            if (Array.isArray(error.response.data[field])) {
              errorMessages.push(`${field}: ${error.response.data[field].join(', ')}`);
            } else {
              errorMessages.push(`${field}: ${error.response.data[field]}`);
            }
          }
          setSubmitMessage(`Error: ${errorMessages.join('; ')}`);
        } else {
          setSubmitMessage(`Error: ${error.response.data || 'An error occurred while submitting your consent form.'}`);
        }
      } else if (error.request) {
        console.error("Request error:", error.request);
        setSubmitMessage("No response from server. Please try again.");
      } else {
        console.error("Error message:", error.message);
        setSubmitMessage(`Error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for max attribute on DOB input
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className="about-bg">
        <div className="ayur-bread-content">
          <h2>Consent Form</h2>
          <div className="ayur-bread-list">
            <span>
              <Link to="/">Home</Link>
            </span>
            <span className="ayur-active-page">/ Consent Form</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us">
            <div className="consult-form-container">
              <div className="text-center mb-4">
                <h4 className='heading-extend'>Consent Form</h4>
                <div className='about-description'>Wellness Center and Speciality Clinic for Chronic Disorders</div>
              </div>
              
              {submitMessage ? (
                <div className={`alert ${submitMessage.includes('Error') ? 'alert-danger' : 'alert-success'} my-4`}>
                  {submitMessage}
                </div>
              ) : (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  {/* Static Clinic Information */}
                  <div className="consult-form-step">
                    <div className="clinic-info mb-4">
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
                        <Form.Group controlId="patient_name">
                          <Form.Label>Patient Name <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="text" 
                            name="patient_name"
                            value={formData.patient_name}
                            onChange={handleInputChange}
                            onKeyPress={(e) => {
                              // Prevent numbers from being typed
                              if (/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            isInvalid={!!errors.patient_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.patient_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Group controlId="date_of_birth">
                          <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="date" 
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleInputChange}
                            max={today} // Disable future dates
                            required
                            isInvalid={!!errors.date_of_birth}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.date_of_birth}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Group controlId="gender">
                          <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                          <Form.Select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            required
                            isInvalid={!!errors.gender}
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.gender}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Group controlId="mobile_number">
                          <Form.Label>Contact Number <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="text" 
                            name="mobile_number"
                            value={formData.mobile_number}
                            onChange={handleInputChange}
                            placeholder="10-digit mobile number"
                            required
                            isInvalid={!!errors.mobile_number}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.mobile_number}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-12 mb-3">
                        <Form.Group controlId="address">
                          <Form.Label>Address</Form.Label>
                          <Form.Control 
                            as="textarea"
                            rows={2}
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Group controlId="diagnosis_name">
                          <Form.Label>Diagnosis <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="text" 
                            name="diagnosis_name"
                            value={formData.diagnosis_name}
                            onChange={handleInputChange}
                            onKeyPress={(e) => {
                              // Prevent numbers from being typed
                              if (/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            isInvalid={!!errors.diagnosis_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.diagnosis_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Group controlId="gurdian_name">
                          <Form.Label>Name of Parent/Legal Guardian <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="text" 
                            name="gurdian_name"
                            value={formData.gurdian_name}
                            onChange={handleInputChange}
                            onKeyPress={(e) => {
                              // Prevent numbers from being typed
                              if (/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            isInvalid={!!errors.gurdian_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.gurdian_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Group controlId="relationship_to_patient">
                          <Form.Label>Relationship <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="text" 
                            name="relationship_to_patient"
                            value={formData.relationship_to_patient}
                            onChange={handleInputChange}
                            onKeyPress={(e) => {
                              // Prevent numbers from being typed
                              if (/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            isInvalid={!!errors.relationship_to_patient}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.relationship_to_patient}
                          </Form.Control.Feedback>
                        </Form.Group>
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
                        <Form.Group controlId="attendee_signature">
                          <Form.Label>Patient / Guardian Signature <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="file"
                            name="attendee_signature"
                            onChange={handleFileChange}
                            accept="image/*"
                            required
                            isInvalid={!!errors.attendee_signature}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.attendee_signature}
                          </Form.Control.Feedback>
                          {formData.attendee_signature && (
                            <div className="mt-2">
                              <img 
                                src={URL.createObjectURL(formData.attendee_signature)} 
                                alt="Signature Preview" 
                                style={{maxHeight: '100px'}}
                              />
                            </div>
                          )}
                        </Form.Group>
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Group controlId="attendee_name">
                          <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="text" 
                            name="attendee_name"
                            value={formData.attendee_name}
                            onChange={handleInputChange}
                            onKeyPress={(e) => {
                              // Prevent numbers from being typed
                              if (/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            isInvalid={!!errors.attendee_name}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.attendee_name}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Group controlId="visit_date">
                          <Form.Label>Date <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="date" 
                            name="visit_date"
                            value={formData.visit_date}
                            onChange={handleInputChange}
                            min={today} // Disable past dates
                            required
                            isInvalid={!!errors.visit_date}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.visit_date}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-navigation mt-4 d-flex justify-content-center">
                    <Button variant="success" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Consent Form'}
                    </Button>
                  </div>
                </Form>
              )}
            </div>
          </div>
          <div className="ayur-bgshape ayur-about-bgshape">
            <img src={BgShape2} alt="img" />
            <img src={BgLeaf2} alt="img" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsentForm;