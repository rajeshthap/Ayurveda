import React, { useState } from "react";
import axios from "axios";
import BgShape2 from "../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../assets/images/bg-leaf2.png";
import "../../assets/css/PatientFeedback.css";
import { Link } from "react-router-dom";

function PatientFeedback() {
  // API endpoint
  const API_URL = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/patient-feedback/";
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});
  
  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    visit_date: "",
    treatment_taken: "",
    before_treatment: "",
    experience_during_treatment: "",
    improvement_notice: "",
    improvement_helped: "",
    overall_experience: "",
    message_to_other: "",
    permission_to_use: false
  });

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.visit_date) {
      newErrors.visit_date = "Visit date is required";
    }
    
    if (!formData.treatment_taken.trim()) {
      newErrors.treatment_taken = "Treatment taken is required";
    }
    
    if (!formData.before_treatment.trim()) {
      newErrors.before_treatment = "Please describe your condition before treatment";
    }
    
    if (!formData.experience_during_treatment.trim()) {
      newErrors.experience_during_treatment = "Please share your experience during treatment";
    }
    
    if (!formData.improvement_notice.trim()) {
      newErrors.improvement_notice = "Please describe the improvements you noticed";
    }
    
    if (!formData.improvement_helped.trim()) {
      newErrors.improvement_helped = "Please explain how the improvement helped you";
    }
    
    if (!formData.overall_experience) {
      newErrors.overall_experience = "Please rate your overall experience";
    }
    
    if (!formData.message_to_other.trim()) {
      newErrors.message_to_other = "Please share a message for other patients";
    }
    
    if (formData.permission_to_use === undefined || formData.permission_to_use === null) {
      newErrors.permission_to_use = "Please select a permission option";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox for permission
    if (type === 'checkbox' || type === 'radio') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
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
      // Log the form data to debug
      console.log("Submitting form data:", formData);
      
      // Make sure all required fields are included
      const submissionData = {
        ...formData,
        // Ensure age is a number or null
        age: formData.age ? parseInt(formData.age) : null,
      };
      
      console.log("Final submission data:", submissionData);
      
      const response = await axios.post(API_URL, submissionData);
      console.log("API response:", response.data);
      setSubmitMessage("Your feedback has been submitted successfully!");
      
      // Reset form after successful submission
      setFormData({
        name: "",
        age: "",
        visit_date: "",
        treatment_taken: "",
        before_treatment: "",
        experience_during_treatment: "",
        improvement_notice: "",
        improvement_helped: "",
        overall_experience: "",
        message_to_other: "",
        permission_to_use: false
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
          setSubmitMessage(`Error: ${error.response.data || 'An error occurred while submitting your feedback.'}`);
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

  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className="about-bg">
        <div className="ayur-bread-content">
          <h2>Patient Feedback</h2>
          <div className="ayur-bread-list">
            <span>
              <Link to="/">Home</Link>
            </span>
            <span className="ayur-active-page">/ Patient Feedback</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us">
            <div className="consult-form-container">
              {/* Added heading with requested classes */}
              <div className="text-center mb-4">
                <h4 className='heading-extend'>Patient Feedback Form</h4>
                <div className='about-description'>Wellness Center and Speciality Clinic for Chronic Disorders</div>
              </div>
              
              {submitMessage ? (
                <div className={`alert ${submitMessage.includes('Error') ? 'alert-danger' : 'alert-success'} my-4`}>
                  {submitMessage}
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="consult-form-step">
                    <h3 className="step-title">Basic Details</h3>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="name" className="form-label">Name (optional)</label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="age" className="form-label">Age (optional)</label>
                        <input
                          type="number"
                          className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                          id="age"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                        />
                        {errors.age && <div className="invalid-feedback">{errors.age}</div>}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="visit_date" className="form-label">Treatment Period / Date of Visit *</label>
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
                      <div className="col-md-6 mb-3">
                        <label htmlFor="treatment_taken" className="form-label">Treatment Taken for (Name the condition) *</label>
                        <input
                          type="text"
                          className={`form-control ${errors.treatment_taken ? 'is-invalid' : ''}`}
                          id="treatment_taken"
                          name="treatment_taken"
                          value={formData.treatment_taken}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.treatment_taken && <div className="invalid-feedback">{errors.treatment_taken}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="consult-form-step">
                    <h3 className="form-label">Your Health Condition Before Treatment *</h3>
                    <p className="mb-3">How were you feeling before you started treatment? (What problems did you have? How did it affect your daily life?)</p>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <textarea
                          className={`form-control ${errors.before_treatment ? 'is-invalid' : ''}`}
                          id="before_treatment"
                          name="before_treatment"
                          value={formData.before_treatment}
                          onChange={handleInputChange}
                          rows="5"
                          required
                        ></textarea>
                        {errors.before_treatment && <div className="invalid-feedback">{errors.before_treatment}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="consult-form-step">
                    <h3 className="form-label">Your Experience During Treatment *</h3>
                    <p className="mb-3">Please share your experience during the treatment. (Your interaction with doctors, staff, explanations given, and overall care.)</p>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <textarea
                          className={`form-control ${errors.experience_during_treatment ? 'is-invalid' : ''}`}
                          id="experience_during_treatment"
                          name="experience_during_treatment"
                          value={formData.experience_during_treatment}
                          onChange={handleInputChange}
                          rows="5"
                          required
                        ></textarea>
                        {errors.experience_during_treatment && <div className="invalid-feedback">{errors.experience_during_treatment}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="consult-form-step">
                    <h3 className="form-label">Changes or Improvements You Noticed *</h3>
                    <p className="mb-3">What changes or improvements did you notice after treatment? (For example: pain relief, better sleep, more energy, improved digestion or movement, symptoms reduction)</p>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <textarea
                          className={`form-control ${errors.improvement_notice ? 'is-invalid' : ''}`}
                          id="improvement_notice"
                          name="improvement_notice"
                          value={formData.improvement_notice}
                          onChange={handleInputChange}
                          rows="5"
                          required
                        ></textarea>
                        {errors.improvement_notice && <div className="invalid-feedback">{errors.improvement_notice}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="consult-form-step">
                    <h3 className="form-label">How This Improvement Helped You *</h3>
                    <p className="mb-3">How has this improvement helped you in your daily life? (Work, home activities, comfort, confidence, or overall well-being.)</p>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <textarea
                          className={`form-control ${errors.improvement_helped ? 'is-invalid' : ''}`}
                          id="improvement_helped"
                          name="improvement_helped"
                          value={formData.improvement_helped}
                          onChange={handleInputChange}
                          rows="5"
                          required
                        ></textarea>
                        {errors.improvement_helped && <div className="invalid-feedback">{errors.improvement_helped}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="consult-form-step">
                    <h3 className="form-label">Overall Experience *</h3>
                    <p className="mb-3">How would you rate your overall experience with our clinic?</p>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <select
                          className={`form-select ${errors.overall_experience ? 'is-invalid' : ''}`}
                          id="overall_experience"
                          name="overall_experience"
                          value={formData.overall_experience}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Experience</option>
                          <option value="Very Good">Very Good</option>
                          <option value="Good">Good</option>
                          <option value="Average">Average</option>
                          <option value="Not Satisfactory">Not Satisfactory</option>
                        </select>
                        {errors.overall_experience && <div className="invalid-feedback">{errors.overall_experience}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="consult-form-step">
                    <h3 className="form-label">Your Message to Others *</h3>
                    <p className="mb-3">Would you like to share a message for other patients facing similar health issues?</p>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <textarea
                          className={`form-control ${errors.message_to_other ? 'is-invalid' : ''}`}
                          id="message_to_other"
                          name="message_to_other"
                          value={formData.message_to_other}
                          onChange={handleInputChange}
                          rows="5"
                          required
                        ></textarea>
                        {errors.message_to_other && <div className="invalid-feedback">{errors.message_to_other}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="consult-form-step">
                    <h3 className="step-title">Permission to Use Your Feedback *</h3>
                    <p className="mb-3">Please select one option:</p>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <div className="simple-radio-container">
                          {errors.permission_to_use && <div className="invalid-feedback d-block mb-2">{errors.permission_to_use}</div>}
                          <label>
                            <input 
                              type="radio" 
                              name="permission_to_use" 
                              value="true"
                              checked={formData.permission_to_use === true} 
                              onChange={() => setFormData({...formData, permission_to_use: true})} 
                            /> 
                            I give permission to use my feedback (with/without my name) for quality improvement, education, or patient awareness.
                          </label>
                          <br />
                          <label>
                            <input 
                              type="radio" 
                              name="permission_to_use" 
                              value="false"
                              checked={formData.permission_to_use === false} 
                              onChange={() => setFormData({...formData, permission_to_use: false})} 
                            /> 
                            I do not give permission to use my feedback.
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-navigation mt-4 d-flex justify-content-center">
                    <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
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

export default PatientFeedback;