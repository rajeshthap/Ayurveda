import React, { useState } from "react";
import axios from "axios";
import BgShape2 from "../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../assets/images/bg-leaf2.png";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

function ConsultNow() {
  // API endpoint
  const API_URL = "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/consult-entries/";
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});
  
  // Form data state
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    date: "",
    gender: "",
    height: "",
    weight: "",
    email: "",
    marital_status: "",
    complete_address: "",
    occupation: "",
    contact_number: "",
    
    // Medical Information
    chief_complaint: "",
    complaint_duration: "",
    family_history: "",
    mode_of_onset: "",
    problem_start: "",
    problem_progress: "",
    past_history: "",
    number_of_pregnancies: 0,
    number_of_alive_kids: 0,
    mode_of_delivery: "",
    any_surgery: "",
    menstrual_history: "",
    
    // Past Treatment
    past_treatment_1_doctor_name: "",
    past_treatment_1_hospital_name: "",
    past_treatment_1_place: "",
    past_treatment_1_date: "",
    past_treatment_1_details: "",
    past_treatment_2_doctor_name: "",
    past_treatment_2_hospital_name: "",
    past_treatment_2_place: "",
    past_treatment_2_date: "",
    past_treatment_2_details: "",
    current_treatment: "",
    
    // Physical Examination
    life_style: "",
    body_built: "",
    complexion: "",
    skin_nature: "",
    hair_nature: "",
    joint_characteristics: "",
    veins_tendons: "",
    temperature_preference: "",
    patient_body_temperature: "",
    eye_condition: "",
    teeth_gums_nature: "",
    
    // Lifestyle
    appetite: "",
    taste_preference: "",
    sweating: "",
    excretory_habits: "",
    urination: "",
    sleep: "",
    psychological_status: "",
    memory: ""
  });

  // Validate Personal Information
  const validatePersonalInfo = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    
    if (!formData.height.trim()) {
      newErrors.height = "Height is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.weight.trim()) {
      newErrors.weight = "Weight is required";
    }
    
    if (!formData.marital_status) {
      newErrors.marital_status = "Marital status is required";
    }
    
    if (!formData.complete_address.trim()) {
      newErrors.complete_address = "Address is required";
    }
    
    if (!formData.occupation.trim()) {
      newErrors.occupation = "Occupation is required";
    }
    
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contact_number.replace(/\s/g, ""))) {
      newErrors.contact_number = "Contact number must be 10 digits";
    }
    
    if (!formData.chief_complaint.trim()) {
      newErrors.chief_complaint = "Chief complaint is required";
    }
    
    if (!formData.complaint_duration.trim()) {
      newErrors.complaint_duration = "Complaint duration is required";
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(API_URL, formData);
      setSubmitMessage("Your consultation request has been submitted successfully!");
      // Reset form after successful submission
      setFormData({
        name: "",
        date: "",
        gender: "",
        height: "",
        weight: "",
        email: "",
        marital_status: "",
        complete_address: "",
        occupation: "",
        contact_number: "",
        chief_complaint: "",
        complaint_duration: "",
        family_history: "",
        mode_of_onset: "",
        problem_start: "",
        problem_progress: "",
        past_history: "",
        number_of_pregnancies: 0,
        number_of_alive_kids: 0,
        mode_of_delivery: "",
        any_surgery: "",
        menstrual_history: "",
        past_treatment_1_doctor_name: "",
        past_treatment_1_hospital_name: "",
        past_treatment_1_place: "",
        past_treatment_1_date: "",
        past_treatment_1_details: "",
        past_treatment_2_doctor_name: "",
        past_treatment_2_hospital_name: "",
        past_treatment_2_place: "",
        past_treatment_2_date: "",
        past_treatment_2_details: "",
        current_treatment: "",
        life_style: "",
        body_built: "",
        complexion: "",
        skin_nature: "",
        hair_nature: "",
        joint_characteristics: "",
        veins_tendons: "",
        temperature_preference: "",
        patient_body_temperature: "",
        eye_condition: "",
        teeth_gums_nature: "",
        appetite: "",
        taste_preference: "",
        sweating: "",
        excretory_habits: "",
        urination: "",
        sleep: "",
        psychological_status: "",
        memory: ""
      });
      setCurrentStep(1);
      setCompletedSteps([]);
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage("An error occurred while submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigate to next step
  const nextStep = () => {
    // Validate Personal Information before proceeding
    if (currentStep === 1 && !validatePersonalInfo()) {
      return;
    }
    
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    setCurrentStep(currentStep + 1);
  };

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Render Personal Information Step
  const renderPersonalInfo = () => (
    <div className="consult-form-step">
      <h3 className="step-title">Personal Information</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="date" className="form-label">Date</label>
          <input
            type="date"
            className={`form-control ${errors.date ? 'is-invalid' : ''}`}
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
          {errors.date && <div className="invalid-feedback">{errors.date}</div>}
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="gender" className="form-label">Gender</label>
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
          <label htmlFor="height" className="form-label">Height</label>
          <input
            type="text"
            className={`form-control ${errors.height ? 'is-invalid' : ''}`}
            id="height"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            placeholder="e.g., 165 cm"
          />
          {errors.height && <div className="invalid-feedback">{errors.height}</div>}
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="weight" className="form-label">Weight</label>
          <input
            type="text"
            className={`form-control ${errors.weight ? 'is-invalid' : ''}`}
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="e.g., 60 kg"
          />
          {errors.weight && <div className="invalid-feedback">{errors.weight}</div>}
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="email" className="form-label">Email</label>
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
        <div className="col-md-6 mb-3">
          <label htmlFor="marital_status" className="form-label">Marital Status</label>
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
        <div className="col-md-6 mb-3">
          <label htmlFor="occupation" className="form-label">Occupation</label>
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
        <div className="col-md-6 mb-3">
          <label htmlFor="contact_number" className="form-label">Contact Number</label>
          <input
            type="tel"
            className={`form-control ${errors.contact_number ? 'is-invalid' : ''}`}
            id="contact_number"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleInputChange}
            required
          />
          {errors.contact_number && <div className="invalid-feedback">{errors.contact_number}</div>}
        </div>
        <div className="col-12 mb-3">
          <label htmlFor="complete_address" className="form-label">Complete Address</label>
          <textarea
            className={`form-control ${errors.complete_address ? 'is-invalid' : ''}`}
            id="complete_address"
            name="complete_address"
            value={formData.complete_address}
            onChange={handleInputChange}
            rows="3"
          ></textarea>
          {errors.complete_address && <div className="invalid-feedback">{errors.complete_address}</div>}
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="chief_complaint" className="form-label">Chief Complaint</label>
          <input
            type="text"
            className={`form-control ${errors.chief_complaint ? 'is-invalid' : ''}`}
            id="chief_complaint"
            name="chief_complaint"
            value={formData.chief_complaint}
            onChange={handleInputChange}
          />
          {errors.chief_complaint && <div className="invalid-feedback">{errors.chief_complaint}</div>}
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="complaint_duration" className="form-label">Complaint Duration</label>
          <input
            type="text"
            className={`form-control ${errors.complaint_duration ? 'is-invalid' : ''}`}
            id="complaint_duration"
            name="complaint_duration"
            value={formData.complaint_duration}
            onChange={handleInputChange}
          />
          {errors.complaint_duration && <div className="invalid-feedback">{errors.complaint_duration}</div>}
        </div>
      </div>
    </div>
  );

  // Render Medical Information Step
  const renderMedicalInfo = () => (
    <div className="consult-form-step">
      <h3 className="step-title">Medical Information</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="family_history" className="form-label">Family History</label>
          <select
            className="form-select"
            id="family_history"
            name="family_history"
            value={formData.family_history}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One[Family history/Personal history of any of the following]</option>
            <option>Diabetes</option>
            <option>Hypertension/High Blood Pressure</option>
            <option>T.B/Cancer</option>
            <option>Memory Loss</option>
            <option>Flatulence/Acidity</option>
            <option>Any Other</option>
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="mode_of_onset" className="form-label">Mode of Onset</label>
          <select
            className="form-select"
            id="mode_of_onset"
            name="mode_of_onset"
            value={formData.mode_of_onset}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One(Mode of Onset)</option>
            <option>Sudden/Gradual</option>
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="problem_start" className="form-label">Problem Start</label>
          <select
            className="form-select"
            id="problem_start"
            name="problem_start"
            value={formData.problem_start}
            onChange={handleInputChange}
          >
            <option value="" disabled>How did problem start</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
            <option>Night</option>
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="problem_progress" className="form-label">Problem Progress</label>
          <select
            className="form-select"
            id="problem_progress"
            name="problem_progress"
            value={formData.problem_progress}
            onChange={handleInputChange}
          >
            <option value="" disabled>How has it progressed</option>
            <option>Increasing</option>
            <option>Decreasing</option>
            <option>Constant</option>
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="past_history" className="form-label">Past History</label>
          <select
            className="form-select"
            id="past_history"
            name="past_history"
            value={formData.past_history}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Any One[Past History, please specify detail of following(if any)]</option>
            <option>Any Medication</option>
            <option>Hospitalization</option>
            <option>Surgery</option>
            <option>Accident</option>
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="any_surgery" className="form-label">Any Surgery</label>
          <input
            type="text"
            className="form-control"
            id="any_surgery"
            name="any_surgery"
            value={formData.any_surgery}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label htmlFor="number_of_pregnancies" className="form-label">Number of Pregnancies</label>
          <input
            type="number"
            className="form-control"
            id="number_of_pregnancies"
            name="number_of_pregnancies"
            value={formData.number_of_pregnancies}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label htmlFor="number_of_alive_kids" className="form-label">Number of Alive Kids</label>
          <input
            type="number"
            className="form-control"
            id="number_of_alive_kids"
            name="number_of_alive_kids"
            value={formData.number_of_alive_kids}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label htmlFor="mode_of_delivery" className="form-label">Mode of Delivery</label>
          <select
            className="form-select"
            id="mode_of_delivery"
            name="mode_of_delivery"
            value={formData.mode_of_delivery}
            onChange={handleInputChange}
          >
            <option value="">Select Mode</option>
            <option>Normal</option>
            <option>Caesarian</option>
          </select>
        </div>
        <div className="col-md-12 mb-3">
          <label htmlFor="menstrual_history" className="form-label">Menstrual History</label>
          <input
            type="text"
            className="form-control"
            id="menstrual_history"
            name="menstrual_history"
            value={formData.menstrual_history}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );

  // Render Past Treatment Step
  const renderPastTreatment = () => (
    <div className="consult-form-step">
      <h3 className="step-title">Past Treatment</h3>
      <div className="row">
        <div className="col-12 mb-4">
          <h5 className="sub-title">Treatment 1</h5>
        </div>
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
          <label htmlFor="past_treatment_1_date" className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            id="past_treatment_1_date"
            name="past_treatment_1_date"
            value={formData.past_treatment_1_date}
            onChange={handleInputChange}
          />
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
          <label htmlFor="past_treatment_2_date" className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            id="past_treatment_2_date"
            name="past_treatment_2_date"
            value={formData.past_treatment_2_date}
            onChange={handleInputChange}
          />
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

  // Render Physical Examination Step
  const renderPhysicalExamination = () => (
    <div className="consult-form-step">
      <h3 className="step-title">Physical Examination</h3>
      <div className="row">
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
        <div className="col-md-6 mb-3">
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
                  <td>{formData.past_treatment_1_date}</td>
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
                  <td>{formData.past_treatment_2_date}</td>
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
                    <span>Medical Info</span>
                  </div>
                  <div className={`step ${currentStep >= 3 ? 'active' : ''} ${completedSteps.includes(3) ? 'completed' : ''}`}>
                    <div className="step-number">
                      {completedSteps.includes(3) ? <FaCheck /> : '3'}
                    </div>
                    <span>Past Treatment</span>
                  </div>
                  <div className={`step ${currentStep >= 4 ? 'active' : ''} ${completedSteps.includes(4) ? 'completed' : ''}`}>
                    <div className="step-number">
                      {completedSteps.includes(4) ? <FaCheck /> : '4'}
                    </div>
                    <span>Physical Exam</span>
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
              
              {submitMessage ? (
                <div className="alert alert-success my-4">
                  {submitMessage}
                </div>
              ) : (
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
              )}
            </div>
          </div>
          <div className="ayur-bgshape ayur-about-bgshape">
            <img src={BgShape2} alt="img" />
            <img src={BgLeaf2} alt="img" />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 10px;
          position: relative;
          flex: 1;
        }
        
        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #e9ecef;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        .step.active .step-number {
          background-color: #0d6efd;
          color: white;
        }
        
        .step.completed .step-number {
          background-color: #198754;
          color: white;
        }
        
        .step span {
          font-size: 12px;
        }
        
        .step.active span {
          color: #0d6efd;
          font-weight: bold;
        }
        
        .step.completed span {
          color: #198754;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}

export default ConsultNow;