import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
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
  const [validated, setValidated] = useState(false);

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
    let isValid = true;

    // Validate visit date (required and not in the past)
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

    // Validate treatment taken (required)
    if (!formData.treatment_taken.trim()) {
      newErrors.treatment_taken = "Treatment taken is required";
      isValid = false;
    }

    // Validate before treatment (required)
    if (!formData.before_treatment.trim()) {
      newErrors.before_treatment = "Please describe your condition before treatment";
      isValid = false;
    }

    // Validate experience during treatment (required)
    if (!formData.experience_during_treatment.trim()) {
      newErrors.experience_during_treatment = "Please share your experience during treatment";
      isValid = false;
    }

    // Validate improvement notice (required)
    if (!formData.improvement_notice.trim()) {
      newErrors.improvement_notice = "Please describe the improvements you noticed";
      isValid = false;
    }

    // Validate improvement helped (required)
    if (!formData.improvement_helped.trim()) {
      newErrors.improvement_helped = "Please explain how the improvement helped you";
      isValid = false;
    }

    // Validate overall experience (required)
    if (!formData.overall_experience) {
      newErrors.overall_experience = "Please rate your overall experience";
      isValid = false;
    }

    // Validate message to other (required)
    if (!formData.message_to_other.trim()) {
      newErrors.message_to_other = "Please share a message for other patients";
      isValid = false;
    }

    // Validate permission to use (required)
    if (formData.permission_to_use === undefined || formData.permission_to_use === null) {
      newErrors.permission_to_use = "Please select a permission option";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = value;
    
    // For text fields (not textarea, not select), remove numbers
    if (type === 'text' && name !== 'age') {
      processedValue = value.replace(/[0-9]/g, '');
    }

    // Handle checkbox for permission
    if (type === 'checkbox' || type === 'radio') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: processedValue
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

  // Get today's date in YYYY-MM-DD format for date validation
  const today = new Date().toISOString().split('T')[0];

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
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <div className="consult-form-step">
                    <h3 className="step-title">Basic Details</h3>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <Form.Group controlId="name">
                          <Form.Label>Name (optional)</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            onKeyPress={(e) => {
                              // Prevent numbers from being typed
                              if (/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Group controlId="age">
                          <Form.Label>Date of Birth (optional)</Form.Label>
                          <Form.Control 
                            type="date" 
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            max={today} // Disable future dates
                          />
                        </Form.Group>
                      </div>
                      <div className="col-md-6 mb-3">
                        <Form.Group controlId="visit_date">
                          <Form.Label>Treatment Period / Date of Visit <span className="text-danger">*</span></Form.Label>
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
                      <div className="col-md-6 mb-3">
                        <Form.Group controlId="treatment_taken">
                          <Form.Label>Treatment Taken for (Name the condition) <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="text" 
                            name="treatment_taken"
                            value={formData.treatment_taken}
                            onChange={handleInputChange}
                            onKeyPress={(e) => {
                              // Prevent numbers from being typed
                              if (/[0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            required
                            isInvalid={!!errors.treatment_taken}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.treatment_taken}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </div>
                  </div>

                  <div className="consult-form-step">
                    <h3 className="form-label">Your Health Condition Before Treatment <span className="text-danger">*</span></h3>
                    <p className="mb-3">How were you feeling before you started treatment? (What problems did you have? How did it affect your daily life?)</p>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <Form.Group controlId="before_treatment">
                          <Form.Control 
                            as="textarea"
                            rows={5}
                            name="before_treatment"
                            value={formData.before_treatment}
                            onChange={handleInputChange}
                            required
                            isInvalid={!!errors.before_treatment}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.before_treatment}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </div>
                  </div>

                  <div className="consult-form-step">
                    <h3 className="form-label">Your Experience During Treatment <span className="text-danger">*</span></h3>
                    <p className="mb-3">Please share your experience during the treatment. (Your interaction with doctors, staff, explanations given, and overall care.)</p>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <Form.Group controlId="experience_during_treatment">
                          <Form.Control 
                            as="textarea"
                            rows={5}
                            name="experience_during_treatment"
                            value={formData.experience_during_treatment}
                            onChange={handleInputChange}
                            required
                            isInvalid={!!errors.experience_during_treatment}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.experience_during_treatment}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </div>
                  </div>

                  <div className="consult-form-step">
                    <h3 className="form-label">Changes or Improvements You Noticed <span className="text-danger">*</span></h3>
                    <p className="mb-3">What changes or improvements did you notice after treatment? (For example: pain relief, better sleep, more energy, improved digestion or movement, symptoms reduction)</p>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <Form.Group controlId="improvement_notice">
                          <Form.Control 
                            as="textarea"
                            rows={5}
                            name="improvement_notice"
                            value={formData.improvement_notice}
                            onChange={handleInputChange}
                            required
                            isInvalid={!!errors.improvement_notice}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.improvement_notice}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </div>
                  </div>

                  <div className="consult-form-step">
                    <h3 className="form-label">How This Improvement Helped You <span className="text-danger">*</span></h3>
                    <p className="mb-3">How has this improvement helped you in your daily life? (Work, home activities, comfort, confidence, or overall well-being.)</p>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <Form.Group controlId="improvement_helped">
                          <Form.Control 
                            as="textarea"
                            rows={5}
                            name="improvement_helped"
                            value={formData.improvement_helped}
                            onChange={handleInputChange}
                            required
                            isInvalid={!!errors.improvement_helped}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.improvement_helped}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </div>
                  </div>

                  <div className="consult-form-step">
                    <h3 className="form-label">Overall Experience <span className="text-danger">*</span></h3>
                    <p className="mb-3">How would you rate your overall experience with our clinic?</p>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <Form.Group controlId="overall_experience">
                          <Form.Select
                            name="overall_experience"
                            value={formData.overall_experience}
                            onChange={handleInputChange}
                            required
                            isInvalid={!!errors.overall_experience}
                          >
                            <option value="">Select Experience</option>
                            <option value="Very Good">Very Good</option>
                            <option value="Good">Good</option>
                            <option value="Average">Average</option>
                            <option value="Not Satisfactory">Not Satisfactory</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.overall_experience}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </div>
                  </div>

                  <div className="consult-form-step">
                    <h3 className="form-label">Your Message to Others <span className="text-danger">*</span></h3>
                    <p className="mb-3">Would you like to share a message for other patients facing similar health issues?</p>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <Form.Group controlId="message_to_other">
                          <Form.Control 
                            as="textarea"
                            rows={5}
                            name="message_to_other"
                            value={formData.message_to_other}
                            onChange={handleInputChange}
                            required
                            isInvalid={!!errors.message_to_other}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.message_to_other}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </div>
                  </div>

                  <div className="consult-form-step">
                    <h3 className="step-title">Permission to Use Your Feedback <span className="text-danger">*</span></h3>
                    <p className="mb-3">Please select one option:</p>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <div className="simple-radio-container">
                          {errors.permission_to_use && <div className="invalid-feedback d-block mb-2">{errors.permission_to_use}</div>}

                          <div className="radio-option">
                            <label>
                              <input
                                type="radio"
                                name="permission_to_use"
                                value="true"
                                checked={formData.permission_to_use === true}
                                onChange={() => setFormData({ ...formData, permission_to_use: true })}
                              />
                              <span>I give permission to use my feedback (with/without my name) for quality improvement, education, or patient awareness.</span>
                            </label>
                          </div>

                          <div className="radio-option">
                            <label>
                              <input
                                type="radio"
                                name="permission_to_use"
                                value="false"
                                checked={formData.permission_to_use === false}
                                onChange={() => setFormData({ ...formData, permission_to_use: false })}
                              />
                              <span>I do not give permission to use my feedback.</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-navigation mt-4 d-flex justify-content-center">
                    <Button variant="success" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
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

export default PatientFeedback;