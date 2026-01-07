import React, { useState } from "react";
import axios from "axios";
import BgShape2 from "../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../assets/images/bg-leaf2.png";
import "../../assets/css/PatientFeedback.css";
import { Link } from "react-router-dom";

function ConsentForm() {
  // API endpoint
  const API_URL = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/consent-form/";
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});
  
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
    
    if (!formData.patient_name.trim()) {
      newErrors.patient_name = "Patient name is required";
    }
    
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    }
    
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    
    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile_number.replace(/\s/g, ""))) {
      newErrors.mobile_number = "Mobile number must be 10 digits";
    }
    
    if (!formData.diagnosis_name.trim()) {
      newErrors.diagnosis_name = "Diagnosis name is required";
    }
    
    if (!formData.gurdian_name.trim()) {
      newErrors.gurdian_name = "Guardian name is required";
    }
    
    if (!formData.relationship_to_patient.trim()) {
      newErrors.relationship_to_patient = "Relationship to patient is required";
    }
    
    if (!formData.attendee_signature) {
      newErrors.attendee_signature = "Attendee signature is required";
    }
    
    if (!formData.attendee_name.trim()) {
      newErrors.attendee_name = "Attendee name is required";
    }
    
    if (!formData.attendee_physician_signature) {
      newErrors.attendee_physician_signature = "Physician signature is required";
    }
    
    if (!formData.attendee_physician_name.trim()) {
      newErrors.attendee_physician_name = "Physician name is required";
    }
    
    if (!formData.visit_date) {
      newErrors.visit_date = "Visit date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
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

  // CSS for red asterisk
  const requiredAsterisk = <span className="text-danger">*</span>;

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
              {/* Added heading with requested classes */}
              <div className="text-center mb-4">
                <h4 className='heading-extend'>Consent Form</h4>
                <div className='about-description'>Wellness Center and Speciality Clinic for Chronic Disorders</div>
              </div>
              
              {submitMessage ? (
                <div className={`alert ${submitMessage.includes('Error') ? 'alert-danger' : 'alert-success'} my-4`}>
                  {submitMessage}
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Static Clinic Information */}
                  <div className="consult-form-step">
                    <h3 className="form-label">Informed medical consent for Ayurvedic treatment</h3>
                    <div className="clinic-info mb-4">
                      <p><strong>Name of the Clinic:</strong> Trilok Ayurveda</p>
                      <p><strong>Address:</strong> 475, Street-8, Rajendra Nagar, Dehradun, U.K.</p>
                      <p><strong>Contact Details:</strong> +91-9837071030, +91-9758253472</p>
                    </div>
                  </div>

                  {/* Patient Identification Section */}
                  <div className="consult-form-step">
                    <h3 className="form-label">PATIENT IDENTIFICATION</h3>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="patient_name" className="form-label">Patient Name {requiredAsterisk}</label>
                        <input
                          type="text"
                          className={`form-control ${errors.patient_name ? 'is-invalid' : ''}`}
                          id="patient_name"
                          name="patient_name"
                          value={formData.patient_name}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.patient_name && <div className="invalid-feedback">{errors.patient_name}</div>}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="date_of_birth" className="form-label">Date of Birth {requiredAsterisk}</label>
                        <input
                          type="date"
                          className={`form-control ${errors.date_of_birth ? 'is-invalid' : ''}`}
                          id="date_of_birth"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.date_of_birth && <div className="invalid-feedback">{errors.date_of_birth}</div>}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="gender" className="form-label">Gender {requiredAsterisk}</label>
                        <select
                          className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="mobile_number" className="form-label">Contact Number {requiredAsterisk}</label>
                        <input
                          type="tel"
                          className={`form-control ${errors.mobile_number ? 'is-invalid' : ''}`}
                          id="mobile_number"
                          name="mobile_number"
                          value={formData.mobile_number}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.mobile_number && <div className="invalid-feedback">{errors.mobile_number}</div>}
                      </div>
                      <div className="col-12 mb-3">
                        <label htmlFor="address" className="form-label">Address</label>
                        <textarea
                          className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows="2"
                        ></textarea>
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="diagnosis_name" className="form-label">Diagnosis {requiredAsterisk}</label>
                        <input
                          type="text"
                          className={`form-control ${errors.diagnosis_name ? 'is-invalid' : ''}`}
                          id="diagnosis_name"
                          name="diagnosis_name"
                          value={formData.diagnosis_name}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.diagnosis_name && <div className="invalid-feedback">{errors.diagnosis_name}</div>}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="gurdian_name" className="form-label">Name of Parent/Legal Guardian {requiredAsterisk}</label>
                        <input
                          type="text"
                          className={`form-control ${errors.gurdian_name ? 'is-invalid' : ''}`}
                          id="gurdian_name"
                          name="gurdian_name"
                          value={formData.gurdian_name}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.gurdian_name && <div className="invalid-feedback">{errors.gurdian_name}</div>}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="relationship_to_patient" className="form-label">Relationship {requiredAsterisk}</label>
                        <input
                          type="text"
                          className={`form-control ${errors.relationship_to_patient ? 'is-invalid' : ''}`}
                          id="relationship_to_patient"
                          name="relationship_to_patient"
                          value={formData.relationship_to_patient}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.relationship_to_patient && <div className="invalid-feedback">{errors.relationship_to_patient}</div>}
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
                        <label htmlFor="attendee_signature" className="form-label">Patient / Guardian Signature {requiredAsterisk}</label>
                        <input
                          type="file"
                          className={`form-control ${errors.attendee_signature ? 'is-invalid' : ''}`}
                          id="attendee_signature"
                          name="attendee_signature"
                          onChange={handleFileChange}
                          accept="image/*"
                          required
                        />
                        {errors.attendee_signature && <div className="invalid-feedback">{errors.attendee_signature}</div>}
                        {formData.attendee_signature && (
                          <div className="mt-2">
                            <img 
                              src={URL.createObjectURL(formData.attendee_signature)} 
                              alt="Signature Preview" 
                              style={{maxHeight: '100px'}}
                            />
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="attendee_name" className="form-label">Name {requiredAsterisk}</label>
                        <input
                          type="text"
                          className={`form-control ${errors.attendee_name ? 'is-invalid' : ''}`}
                          id="attendee_name"
                          name="attendee_name"
                          value={formData.attendee_name}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.attendee_name && <div className="invalid-feedback">{errors.attendee_name}</div>}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="attendee_physician_signature" className="form-label">Attending Physician's Signature {requiredAsterisk}</label>
                        <input
                          type="file"
                          className={`form-control ${errors.attendee_physician_signature ? 'is-invalid' : ''}`}
                          id="attendee_physician_signature"
                          name="attendee_physician_signature"
                          onChange={handleFileChange}
                          accept="image/*"
                          required
                        />
                        {errors.attendee_physician_signature && <div className="invalid-feedback">{errors.attendee_physician_signature}</div>}
                        {formData.attendee_physician_signature && (
                          <div className="mt-2">
                            <img 
                              src={URL.createObjectURL(formData.attendee_physician_signature)} 
                              alt="Physician Signature Preview" 
                              style={{maxHeight: '100px'}}
                            />
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="attendee_physician_name" className="form-label">Physician Name {requiredAsterisk}</label>
                        <input
                          type="text"
                          className={`form-control ${errors.attendee_physician_name ? 'is-invalid' : ''}`}
                          id="attendee_physician_name"
                          name="attendee_physician_name"
                          value={formData.attendee_physician_name}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.attendee_physician_name && <div className="invalid-feedback">{errors.attendee_physician_name}</div>}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="visit_date" className="form-label">Date {requiredAsterisk}</label>
                        <input
                          type="date"
                          className={`form-control ${errors.visit_date ? 'is-invalid' : ''}`}
                          id="visit_date"
                          name="visit_date"
                          value={formData.visit_date}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.visit_date && <div className="invalid-feedback">{errors.visit_date}</div>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-navigation mt-4 d-flex justify-content-center">
                    <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Consent Form'}
                    </button>
                  </div>
                </form>
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