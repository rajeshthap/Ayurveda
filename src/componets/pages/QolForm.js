import React, { useState } from "react";
import axios from "axios";
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
    
    if (!formData.patient_name.trim()) {
      newErrors.patient_name = "Patient name is required";
    }
    
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(formData.age) || formData.age <= 0) {
      newErrors.age = "Please enter a valid age";
    }
    
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    
    if (!formData.diagnosis_date) {
      newErrors.diagnosis_date = "Diagnosis date is required";
    }
    
    if (!formData.current_medications.trim()) {
      newErrors.current_medications = "Current medications is required";
    }
    
    // Validate all questions are answered
    for (let i = 1; i <= 21; i++) {
      const fieldName = `q${i}_${getQuestionFieldName(i)}`;
      if (!formData[fieldName] || formData[fieldName] === 0) {
        newErrors[fieldName] = `Please answer question ${i}`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        // Ensure age is a number
        age: parseInt(formData.age),
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

  // CSS for red asterisk
  const requiredAsterisk = <span className="text-danger">*</span>;

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
                <form onSubmit={handleSubmit}>
                  {/* Patient Information Section */}
                  <div className="consult-form-step">
                    <h3 className="form-label">Patient Information</h3>
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
                        <label htmlFor="age" className="form-label">Age {requiredAsterisk}</label>
                        <input
                          type="number"
                          className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                          id="age"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.age && <div className="invalid-feedback">{errors.age}</div>}
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
                        <label htmlFor="diagnosis_date" className="form-label">Diagnosis Date {requiredAsterisk}</label>
                        <input
                          type="date"
                          className={`form-control ${errors.diagnosis_date ? 'is-invalid' : ''}`}
                          id="diagnosis_date"
                          name="diagnosis_date"
                          value={formData.diagnosis_date}
                          onChange={handleInputChange}
                          required
                        />
                        {errors.diagnosis_date && <div className="invalid-feedback">{errors.diagnosis_date}</div>}
                      </div>
                      <div className="col-12 mb-3">
                        <label htmlFor="current_medications" className="form-label">Current Medications {requiredAsterisk}</label>
                        <textarea
                          className={`form-control ${errors.current_medications ? 'is-invalid' : ''}`}
                          id="current_medications"
                          name="current_medications"
                          value={formData.current_medications}
                          onChange={handleInputChange}
                          rows="2"
                          required
                        ></textarea>
                        {errors.current_medications && <div className="invalid-feedback">{errors.current_medications}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Section 1: Physical Health */}
                  <div className="consult-form-step">
                    <h3 className="section-heading">Section 1: Physical Health</h3>
                    <div className="row">
                      {/* Question 1 */}
                      <div className="col-12 mb-3">
                        <label className="form-label">1. Causing swelling in your ankles or legs?</label>
                        <div className="simple-radio-container">
                          {errors.q1_swelling && <div className="invalid-feedback d-block mb-2">{errors.q1_swelling}</div>}
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
                        <label className="form-label">2. Making you sit or lie down to rest during the day?</label>
                        <div className="simple-radio-container">
                          {errors.q2_rest_needed && <div className="invalid-feedback d-block mb-2">{errors.q2_rest_needed}</div>}
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
                        <label className="form-label">3. Making your walking about or climbing stairs difficult?</label>
                        <div className="simple-radio-container">
                          {errors.q3_walking_difficulty && <div className="invalid-feedback d-block mb-2">{errors.q3_walking_difficulty}</div>}
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
                        <label className="form-label">4. Making your going places away from home difficult?</label>
                        <div className="simple-radio-container">
                          {errors.q4_going_out_difficulty && <div className="invalid-feedback d-block mb-2">{errors.q4_going_out_difficulty}</div>}
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
                        <label className="form-label">5. Making you short of breath?</label>
                        <div className="simple-radio-container">
                          {errors.q5_shortness_of_breath && <div className="invalid-feedback d-block mb-2">{errors.q5_shortness_of_breath}</div>}
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
                        <label className="form-label">6. Making you tired, fatigued, or low on energy?</label>
                        <div className="simple-radio-container">
                          {errors.q6_fatigue && <div className="invalid-feedback d-block mb-2">{errors.q6_fatigue}</div>}
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
                        <label className="form-label">7. Making you feel you are a burden to your family or friends?</label>
                        <div className="simple-radio-container">
                          {errors.q7_burden_feeling && <div className="invalid-feedback d-block mb-2">{errors.q7_burden_feeling}</div>}
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
                        <label className="form-label">8. Making you feel a loss of self-control in your life?</label>
                        <div className="simple-radio-container">
                          {errors.q8_loss_of_control && <div className="invalid-feedback d-block mb-2">{errors.q8_loss_of_control}</div>}
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
                        <label className="form-label">9. Making you worry?</label>
                        <div className="simple-radio-container">
                          {errors.q9_worry && <div className="invalid-feedback d-block mb-2">{errors.q9_worry}</div>}
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
                        <label className="form-label">10. Making it difficult for you to concentrate or remember things?</label>
                        <div className="simple-radio-container">
                          {errors.q10_concentration_issue && <div className="invalid-feedback d-block mb-2">{errors.q10_concentration_issue}</div>}
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
                        <label className="form-label">11. Making you feel depressed?</label>
                        <div className="simple-radio-container">
                          {errors.q11_depression && <div className="invalid-feedback d-block mb-2">{errors.q11_depression}</div>}
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
                        <label className="form-label">12. Making your relating to or doing things with your friends or family difficult?</label>
                        <div className="simple-radio-container">
                          {errors.q12_social_difficulty && <div className="invalid-feedback d-block mb-2">{errors.q12_social_difficulty}</div>}
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
                        <label className="form-label">13. Making your working to earn a living difficult?</label>
                        <div className="simple-radio-container">
                          {errors.q13_work_difficulty && <div className="invalid-feedback d-block mb-2">{errors.q13_work_difficulty}</div>}
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
                        <label className="form-label">14. Making your recreational pastimes, sports, or hobbies difficult?</label>
                        <div className="simple-radio-container">
                          {errors.q14_hobby_difficulty && <div className="invalid-feedback d-block mb-2">{errors.q14_hobby_difficulty}</div>}
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
                        <label className="form-label">15. Making your sexual activities difficult?</label>
                        <div className="simple-radio-container">
                          {errors.q15_sexual_difficulty && <div className="invalid-feedback d-block mb-2">{errors.q15_sexual_difficulty}</div>}
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
                        <label className="form-label">16. Making your sleeping well at night difficult?</label>
                        <div className="simple-radio-container">
                          {errors.q16_sleep_difficulty && <div className="invalid-feedback d-block mb-2">{errors.q16_sleep_difficulty}</div>}
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
                        <label className="form-label">17. Making you stay in a hospital?</label>
                        <div className="simple-radio-container">
                          {errors.q17_hospitalization && <div className="invalid-feedback d-block mb-2">{errors.q17_hospitalization}</div>}
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
                        <label className="form-label">18. Costing you money for medical care?</label>
                        <div className="simple-radio-container">
                          {errors.q18_financial_burden && <div className="invalid-feedback d-block mb-2">{errors.q18_financial_burden}</div>}
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
                        <label className="form-label">19. Giving you side effects from treatments?</label>
                        <div className="simple-radio-container">
                          {errors.q19_treatment_side_effects && <div className="invalid-feedback d-block mb-2">{errors.q19_treatment_side_effects}</div>}
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
                        <label className="form-label">20. In general, how well do you feel your heart failure is managed?</label>
                        <div className="simple-radio-container">
                          {errors.q20_management_quality && <div className="invalid-feedback d-block mb-2">{errors.q20_management_quality}</div>}
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
                        <label className="form-label">21. How would you rate your overall health?</label>
                        <div className="simple-radio-container">
                          {errors.q21_overall_health && <div className="invalid-feedback d-block mb-2">{errors.q21_overall_health}</div>}
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
                        <textarea
                          className={`form-control ${errors.additional_comments ? 'is-invalid' : ''}`}
                          id="additional_comments"
                          name="additional_comments"
                          value={formData.additional_comments}
                          onChange={handleInputChange}
                          rows="5"
                        ></textarea>
                        {errors.additional_comments && <div className="invalid-feedback">{errors.additional_comments}</div>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-navigation mt-4 d-flex justify-content-center">
                    <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit QOL Assessment'}
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

export default QolForm;