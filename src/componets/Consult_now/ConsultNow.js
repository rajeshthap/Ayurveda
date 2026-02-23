import React, { useState, useEffect } from "react";
import axios from "axios";
import BgShape2 from "../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../assets/images/bg-leaf2.png";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function ConsultNow() {
  const location = useLocation();
  // API endpoints 
  const API_URL_SECTION1 = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/online-consult-section-1/";
  const API_URL_SECTION2 = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/online-consult-section-2/";
  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  const todayDate = getTodayDate();
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Form data state (Section 1 and Section 2 fields)
  const [formData, setFormData] = useState({
    // Section 1 - Personal Information
    full_name: "",
    date_of_birth: "",
    gender: "",
    height: "",
    weight: "",
    occupation: "",
    marital_status: "",
    address: "",
    email: "",
    mobile_number: "",
    alternate_number: "",
    city: "",
    pin: "",
    state: "",
    country: "",
    references: "",
    // Section 2 - Medical Information
    consult_id: "",
    main_disease_problem: "",
    associated_complications: "",
    mode_of_onset: "",
    problem_start_description: "",
    progression_over_time: "",
    significant_health_events: "",
    past_medications: "",
    medical_history: "",
    hospitalizations: "",
    surgeries: "",
    accidents: "",
    disease_history: [],
     other_chronic_disease: "",
    diagnosing_doctor_name: "",
    hospital_clinic_name: "",
    city: "",
    date_of_diagnosis: "",
    medical_reports: ""
  });

  // Extract email from query parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    if (email) {
      setFormData(prev => ({
        ...prev,
        email: decodeURIComponent(email)
      }));
    }
  }, [location.search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('diseaseHistoryDropdown');
      if (dropdown && !dropdown.contains(event.target) && !event.target.closest('.dropdown-menu')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Validate Personal Information
  const validatePersonalInfo = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }
    
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    }
    
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    
    if (!formData.height.trim()) {
      newErrors.height = "Height is required";
    }
    
    if (!formData.weight.trim()) {
      newErrors.weight = "Weight is required";
    }
    
    if (!formData.occupation.trim()) {
      newErrors.occupation = "Occupation is required";
    }
    
    if (!formData.marital_status) {
      newErrors.marital_status = "Marital status is required";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile_number.replace(/\s/g, ""))) {
      newErrors.mobile_number = "Mobile number must be 10 digits";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!formData.pin.trim()) {
      newErrors.pin = "PIN code is required";
    } else if (!/^\d{6}$/.test(formData.pin.replace(/\s/g, ""))) {
      newErrors.pin = "PIN code must be 6 digits";
    }
    
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }
    
    if (!formData.references.trim()) {
      newErrors.references = "References is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Medical Information (Section 2)
  const validateMedicalInfo = () => {
    const newErrors = {};
    
    if (!formData.consult_id) {
      newErrors.consult_id = "Consultation type is required";
    }
    
    if (!formData.main_disease_problem.trim()) {
      newErrors.main_disease_problem = "Main disease problem is required";
    }
    
    if (!formData.mode_of_onset) {
      newErrors.mode_of_onset = "Mode of onset is required";
    }
    
    if (!formData.problem_start_description.trim()) {
      newErrors.problem_start_description = "Problem start description is required";
    }
    
    if (!formData.progression_over_time.trim()) {
      newErrors.progression_over_time = "Progression over time is required";
    }
    
    if (!formData.medical_history.trim()) {
      newErrors.medical_history = "Medical history is required";
    }
    
    if (formData.disease_history.length === 0) {
      newErrors.disease_history = "Disease history is required";
    }
    
    if (!formData.diagnosing_doctor_name.trim()) {
      newErrors.diagnosing_doctor_name = "Diagnosing doctor name is required";
    }
    
    if (!formData.hospital_clinic_name.trim()) {
      newErrors.hospital_clinic_name = "Hospital/clinic name is required";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!formData.date_of_diagnosis) {
      newErrors.date_of_diagnosis = "Date of diagnosis is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   // Handle input changes
  const handleInputChange = (e) => {
    const { name, type, files } = e.target;
    
    if (type === "file" && files && files.length > 0) {
      // For file inputs, handle the file object
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      // For other inputs, handle value normally
      let updatedValue = e.target.value;
      
      // Remove numbers from full name field
      if (name === "full_name") {
        updatedValue = updatedValue.replace(/[0-9]/g, "");
      }
      
      // Remove numbers from occupation field
      if (name === "occupation") {
        updatedValue = updatedValue.replace(/[0-9]/g, "");
      }
      
      setFormData({
        ...formData,
        [name]: updatedValue
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
    setIsSubmitting(true);
    
    try {
      // Log the form data to debug
      console.log("Submitting form data:", formData);
      
      // Create FormData object for file upload
      const submissionData = new FormData();
      
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === "disease_history") {
          // Handle array field specially - send as JSON
          submissionData.append(key, JSON.stringify(formData[key]));
        } else if (key === "medical_reports" && formData[key]) {
          // Handle file field specially
          submissionData.append(key, formData[key]);
        } else {
          submissionData.append(key, formData[key]);
        }
      });
      
      console.log("Final submission data:", submissionData);
      
      // Submit to Section 2 API with appropriate headers
      const response = await axios.post(API_URL_SECTION2, submissionData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("API response:", response.data);
      setSubmitMessage("Your consultation request has been submitted successfully!");
      
      // Reset form after successful submission
      setFormData({
        // Section 1 - Personal Information
        full_name: "",
        date_of_birth: "",
        gender: "",
        height: "",
        weight: "",
        occupation: "",
        marital_status: "",
        address: "",
        email: "",
        mobile_number: "",
        alternate_number: "",
        city: "",
        pin: "",
        state: "",
        country: "",
        references: "",
        // Section 2 - Medical Information
        consult_id: "",
        main_disease_problem: "",
        associated_complications: "",
        mode_of_onset: "",
        problem_start_description: "",
        progression_over_time: "",
        significant_health_events: "",
        past_medications: "",
        medical_history: "",
        hospitalizations: "",
        surgeries: "",
        accidents: "",
        disease_history: [],
         other_chronic_disease: "",
        diagnosing_doctor_name: "",
        hospital_clinic_name: "",
        date_of_diagnosis: "",
        medical_reports: ""
      });
      setCurrentStep(1);
      setCompletedSteps([]);
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // More detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
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
            
            // Set field-specific error for email duplicate error
            if (field === 'email') {
              setErrors(prev => ({
                ...prev,
                [field]: error.response.data[field]
              }));
            }
          }
          setSubmitMessage(`Error: ${errorMessages.join('; ')}`);
        } else {
          setSubmitMessage(`Error: ${error.response.data || 'An error occurred while submitting your request.'}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Request error:", error.request);
        setSubmitMessage("No response from server. Please try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        setSubmitMessage(`Error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate to next step or submit form if on last step
  const nextStep = async () => {
    if (currentStep === 1) {
      // Validate Section 1 before submitting
      if (!validatePersonalInfo()) {
        return;
      }
      
      setIsSubmitting(true);
      
      try {
         // Submit Section 1 data
        const section1Data = new FormData();
        section1Data.append("full_name", formData.full_name);
        section1Data.append("date_of_birth", formData.date_of_birth);
        section1Data.append("gender", formData.gender);
        section1Data.append("height", formData.height);
        section1Data.append("weight", formData.weight);
        section1Data.append("occupation", formData.occupation);
        section1Data.append("marital_status", formData.marital_status);
        section1Data.append("address", formData.address);
        section1Data.append("email", formData.email);
        section1Data.append("mobile_number", formData.mobile_number);
        section1Data.append("alternate_number", formData.alternate_number);
        section1Data.append("city", formData.city);
        section1Data.append("pin", formData.pin);
        section1Data.append("state", formData.state);
        section1Data.append("country", formData.country);
        section1Data.append("references", formData.references);
        
        console.log("Submitting Section 1 data:", section1Data);
        const response = await axios.post(API_URL_SECTION1, section1Data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        console.log("Section 1 API response:", response.data);
        
        // Show success alert
        setSubmitMessage("Your consultation request has been submitted successfully!");
        
        // Mark section 1 as completed
        setCompletedSteps(prev => [...prev, 1]);
        
        // Auto navigate to section 2 after a short delay
        setTimeout(() => {
          setCurrentStep(2);
          // Clear message after navigation
          setSubmitMessage("");
        }, 2000);
        
      } catch (error) {
        console.error("Error submitting Section 1:", error);
        
        // Handle error
        let errorMessage = "Error submitting section 1. Please try again.";
        if (error.response) {
          if (error.response.data && typeof error.response.data === 'object') {
            const errorMessages = [];
            for (const field in error.response.data) {
              if (Array.isArray(error.response.data[field])) {
                errorMessages.push(`${field}: ${error.response.data[field].join(', ')}`);
              } else {
                errorMessages.push(`${field}: ${error.response.data[field]}`);
              }
              
              if (field === 'email') {
                setErrors(prev => ({
                  ...prev,
                  [field]: error.response.data[field]
                }));
              }
            }
            errorMessage = `Error: ${errorMessages.join('; ')}`;
          } else {
            errorMessage = `Error: ${error.response.data || 'An error occurred while submitting your request.'}`;
          }
        } else if (error.request) {
          errorMessage = "No response from server. Please try again.";
        } else {
          errorMessage = `Error: ${error.message}`;
        }
        
        setSubmitMessage(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep === 2) {
      // Validate Section 2 before submitting
      if (!validateMedicalInfo()) {
        return;
      }
      
      // Mark section 2 as completed
      setCompletedSteps(prev => [...prev, 2]);
      
      // Auto navigate to section 3
      setTimeout(() => {
        setCurrentStep(3);
      }, 2000);
    } else if (currentStep === 3) {
      // Mark section 3 as completed
      setCompletedSteps(prev => [...prev, 3]);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Mark section 4 as completed
      setCompletedSteps(prev => [...prev, 4]);
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Mark section 5 as completed
      setCompletedSteps(prev => [...prev, 5]);
      setCurrentStep(6);
     } else if (currentStep === 6) {
      // Call handleSubmit to submit both sections
      const fakeEvent = { preventDefault: () => {} };
      await handleSubmit(fakeEvent);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Render Primary Health Concern Step (Section 2)
  const renderMedicalInfo = () => (
    <div className="consult-form-step main-headin-form">
      <h5 className="">SECTION 2 — PRIMARY HEALTH CONCERN</h5>
      <div className="row mt-3">
       
        <h3>Chief Complaint</h3>
        <div className="col-lg-4 mb-3 col-md-4 col-sm-12">
          <label htmlFor="main_disease_problem" className="form-label">
           Main disease/problem with duration <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.main_disease_problem ? 'is-invalid' : ''}`}
            id="main_disease_problem"
            name="main_disease_problem"
            value={formData.main_disease_problem}
            onChange={handleInputChange}
            rows="3"
            placeholder="e.g., Type 2 Diabetes for 5 years"
          ></textarea>
          {errors.main_disease_problem && <div className="invalid-feedback">{errors.main_disease_problem}</div>}
        </div>
        <div className="col-lg-4 mb-4 col-md-6 col-sm-12">
          <label htmlFor="associated_complications" className="form-label">
            Associated complications or conditions
          </label>
          <textarea
            className={`form-control ${errors.associated_complications ? 'is-invalid' : ''}`}
            id="associated_complications"
            name="associated_complications"
            value={formData.associated_complications}
            onChange={handleInputChange}
            rows="3"
            placeholder="e.g., Mild neuropathy and high cholesterol"
          ></textarea>
          {errors.associated_complications && <div className="invalid-feedback">{errors.associated_complications}</div>}
        </div>
        <h3>History of Present Illness</h3>
        <div className="col-lg-4 mb-3 col-md-4 col-sm-12">
          <label htmlFor="mode_of_onset" className="form-label">
            Mode of Onset <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errors.mode_of_onset ? 'is-invalid' : ''}`}
            id="mode_of_onset"
            name="mode_of_onset"
            value={formData.mode_of_onset}
            onChange={handleInputChange}
          >
            <option value="">Select Mode</option>
            <option value="gradual">Gradual</option>
            <option value="sudden">Sudden</option>
          
          </select>
          {errors.mode_of_onset && <div className="invalid-feedback">{errors.mode_of_onset}</div>}
        </div>
        
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="problem_start_description" className="form-label">
            How did the problem start ? <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.problem_start_description ? 'is-invalid' : ''}`}
            id="problem_start_description"
            name="problem_start_description"
            value={formData.problem_start_description}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g., Started with frequent urination and fatigue"
          ></textarea>
          {errors.problem_start_description && <div className="invalid-feedback">{errors.problem_start_description}</div>}
        </div>
        <div className="col-12 mb-3">
          <label htmlFor="progression_over_time" className="form-label">
           How has it progressed over time ? <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.progression_over_time ? 'is-invalid' : ''}`}
            id="progression_over_time"
            name="progression_over_time"
            value={formData.progression_over_time}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g., Symptoms gradually worsened over 2 years"
          ></textarea>
          {errors.progression_over_time && <div className="invalid-feedback">{errors.progression_over_time}</div>}
        </div>
        <h5>Section 3 Medical History</h5>
        <h3>  Past Medical History: Please specify if applicable</h3>
        <div className="col-12 mb-3">
          <label htmlFor="significant_health_events" className="form-label">
            Other Significant health events
          </label>
          <textarea
            className={`form-control ${errors.significant_health_events ? 'is-invalid' : ''}`}
            id="significant_health_events"
            name="significant_health_events"
            value={formData.significant_health_events}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g., Hospitalized once due to high blood sugar levels"
          ></textarea>
          {errors.significant_health_events && <div className="invalid-feedback">{errors.significant_health_events}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="past_medications" className="form-label">
          Current or past medications
          </label>
          <textarea
            className={`form-control ${errors.past_medications ? 'is-invalid' : ''}`}
            id="past_medications"
            name="past_medications"
            value={formData.past_medications}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g., Metformin 500mg twice daily"
          ></textarea>
          {errors.past_medications && <div className="invalid-feedback">{errors.past_medications}</div>}
        </div>
      
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="hospitalizations" className="form-label">
            Hospitalizations
          </label>
          <textarea
            className={`form-control ${errors.hospitalizations ? 'is-invalid' : ''}`}
            id="hospitalizations"
            name="hospitalizations"
            value={formData.hospitalizations}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g., Admitted in 2022 for 3 days"
          ></textarea>
          {errors.hospitalizations && <div className="invalid-feedback">{errors.hospitalizations}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="surgeries" className="form-label">
            Surgeries
          </label>
          <textarea
            className={`form-control ${errors.surgeries ? 'is-invalid' : ''}`}
            id="surgeries"
            name="surgeries"
            value={formData.surgeries}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g., Appendix surgery in 2015"
          ></textarea>
          {errors.surgeries && <div className="invalid-feedback">{errors.surgeries}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="accidents" className="form-label">
            Accidents
          </label>
          <textarea
            className={`form-control ${errors.accidents ? 'is-invalid' : ''}`}
            id="accidents"
            name="accidents"
            value={formData.accidents}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g., Minor road accident in 2020"
          ></textarea>
          {errors.accidents && <div className="invalid-feedback">{errors.accidents}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="disease_history" className="form-label">
           Family / Personal Disease History <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button 
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.disease_history ? 'is-invalid' : ''}`} 
              type="button" 
              id="diseaseHistoryDropdown" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
            >
              {formData.disease_history.length > 0 
                ? `${formData.disease_history.length} disease(s) selected` 
                : 'Select disease(s)'}
            </button>
            {isDropdownOpen && (
              <ul className="dropdown-menu show w-100 p-2" aria-labelledby="diseaseHistoryDropdown">
  {[
    { value: "Diabetes", label: "Diabetes" },
    { value: "Hypertension", label: "Hypertension" },
    { value: "Cancer", label: "Cancer" },
    { value: "Tuberculosis", label: "Tuberculosis" },
    { value: "Memory Disorders", label: "Memory disorders" },
    { value: "Acidity_Flatulence", label: "Acidity/Flatulence" },
    { value: "Other_Chronic_Disease", label: "Any other chronic disease" }
  ].map(disease => (
    <li key={disease.value} className="mb-2">
      <div className="form-check">
        <input 
          className="form-check-input" 
          type="checkbox" 
          id={`disease-${disease.value}`}
          value={disease.value}
          checked={formData.disease_history.includes(disease.value)}
          onChange={(e) => {
            let updatedDiseases;
            if (e.target.checked) {
              updatedDiseases = [...formData.disease_history, disease.value];
            } else {
              updatedDiseases = formData.disease_history.filter(d => d !== disease.value);
            }
            setFormData(prev => ({
              ...prev,
              disease_history: updatedDiseases
            }));
            if (errors.disease_history) {
              setErrors({
                ...errors,
                disease_history: ""
              });
            }
          }}
        />
        <label className="form-check-label" htmlFor={`disease-${disease.value}`}>
          {disease.label}
        </label>
      </div>
    </li>
  ))}
</ul>
            )}
          </div>
          {errors.disease_history && <div className="invalid-feedback">{errors.disease_history}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="other_chronic_disease" className="form-label">
            Other Chronic Diseases
          </label>
          <input
            type="text"
            className={`form-control ${errors.other_chronic_disease ? 'is-invalid' : ''}`}
            id="other_chronic_disease"
            name="other_chronic_disease"
            value={formData.other_chronic_disease}
            onChange={handleInputChange}
            placeholder="e.g., None"
          />
          {errors.other_chronic_disease && <div className="invalid-feedback">{errors.other_chronic_disease}</div>}
        </div>
        <h5> Section 4 DIAGNOSTIC DETAILS</h5>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="diagnosing_doctor_name" className="form-label">
            Diagnosing Doctor Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.diagnosing_doctor_name ? 'is-invalid' : ''}`}
            id="diagnosing_doctor_name"
            name="diagnosing_doctor_name"
            value={formData.diagnosing_doctor_name}
            onChange={handleInputChange}
            placeholder="e.g., Dr. Amit Sharma"
          />
          {errors.diagnosing_doctor_name && <div className="invalid-feedback">{errors.diagnosing_doctor_name}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="hospital_clinic_name" className="form-label">
            Hospital/Clinic Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.hospital_clinic_name ? 'is-invalid' : ''}`}
            id="hospital_clinic_name"
            name="hospital_clinic_name"
            value={formData.hospital_clinic_name}
            onChange={handleInputChange}
            placeholder="e.g., City Care Hospital"
          />
          {errors.hospital_clinic_name && <div className="invalid-feedback">{errors.hospital_clinic_name}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="city" className="form-label">
            City <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="e.g., Delhi"
          />
          {errors.city && <div className="invalid-feedback">{errors.city}</div>}
        </div>
         <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="date_of_diagnosis" className="form-label">
            Date of Diagnosis <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className={`form-control ${errors.date_of_diagnosis ? 'is-invalid' : ''}`}
            id="date_of_diagnosis"
            name="date_of_diagnosis"
            value={formData.date_of_diagnosis}
            onChange={handleInputChange}
            max={todayDate}
          />
          {errors.date_of_diagnosis && <div className="invalid-feedback">{errors.date_of_diagnosis}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="medical_reports" className="form-label">
            Medical Reports 
          </label>
          <input
            type="file"
            className={`form-control ${errors.medical_reports ? 'is-invalid' : ''}`}
            id="medical_reports"
            name="medical_reports"
            onChange={handleInputChange}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          {errors.medical_reports && <div className="invalid-feedback">{errors.medical_reports}</div>}
        </div>
          <div className="col-lg-4 mb-3 col-md-6 col-sm-12 medical-report" >
          <label htmlFor="medical_reports" className="form-label">
            Medical Reports 
          </label>
          <strong>Important:</strong> Please combine all your documents into a <strong>single PDF file</strong> before uploading.
    <br />
    <p>This includes: Discharge summary, Test reports, Treatment Details, Past treatments, and Current treatments.</p>
         
        
        </div>
      </div>
    </div>
  );

  // Render Personal Information Step
  const renderPersonalInfo = () => (
    <div className="consult-form-step">
      <h3 className="step-title">PERSONAL INFORMATION</h3>
      <div className="row">
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="full_name" className="form-label">
            Full Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            required
          />
          {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="date_of_birth" className="form-label">
            Date of Birth <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className={`form-control ${errors.date_of_birth ? 'is-invalid' : ''}`}
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            max={todayDate}
            required
          />
          {errors.date_of_birth && <div className="invalid-feedback">{errors.date_of_birth}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="gender" className="form-label">
            Gender <span className="text-danger">*</span>
          </label>
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
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="height" className="form-label">
            Feet and Inches <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            className={`form-control ${errors.height ? 'is-invalid' : ''}`}
            id="height"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            placeholder="e.g., 172.50"
          />
          {errors.height && <div className="invalid-feedback">{errors.height}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="weight" className="form-label">
            Weight (kg) <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            className={`form-control ${errors.weight ? 'is-invalid' : ''}`}
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="e.g., 70.25 kg"
          />
          {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="occupation" className="form-label">
            Occupation <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.occupation ? 'is-invalid' : ''}`}
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
          />
          {errors.occupation && <div className="invalid-feedback">{errors.occupation}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="marital_status" className="form-label">
            Marital Status <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errors.marital_status ? 'is-invalid' : ''}`}
            id="marital_status"
            name="marital_status"
            value={formData.marital_status}
            onChange={handleInputChange}
          >
            <option value="">Select Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
          {errors.marital_status && <div className="invalid-feedback">{errors.marital_status}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="email" className="form-label">
            Email <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="mobile_number" className="form-label">
            Mobile Number <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.mobile_number ? 'is-invalid' : ''}`}
            id="mobile_number"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleInputChange}
            required
            placeholder="e.g., 9876543210"
          />
          {errors.mobile_number && <div className="invalid-feedback">{errors.mobile_number}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="alternate_number" className="form-label">
            Alternate Number
          </label>
          <input
            type="text"
            className={`form-control ${errors.alternate_number ? 'is-invalid' : ''}`}
            id="alternate_number"
            name="alternate_number"
            value={formData.alternate_number}
            onChange={handleInputChange}
            placeholder="e.g., 9123456780"
          />
          {errors.alternate_number && <div className="invalid-feedback">{errors.alternate_number}</div>}
        </div>
        <div className="col-8 mb-3">
          <label htmlFor="address" className="form-label">
           Complete Address Postal <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows="3"
            placeholder="e.g., 123 MG Road, Near City Mall"
          ></textarea>
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="city" className="form-label">
            City <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="e.g., Bangalore"
          />
          {errors.city && <div className="invalid-feedback">{errors.city}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="pin" className="form-label">
            PIN Code <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.pin ? 'is-invalid' : ''}`}
            id="pin"
            name="pin"
            value={formData.pin}
            onChange={handleInputChange}
            placeholder="e.g., 560001"
          />
          {errors.pin && <div className="invalid-feedback">{errors.pin}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="state" className="form-label">
            State <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.state ? 'is-invalid' : ''}`}
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="e.g., Karnataka"
          />
          {errors.state && <div className="invalid-feedback">{errors.state}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="country" className="form-label">
            Country <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.country ? 'is-invalid' : ''}`}
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="e.g., India"
          />
          {errors.country && <div className="invalid-feedback">{errors.country}</div>}
        </div>
       
      
        
        {/* New fields */}
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="references" className="form-label">
            Reference <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errors.references ? 'is-invalid' : ''}`}
            id="references"
            name="references"
            value={formData.references}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Reference</option>
            <option value="Friends or Relatives">Friends or Relatives</option>
            <option value="Internet">Internet</option>
            <option value="Other">Other</option>
          </select>
          {errors.references && <div className="invalid-feedback">{errors.references}</div>}
        </div>
       
      </div>
    </div>
  );



  // Render Medical History Step (Section 3)
  const renderPastTreatment = () => (
    <div className="consult-form-step">
      <h3 className="step-title">SECTION 3 — MEDICAL HISTORY</h3>
      <div className="row">
        <div className="col-12 mb-4">
          <h5 className="sub-title">Treatment 1</h5>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="past_treatment_1_doctor_name" className="form-label">Doctor Name</label>
          <input
            type="text"
            className="form-control"
            id="past_treatment_1_doctor_name"
            name="past_treatment_1_doctor_name"
            value={formData.past_treatment_1_doctor_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="past_treatment_1_hospital_name" className="form-label">Hospital Name</label>
          <input
            type="text"
            className="form-control"
            id="past_treatment_1_hospital_name"
            name="past_treatment_1_hospital_name"
            value={formData.past_treatment_1_hospital_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="past_treatment_1_place" className="form-label">Place</label>
          <input
            type="text"
            className="form-control"
            id="past_treatment_1_place"
            name="past_treatment_1_place"
            value={formData.past_treatment_1_place}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="past_treatment_1_date" className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            id="past_treatment_1_date"
            name="past_treatment_1_date"
            value={formData.past_treatment_1_date}
            onChange={handleInputChange}
          />
          <small className="form-text text-muted">Leave empty if not applicable</small>
        </div>
        <div className="col-12 mb-3">
          <label htmlFor="past_treatment_1_details" className="form-label">Treatment Details</label>
          <textarea
            className="form-control"
            id="past_treatment_1_details"
            name="past_treatment_1_details"
            value={formData.past_treatment_1_details}
            onChange={handleInputChange}
            rows="3"
          ></textarea>
        </div>
        
        <div className="col-12 mb-4">
          <h5 className="sub-title">Treatment 2</h5>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="past_treatment_2_doctor_name" className="form-label">Doctor Name</label>
          <input
            type="text"
            className="form-control"
            id="past_treatment_2_doctor_name"
            name="past_treatment_2_doctor_name"
            value={formData.past_treatment_2_doctor_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="past_treatment_2_hospital_name" className="form-label">Hospital Name</label>
          <input
            type="text"
            className="form-control"
            id="past_treatment_2_hospital_name"
            name="past_treatment_2_hospital_name"
            value={formData.past_treatment_2_hospital_name}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="past_treatment_2_place" className="form-label">Place</label>
          <input
            type="text"
            className="form-control"
            id="past_treatment_2_place"
            name="past_treatment_2_place"
            value={formData.past_treatment_2_place}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="past_treatment_2_date" className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            id="past_treatment_2_date"
            name="past_treatment_2_date"
            value={formData.past_treatment_2_date}
            onChange={handleInputChange}
          />
          <small className="form-text text-muted">Leave empty if not applicable</small>
        </div>
        <div className="col-12 mb-3">
          <label htmlFor="past_treatment_2_details" className="form-label">Treatment Details</label>
          <textarea
            className="form-control"
            id="past_treatment_2_details"
            name="past_treatment_2_details"
            value={formData.past_treatment_2_details}
            onChange={handleInputChange}
            rows="3"
          ></textarea>
        </div>
        
        <div className="col-12 mb-3">
          <label htmlFor="current_treatment" className="form-label">Current Treatment</label>
          <textarea
            className="form-control"
            id="current_treatment"
            name="current_treatment"
            value={formData.current_treatment}
            onChange={handleInputChange}
            rows="3"
          ></textarea>
        </div>
      </div>
    </div>
  );

  // Render Diagnostic Details Step (Section 4)
  const renderPhysicalExamination = () => (
    <div className="consult-form-step">
      <h3 className="step-title">SECTION 4 — DIAGNOSTIC DETAILS</h3>
      <div className="row">
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="life_style" className="form-label">Life-style</label>
          <select
            className="form-select"
            id="life_style"
            name="life_style"
            value={formData.life_style}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One[Life-style of patient (before and after diagnosis)]</option>
            <option>Dietary habits-Smoking/Non-veg./Alcohol/Tobacco/Any other/Not applicable</option>
            <option>Physical activity – Any workout (please specify)</option>
            <option>Mental activity</option>
            <option>Social interactions</option>
            <option>Any Other</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="body_built" className="form-label">Body Built</label>
          <select
            className="form-select"
            id="body_built"
            name="body_built"
            value={formData.body_built}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Body Built)</option>
            <option>Thin</option>
            <option>Medium</option>
            <option>Well built</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="complexion" className="form-label">Complexion</label>
          <select
            className="form-select"
            id="complexion"
            name="complexion"
            value={formData.complexion}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Complexion)</option>
            <option>Fair</option>
            <option>Dusky</option>
            <option>Dark</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="skin_nature" className="form-label">Skin Nature</label>
          <select
            className="form-select"
            id="skin_nature"
            name="skin_nature"
            value={formData.skin_nature}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Skin Nature)</option>
            <option>Dry</option>
            <option>Oily</option>
            <option>Normal</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="hair_nature" className="form-label">Nature of Hair</label>
          <select
            className="form-select"
            id="hair_nature"
            name="hair_nature"
            value={formData.hair_nature}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Nature of Hair)</option>
            <option>Dry/Rough</option>
            <option>Oily/Silky</option>
            <option>Thick</option>
            <option>Thin</option>
            <option>Premature graying/balding</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="joint_characteristics" className="form-label">Joint characteristics</label>
          <select
            className="form-select"
            id="joint_characteristics"
            name="joint_characteristics"
            value={formData.joint_characteristics}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Joint characteristics)</option>
            <option>Emits sound</option>
            <option>Hot to touch</option>
            <option>Soft and flabby</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="veins_tendons" className="form-label">Appearance of veins and tendons</label>
          <select
            className="form-select"
            id="veins_tendons"
            name="veins_tendons"
            value={formData.veins_tendons}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Appearance of veins and tendons)</option>
            <option>Prominent</option>
            <option>Normal</option>
            <option>Not prominent</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="temperature_preference" className="form-label">Temperature preferences</label>
          <select
            className="form-select"
            id="temperature_preference"
            name="temperature_preference"
            value={formData.temperature_preference}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Temperature preferences)</option>
            <option>Cannot tolerate cold</option>
            <option>Cannot tolerate heat</option>
            <option>Can tolerate both</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="patient_body_temperature" className="form-label">Patient's body is</label>
          <select
            className="form-select"
            id="patient_body_temperature"
            name="patient_body_temperature"
            value={formData.patient_body_temperature}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Patient's body is)</option>
            <option>Cold to touch/lowered temperature</option>
            <option>Hot to touch/raised temperature</option>
            <option>Normal</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="eye_condition" className="form-label">Eye</label>
          <select
            className="form-select"
            id="eye_condition"
            name="eye_condition"
            value={formData.eye_condition}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Eye)</option>
            <option>Dry</option>
            <option>Reddish/Pale</option>
            <option>Moist</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="teeth_gums_nature" className="form-label">Nature of teeth and gums</label>
          <select
            className="form-select"
            id="teeth_gums_nature"
            name="teeth_gums_nature"
            value={formData.teeth_gums_nature}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Nature of teeth and gums)</option>
            <option>Talkative</option>
            <option>Measured conversation</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Render Lifestyle Step
  const renderLifestyle = () => (
    <div className="consult-form-step">
      <h3 className="step-title">Lifestyle</h3>
      <div className="row">
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="appetite" className="form-label">Appetite</label>
          <select
            className="form-select"
            id="appetite"
            name="appetite"
            value={formData.appetite}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Appetite)</option>
            <option>Irregular</option>
            <option>Robust/Cannot tolerate hunger</option>
            <option>Low appetite</option>
            <option>Normal</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="taste_preference" className="form-label">Preference for taste</label>
          <select
            className="form-select"
            id="taste_preference"
            name="taste_preference"
            value={formData.taste_preference}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Preference for taste)</option>
            <option>Sour</option>
            <option>Sweet</option>
            <option>Salty/Spicy</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="sweating" className="form-label">Sweating</label>
          <select
            className="form-select"
            id="sweating"
            name="sweating"
            value={formData.sweating}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Sweating)</option>
            <option>Scanty</option>
            <option>Profuse</option>
            <option>No sweating</option>
            <option>Any Other</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="excretory_habits" className="form-label">Excretory habits</label>
          <select
            className="form-select"
            id="excretory_habits"
            name="excretory_habits"
            value={formData.excretory_habits}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Excretory habits)</option>
            <option>Constipated/hard/dry stool</option>
            <option>Loose stool</option>
            <option>Well formed/Normal</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="urination" className="form-label">Urination</label>
          <select
            className="form-select"
            id="urination"
            name="urination"
            value={formData.urination}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Urination)</option>
            <option>Painful/Scanty</option>
            <option>Burning/Hot</option>
            <option>Frequent/Profuse</option>
            <option>Normal</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="sleep" className="form-label">Sleep</label>
          <select
            className="form-select"
            id="sleep"
            name="sleep"
            value={formData.sleep}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Sleep)</option>
            <option>Disturbed sleep/Insomnia</option>
            <option>Moderate</option>
            <option>Sound sleep</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="psychological_status" className="form-label">Psychological status</label>
          <select
            className="form-select"
            id="psychological_status"
            name="psychological_status"
            value={formData.psychological_status}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Psychological status)</option>
            <option>Restless</option>
            <option>Irritable</option>
            <option>Stable</option>
          </select>
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="memory" className="form-label">Memory</label>
          <select
            className="form-select"
            id="memory"
            name="memory"
            value={formData.memory}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Memory)</option>
            <option>Forgetful</option>
            <option>Moderate</option>
            <option>Sound</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Render Review Step
  const renderReview = () => (
    <div className="consult-form-step">
      <h3 className="step-title">Review Your Information</h3>
      <div className="review-section">
        <div className="row">
          <div className="col-12 mb-4">
            <h5 className="sub-title">Personal Information</h5>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td><strong>Name:</strong></td>
                  <td>{formData.name}</td>
                  <td><strong>Date:</strong></td>
                  <td>{formData.date}</td>
                </tr>
                <tr>
                  <td><strong>Gender:</strong></td>
                  <td>{formData.gender}</td>
                  <td><strong>Height:</strong></td>
                  <td>{formData.height}</td>
                </tr>
                <tr>
                  <td><strong>Weight:</strong></td>
                  <td>{formData.weight}</td>
                  <td><strong>Email:</strong></td>
                  <td>{formData.email}</td>
                </tr>
                <tr>
                  <td><strong>Marital Status:</strong></td>
                  <td>{formData.marital_status}</td>
                  <td><strong>Occupation:</strong></td>
                  <td>{formData.occupation}</td>
                </tr>
                <tr>
                  <td><strong>Contact Number:</strong></td>
                  <td>{formData.contact_number}</td>
                  <td><strong>Address:</strong></td>
                  <td>{formData.complete_address}</td>
                </tr>
                <tr>
                  <td><strong>Chief Complaint:</strong></td>
                  <td>{formData.chief_complaint}</td>
                  <td><strong>Complaint Duration:</strong></td>
                  <td>{formData.complaint_duration}</td>
                </tr>
                {/* New fields in review */}
                <tr>
                  <td><strong>Reference:</strong></td>
                  <td>{formData.reference}</td>
                  <td><strong>Other Health Conditions:</strong></td>
                  <td>{formData.complications}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="col-12 mb-4">
            <h5 className="sub-title">Medical Information</h5>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td><strong>Family History:</strong></td>
                  <td>{formData.family_history}</td>
                  <td><strong>Mode of Onset:</strong></td>
                  <td>{formData.mode_of_onset}</td>
                </tr>
                <tr>
                  <td><strong>Problem Start:</strong></td>
                  <td>{formData.problem_start}</td>
                  <td><strong>Problem Progress:</strong></td>
                  <td>{formData.problem_progress}</td>
                </tr>
                <tr>
                  <td><strong>Past History:</strong></td>
                  <td>{formData.past_history}</td>
                  <td><strong>Any Surgery:</strong></td>
                  <td>{formData.any_surgery}</td>
                </tr>
                <tr>
                  <td><strong>Number of Pregnancies:</strong></td>
                  <td>{formData.number_of_pregnancies}</td>
                  <td><strong>Number of Alive Kids:</strong></td>
                  <td>{formData.number_of_alive_kids}</td>
                </tr>
                <tr>
                  <td><strong>Mode of Delivery:</strong></td>
                  <td>{formData.mode_of_delivery}</td>
                  <td><strong>Menstrual History:</strong></td>
                  <td>{formData.menstrual_history}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="col-12 mb-4">
            <h5 className="sub-title">Past Treatment</h5>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td><strong>Treatment 1 Doctor:</strong></td>
                  <td>{formData.past_treatment_1_doctor_name}</td>
                  <td><strong>Treatment 1 Hospital:</strong></td>
                  <td>{formData.past_treatment_1_hospital_name}</td>
                </tr>
                <tr>
                  <td><strong>Treatment 1 Place:</strong></td>
                  <td>{formData.past_treatment_1_place}</td>
                  <td><strong>Treatment 1 Date:</strong></td>
                  <td>{formData.past_treatment_1_date || 'Not provided'}</td>
                </tr>
                <tr>
                  <td colSpan="4"><strong>Treatment 1 Details:</strong> {formData.past_treatment_1_details}</td>
                </tr>
                <tr>
                  <td><strong>Treatment 2 Doctor:</strong></td>
                  <td>{formData.past_treatment_2_doctor_name}</td>
                  <td><strong>Treatment 2 Hospital:</strong></td>
                  <td>{formData.past_treatment_2_hospital_name}</td>
                </tr>
                <tr>
                  <td><strong>Treatment 2 Place:</strong></td>
                  <td>{formData.past_treatment_2_place}</td>
                  <td><strong>Treatment 2 Date:</strong></td>
                  <td>{formData.past_treatment_2_date || 'Not provided'}</td>
                </tr>
                <tr>
                  <td colSpan="4"><strong>Treatment 2 Details:</strong> {formData.past_treatment_2_details}</td>
                </tr>
                <tr>
                  <td colSpan="4"><strong>Current Treatment:</strong> {formData.current_treatment}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="col-12 mb-4">
            <h5 className="sub-title">Physical Examination</h5>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td><strong>Life-style:</strong></td>
                  <td>{formData.life_style}</td>
                  <td><strong>Body Built:</strong></td>
                  <td>{formData.body_built}</td>
                </tr>
                <tr>
                  <td><strong>Complexion:</strong></td>
                  <td>{formData.complexion}</td>
                  <td><strong>Skin Nature:</strong></td>
                  <td>{formData.skin_nature}</td>
                </tr>
                <tr>
                  <td><strong>Hair Nature:</strong></td>
                  <td>{formData.hair_nature}</td>
                  <td><strong>Joint Characteristics:</strong></td>
                  <td>{formData.joint_characteristics}</td>
                </tr>
                <tr>
                  <td><strong>Veins/Tendons:</strong></td>
                  <td>{formData.veins_tendons}</td>
                  <td><strong>Temperature Preference:</strong></td>
                  <td>{formData.temperature_preference}</td>
                </tr>
                <tr>
                  <td><strong>Body Temperature:</strong></td>
                  <td>{formData.patient_body_temperature}</td>
                  <td><strong>Eye Condition:</strong></td>
                  <td>{formData.eye_condition}</td>
                </tr>
                <tr>
                  <td colSpan="2"><strong>Teeth/Gums Nature:</strong> {formData.teeth_gums_nature}</td>
                  <td colSpan="2"></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="col-12 mb-4">
            <h5 className="sub-title">Lifestyle</h5>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td><strong>Appetite:</strong></td>
                  <td>{formData.appetite}</td>
                  <td><strong>Taste Preference:</strong></td>
                  <td>{formData.taste_preference}</td>
                </tr>
                <tr>
                  <td><strong>Sweating:</strong></td>
                  <td>{formData.sweating}</td>
                  <td><strong>Excretory Habits:</strong></td>
                  <td>{formData.excretory_habits}</td>
                </tr>
                <tr>
                  <td><strong>Urination:</strong></td>
                  <td>{formData.urination}</td>
                  <td><strong>Sleep:</strong></td>
                  <td>{formData.sleep}</td>
                </tr>
                <tr>
                  <td><strong>Psychological Status:</strong></td>
                  <td>{formData.psychological_status}</td>
                  <td><strong>Memory:</strong></td>
                  <td>{formData.memory}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // Render step based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderMedicalInfo();
      case 3:
        return renderPastTreatment();
      case 4:
        return renderPhysicalExamination();
      case 5:
        return renderLifestyle();
      case 6:
        return renderReview();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className="about-bg">
        <div className="ayur-bread-content">
          <h2>Consult Now</h2>
          <div className="ayur-bread-list">
            <span>
              <Link to="/">Home</Link>
            </span>
            <span className="ayur-active-page">/ Consult Now</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us">
            <div className="consult-form-container">
              <div className="step-indicator mb-4">
                <div className="d-flex justify-content-between">
                  <div className={`step ${currentStep >= 1 ? 'active' : ''} ${completedSteps.includes(1) ? 'completed' : ''}`}>
                    <div className="step-number">
                      {completedSteps.includes(1) ? <FaCheck /> : '1'}
                    </div>
                    <span>Personal Info</span>
                  </div>
                  <div className={`step ${currentStep >= 2 ? 'active' : ''} ${completedSteps.includes(2) ? 'completed' : ''}`}>
                    <div className="step-number">
                      {completedSteps.includes(2) ? <FaCheck /> : '2'}
                    </div>
                    <span>Primary Health Concern</span>
                  </div>
                  <div className={`step ${currentStep >= 3 ? 'active' : ''} ${completedSteps.includes(3) ? 'completed' : ''}`}>
                    <div className="step-number">
                      {completedSteps.includes(3) ? <FaCheck /> : '3'}
                    </div>
                    <span>Medical History</span>
                  </div>
                  <div className={`step ${currentStep >= 4 ? 'active' : ''} ${completedSteps.includes(4) ? 'completed' : ''}`}>
                    <div className="step-number">
                      {completedSteps.includes(4) ? <FaCheck /> : '4'}
                    </div>
                    <span>Diagnostic Details</span>
                  </div>
                  <div className={`step ${currentStep >= 5 ? 'active' : ''} ${completedSteps.includes(5) ? 'completed' : ''}`}>
                    <div className="step-number">
                      {completedSteps.includes(5) ? <FaCheck /> : '5'}
                    </div>
                    <span>Lifestyle</span>
                  </div>
                  <div className={`step ${currentStep >= 6 ? 'active' : ''} ${completedSteps.includes(6) ? 'completed' : ''}`}>
                    <div className="step-number">
                      {completedSteps.includes(6) ? <FaCheck /> : '6'}
                    </div>
                    <span>Review</span>
                  </div>
                </div>
              </div>
              
              {/* Show alert if there's a message */}
              {submitMessage && (
                <div className={`alert ${submitMessage.includes('Error') ? 'alert-danger' : 'alert-success'} my-4`}>
                  {submitMessage}
                </div>
              )}
              
              {/* Always show form if there's an error or if no submission yet */}
              {!submitMessage || submitMessage.includes('Error') ? (
                <form onSubmit={handleSubmit}>
                  {renderStep()}
                  
                  <div className="form-navigation mt-4 d-flex justify-content-between">
                    {currentStep > 1 && (
                      <button type="button" className="btn btn-secondary" onClick={prevStep}>
                        <FaArrowLeft className="me-2" />
                        Previous
                      </button>
                    )}
                    
                    {currentStep < 6 && (
                      <button type="button" className="btn btn-primary ms-auto" onClick={nextStep}>
                        Next
                        <FaArrowRight className="ms-2" />
                      </button>
                    )}
                    
                    {currentStep === 6 && (
                      <button type="submit" className="btn btn-success ms-auto" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Consultation'}
                      </button>
                    )}
                  </div>
                </form>
              ) : null}
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

export default ConsultNow;