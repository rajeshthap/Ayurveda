import React, { useState } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";
import BgShape2 from "../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../assets/images/bg-leaf2.png";
import "../../assets/css/PatientFeedback.css";
import "../../assets/css/Qol.css";
import { Link } from "react-router-dom";

function QolForm() {
  // API endpoint
  const API_URL = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/heart-failure-qol/";
  
  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState({
    patient_name: "",
    age: "",
    gender: "",
    diagnosis_date: "",
    current_medications: "",
    additional_comments: "",
    
    // Questions 1-6: Physical Health
    q1_swelling: 0,
    q2_rest_needed: 0,
    q3_walking_difficulty: 0,
    q4_going_out_difficulty: 0,
    q5_shortness_of_breath: 0,
    q6_fatigue: 0,
    
    // Questions 7-11: Emotional and Psychological Health
    q7_burden_feeling: 0,
    q8_loss_of_control: 0,
    q9_worry: 0,
    q10_concentration_issue: 0,
    q11_depression: 0,
    
    // Questions 12-15: Social and Functional Impact
    q12_social_difficulty: 0,
    q13_work_difficulty: 0,
    q14_hobby_difficulty: 0,
    q15_sexual_difficulty: 0,
    
    // Question 16: Sleep and Rest
    q16_sleep_difficulty: 0,
    
    // Questions 17-19: Self-Care and Treatment Burden
    q17_hospitalization: 0,
    q18_financial_burden: 0,
    q19_treatment_side_effects: 0,
    
    // Questions 20-21: General Health and Well-being
    q20_management_quality: 0,
    q21_overall_health: 0
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
    
    // Validate age (date of birth)
    if (!formData.age) {
      newErrors.age = "Date of birth is required";
      isValid = false;
    } else {
      const dob = new Date(formData.age);
      const today = new Date();
      if (dob > today) {
        newErrors.age = "Date of birth cannot be in the future";
        isValid = false;
      }
    }
    
    // Validate gender
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
      isValid = false;
    }
    
    // Validate diagnosis date
if (!formData.diagnosis_date) {
  newErrors.diagnosis_date = "Diagnosis date is required";
  isValid = false;
} else {
  const diagnosisDate = new Date(formData.diagnosis_date);
  const today = new Date();
  if (diagnosisDate > today) { // Check for future date instead of past date
    newErrors.diagnosis_date = "Diagnosis date cannot be in the future";
    isValid = false;
  }
}
    // Validate current medications
    if (!formData.current_medications.trim()) {
      newErrors.current_medications = "Current medications is required";
      isValid = false;
    }
    
    // Validate all questions are answered
    for (let i = 1; i <= 21; i++) {
      const fieldName = `q${i}_${getQuestionFieldName(i)}`;
      if (!formData[fieldName] || formData[fieldName] === 0) {
        newErrors[fieldName] = `Please answer question ${i}`;
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Get the field name part for each question
  const getQuestionFieldName = (questionNumber) => {
    const fieldNames = {
      1: "swelling",
      2: "rest_needed",
      3: "walking_difficulty",
      4: "going_out_difficulty",
      5: "shortness_of_breath",
      6: "fatigue",
      7: "burden_feeling",
      8: "loss_of_control",
      9: "worry",
      10: "concentration_issue",
      11: "depression",
      12: "social_difficulty",
      13: "work_difficulty",
      14: "hobby_difficulty",
      15: "sexual_difficulty",
      16: "sleep_difficulty",
      17: "hospitalization",
      18: "financial_burden",
      19: "treatment_side_effects",
      20: "management_quality",
      21: "overall_health"
    };
    return fieldNames[questionNumber] || "";
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    // For text fields, remove numbers
    if (type === 'text') {
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

  // Handle radio button changes for questions
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value)
    });
    
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
      // Convert Date of Birth (formData.age) to integer age in years
      let ageInt = null;
      if (formData.age) {
        const dob = new Date(formData.age);
        const todayDate = new Date();
        ageInt = todayDate.getFullYear() - dob.getFullYear();
        const m = todayDate.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && todayDate.getDate() < dob.getDate())) {
          ageInt -= 1;
        }
        if (ageInt < 0) ageInt = 0;
      }

      const submissionData = {
        ...formData,
        // Send integer age (years) as required by the API
        age: ageInt,
      };
      
      console.log("Final submission data:", submissionData);
      
      const response = await axios.post(API_URL, submissionData);
      console.log("API response:", response.data);
      setSubmitMessage("Your QOL assessment has been submitted successfully!");
      
      // Reset form after successful submission
      setFormData({
        patient_name: "",
        age: "",
        gender: "",
        diagnosis_date: "",
        current_medications: "",
        additional_comments: "",
        
        // Questions 1-6: Physical Health
        q1_swelling: 0,
        q2_rest_needed: 0,
        q3_walking_difficulty: 0,
        q4_going_out_difficulty: 0,
        q5_shortness_of_breath: 0,
        q6_fatigue: 0,
        
        // Questions 7-11: Emotional and Psychological Health
        q7_burden_feeling: 0,
        q8_loss_of_control: 0,
        q9_worry: 0,
        q10_concentration_issue: 0,
        q11_depression: 0,
        
        // Questions 12-15: Social and Functional Impact
        q12_social_difficulty: 0,
        q13_work_difficulty: 0,
        q14_hobby_difficulty: 0,
        q15_sexual_difficulty: 0,
        
        // Question 16: Sleep and Rest
        q16_sleep_difficulty: 0,
        
        // Questions 17-19: Self-Care and Treatment Burden
        q17_hospitalization: 0,
        q18_financial_burden: 0,
        q19_treatment_side_effects: 0,
        
        // Questions 20-21: General Health and Well-being
        q20_management_quality: 0,
        q21_overall_health: 0
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
          setSubmitMessage(`Error: ${error.response.data || 'An error occurred while submitting your assessment.'}`);
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

  // Get today's date in YYYY-MM-DD format for max attribute on age input
  const today = new Date().toISOString().split('T')[0];

  // Options for questions 1-19
  const options1to19 = [
    { label: "No", value: 1 },
    { label: "Very little", value: 2 },
    { label: "Little", value: 3 },
    { label: "Moderate", value: 4 },
    { label: "Quite a bit", value: 5 },
    { label: "Very much", value: 6 }
  ];

  // Options for question 20
  const options20 = [
    { label: "Very well", value: 1 },
    { label: "Well", value: 2 },
    { label: "Neutral", value: 3 },
    { label: "Poorly", value: 4 },
    { label: "Very poorly", value: 5 }
  ];

  // Options for question 21
  const options21 = [
    { label: "Very good", value: 1 },
    { label: "Good", value: 2 },
    { label: "Fair", value: 3 },
    { label: "Poor", value: 4 },
    { label: "Very poor", value: 5 }
  ];

  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className="about-bg">
        <div className="ayur-bread-content">
          <h2>QOL Form</h2>
          <div className="ayur-bread-list">
            <span>
              <Link to="/">Home</Link>
            </span>
            <span className="ayur-active-page">/ QOL Form</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us">
            <div className="consult-form-container">
              {/* Added heading with requested classes */}
              <div className="text-center mb-4">
                <h4 className='heading-extend'>Heart Failure Quality of Life (QOL) Assessment Questionnaire</h4>
                <div className='about-description'>Wellness Center and Speciality Clinic for Chronic Disorders</div>
              </div>
              
              {submitMessage ? (
                <div className={`alert ${submitMessage.includes('Error') ? 'alert-danger' : 'alert-success'} my-4`}>
                  {submitMessage}
                </div>
              ) : (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  {/* Patient Information Section */}
                  <div className="consult-form-step">
                    <h3 className="form-label">Patient Information</h3>
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
                        <Form.Group controlId="age">
                          <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="date" 
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            max={today} // Disable future dates
                            required
                            isInvalid={!!errors.age}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.age}
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
                        <Form.Group controlId="diagnosis_date">
                          <Form.Label>Diagnosis Date <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            type="date" 
                            name="diagnosis_date"
                            value={formData.diagnosis_date}
                            onChange={handleInputChange}
                            max={today} // Disable past dates
                            required
                            isInvalid={!!errors.diagnosis_date}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.diagnosis_date}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                      <div className="col-12 mb-3">
                        <Form.Group controlId="current_medications">
                          <Form.Label>Current Medications <span className="text-danger">*</span></Form.Label>
                          <Form.Control 
                            as="textarea"
                            rows={2}
                            name="current_medications"
                            value={formData.current_medications}
                            onChange={handleInputChange}
                            required
                            isInvalid={!!errors.current_medications}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.current_medications}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </div>
                  </div>

                  {/* Section 1: Physical Health */}
                  <div className="consult-form-step">
                    <h3 className="section-heading">Section 1: Physical Health</h3>
                    <div className="row">
                      {/* Question 1 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">1. Causing swelling in your ankles or legs? <span className="text-danger">*</span></label>
                        {errors.q1_swelling && <div className="text-danger mb-2">{errors.q1_swelling}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q1_swelling" 
                                value={option.value}
                                checked={formData.q1_swelling === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Question 2 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">2. Making you sit or lie down to rest during the day? <span className="text-danger">*</span></label>
                        {errors.q2_rest_needed && <div className="text-danger mb-2">{errors.q2_rest_needed}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q2_rest_needed" 
                                value={option.value}
                                checked={formData.q2_rest_needed === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Question 3 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">3. Making your walking about or climbing stairs difficult? <span className="text-danger">*</span></label>
                        {errors.q3_walking_difficulty && <div className="text-danger mb-2">{errors.q3_walking_difficulty}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q3_walking_difficulty" 
                                value={option.value}
                                checked={formData.q3_walking_difficulty === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Question 4 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">4. Making your going places away from home difficult? <span className="text-danger">*</span></label>
                        {errors.q4_going_out_difficulty && <div className="text-danger mb-2">{errors.q4_going_out_difficulty}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q4_going_out_difficulty" 
                                value={option.value}
                                checked={formData.q4_going_out_difficulty === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Question 5 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">5. Making you short of breath? <span className="text-danger">*</span></label>
                        {errors.q5_shortness_of_breath && <div className="text-danger mb-2">{errors.q5_shortness_of_breath}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q5_shortness_of_breath" 
                                value={option.value}
                                checked={formData.q5_shortness_of_breath === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Question 6 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">6. Making you tired, fatigued, or low on energy? <span className="text-danger">*</span></label>
                        {errors.q6_fatigue && <div className="text-danger mb-2">{errors.q6_fatigue}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q6_fatigue" 
                                value={option.value}
                                checked={formData.q6_fatigue === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Emotional and Psychological Health */}
                  <div className="consult-form-step">
                    <h3 className="section-heading">Section 2: Emotional and Psychological Health</h3>
                    <div className="row">
                      {/* Question 7 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">7. Making you feel you are a burden to your family or friends? <span className="text-danger">*</span></label>
                        {errors.q7_burden_feeling && <div className="text-danger mb-2">{errors.q7_burden_feeling}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q7_burden_feeling" 
                                value={option.value}
                                checked={formData.q7_burden_feeling === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Question 8 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">8. Making you feel a loss of self-control in your life? <span className="text-danger">*</span></label>
                        {errors.q8_loss_of_control && <div className="text-danger mb-2">{errors.q8_loss_of_control}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q8_loss_of_control" 
                                value={option.value}
                                checked={formData.q8_loss_of_control === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Question 9 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">9. Making you worry? <span className="text-danger">*</span></label>
                        {errors.q9_worry && <div className="text-danger mb-2">{errors.q9_worry}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q9_worry" 
                                value={option.value}
                                checked={formData.q9_worry === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Question 10 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">10. Making it difficult for you to concentrate or remember things? <span className="text-danger">*</span></label>
                        {errors.q10_concentration_issue && <div className="text-danger mb-2">{errors.q10_concentration_issue}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q10_concentration_issue" 
                                value={option.value}
                                checked={formData.q10_concentration_issue === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Question 11 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">11. Making you feel depressed? <span className="text-danger">*</span></label>
                        {errors.q11_depression && <div className="text-danger mb-2">{errors.q11_depression}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q11_depression" 
                                value={option.value}
                                checked={formData.q11_depression === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Social and Functional Impact */}
                  <div className="consult-form-step">
                    <h3 className="section-heading">Section 3: Social and Functional Impact</h3>
                    <div className="row">
                      {/* Question 12 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">12. Making your relating to or doing things with your friends or family difficult? <span className="text-danger">*</span></label>
                        {errors.q12_social_difficulty && <div className="text-danger mb-2">{errors.q12_social_difficulty}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q12_social_difficulty" 
                                value={option.value}
                                checked={formData.q12_social_difficulty === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Question 13 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">13. Making your working to earn a living difficult? <span className="text-danger">*</span></label>
                        {errors.q13_work_difficulty && <div className="text-danger mb-2">{errors.q13_work_difficulty}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q13_work_difficulty" 
                                value={option.value}
                                checked={formData.q13_work_difficulty === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Question 14 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">14. Making your recreational pastimes, sports, or hobbies difficult? <span className="text-danger">*</span></label>
                        {errors.q14_hobby_difficulty && <div className="text-danger mb-2">{errors.q14_hobby_difficulty}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q14_hobby_difficulty" 
                                value={option.value}
                                checked={formData.q14_hobby_difficulty === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Question 15 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">15. Making your sexual activities difficult? <span className="text-danger">*</span></label>
                        {errors.q15_sexual_difficulty && <div className="text-danger mb-2">{errors.q15_sexual_difficulty}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q15_sexual_difficulty" 
                                value={option.value}
                                checked={formData.q15_sexual_difficulty === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Sleep and Rest */}
                  <div className="consult-form-step">
                    <h3 className="section-heading">Section 4: Sleep and Rest</h3>
                    <div className="row">
                      {/* Question 16 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">16. Making your sleeping well at night difficult? <span className="text-danger">*</span></label>
                        {errors.q16_sleep_difficulty && <div className="text-danger mb-2">{errors.q16_sleep_difficulty}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q16_sleep_difficulty" 
                                value={option.value}
                                checked={formData.q16_sleep_difficulty === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Self-Care and Treatment Burden */}
                  <div className="consult-form-step">
                    <h3 className="section-heading">Section 5: Self-Care and Treatment Burden</h3>
                    <div className="row">
                      {/* Question 17 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">17. Making you stay in a hospital? <span className="text-danger">*</span></label>
                        {errors.q17_hospitalization && <div className="text-danger mb-2">{errors.q17_hospitalization}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q17_hospitalization" 
                                value={option.value}
                                checked={formData.q17_hospitalization === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Question 18 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">18. Costing you money for medical care? <span className="text-danger">*</span></label>
                        {errors.q18_financial_burden && <div className="text-danger mb-2">{errors.q18_financial_burden}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q18_financial_burden" 
                                value={option.value}
                                checked={formData.q18_financial_burden === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Question 19 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">19. Giving you side effects from treatments? <span className="text-danger">*</span></label>
                        {errors.q19_treatment_side_effects && <div className="text-danger mb-2">{errors.q19_treatment_side_effects}</div>}
                        <div className="simple-radio-container">
                          {options1to19.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q19_treatment_side_effects" 
                                value={option.value}
                                checked={formData.q19_treatment_side_effects === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 6: General Health and Well-being */}
                  <div className="consult-form-step">
                    <h3 className="section-heading">Section 6: General Health and Well-being</h3>
                    <div className="row">
                      {/* Question 20 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">20. In general, how well do you feel your heart failure is managed? <span className="text-danger">*</span></label>
                        {errors.q20_management_quality && <div className="text-danger mb-2">{errors.q20_management_quality}</div>}
                        <div className="simple-radio-container">
                          {options20.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q20_management_quality" 
                                value={option.value}
                                checked={formData.q20_management_quality === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      {/* Question 21 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">21. How would you rate your overall health? <span className="text-danger">*</span></label>
                        {errors.q21_overall_health && <div className="text-danger mb-2">{errors.q21_overall_health}</div>}
                        <div className="simple-radio-container">
                          {options21.map(option => (
                            <label key={option.value}>
                              <input 
                                type="radio" 
                                name="q21_overall_health" 
                                value={option.value}
                                checked={formData.q21_overall_health === option.value} 
                                onChange={handleRadioChange} 
                              /> 
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Comments Section */}
                  <div className="consult-form-step">
                    <h3 className="form-label">Additional Comments</h3>
                    <p className="mb-3">Please share any other concerns or experiences related to your heart failure and its impact on your quality of life:</p>
                    <div className="row">
                      <div className="col-12 mb-3">
                        <Form.Group controlId="additional_comments">
                          <Form.Control 
                            as="textarea"
                            rows={5}
                            name="additional_comments"
                            value={formData.additional_comments}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-navigation mt-4 d-flex justify-content-center">
                    <Button variant="success" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit QOL Assessment'}
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

export default QolForm;