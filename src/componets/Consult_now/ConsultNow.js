import React, { useState, useEffect } from "react";
import axios from "axios";
import BgShape2 from "../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../assets/images/bg-leaf2.png";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function ConsultNow() {
  const location = useLocation();
  // API endpoints
  const API_URL_SECTION1 =
    "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/online-consult-section-1/";
  const API_URL_SECTION2 =
    "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/online-consult-section-2/";
  const API_URL_SECTION3 =
    "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/online-consult-section-3/";
  const API_URL_SECTION4 =
    "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/online-consult-section-4/";

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const todayDate = getTodayDate();

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const [isLoadingConsultData, setIsLoadingConsultData] = useState(false);
  const [consultDataFetched, setConsultDataFetched] = useState(false);

  // Ref to track consult_id in real-time
  const consultIdRef = React.useRef("");

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
    date_of_diagnosis: "",
    medical_reports: "",
    // Section 3 - Lifestyle & Gynecological Information
    habits: {
      Smoking: "No",
      Alcohol: "No",
      Tobacco: "No",
      Drugs: "No",
      "Non-vegetarian diet": "No",
    },
    type_of_exercise: null,
    frequency: null,
    mental_workload: null,
    stress_levels: null,
    social_interaction_level: null,
    number_of_pregnancies: "",
    number_of_living_children: "",
    mode_of_delivery: "",
    menstrual_history: "",
    gynaecological_surgery: "",
    // Section 4 - Physical & Psychological Characteristics
    body_build: [],
    complexion: [],
    skin_nature: [],
    hair_nature: [],
    premature_greying_or_balding: [],
    joint_characteristics: [],
    veins_and_tendons: [],
    body_temperature: [],
    temperature_preference: [],
    eyes: [],
    teeth_and_gums: [],
    voice_nature: [],
    appetite: [],
    taste_preference: [],
    sweating: [],
    bowel_habits: [],
    urination: [],
    sleep: [],
    memory: [],
    psychological_state: [],
    additional_clinical_information: "",
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");

    if (!email) {
      setConsultDataFetched(true);
      return;
    }

    const decodedEmail = decodeURIComponent(email);
    setFormData((prev) => ({ ...prev, email: decodedEmail }));

    const fetchConsultationData = async () => {
      setIsLoadingConsultData(true);

      try {
        const apiUrl = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/consultation-combined/?email=${encodeURIComponent(decodedEmail)}`;
        const response = await axios.get(apiUrl);

        // Log full API response for debugging
        console.log("📡 Consultation API Response:");
        console.log("URL:", apiUrl);
        console.log("Status:", response.status);
        console.log(
          "Full Response Data:",
          JSON.stringify(response.data, null, 2),
        );

        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const consultationData = response.data[0];

          // Log extracted consultation data
          console.log("Extracted Consultation Data:");
          console.log(
            "Full Object:",
            JSON.stringify(consultationData, null, 2),
          );

          // Extract consult_id (check multiple possible field names)
          const consultId =
            consultationData.consult_id ||
            consultationData.id ||
            consultationData.consultation_id ||
            consultationData.uuid ||
            consultationData.section2?.[0]?.consult_id ||
            "";

          console.log("🔑 Extracted consultId from existing data:", consultId);

          // Helper function to safely extract nested data
          const extractSectionData = (section, field, defaultValue = "") => {
            return section?.[0]?.[field] ?? defaultValue;
          };

          // Build form data object with exact field mapping
          const updatedFormData = {
            // Basic Information (from root level)
            consult_id: consultId,
            full_name: consultationData.full_name || "",
            date_of_birth: consultationData.date_of_birth || "",
            gender: consultationData.gender || "",
            height: consultationData.height || "",
            weight: consultationData.weight || "",
            occupation: consultationData.occupation || "",
            marital_status: consultationData.marital_status || "",
            address: consultationData.address || "",
            email: decodedEmail,
            mobile_number: consultationData.mobile_number || "",
            alternate_number: consultationData.alternate_number || "",
            city: consultationData.city || "",
            pin: consultationData.pin || "",
            state: consultationData.state || "",
            country: consultationData.country || "",
            references: consultationData.references || "",

            // Section 2 - Medical History (exact field names)
            main_disease_problem: extractSectionData(
              consultationData.section2,
              "main_disease_problem",
            ),
            associated_complications: extractSectionData(
              consultationData.section2,
              "associated_complications",
            ),
            mode_of_onset: extractSectionData(
              consultationData.section2,
              "mode_of_onset",
            ),
            problem_start_description: extractSectionData(
              consultationData.section2,
              "problem_start_description",
            ),
            progression_over_time: extractSectionData(
              consultationData.section2,
              "progression_over_time",
            ),
            significant_health_events: extractSectionData(
              consultationData.section2,
              "significant_health_events",
            ),
            past_medications: extractSectionData(
              consultationData.section2,
              "past_medications",
            ),
            medical_history: extractSectionData(
              consultationData.section2,
              "medical_history",
            ),
            hospitalizations: extractSectionData(
              consultationData.section2,
              "hospitalizations",
            ),
            surgeries: extractSectionData(
              consultationData.section2,
              "surgeries",
            ),
            accidents: extractSectionData(
              consultationData.section2,
              "accidents",
            ),
            disease_history: extractSectionData(
              consultationData.section2,
              "disease_history",
              [],
            ),
            other_chronic_disease: extractSectionData(
              consultationData.section2,
              "other_chronic_disease",
            ),
            diagnosing_doctor_name: extractSectionData(
              consultationData.section2,
              "diagnosing_doctor_name",
            ),
            hospital_clinic_name: extractSectionData(
              consultationData.section2,
              "hospital_clinic_name",
            ),
            date_of_diagnosis: extractSectionData(
              consultationData.section2,
              "date_of_diagnosis",
            ),
            medical_reports: "", // File uploads not included in API response

            // Section 3 - Lifestyle & Habits (exact field names)
            habits: (() => {
              const habitsData = extractSectionData(consultationData.section3, "habits", []);
              // Initialize with default "No" values for all habits
              const defaultHabits = {
                Smoking: "No",
                Alcohol: "No",
                Tobacco: "No",
                Drugs: "No",
                "Non-vegetarian diet": "No",
              };
              
              // If habits data is an array (API format), convert to object with Yes/No values
              if (Array.isArray(habitsData)) {
                return habitsData.reduce((acc, habit) => {
                  if (defaultHabits.hasOwnProperty(habit)) {
                    acc[habit] = "Yes";
                  }
                  return acc;
                }, { ...defaultHabits });
              }
              
              // If habits data is an object (old format), merge with default values
              if (typeof habitsData === "object" && habitsData !== null) {
                return { ...defaultHabits, ...habitsData };
              }
              
              return defaultHabits;
            })(),
            type_of_exercise: extractSectionData(
              consultationData.section3,
              "type_of_exercise",
              null,
            ),
            frequency: extractSectionData(
              consultationData.section3,
              "frequency",
              null,
            ),
            mental_workload: extractSectionData(
              consultationData.section3,
              "mental_workload",
              null,
            ),
            stress_levels: extractSectionData(
              consultationData.section3,
              "stress_levels",
              null,
            ),
            social_interaction_level: extractSectionData(
              consultationData.section3,
              "social_interaction_level",
              null,
            ),
            number_of_pregnancies: extractSectionData(
              consultationData.section3,
              "number_of_pregnancies",
              0,
            ).toString(),
            number_of_living_children: extractSectionData(
              consultationData.section3,
              "number_of_living_children",
              0,
            ).toString(),
            mode_of_delivery: extractSectionData(
              consultationData.section3,
              "mode_of_delivery",
            ),
            menstrual_history: extractSectionData(
              consultationData.section3,
              "menstrual_history",
            ),
            gynaecological_surgery: extractSectionData(
              consultationData.section3,
              "gynaecological_surgery",
            ),

            // Section 4 - Physical Characteristics (exact field names)
            body_build: extractSectionData(
              consultationData.section4,
              "body_build",
              [],
            ),
            complexion: extractSectionData(
              consultationData.section4,
              "complexion",
              [],
            ),
            skin_nature: extractSectionData(
              consultationData.section4,
              "skin_nature",
              [],
            ),
            hair_nature: extractSectionData(
              consultationData.section4,
              "hair_nature",
              [],
            ),
            premature_greying_or_balding: extractSectionData(
              consultationData.section4,
              "premature_greying_or_balding",
              [],
            ),
            joint_characteristics: extractSectionData(
              consultationData.section4,
              "joint_characteristics",
              [],
            ),
            veins_and_tendons: extractSectionData(
              consultationData.section4,
              "veins_and_tendons",
              [],
            ),
            body_temperature: extractSectionData(
              consultationData.section4,
              "body_temperature",
              [],
            ),
            temperature_preference: extractSectionData(
              consultationData.section4,
              "temperature_preference",
              [],
            ),
            eyes: extractSectionData(consultationData.section4, "eyes", []),
            teeth_and_gums: extractSectionData(
              consultationData.section4,
              "teeth_and_gums",
              [],
            ),
            voice_nature: extractSectionData(
              consultationData.section4,
              "voice_nature",
              [],
            ),
            appetite: extractSectionData(
              consultationData.section4,
              "appetite",
              [],
            ),
            taste_preference: extractSectionData(
              consultationData.section4,
              "taste_preference",
              [],
            ),
            sweating: extractSectionData(
              consultationData.section4,
              "sweating",
              [],
            ),
            bowel_habits: extractSectionData(
              consultationData.section4,
              "bowel_habits",
              [],
            ),
            urination: extractSectionData(
              consultationData.section4,
              "urination",
              [],
            ),
            sleep: extractSectionData(consultationData.section4, "sleep", []),
            memory: extractSectionData(consultationData.section4, "memory", []),
            psychological_state: extractSectionData(
              consultationData.section4,
              "psychological_state",
              [],
            ),
            additional_clinical_information: extractSectionData(
              consultationData.section4,
              "additional_clinical_information",
            ),
          };

          // Update consultId ref
          consultIdRef.current = updatedFormData.consult_id;

          // Update form state
          console.log("🔄 Setting form data with updated values:", {
            consult_id: updatedFormData.consult_id,
            full_name: updatedFormData.full_name,
          });
          setFormData(updatedFormData);

          // Set current step based on available data
          if (consultationData.section4?.length > 0) {
            setCurrentStep(5); // Review step
          } else if (consultationData.section3?.length > 0) {
            setCurrentStep(4); // Physical Examination
          } else if (consultationData.section2?.length > 0) {
            setCurrentStep(3); // Past Treatment
          } else {
            setCurrentStep(2); // Medical Info
          }

          // Mark completed steps based on available data
          const newCompletedSteps = [];
          if (consultationData.full_name) {
            newCompletedSteps.push(1);
          }
          if (consultationData.section2?.length > 0) {
            newCompletedSteps.push(2);
          }
          if (consultationData.section3?.length > 0) {
            newCompletedSteps.push(3);
          }
          if (consultationData.section4?.length > 0) {
            newCompletedSteps.push(4);
          }
          setCompletedSteps(newCompletedSteps);

          console.log("✅ Form data populated successfully");
        } else {
          console.log("⚠️ No consultation data found for email:", decodedEmail);
        }
      } catch (error) {
        console.error("❌ Error fetching consultation data:", error);
      } finally {
        setIsLoadingConsultData(false);
        setConsultDataFetched(true);
      }
    };

    fetchConsultationData();
  }, [location.search]);

  // Optional: Debug log to verify data
  useEffect(() => {
    console.log("📋 Form Data Verification (Every Update):", {
      consult_id: formData.consult_id,
      full_name: formData.full_name,
      email: formData.email,
      consultDataFetched: consultDataFetched,
      currentStep: currentStep,
    });
  }, [formData, consultDataFetched, currentStep]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdowns = document.querySelectorAll(".dropdown");
      const isClickInsideDropdown = Array.from(dropdowns).some((dropdown) =>
        dropdown.contains(event.target),
      );

      if (!isClickInsideDropdown) {
        setIsDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

    console.log("\n🔍 VALIDATING SECTION 2:");
    console.log("📋 Form Data consult_id details:", {
      consult_id: formData.consult_id,
      consult_id_empty: !formData.consult_id,
      consult_id_type: typeof formData.consult_id,
      consult_id_trimmed: formData.consult_id?.trim(),
      consult_id_trimmed_empty: !formData.consult_id?.trim(),
    });
    console.log("📋 Full Form Data for Section 2:", {
      consult_id: formData.consult_id,
      main_disease_problem: formData.main_disease_problem,
      mode_of_onset: formData.mode_of_onset,
      disease_history: formData.disease_history,
    });

    // Check if consult_id exists (should be fetched from API)
    if (!formData.consult_id || !formData.consult_id.toString().trim()) {
      console.log("❌ consult_id validation FAILED - Empty or missing");
      console.log("   consult_id value:", `"${formData.consult_id}"`);
      console.log("   consult_id type:", typeof formData.consult_id);
      console.log(
        "   Hint: Make sure the consultation data was fetched successfully from the API",
      );
      newErrors.consult_id =
        "Consultation ID is required. Please ensure consultation data was loaded from the system.";
    } else {
      console.log("✅ consult_id validation PASSED:", formData.consult_id);
    }

    if (!formData.main_disease_problem.trim()) {
      console.log("❌ main_disease_problem validation FAILED");
      newErrors.main_disease_problem = "Main disease problem is required";
    } else {
      console.log("✅ main_disease_problem validation PASSED");
    }

    if (!formData.mode_of_onset) {
      console.log("❌ mode_of_onset validation FAILED");
      newErrors.mode_of_onset = "Mode of onset is required";
    } else {
      console.log("✅ mode_of_onset validation PASSED");
    }

    if (!formData.problem_start_description.trim()) {
      console.log("❌ problem_start_description validation FAILED");
      newErrors.problem_start_description =
        "Problem start description is required";
    } else {
      console.log("✅ problem_start_description validation PASSED");
    }

    if (!formData.progression_over_time.trim()) {
      console.log("❌ progression_over_time validation FAILED");
      newErrors.progression_over_time = "Progression over time is required";
    } else {
      console.log("✅ progression_over_time validation PASSED");
    }

    if (formData.disease_history.length === 0) {
      console.log("❌ disease_history validation FAILED");
      newErrors.disease_history = "Disease history is required";
    } else {
      console.log("✅ disease_history validation PASSED");
    }

    if (!formData.diagnosing_doctor_name.trim()) {
      console.log("❌ diagnosing_doctor_name validation FAILED");
      newErrors.diagnosing_doctor_name = "Diagnosing doctor name is required";
    } else {
      console.log("✅ diagnosing_doctor_name validation PASSED");
    }

    if (!formData.hospital_clinic_name.trim()) {
      console.log("❌ hospital_clinic_name validation FAILED");
      newErrors.hospital_clinic_name = "Hospital/clinic name is required";
    } else {
      console.log("✅ hospital_clinic_name validation PASSED");
    }

    if (!formData.city.trim()) {
      console.log("❌ city validation FAILED");
      newErrors.city = "City is required";
    } else {
      console.log("✅ city validation PASSED");
    }

    if (!formData.date_of_diagnosis) {
      console.log("❌ date_of_diagnosis validation FAILED");
      newErrors.date_of_diagnosis = "Date of diagnosis is required";
    } else {
      console.log("✅ date_of_diagnosis validation PASSED");
    }

    console.log("\n📊 VALIDATION SUMMARY:");
    console.log("   Errors found:", Object.keys(newErrors).length);
    if (Object.keys(newErrors).length > 0) {
      console.log("   Error details:", newErrors);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Lifestyle & Gynecological Information (Section 3)
  const validateLifestyleInfo = () => {
    const newErrors = {};

    // Check if at least one habit is selected (optional, but kept for consistency)
    // Note: API accepts empty array if no habits are selected
    // Uncomment below if you want to require at least one habit
    /*
    if (formData.habits.length === 0) {
      newErrors.habits = "Please select at least one habit or indicate none";
    }
    */

    // These fields are optional (API accepts null values)
    // Uncomment below if you want to make them required
    /*
    if (!formData.type_of_exercise) {
      newErrors.type_of_exercise = "Type of exercise is required";
    }

    if (!formData.frequency) {
      newErrors.frequency = "Frequency is required";
    }

    if (!formData.mental_workload) {
      newErrors.mental_workload = "Mental workload is required";
    }

    if (!formData.stress_levels) {
      newErrors.stress_levels = "Stress levels are required";
    }

    if (!formData.social_interaction_level) {
      newErrors.social_interaction_level = "Social interaction level is required";
    }
    */

    // Gynecological fields are optional (not relevant to all users)
    if (formData.number_of_pregnancies.trim() && !/^\d+$/.test(formData.number_of_pregnancies)) {
      newErrors.number_of_pregnancies =
        "Number of pregnancies must be a number";
    }

    if (formData.number_of_living_children.trim() && !/^\d+$/.test(formData.number_of_living_children)) {
      newErrors.number_of_living_children =
        "Number of living children must be a number";
    }

    // Mode of delivery, menstrual history, and gynecological surgery are optional
    // Uncomment below if you want to make them required
    /*
    if (!formData.mode_of_delivery) {
      newErrors.mode_of_delivery = "Mode of delivery is required";
    }

    if (!formData.menstrual_history.trim()) {
      newErrors.menstrual_history = "Menstrual history is required";
    }

    if (!formData.gynaecological_surgery.trim()) {
      newErrors.gynaecological_surgery =
        "Gynecological surgery information is required";
    }
    */

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Physical & Psychological Characteristics (Section 4)
  const validatePhysicalPsychologicalInfo = () => {
    const newErrors = {};

    if (formData.body_build.length === 0) {
      newErrors.body_build = "Body build information is required";
    }

    if (formData.complexion.length === 0) {
      newErrors.complexion = "Complexion information is required";
    }

    if (formData.skin_nature.length === 0) {
      newErrors.skin_nature = "Skin nature information is required";
    }

    if (formData.hair_nature.length === 0) {
      newErrors.hair_nature = "Hair nature information is required";
    }

    if (formData.premature_greying_or_balding.length === 0) {
      newErrors.premature_greying_or_balding =
        "Premature greying or balding information is required";
    }

    if (formData.joint_characteristics.length === 0) {
      newErrors.joint_characteristics =
        "Joint characteristics information is required";
    }

    if (formData.veins_and_tendons.length === 0) {
      newErrors.veins_and_tendons = "Veins and tendons information is required";
    }

    if (formData.body_temperature.length === 0) {
      newErrors.body_temperature = "Body temperature information is required";
    }

    if (formData.temperature_preference.length === 0) {
      newErrors.temperature_preference =
        "Temperature preference information is required";
    }

    if (formData.eyes.length === 0) {
      newErrors.eyes = "Eyes information is required";
    }

    if (formData.teeth_and_gums.length === 0) {
      newErrors.teeth_and_gums = "Teeth and gums information is required";
    }

    if (formData.voice_nature.length === 0) {
      newErrors.voice_nature = "Voice nature information is required";
    }

    if (formData.appetite.length === 0) {
      newErrors.appetite = "Appetite information is required";
    }

    if (formData.taste_preference.length === 0) {
      newErrors.taste_preference = "Taste preference information is required";
    }

    if (formData.sweating.length === 0) {
      newErrors.sweating = "Sweating information is required";
    }

    if (formData.bowel_habits.length === 0) {
      newErrors.bowel_habits = "Bowel habits information is required";
    }

    if (formData.urination.length === 0) {
      newErrors.urination = "Urination information is required";
    }

    if (formData.sleep.length === 0) {
      newErrors.sleep = "Sleep information is required";
    }

    if (formData.memory.length === 0) {
      newErrors.memory = "Memory information is required";
    }

    if (formData.psychological_state.length === 0) {
      newErrors.psychological_state =
        "Psychological state information is required";
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
        [name]: files[0],
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
        [name]: updatedValue,
      });
    }

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
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

      // Append only Section 2 specific fields to FormData (exact match with API expectations)
      submissionData.append("consult_id", consultIdRef.current);
      submissionData.append(
        "main_disease_problem",
        formData.main_disease_problem,
      );
      submissionData.append(
        "associated_complications",
        formData.associated_complications,
      );
      submissionData.append("mode_of_onset", formData.mode_of_onset);
      submissionData.append(
        "problem_start_description",
        formData.problem_start_description,
      );
      submissionData.append(
        "progression_over_time",
        formData.progression_over_time,
      );
      submissionData.append(
        "significant_health_events",
        formData.significant_health_events,
      );
      submissionData.append("past_medications", formData.past_medications);
      submissionData.append("medical_history", formData.medical_history);
      submissionData.append("hospitalizations", formData.hospitalizations);
      submissionData.append("surgeries", formData.surgeries);
      submissionData.append("accidents", formData.accidents);
      submissionData.append(
        "disease_history",
        JSON.stringify(formData.disease_history),
      );
      submissionData.append(
        "other_chronic_disease",
        formData.other_chronic_disease,
      );
      submissionData.append(
        "diagnosing_doctor_name",
        formData.diagnosing_doctor_name,
      );
      submissionData.append(
        "hospital_clinic_name",
        formData.hospital_clinic_name,
      );
      submissionData.append("city", formData.city);
      submissionData.append("date_of_diagnosis", formData.date_of_diagnosis);
      if (formData.medical_reports) {
        submissionData.append("medical_reports", formData.medical_reports);
      }

      // Log FormData contents properly
      console.log("Final submission data:");
      for (let [key, value] of submissionData.entries()) {
        console.log(key, ":", value);
      }

      // Submit to Section 2 API with appropriate headers
      const response = await axios.post(API_URL_SECTION2, submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("API response:", response.data);
      setSubmitMessage(
        "Your consultation request has been submitted successfully!",
      );

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
        medical_reports: "",
        // Section 3 - Lifestyle & Gynecological Information
        habits: [],
        type_of_exercise: null,
        frequency: null,
        mental_workload: null,
        stress_levels: null,
        social_interaction_level: null,
        number_of_pregnancies: "",
        number_of_living_children: "",
        mode_of_delivery: "",
        menstrual_history: "",
        gynaecological_surgery: "",
        // Section 4 - Physical & Psychological Characteristics
        body_build: [],
        complexion: [],
        skin_nature: [],
        hair_nature: [],
        premature_greying_or_balding: [],
        joint_characteristics: [],
        veins_and_tendons: [],
        body_temperature: [],
        temperature_preference: [],
        eyes: [],
        teeth_and_gums: [],
        voice_nature: [],
        appetite: [],
        taste_preference: [],
        sweating: [],
        bowel_habits: [],
        urination: [],
        sleep: [],
        memory: [],
        psychological_state: [],
        additional_clinical_information: "",
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
        if (error.response.data && typeof error.response.data === "object") {
          const errorMessages = [];
          for (const field in error.response.data) {
            if (Array.isArray(error.response.data[field])) {
              errorMessages.push(
                `${field}: ${error.response.data[field].join(", ")}`,
              );
            } else {
              errorMessages.push(`${field}: ${error.response.data[field]}`);
            }

            // Set field-specific error for email duplicate error
            if (field === "email") {
              setErrors((prev) => ({
                ...prev,
                [field]: error.response.data[field],
              }));
            }
          }
          setSubmitMessage(`Error: ${errorMessages.join("; ")}`);
        } else {
          setSubmitMessage(
            `Error: ${error.response.data || "An error occurred while submitting your request."}`,
          );
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
    // Check if we're still loading consultation data
    if (isLoadingConsultData) {
      console.warn("\n⏳ DATA STILL LOADING - User clicked Next too early!");
      console.log("   isLoadingConsultData:", isLoadingConsultData);
      console.log("   consultDataFetched:", consultDataFetched);
      setSubmitMessage("⏳ Please wait, loading your consultation data...");
      return;
    }

    // Check if data has been fetched
    if (!consultDataFetched) {
      console.warn("\n⏳ DATA NOT YET FETCHED - User clicked Next too early!");
      console.log("   consultDataFetched:", consultDataFetched);
      setSubmitMessage("⏳ Please wait, loading your consultation data...");
      return;
    }

    console.log("\n✅ DATA FETCH COMPLETE - Proceeding to validation");
    console.log("   isLoadingConsultData:", isLoadingConsultData);
    console.log("   consultDataFetched:", consultDataFetched);
    console.log("   Current formData.consult_id:", formData.consult_id);

    if (currentStep === 1) {
      console.log("\n📋 STEP 1: Validating Personal Information");
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

        // Log FormData contents properly
        console.log("\n" + "=".repeat(80));
        console.log("📤 SUBMITTING SECTION 1 DATA:");
        console.log("=".repeat(80));
        console.log("📍 API Endpoint:", API_URL_SECTION1);
        console.log("\n📋 Section 1 FormData being sent:");
        for (let [key, value] of section1Data.entries()) {
          console.log(`   ${key}: ${value}`);
        }
        console.log("=".repeat(80));

        const response = await axios.post(API_URL_SECTION1, section1Data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("\n" + "=".repeat(80));
        console.log("✅ SECTION 1 API RESPONSE RECEIVED:");
        console.log("=".repeat(80));
        console.log("📍 Response Status:", response.status);
        console.log("📍 Response Status Text:", response.statusText);
        console.log("\n📦 RAW RESPONSE DATA:");
        console.log(JSON.stringify(response.data, null, 2));

        console.log("\n📋 ALL PROPERTIES IN RESPONSE:");
        if (typeof response.data === "object" && response.data !== null) {
          Object.keys(response.data).forEach((key) => {
            console.log(`   ${key}:`, response.data[key]);
          });
        }

        console.log("\n🔍 CHECKING FOR CONSULT_ID VARIATIONS:");
        console.log("   consult_id:", response.data.consult_id);
        console.log("   id:", response.data.id);
        console.log("   consultation_id:", response.data.consultation_id);
        console.log("   consultId:", response.data.consultId);
        console.log(
          "   section2[0]?.consult_id:",
          response.data.section2?.[0]?.consult_id,
        );
        console.log("   uuid:", response.data.uuid);
        console.log("=".repeat(80));

        // Extract and store consult_id from API response - try multiple field names
        const consultId =
          response.data.consult_id ||
          response.data.id ||
          response.data.consultation_id ||
          response.data.consultId ||
          response.data.section2?.[0]?.consult_id ||
          response.data.uuid;

        console.log("\n🔑 EXTRACTED CONSULT_ID FROM SECTION 1:", consultId);
        console.log("   Type:", typeof consultId);
        console.log("   Is Empty:", !consultId);
        console.log("   Length:", consultId ? consultId.toString().length : 0);

        // NOW: Fetch consultation-combined API with email to get the complete data with consult_id
        console.log("\n" + "=".repeat(80));
        console.log("🔄 FETCHING CONSULTATION-COMBINED DATA WITH EMAIL:");
        console.log("=".repeat(80));
        console.log("📧 Email to fetch:", formData.email);

        let finalConsultId = consultId;

        try {
          const consultationUrl = `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/consultation-combined/?email=${encodeURIComponent(formData.email)}`;
          console.log("📍 API URL:", consultationUrl);

          const consultationResponse = await axios.get(consultationUrl);

          console.log("✅ CONSULTATION-COMBINED API RESPONSE RECEIVED:");
          console.log(
            "📦 Response Data:",
            JSON.stringify(consultationResponse.data, null, 2),
          );

          if (
            consultationResponse.data &&
            Array.isArray(consultationResponse.data) &&
            consultationResponse.data.length > 0
          ) {
            const consultationData = consultationResponse.data[0];

            // Extract consult_id from this response
            finalConsultId =
              consultationData.consult_id ||
              consultationData.section2?.[0]?.consult_id ||
              consultationData.id ||
              consultId;

            console.log(
              "\n🔑 FINAL CONSULT_ID FROM CONSULTATION API:",
              finalConsultId,
            );
          } else {
            console.log("⚠️ Consultation API returned empty data");
            // Keep using consultId from Section 1
          }
        } catch (consultationError) {
          console.error(
            "❌ ERROR FETCHING CONSULTATION-COMBINED API:",
            consultationError.message,
          );
          // Keep using consultId from Section 1
        }

        // Set consult_id and navigate to Section 2
        if (finalConsultId) {
          console.log(
            "✅ Setting consult_id in formData and ref:",
            finalConsultId,
          );
          // Update ref first (synchronous)
          consultIdRef.current = finalConsultId;
          // Update formData with consult_id
          setFormData((prev) => {
            const updated = {
              ...prev,
              consult_id: finalConsultId,
            };
            console.log(
              "✅ Updated formData after setting consult_id:",
              updated.consult_id,
            );
            return updated;
          });

          // Show success alert
          setSubmitMessage(
            "Your consultation request has been submitted successfully!",
          );

          // Mark section 1 as completed
          setCompletedSteps((prev) => [...prev, 1]);

          // Navigate to Section 2 immediately (no need for delay since we're updating state properly)
          setTimeout(() => {
            setCurrentStep(2);
            // Clear message after navigation
            setSubmitMessage("");
          }, 2500);
        } else {
          console.error(
            "❌ Failed to extract valid consult_id from any API response!",
          );
          throw new Error("consult_id not found in API responses");
        }
      } catch (error) {
        console.error("\n" + "=".repeat(80));
        console.error("❌ ERROR SUBMITTING SECTION 1:");
        console.error("=".repeat(80));
        console.error("   Error Message:", error.message);
        console.error("   Error Code:", error.code);
        console.error("   Full Error:", error);

        // Handle error
        let errorMessage = "Error submitting section 1. Please try again.";
        if (error.response) {
          console.error("\n   ❌ Server responded with error:");
          console.error("   Status:", error.response.status);
          console.error("   Status Text:", error.response.statusText);
          console.error(
            "   Response Data:",
            JSON.stringify(error.response.data, null, 2),
          );
          console.error("=".repeat(80));

          if (error.response.data && typeof error.response.data === "object") {
            const errorMessages = [];
            for (const field in error.response.data) {
              if (Array.isArray(error.response.data[field])) {
                errorMessages.push(
                  `${field}: ${error.response.data[field].join(", ")}`,
                );
              } else {
                errorMessages.push(`${field}: ${error.response.data[field]}`);
              }

              if (field === "email") {
                setErrors((prev) => ({
                  ...prev,
                  [field]: error.response.data[field],
                }));
              }
            }
            errorMessage = `Error: ${errorMessages.join("; ")}`;
          } else {
            errorMessage = `Error: ${error.response.data || "An error occurred while submitting your request."}`;
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
      console.log("\n" + "=".repeat(80));
      console.log("📋 SECTION 2 SUBMISSION - PRE-CHECKS:");
      console.log("=".repeat(80));
      console.log("Current Step:", currentStep);
      console.log("isSubmitting:", isSubmitting);
      console.log("consult_id from formData:", formData.consult_id);
      console.log("consult_id from ref:", consultIdRef.current);
      console.log("consult_id empty?:", !consultIdRef.current);
      console.log("consult_id type:", typeof consultIdRef.current);
      console.log("consultDataFetched:", consultDataFetched);
      console.log("Full formData:", JSON.stringify(formData, null, 2));
      console.log("=".repeat(80));

      // IMPORTANT: Check if consult_id exists before allowing submission
      if (!consultIdRef.current || !consultIdRef.current.toString().trim()) {
        console.error(
          "❌ CRITICAL: consult_id is missing before Section 2 submission",
        );
        console.error("   This could happen if:");
        console.error("   1. Section 1 was not submitted yet");
        console.error(
          "   2. The API response from Section 1 didn't include consult_id",
        );
        console.error(
          "   3. The consultation data from URL wasn't loaded properly",
        );
        console.error(
          "\n   Current formData.consult_id value:",
          formData.consult_id,
        );
        console.error("   Current formData.full_name:", formData.full_name);
        console.error("   Current formData.email:", formData.email);
        console.error("=".repeat(80));

        setSubmitMessage(
          "❌ ERROR: Consultation ID not found! Please complete Section 1 first by clicking Next, or check the console for details.",
        );
        return;
      }

      console.log(
        "✅ consult_id found! Proceeding with Section 2 validation...",
      );

      // Validate Section 2 before submitting
      if (!validateMedicalInfo()) {
        console.log("❌ Validation failed for Section 2"); // Debug log
        return;
      }

      console.log("✅ Validation passed for Section 2"); // Debug log
      setIsSubmitting(true);

      // Build a readable payload representation BEFORE try block
      const section2Payload = {
        consult_id: consultIdRef.current,
        main_disease_problem: formData.main_disease_problem,
        associated_complications: formData.associated_complications,
        mode_of_onset: formData.mode_of_onset,
        problem_start_description: formData.problem_start_description,
        progression_over_time: formData.progression_over_time,
        significant_health_events: formData.significant_health_events,
        past_medications: formData.past_medications,
        medical_history: formData.medical_history,
        hospitalizations: formData.hospitalizations,
        surgeries: formData.surgeries,
        accidents: formData.accidents,
        disease_history: formData.disease_history,
        other_chronic_disease: formData.other_chronic_disease,
        diagnosing_doctor_name: formData.diagnosing_doctor_name,
        hospital_clinic_name: formData.hospital_clinic_name,
        city: formData.city,
        date_of_diagnosis: formData.date_of_diagnosis,
      };

      try {
        // Submit Section 2 data
        const section2Data = new FormData();

        // Log consult_id quality before appending
        console.log("\n" + "=".repeat(80));
        console.log("📤 PREPARING SECTION 2 SUBMISSION:");
        console.log("=".repeat(80));
        console.log("🔑 consult_id from ref:", consultIdRef.current);
        console.log("🔑 consult_id type:", typeof consultIdRef.current);
        console.log(
          "🔑 consult_id length:",
          consultIdRef.current ? consultIdRef.current.toString().length : 0,
        );
        console.log("🔑 consult_id is empty:", !consultIdRef.current);
        console.log(
          "🔑 consult_id trimmed empty:",
          !consultIdRef.current?.toString().trim(),
        );
        console.log("\n⚠️ PAYLOAD STRUCTURE CHECK:");
        console.log("   consult_id MUST be present:", {
          present: !!consultIdRef.current,
          value: consultIdRef.current,
        });
        console.log("=".repeat(80));

        section2Data.append("consult_id", consultIdRef.current);
        section2Data.append(
          "main_disease_problem",
          formData.main_disease_problem,
        );
        section2Data.append(
          "associated_complications",
          formData.associated_complications,
        );
        section2Data.append("mode_of_onset", formData.mode_of_onset);
        section2Data.append(
          "problem_start_description",
          formData.problem_start_description,
        );
        section2Data.append(
          "progression_over_time",
          formData.progression_over_time,
        );
        section2Data.append(
          "significant_health_events",
          formData.significant_health_events,
        );
        section2Data.append("past_medications", formData.past_medications);
        section2Data.append("medical_history", formData.medical_history);
        section2Data.append("hospitalizations", formData.hospitalizations);
        section2Data.append("surgeries", formData.surgeries);
        section2Data.append("accidents", formData.accidents);
        section2Data.append(
          "disease_history",
          JSON.stringify(formData.disease_history),
        );
        section2Data.append(
          "other_chronic_disease",
          formData.other_chronic_disease,
        );
        section2Data.append(
          "diagnosing_doctor_name",
          formData.diagnosing_doctor_name,
        );
        section2Data.append(
          "hospital_clinic_name",
          formData.hospital_clinic_name,
        );
        section2Data.append("city", formData.city);
        section2Data.append("date_of_diagnosis", formData.date_of_diagnosis);
        if (formData.medical_reports) {
          section2Data.append("medical_reports", formData.medical_reports);
        }

        // Log FormData contents properly
        console.log("\n" + "=".repeat(80));
        console.log("📤 SUBMITTING SECTION 2 DATA TO API:");
        console.log("=".repeat(80));
        console.log("📍 API Endpoint:", API_URL_SECTION2);

        console.log("\n📋 SECTION 2 PAYLOAD (JSON):");
        console.log(JSON.stringify(section2Payload, null, 2));

        console.log("\n✅ PAYLOAD VALIDATION:");
        console.log("   consult_id present:", !!section2Payload.consult_id);
        console.log("   consult_id value:", section2Payload.consult_id);
        console.log(
          "   main_disease_problem present:",
          !!section2Payload.main_disease_problem,
        );
        console.log(
          "   mode_of_onset present:",
          !!section2Payload.mode_of_onset,
        );
        console.log(
          "   disease_history count:",
          section2Payload.disease_history.length,
        );
        console.log("   Key fields check:", {
          consult_id: section2Payload.consult_id ? "✅" : "❌",
          main_disease_problem: section2Payload.main_disease_problem
            ? "✅"
            : "❌",
          mode_of_onset: section2Payload.mode_of_onset ? "✅" : "❌",
          disease_history:
            section2Payload.disease_history.length > 0 ? "✅" : "❌",
        });

        console.log("\n📋 FormData Contents:");
        for (let [key, value] of section2Data.entries()) {
          console.log(
            `  ${key}: ${typeof value === "string" ? value.substring(0, 100) : value}`,
          );
        }
        console.log(
          "\n🔑 CRITICAL: CONSULT_ID BEING SENT:",
          consultIdRef.current,
        );
        console.log(
          "🔑 CONSULT_ID EMPTY?:",
          !consultIdRef.current || !consultIdRef.current.toString().trim(),
        );
        console.log("=".repeat(80));

        const response = await axios.post(API_URL_SECTION2, section2Data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("\n" + "=".repeat(80));
        console.log("✅ SECTION 2 API RESPONSE RECEIVED:");
        console.log("=".repeat(80));
        console.log("📊 Response Status:", response.status);
        console.log("📊 Response Status Text:", response.statusText);
        console.log("\n📦 Response Data:");
        console.log(JSON.stringify(response.data, null, 2));

        // Show what was sent
        console.log("\n" + "=".repeat(80));
        console.log("✅ SECTION 2 SUBMISSION SUMMARY:");
        console.log("=".repeat(80));
        console.log("📤 Sent Payload:");
        console.log("  {");
        console.log(`    "consult_id": "${section2Payload.consult_id}",`);
        console.log(
          `    "main_disease_problem": "${section2Payload.main_disease_problem}",`,
        );
        console.log(`    "mode_of_onset": "${section2Payload.mode_of_onset}",`);
        console.log(
          `    "diagnosing_doctor_name": "${section2Payload.diagnosing_doctor_name}",`,
        );
        console.log(
          `    "hospital_clinic_name": "${section2Payload.hospital_clinic_name}",`,
        );
        console.log("    ...and more fields");
        console.log("  }");
        console.log("\n✅ API Response:");
        console.log(JSON.stringify(response.data, null, 2));
        console.log("=".repeat(80));

        // Show success alert
        setSubmitMessage(
          "Your consultation request has been submitted successfully!",
        );

        // Mark section 2 as completed
        setCompletedSteps((prev) => [...prev, 2]);

        // Auto navigate to section 3 after a short delay
        setTimeout(() => {
          setCurrentStep(3);
          // Clear message after navigation
          setSubmitMessage("");
        }, 2000);
      } catch (error) {
        console.error("\n" + "=".repeat(80));
        console.error("❌ ERROR SUBMITTING SECTION 2:");
        console.error("=".repeat(80));
        console.error("   Error Message:", error.message);
        console.error("   Error Code:", error.code);

        // Show what payload was sent
        console.error("\n📤 PAYLOAD THAT FAILED:");
        console.error(JSON.stringify(section2Payload, null, 2));

        console.error("\n   Full Error Object:", error);

        // Handle error with more detailed logging
        let errorMessage = "Error submitting section 2. Please try again.";
        if (error.response) {
          console.error("\n   ❌ Server responded with error:");
          console.error("   Status:", error.response.status);
          console.error("   Status Text:", error.response.statusText);
          console.error("\n   📦 Full Response Data:");
          console.error(JSON.stringify(error.response.data, null, 2));
          console.error("   📋 Response Headers:", error.response.headers);

          if (error.response.data && typeof error.response.data === "object") {
            console.error("\n   💥 DETAILED FIELD ERRORS:");
            const errorMessages = [];
            for (const field in error.response.data) {
              if (Array.isArray(error.response.data[field])) {
                console.error(`   ❌ ${field}:`, error.response.data[field]);
                errorMessages.push(
                  `${field}: ${error.response.data[field].join(", ")}`,
                );
              } else {
                console.error(`   ❌ ${field}:`, error.response.data[field]);
                errorMessages.push(`${field}: ${error.response.data[field]}`);
              }

              // Set field-specific errors for all fields, not just email
              setErrors((prev) => ({
                ...prev,
                [field]: error.response.data[field],
              }));
            }
            errorMessage = `Error: ${errorMessages.join("; ")}`;
            console.error("\n   📊 All Field Errors:", errorMessages);
          } else {
            errorMessage = `Error: ${error.response.data || "An error occurred while submitting your request."}`;
          }
        } else if (error.request) {
          console.error(
            "\n   ❌ Request made but no response received:",
            error.request,
          );
          errorMessage =
            "No response from server. Please check your internet connection and try again.";
        } else {
          console.error("\n   ❌ Error setting up request:", error.message);
          errorMessage = `Error: ${error.message}`;
        }

        console.error("\n   📌 FINAL ERROR MESSAGE:", errorMessage);
        console.error("\n📋 WHAT WAS SENT (Section 2 Payload):");
        console.error(JSON.stringify(section2Payload, null, 2));
        console.error("=".repeat(80));

        setSubmitMessage(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
     } else if (currentStep === 3) {
      console.log("\n" + "=".repeat(80));
      console.log("📋 SECTION 3 SUBMISSION - PRE-CHECKS:");
      console.log("=".repeat(80));
      console.log("Current Step:", currentStep);
      console.log("isSubmitting:", isSubmitting);
      console.log("consult_id from ref:", consultIdRef.current);
      console.log("consult_id empty?:", !consultIdRef.current);
      console.log("consult_id type:", typeof consultIdRef.current);
      console.log("consultDataFetched:", consultDataFetched);
      console.log("Full formData for Section 3:", JSON.stringify(formData, null, 2));
      console.log("=".repeat(80));

      // IMPORTANT: Check if consult_id exists before allowing submission
      if (!consultIdRef.current || !consultIdRef.current.toString().trim()) {
        console.error(
          "❌ CRITICAL: consult_id is missing before Section 3 submission",
        );
        setSubmitMessage(
          "❌ ERROR: Consultation ID not found! Please complete previous sections first.",
        );
        return;
      }

      console.log(
        "✅ consult_id found! Proceeding with Section 3 validation...",
      );

      // Validate Section 3 before submitting
      if (!validateLifestyleInfo()) {
        console.log("❌ Validation failed for Section 3");
        return;
      }

      console.log("✅ Validation passed for Section 3");
      setIsSubmitting(true);

      // Build a readable payload representation BEFORE try block
      const selectedHabits = Object.keys(formData.habits).filter(habit => formData.habits[habit] === "Yes");
      const section3Payload = {
        consult_id: consultIdRef.current,
        habits: selectedHabits,
        type_of_exercise: formData.type_of_exercise,
        frequency: formData.frequency,
        mental_workload: formData.mental_workload,
        stress_levels: formData.stress_levels,
        social_interaction_level: formData.social_interaction_level,
        number_of_pregnancies: parseInt(formData.number_of_pregnancies) || 0,
        number_of_living_children: parseInt(formData.number_of_living_children) || 0,
        mode_of_delivery: formData.mode_of_delivery,
        menstrual_history: formData.menstrual_history,
        gynaecological_surgery: formData.gynaecological_surgery,
      };

      try {
        // Submit Section 3 data as JSON to preserve null values
        console.log("\n" + "=".repeat(80));
        console.log("📤 SUBMITTING SECTION 3 DATA TO API:");
        console.log("=".repeat(80));
        console.log("📍 API Endpoint:", API_URL_SECTION3);

        console.log("\n📋 SECTION 3 PAYLOAD (JSON):");
        console.log(JSON.stringify(section3Payload, null, 2));

        console.log("\n✅ PAYLOAD VALIDATION:");
        console.log("   consult_id present:", !!section3Payload.consult_id);
        console.log("   consult_id value:", section3Payload.consult_id);
        console.log(
          "   habits count:",
          section3Payload.habits.length,
        );
        console.log("   Key fields check:", {
          consult_id: section3Payload.consult_id ? "✅" : "❌",
          habits: section3Payload.habits.length > 0 ? "✅" : "❌",
        });

        console.log(
          "\n🔑 CRITICAL: CONSULT_ID BEING SENT:",
          consultIdRef.current,
        );
        console.log(
          "🔑 CONSULT_ID EMPTY?:",
          !consultIdRef.current || !consultIdRef.current.toString().trim(),
        );
        console.log("=".repeat(80));

        const response = await axios.post(API_URL_SECTION3, section3Payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("\n" + "=".repeat(80));
        console.log("✅ SECTION 3 API RESPONSE RECEIVED:");
        console.log("=".repeat(80));
        console.log("📊 Response Status:", response.status);
        console.log("📊 Response Status Text:", response.statusText);
        console.log("\n📦 Response Data:");
        console.log(JSON.stringify(response.data, null, 2));

        // Show what was sent
        console.log("\n" + "=".repeat(80));
        console.log("✅ SECTION 3 SUBMISSION SUMMARY:");
        console.log("=".repeat(80));
        console.log("📤 Sent Payload:");
        console.log("  {");
        console.log(`    "consult_id": "${section3Payload.consult_id}",`);
        console.log(
          `    "habits": ${JSON.stringify(section3Payload.habits)},`,
        );
        console.log(`    "type_of_exercise": "${section3Payload.type_of_exercise}",`);
        console.log(`    "frequency": "${section3Payload.frequency}",`);
        console.log("    ...and more fields");
        console.log("  }");
        console.log("\n✅ API Response:");
        console.log(JSON.stringify(response.data, null, 2));
        console.log("=".repeat(80));

        // Show success alert
        setSubmitMessage(
          "Your consultation request has been submitted successfully!",
        );

        // Mark section 3 as completed
        setCompletedSteps((prev) => [...prev, 3]);

        // Auto navigate to section 4 after a short delay
        setTimeout(() => {
          setCurrentStep(4);
          // Clear message after navigation
          setSubmitMessage("");
        }, 2000);
      } catch (error) {
        console.error("\n" + "=".repeat(80));
        console.error("❌ ERROR SUBMITTING SECTION 3:");
        console.error("=".repeat(80));
        console.error("   Error Message:", error.message);
        console.error("   Error Code:", error.code);

        // Show what payload was sent
        console.error("\n📤 PAYLOAD THAT FAILED:");
        console.error(JSON.stringify(section3Payload, null, 2));

        console.error("\n   Full Error Object:", error);

        // Handle error with more detailed logging
        let errorMessage = "Error submitting section 3. Please try again.";
        if (error.response) {
          console.error("\n   ❌ Server responded with error:");
          console.error("   Status:", error.response.status);
          console.error("   Status Text:", error.response.statusText);
          console.error("\n   📦 Full Response Data:");
          console.error(JSON.stringify(error.response.data, null, 2));
          console.error("   📋 Response Headers:", error.response.headers);

          if (error.response.data && typeof error.response.data === "object") {
            console.error("\n   💥 DETAILED FIELD ERRORS:");
            const errorMessages = [];
            for (const field in error.response.data) {
              if (Array.isArray(error.response.data[field])) {
                console.error(`   ❌ ${field}:`, error.response.data[field]);
                errorMessages.push(
                  `${field}: ${error.response.data[field].join(", ")}`,
                );
              } else {
                console.error(`   ❌ ${field}:`, error.response.data[field]);
                errorMessages.push(`${field}: ${error.response.data[field]}`);
              }

              // Set field-specific errors for all fields
              setErrors((prev) => ({
                ...prev,
                [field]: error.response.data[field],
              }));
            }
            errorMessage = `Error: ${errorMessages.join("; ")}`;
            console.error("\n   📊 All Field Errors:", errorMessages);
          } else {
            errorMessage = `Error: ${error.response.data || "An error occurred while submitting your request."}`;
          }
        } else if (error.request) {
          console.error(
            "\n   ❌ Request made but no response received:",
            error.request,
          );
          errorMessage =
            "No response from server. Please check your internet connection and try again.";
        } else {
          console.error("\n   ❌ Error setting up request:", error.message);
          errorMessage = `Error: ${error.message}`;
        }

        console.error("\n   📌 FINAL ERROR MESSAGE:", errorMessage);
        console.error("\n📋 WHAT WAS SENT (Section 3 Payload):");
        console.error(JSON.stringify(section3Payload, null, 2));
        console.error("=".repeat(80));

        setSubmitMessage(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } else if (currentStep === 4) {
      console.log("\n" + "=".repeat(80));
      console.log("📋 SECTION 4 SUBMISSION - PRE-CHECKS:");
      console.log("=".repeat(80));
      console.log("Current Step:", currentStep);
      console.log("isSubmitting:", isSubmitting);
      console.log("consult_id from ref:", consultIdRef.current);
      console.log("Full formData for Section 4:", JSON.stringify(formData, null, 2));

      // Validate Section 4 before submitting
      if (!validatePhysicalPsychologicalInfo()) {
        console.log("❌ Section 4 validation failed");
        return;
      }

      console.log("✅ Section 4 validation passed");
      setIsSubmitting(true);

      try {
        // Submit Section 4 data
        const section4Data = new FormData();
        section4Data.append("consult_id", consultIdRef.current);
        section4Data.append("body_build", JSON.stringify(formData.body_build));
        section4Data.append("complexion", JSON.stringify(formData.complexion));
        section4Data.append("skin_nature", JSON.stringify(formData.skin_nature));
        section4Data.append("hair_nature", JSON.stringify(formData.hair_nature));
        section4Data.append("premature_greying_or_balding", JSON.stringify(formData.premature_greying_or_balding));
        section4Data.append("joint_characteristics", JSON.stringify(formData.joint_characteristics));
        section4Data.append("veins_and_tendons", JSON.stringify(formData.veins_and_tendons));
        section4Data.append("body_temperature", JSON.stringify(formData.body_temperature));
        section4Data.append("temperature_preference", JSON.stringify(formData.temperature_preference));
        section4Data.append("eyes", JSON.stringify(formData.eyes));
        section4Data.append("teeth_and_gums", JSON.stringify(formData.teeth_and_gums));
        section4Data.append("voice_nature", JSON.stringify(formData.voice_nature));
        section4Data.append("appetite", JSON.stringify(formData.appetite));
        section4Data.append("taste_preference", JSON.stringify(formData.taste_preference));
        section4Data.append("sweating", JSON.stringify(formData.sweating));
        section4Data.append("bowel_habits", JSON.stringify(formData.bowel_habits));
        section4Data.append("urination", JSON.stringify(formData.urination));
        section4Data.append("sleep", JSON.stringify(formData.sleep));
        section4Data.append("memory", JSON.stringify(formData.memory));
        section4Data.append("psychological_state", JSON.stringify(formData.psychological_state));
        section4Data.append("additional_clinical_information", formData.additional_clinical_information);

        // Log FormData contents properly
        console.log("\n📤 SUBMITTING SECTION 4 DATA:");
        for (let [key, value] of section4Data.entries()) {
          console.log(`   ${key}: ${value}`);
        }
        
        const response = await axios.post(API_URL_SECTION4, section4Data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("\n✅ SECTION 4 API RESPONSE RECEIVED:");
        console.log("Response Status:", response.status);
        console.log("Response Data:", JSON.stringify(response.data, null, 2));

        // Show success alert
        setSubmitMessage(
          "Your consultation request has been submitted successfully!",
        );

        // Mark section 4 as completed
        setCompletedSteps((prev) => [...prev, 4]);

        // Auto navigate to review step after a short delay
        console.log("🔄 Navigating to review step (step 5)...");
        setTimeout(() => {
          setCurrentStep(5);
          // Clear message after navigation
          setSubmitMessage("");
        }, 2000);
      } catch (error) {
        console.error("Error submitting Section 4:", error);

        // Handle error
        let errorMessage = "Error submitting section 4. Please try again.";
        if (error.response) {
          if (error.response.data && typeof error.response.data === "object") {
            const errorMessages = [];
            for (const field in error.response.data) {
              if (Array.isArray(error.response.data[field])) {
                errorMessages.push(
                  `${field}: ${error.response.data[field].join(", ")}`,
                );
              } else {
                errorMessages.push(`${field}: ${error.response.data[field]}`);
              }

              if (field === "email") {
                setErrors((prev) => ({
                  ...prev,
                  [field]: error.response.data[field],
                }));
              }
            }
            errorMessage = `Error: ${errorMessages.join("; ")}`;
          } else {
            errorMessage = `Error: ${error.response.data || "An error occurred while submitting your request."}`;
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

      {/* DEBUG: Show consult_id status */}
      <div className="alert alert-info" style={{ marginBottom: "20px" }}>
        <strong>Consultation Status:</strong>{" "}
        {consultIdRef.current ? (
          <span style={{ color: "green" }}>
            ✓ Consultation ID Loaded: {consultIdRef.current}
          </span>
        ) : (
          <span style={{ color: "red" }}>
            ✗ Consultation ID NOT loaded - Data may still be loading...
          </span>
        )}
      </div>

      <div className="row mt-3">
        {/* Hidden field for consult_id */}
        <input
          type="hidden"
          id="consult_id"
          name="consult_id"
          value={formData.consult_id}
          onChange={handleInputChange}
        />

        <h3>Chief Complaint</h3>
        <div className="col-lg-4 mb-3 col-md-4 col-sm-12">
          <label htmlFor="main_disease_problem" className="form-label">
            Main disease/problem with duration{" "}
            <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.main_disease_problem ? "is-invalid" : ""}`}
            id="main_disease_problem"
            name="main_disease_problem"
            value={formData.main_disease_problem}
            onChange={handleInputChange}
            rows="3"
            placeholder="e.g., Type 2 Diabetes for 5 years"
          ></textarea>
          {errors.main_disease_problem && (
            <div className="invalid-feedback">
              {errors.main_disease_problem}
            </div>
          )}
        </div>
        <div className="col-lg-4 mb-4 col-md-6 col-sm-12">
          <label htmlFor="associated_complications" className="form-label">
            Associated complications or conditions
          </label>
          <textarea
            className={`form-control ${errors.associated_complications ? "is-invalid" : ""}`}
            id="associated_complications"
            name="associated_complications"
            value={formData.associated_complications}
            onChange={handleInputChange}
            rows="3"
            placeholder="e.g., Mild neuropathy and high cholesterol"
          ></textarea>
          {errors.associated_complications && (
            <div className="invalid-feedback">
              {errors.associated_complications}
            </div>
          )}
        </div>
        <h3>History of Present Illness</h3>
        <div className="col-lg-4 mb-3 col-md-4 col-sm-12">
          <label htmlFor="mode_of_onset" className="form-label">
            Mode of Onset <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errors.mode_of_onset ? "is-invalid" : ""}`}
            id="mode_of_onset"
            name="mode_of_onset"
            value={formData.mode_of_onset}
            onChange={handleInputChange}
          >
            <option value="">Select Mode</option>
            <option value="gradual">Gradual</option>
            <option value="sudden">Sudden</option>
          </select>
          {errors.mode_of_onset && (
            <div className="invalid-feedback">{errors.mode_of_onset}</div>
          )}
        </div>

        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="problem_start_description" className="form-label">
            How did the problem start ? <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.problem_start_description ? "is-invalid" : ""}`}
            id="problem_start_description"
            name="problem_start_description"
            value={formData.problem_start_description}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g., Started with frequent urination and fatigue"
          ></textarea>
          {errors.problem_start_description && (
            <div className="invalid-feedback">
              {errors.problem_start_description}
            </div>
          )}
        </div>
        <div className="col-12 mb-3">
          <label htmlFor="progression_over_time" className="form-label">
            How has it progressed over time ?{" "}
            <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.progression_over_time ? "is-invalid" : ""}`}
            id="progression_over_time"
            name="progression_over_time"
            value={formData.progression_over_time}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g., Symptoms gradually worsened over 2 years"
          ></textarea>
          {errors.progression_over_time && (
            <div className="invalid-feedback">
              {errors.progression_over_time}
            </div>
          )}
        </div>
        <h5>Section 3 Medical History</h5>
        <h3> Past Medical History: Please specify if applicable</h3>
        <div className="col-12 mb-3">
          <label htmlFor="significant_health_events" className="form-label">
            Other Significant health events
          </label>
          <textarea
            className={`form-control ${errors.significant_health_events ? "is-invalid" : ""}`}
            id="significant_health_events"
            name="significant_health_events"
            value={formData.significant_health_events}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g., Hospitalized once due to high blood sugar levels"
          ></textarea>
          {errors.significant_health_events && (
            <div className="invalid-feedback">
              {errors.significant_health_events}
            </div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="past_medications" className="form-label">
            Current or past medications
          </label>
          <textarea
            className={`form-control ${errors.past_medications ? "is-invalid" : ""}`}
            id="past_medications"
            name="past_medications"
            value={formData.past_medications}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g., Metformin 500mg twice daily"
          ></textarea>
          {errors.past_medications && (
            <div className="invalid-feedback">{errors.past_medications}</div>
          )}
        </div>

        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="hospitalizations" className="form-label">
            Hospitalizations
          </label>
          <textarea
            className={`form-control ${errors.hospitalizations ? "is-invalid" : ""}`}
            id="hospitalizations"
            name="hospitalizations"
            value={formData.hospitalizations}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g., Admitted in 2022 for 3 days"
          ></textarea>
          {errors.hospitalizations && (
            <div className="invalid-feedback">{errors.hospitalizations}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="surgeries" className="form-label">
            Surgeries
          </label>
          <textarea
            className={`form-control ${errors.surgeries ? "is-invalid" : ""}`}
            id="surgeries"
            name="surgeries"
            value={formData.surgeries}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g., Appendix surgery in 2015"
          ></textarea>
          {errors.surgeries && (
            <div className="invalid-feedback">{errors.surgeries}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="accidents" className="form-label">
            Accidents
          </label>
          <textarea
            className={`form-control ${errors.accidents ? "is-invalid" : ""}`}
            id="accidents"
            name="accidents"
            value={formData.accidents}
            onChange={handleInputChange}
            rows="2"
            placeholder="e.g., Minor road accident in 2020"
          ></textarea>
          {errors.accidents && (
            <div className="invalid-feedback">{errors.accidents}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="disease_history" className="form-label">
            Family / Personal Disease History{" "}
            <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.disease_history ? "is-invalid" : ""}`}
              type="button"
              id="diseaseHistoryDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'diseaseHistory' ? null : 'diseaseHistory')}
              aria-expanded={isDropdownOpen === 'diseaseHistory'}
            >
              {formData.disease_history.length > 0
                ? `${formData.disease_history.length} disease(s) selected`
                : "Select disease(s)"}
            </button>
            {isDropdownOpen === 'diseaseHistory' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="diseaseHistoryDropdown"
              >
                {[
                  { value: "Diabetes", label: "Diabetes" },
                  { value: "Hypertension", label: "Hypertension" },
                  { value: "Cancer", label: "Cancer" },
                  { value: "Tuberculosis", label: "Tuberculosis" },
                  { value: "Memory Disorders", label: "Memory disorders" },
                  { value: "Acidity_Flatulence", label: "Acidity/Flatulence" },
                  {
                    value: "Other_Chronic_Disease",
                    label: "Any other chronic disease",
                  },
                ].map((disease) => (
                  <li key={disease.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`disease-${disease.value}`}
                        value={disease.value}
                        checked={formData.disease_history.includes(
                          disease.value,
                        )}
                        onChange={(e) => {
                          let updatedDiseases;
                          if (e.target.checked) {
                            updatedDiseases = [
                              ...formData.disease_history,
                              disease.value,
                            ];
                          } else {
                            updatedDiseases = formData.disease_history.filter(
                              (d) => d !== disease.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            disease_history: updatedDiseases,
                          }));
                          if (errors.disease_history) {
                            setErrors({
                              ...errors,
                              disease_history: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`disease-${disease.value}`}
                      >
                        {disease.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.disease_history && (
            <div className="invalid-feedback">{errors.disease_history}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="other_chronic_disease" className="form-label">
            Other Chronic Diseases
          </label>
          <input
            type="text"
            className={`form-control ${errors.other_chronic_disease ? "is-invalid" : ""}`}
            id="other_chronic_disease"
            name="other_chronic_disease"
            value={formData.other_chronic_disease}
            onChange={handleInputChange}
            placeholder="e.g., None"
          />
          {errors.other_chronic_disease && (
            <div className="invalid-feedback">
              {errors.other_chronic_disease}
            </div>
          )}
        </div>
        <h5> Section 4 DIAGNOSTIC DETAILS</h5>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="diagnosing_doctor_name" className="form-label">
            Diagnosing Doctor Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.diagnosing_doctor_name ? "is-invalid" : ""}`}
            id="diagnosing_doctor_name"
            name="diagnosing_doctor_name"
            value={formData.diagnosing_doctor_name}
            onChange={handleInputChange}
            placeholder="e.g., Dr. Amit Sharma"
          />
          {errors.diagnosing_doctor_name && (
            <div className="invalid-feedback">
              {errors.diagnosing_doctor_name}
            </div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="hospital_clinic_name" className="form-label">
            Hospital/Clinic Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.hospital_clinic_name ? "is-invalid" : ""}`}
            id="hospital_clinic_name"
            name="hospital_clinic_name"
            value={formData.hospital_clinic_name}
            onChange={handleInputChange}
            placeholder="e.g., City Care Hospital"
          />
          {errors.hospital_clinic_name && (
            <div className="invalid-feedback">
              {errors.hospital_clinic_name}
            </div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="city" className="form-label">
            City <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.city ? "is-invalid" : ""}`}
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
            className={`form-control ${errors.date_of_diagnosis ? "is-invalid" : ""}`}
            id="date_of_diagnosis"
            name="date_of_diagnosis"
            value={formData.date_of_diagnosis}
            onChange={handleInputChange}
            max={todayDate}
          />
          {errors.date_of_diagnosis && (
            <div className="invalid-feedback">{errors.date_of_diagnosis}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="medical_reports" className="form-label">
            Medical Reports
          </label>
          <input
            type="file"
            className={`form-control ${errors.medical_reports ? "is-invalid" : ""}`}
            id="medical_reports"
            name="medical_reports"
            onChange={handleInputChange}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          {errors.medical_reports && (
            <div className="invalid-feedback">{errors.medical_reports}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12 medical-report">
          <label htmlFor="medical_reports" className="form-label">
            Medical Reports
          </label>
          <strong>Important:</strong> Please combine all your documents into a{" "}
          <strong>single PDF file</strong> before uploading.
          <br />
          <p>
            This includes: Discharge summary, Test reports, Treatment Details,
            Past treatments, and Current treatments.
          </p>
        </div>
      </div>
    </div>
  );

  // Render Personal Information Step
  const renderPersonalInfo = () => (
    <div className="consult-form-step">
      <h3 className="step-title">PERSONAL INFORMATION</h3>

      {/* Display Consultation Status */}
      <div className="alert alert-warning mb-4" role="alert">
        <div>
          <strong>Status:</strong>
        </div>
        <div>Loading: {isLoadingConsultData ? "YES" : "NO"}</div>
        <div>Fetched: {consultDataFetched ? "YES" : "NO"}</div>
        <div>
          Consultation ID: <code>{formData.consult_id || "(empty)"}</code>
        </div>
        <div>
          Email: <code>{formData.email || "(empty)"}</code>
        </div>
      </div>

      {/* Display Consultation ID */}
      {formData.consult_id && (
        <div className="alert alert-success mb-4" role="alert">
          <strong>✓ Consultation ID Loaded:</strong> {formData.consult_id}
        </div>
      )}

      <div className="row">
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="full_name" className="form-label">
            Full Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.full_name ? "is-invalid" : ""}`}
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            required
          />
          {errors.full_name && (
            <div className="invalid-feedback">{errors.full_name}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="date_of_birth" className="form-label">
            Date of Birth <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className={`form-control ${errors.date_of_birth ? "is-invalid" : ""}`}
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            max={todayDate}
            required
          />
          {errors.date_of_birth && (
            <div className="invalid-feedback">{errors.date_of_birth}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="gender" className="form-label">
            Gender <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errors.gender ? "is-invalid" : ""}`}
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
          {errors.gender && (
            <div className="invalid-feedback">{errors.gender}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="height" className="form-label">
            Feet and Inches <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            className={`form-control ${errors.height ? "is-invalid" : ""}`}
            id="height"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            placeholder="e.g., 172.50"
          />
          {errors.height && (
            <div className="invalid-feedback">{errors.height}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="weight" className="form-label">
            Weight (kg) <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            className={`form-control ${errors.weight ? "is-invalid" : ""}`}
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="e.g., 70.25 kg"
          />
          {errors.weight && (
            <div className="invalid-feedback">{errors.weight}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="occupation" className="form-label">
            Occupation <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.occupation ? "is-invalid" : ""}`}
            id="occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
          />
          {errors.occupation && (
            <div className="invalid-feedback">{errors.occupation}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="marital_status" className="form-label">
            Marital Status <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errors.marital_status ? "is-invalid" : ""}`}
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
          {errors.marital_status && (
            <div className="invalid-feedback">{errors.marital_status}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="email" className="form-label">
            Email <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="mobile_number" className="form-label">
            Mobile Number <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.mobile_number ? "is-invalid" : ""}`}
            id="mobile_number"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleInputChange}
            required
            placeholder="e.g., 9876543210"
          />
          {errors.mobile_number && (
            <div className="invalid-feedback">{errors.mobile_number}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="alternate_number" className="form-label">
            Alternate Number
          </label>
          <input
            type="text"
            className={`form-control ${errors.alternate_number ? "is-invalid" : ""}`}
            id="alternate_number"
            name="alternate_number"
            value={formData.alternate_number}
            onChange={handleInputChange}
            placeholder="e.g., 9123456780"
          />
          {errors.alternate_number && (
            <div className="invalid-feedback">{errors.alternate_number}</div>
          )}
        </div>
        <div className="col-8 mb-3">
          <label htmlFor="address" className="form-label">
            Complete Address Postal <span className="text-danger">*</span>
          </label>
          <textarea
            className={`form-control ${errors.address ? "is-invalid" : ""}`}
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows="3"
            placeholder="e.g., 123 MG Road, Near City Mall"
          ></textarea>
          {errors.address && (
            <div className="invalid-feedback">{errors.address}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="city" className="form-label">
            City <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.city ? "is-invalid" : ""}`}
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
            className={`form-control ${errors.pin ? "is-invalid" : ""}`}
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
            className={`form-control ${errors.state ? "is-invalid" : ""}`}
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="e.g., Karnataka"
          />
          {errors.state && (
            <div className="invalid-feedback">{errors.state}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="country" className="form-label">
            Country <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${errors.country ? "is-invalid" : ""}`}
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="e.g., India"
          />
          {errors.country && (
            <div className="invalid-feedback">{errors.country}</div>
          )}
        </div>

        {/* New fields */}
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="references" className="form-label">
            Reference <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${errors.references ? "is-invalid" : ""}`}
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
          {errors.references && (
            <div className="invalid-feedback">{errors.references}</div>
          )}
        </div>
      </div>
    </div>
  );

  // Render Lifestyle Assessment Step (Section 3)
  const renderPastTreatment = () => (
    <div className="consult-form-step">
      <h3 className="step-title">SECTION 3 — LIFESTYLE ASSESSMENT</h3>
      <div className="row">
<div className="col-lg-12 mb-3 col-md-6 col-sm-12">
  <label htmlFor="habits" className="form-label">
    Habits <span className="text-danger">*</span>
  </label>
  <div className="p-3 d-flex justify-content-around">
    {[
      { value: "Smoking", label: "Smoking" },
      { value: "Alcohol", label: "Alcohol" },
      { value: "Tobacco", label: "Tobacco" },
      { value: "Drugs", label: "Drugs" },
      { value: "Non-vegetarian diet", label: "Non-vegetarian diet" },
    ].map((option) => (
      <div key={option.value} className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <label className="form-check-label fw-medium">
            {option.label}
          </label>
        </div>
        <div className="d-flex gap-3 justify-content-center">
          <div className="form-check d-flex align-items-center">
            <input
              className="form-check-input"
              type="radio"
              name={`habits-${option.value}`}
              id={`habits-${option.value}-yes`}
              value="Yes"
              checked={formData.habits[option.value] === "Yes"}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  habits: {
                    ...prev.habits,
                    [option.value]: e.target.value,
                  },
                }));
                if (errors.habits) {
                  setErrors({
                    ...errors,
                    habits: "",
                  });
                }
              }}
            />
            <label
              className="form-check-label ms-2"
              htmlFor={`habits-${option.value}-yes`}
            >
              Yes
            </label>
          </div>
          <div className="form-check d-flex align-items-center">
            <input
              className="form-check-input"
              type="radio"
              name={`habits-${option.value}`}
              id={`habits-${option.value}-no`}
              value="No"
              checked={formData.habits[option.value] === "No"}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  habits: {
                    ...prev.habits,
                    [option.value]: e.target.value,
                  },
                }));
                if (errors.habits) {
                  setErrors({
                    ...errors,
                    habits: "",
                  });
                }
              }}
            />
            <label
              className="form-check-label ms-2"
              htmlFor={`habits-${option.value}-no`}
            >
              No
            </label>
          </div>
        </div>
      </div>
    ))}
  </div>
  {errors.habits && (
    <div className="invalid-feedback">{errors.habits}</div>
  )}
</div>

        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="type_of_exercise" className="form-label">
            Type of Exercise
          </label>
          <input
            type="text"
            className={`form-control ${errors.type_of_exercise ? "is-invalid" : ""}`}
            id="type_of_exercise"
            value={formData.type_of_exercise || ""}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                type_of_exercise: e.target.value,
              }));
              if (errors.type_of_exercise) {
                setErrors({
                  ...errors,
                  type_of_exercise: "",
                });
              }
            }}
            placeholder="e.g., Walking, Yoga, Gym"
          />
          {errors.type_of_exercise && (
            <div className="invalid-feedback">{errors.type_of_exercise}</div>
          )}
        </div>

        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="frequency" className="form-label">
            Frequency
          </label>
          <input
            type="text"
            className={`form-control ${errors.frequency ? "is-invalid" : ""}`}
            id="frequency"
            value={formData.frequency || ""}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                frequency: e.target.value,
              }));
              if (errors.frequency) {
                setErrors({
                  ...errors,
                  frequency: "",
                });
              }
            }}
            placeholder="e.g., 5 times per week, Rarely"
          />
          {errors.frequency && (
            <div className="invalid-feedback">{errors.frequency}</div>
          )}
        </div>

        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="mental_workload" className="form-label">
            Mental Workload
          </label>
          <input
            type="text"
            className={`form-control ${errors.mental_workload ? "is-invalid" : ""}`}
            id="mental_workload"
            value={formData.mental_workload || ""}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                mental_workload: e.target.value,
              }));
              if (errors.mental_workload) {
                setErrors({
                  ...errors,
                  mental_workload: "",
                });
              }
            }}
            placeholder="e.g., High, Moderate, Low"
          />
          {errors.mental_workload && (
            <div className="invalid-feedback">{errors.mental_workload}</div>
          )}
        </div>

        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="stress_levels" className="form-label">
            Stress Levels
          </label>
          <input
            type="text"
            className={`form-control ${errors.stress_levels ? "is-invalid" : ""}`}
            id="stress_levels"
            value={formData.stress_levels || ""}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                stress_levels: e.target.value,
              }));
              if (errors.stress_levels) {
                setErrors({
                  ...errors,
                  stress_levels: "",
                });
              }
            }}
            placeholder="e.g., High, Moderate, Low"
          />
          {errors.stress_levels && (
            <div className="invalid-feedback">{errors.stress_levels}</div>
          )}
        </div>

        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="social_interaction_level" className="form-label">
            Social Interaction Level
          </label>
          <input
            type="text"
            className={`form-control ${errors.social_interaction_level ? "is-invalid" : ""}`}
            id="social_interaction_level"
            value={formData.social_interaction_level || ""}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                social_interaction_level: e.target.value,
              }));
              if (errors.social_interaction_level) {
                setErrors({
                  ...errors,
                  social_interaction_level: "",
                });
              }
            }}
            placeholder="e.g., Good, Moderate, Low"
          />
          {errors.social_interaction_level && (
            <div className="invalid-feedback">{errors.social_interaction_level}</div>
          )}
        </div>
<h3>SECTION 6 — GYNAECOLOGICAL / OBSTETRIC HISTORY </h3>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="number_of_pregnancies" className="form-label">
            Number of pregnancies
          </label>
          <input
            type="number"
            className="form-control"
            id="number_of_pregnancies"
            name="number_of_pregnancies"
            value={formData.number_of_pregnancies}
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="number_of_living_children" className="form-label">
            Number of living children
          </label>
          <input
            type="number"
            className="form-control"
            id="number_of_living_children"
            name="number_of_living_children"
            value={formData.number_of_living_children}
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="mode_of_delivery" className="form-label">
            Mode of Delivery
          </label>
          <select
            className="form-select"
            id="mode_of_delivery"
            name="mode_of_delivery"
            value={formData.mode_of_delivery}
            onChange={handleInputChange}
          >
            <option value="">Select mode of delivery</option>
            <option value="Normal">Normal</option>
            <option value="Caesarean">Caesarean</option>
           
          </select>
        </div>

        <div className="col-lg-6 mb-3 col-md-6 col-sm-12">
          <label htmlFor="menstrual_history" className="form-label">
            Menstrual History
          </label>
          <textarea
            className="form-control"
            id="menstrual_history"
            name="menstrual_history"
            value={formData.menstrual_history}
            onChange={handleInputChange}
            rows="2"
          ></textarea>
        </div>

        <div className="col-lg-6 mb-3 col-md-6 col-sm-12">
          <label htmlFor="gynaecological_surgery" className="form-label">
            Gynaecological Surgery
          </label>
          <textarea
            className="form-control"
            id="gynaecological_surgery"
            name="gynaecological_surgery"
            value={formData.gynaecological_surgery}
            onChange={handleInputChange}
            rows="2"
          ></textarea>
        </div>
      </div>
    </div>
  );

  // Render Ayurvedic Constitution Analysis Step (Section 4)
  const renderPhysicalExamination = () => (
    <div className="consult-form-step">
      <h3 className="step-title">
        SECTION 4 — AYURVEDIC CONSTITUTION ANALYSIS
      </h3>
      <div className="row">
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="body_build" className="form-label">
            Body Build <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.body_build ? "is-invalid" : ""}`}
              type="button"
              id="bodyBuildDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'bodyBuild' ? null : 'bodyBuild')}
              aria-expanded={isDropdownOpen === 'bodyBuild'}
            >
              {formData.body_build.length > 0
                ? `${formData.body_build.length} option(s) selected`
                : "Select body build(s)"}
            </button>
            {isDropdownOpen === 'bodyBuild' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="bodyBuildDropdown"
              >
                {[
                  { value: "Lean", label: "Lean" },
                  { value: "Medium frame", label: "Medium frame" },
                  { value: "Heavy built", label: "Heavy built" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`bodyBuild-${option.value}`}
                        value={option.value}
                        checked={formData.body_build.includes(option.value)}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.body_build,
                              option.value,
                            ];
                          } else {
                            updatedValues = formData.body_build.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            body_build: updatedValues,
                          }));
                          if (errors.body_build) {
                            setErrors({
                              ...errors,
                              body_build: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`bodyBuild-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.body_build && (
            <div className="invalid-feedback">{errors.body_build}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="complexion" className="form-label">
            Complexion <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.complexion ? "is-invalid" : ""}`}
              type="button"
              id="complexionDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'complexion' ? null : 'complexion')}
              aria-expanded={isDropdownOpen === 'complexion'}
            >
              {formData.complexion.length > 0
                ? `${formData.complexion.length} option(s) selected`
                : "Select complexion(s)"}
            </button>
            {isDropdownOpen === 'complexion' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="complexionDropdown"
              >
                {[
                  { value: "Fair", label: "Fair" },
                  { value: "Dusky", label: "Dusky" },
                  { value: "Dark", label: "Dark" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`complexion-${option.value}`}
                        value={option.value}
                        checked={formData.complexion.includes(option.value)}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.complexion,
                              option.value,
                            ];
                          } else {
                            updatedValues = formData.complexion.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            complexion: updatedValues,
                          }));
                          if (errors.complexion) {
                            setErrors({
                              ...errors,
                              complexion: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`complexion-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.complexion && (
            <div className="invalid-feedback">{errors.complexion}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="skin_nature" className="form-label">
            Skin Nature <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.skin_nature ? "is-invalid" : ""}`}
              type="button"
              id="skinNatureDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'skinNature' ? null : 'skinNature')}
              aria-expanded={isDropdownOpen === 'skinNature'}
            >
              {formData.skin_nature.length > 0
                ? `${formData.skin_nature.length} option(s) selected`
                : "Select skin nature(s)"}
            </button>
            {isDropdownOpen === 'skinNature' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="skinNatureDropdown"
              >
                {[
                  { value: "Dry", label: "Dry" },
                  { value: "Oily", label: "Oily" },
                  { value: "Normal", label: "Normal" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`skinNature-${option.value}`}
                        value={option.value}
                        checked={formData.skin_nature.includes(option.value)}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.skin_nature,
                              option.value,
                            ];
                          } else {
                            updatedValues = formData.skin_nature.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            skin_nature: updatedValues,
                          }));
                          if (errors.skin_nature) {
                            setErrors({
                              ...errors,
                              skin_nature: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`skinNature-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.skin_nature && (
            <div className="invalid-feedback">{errors.skin_nature}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="hair_nature" className="form-label">
            Hair Nature <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.hair_nature ? "is-invalid" : ""}`}
              type="button"
              id="hairNatureDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'hairNature' ? null : 'hairNature')}
              aria-expanded={isDropdownOpen === 'hairNature'}
            >
              {formData.hair_nature.length > 0
                ? `${formData.hair_nature.length} option(s) selected`
                : "Select hair nature(s)"}
            </button>
            {isDropdownOpen === 'hairNature' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="hairNatureDropdown"
              >
                {[
                  { value: "Dry", label: "Dry" },
                  { value: "Frizzy", label: "Frizzy" },
                  { value: "Oily", label: "Oily" },
                  { value: "Silky", label: "Silky" },
                  { value: "Thick", label: "Thick" },
                  { value: "Thin", label: "Thin" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`hairNature-${option.value}`}
                        value={option.value}
                        checked={formData.hair_nature.includes(option.value)}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.hair_nature,
                              option.value,
                            ];
                          } else {
                            updatedValues = formData.hair_nature.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            hair_nature: updatedValues,
                          }));
                          if (errors.hair_nature) {
                            setErrors({
                              ...errors,
                              hair_nature: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`hairNature-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.hair_nature && (
            <div className="invalid-feedback">{errors.hair_nature}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="premature_greying_or_balding" className="form-label">
            Premature Greying or Balding <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.premature_greying_or_balding ? "is-invalid" : ""}`}
              type="button"
              id="prematureGreyingDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'prematureGreying' ? null : 'prematureGreying')}
              aria-expanded={isDropdownOpen === 'prematureGreying'}
            >
              {formData.premature_greying_or_balding.length > 0
                ? `${formData.premature_greying_or_balding.length} option(s) selected`
                : "Select premature greying or balding"}
            </button>
            {isDropdownOpen === 'prematureGreying' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="prematureGreyingDropdown"
              >
                {[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`prematureGreying-${option.value}`}
                        value={option.value}
                        checked={formData.premature_greying_or_balding.includes(
                          option.value,
                        )}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.premature_greying_or_balding,
                              option.value,
                            ];
                          } else {
                            updatedValues =
                              formData.premature_greying_or_balding.filter(
                                (d) => d !== option.value,
                              );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            premature_greying_or_balding: updatedValues,
                          }));
                          if (errors.premature_greying_or_balding) {
                            setErrors({
                              ...errors,
                              premature_greying_or_balding: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`prematureGreying-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.premature_greying_or_balding && (
            <div className="invalid-feedback">
              {errors.premature_greying_or_balding}
            </div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="joint_characteristics" className="form-label">
            Joint Characteristics <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.joint_characteristics ? "is-invalid" : ""}`}
              type="button"
              id="jointCharacteristicsDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'jointCharacteristics' ? null : 'jointCharacteristics')}
              aria-expanded={isDropdownOpen === 'jointCharacteristics'}
            >
              {formData.joint_characteristics.length > 0
                ? `${formData.joint_characteristics.length} option(s) selected`
                : "Select joint characteristics(s)"}
            </button>
            {isDropdownOpen === 'jointCharacteristics' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="jointCharacteristicsDropdown"
              >
                {[
                  { value: "Flexible", label: "Flexible" },
                  { value: "Stiff", label: "Stiff" },
                  { value: "Emits sound", label: "Emits sound" },
                  { value: "Hot to touch", label: "Hot to touch" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`jointCharacteristics-${option.value}`}
                        value={option.value}
                        checked={formData.joint_characteristics.includes(
                          option.value,
                        )}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.joint_characteristics,
                              option.value,
                            ];
                          } else {
                            updatedValues =
                              formData.joint_characteristics.filter(
                                (d) => d !== option.value,
                              );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            joint_characteristics: updatedValues,
                          }));
                          if (errors.joint_characteristics) {
                            setErrors({
                              ...errors,
                              joint_characteristics: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`jointCharacteristics-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.joint_characteristics && (
            <div className="invalid-feedback">
              {errors.joint_characteristics}
            </div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="veins_and_tendons" className="form-label">
            Veins and Tendons <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.veins_and_tendons ? "is-invalid" : ""}`}
              type="button"
              id="veinsAndTendonsDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'veinsAndTendons' ? null : 'veinsAndTendons')}
              aria-expanded={isDropdownOpen === 'veinsAndTendons'}
            >
              {formData.veins_and_tendons.length > 0
                ? `${formData.veins_and_tendons.length} option(s) selected`
                : "Select veins and tendons(s)"}
            </button>
            {isDropdownOpen === 'veinsAndTendons' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="veinsAndTendonsDropdown"
              >
                {[
                  { value: "Visible veins", label: "Visible veins" },
                  { value: "Prominent", label: "Prominent" },
                  { value: "Normal", label: "Normal" },
                  { value: "Not visible", label: "Not visible" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`veinsAndTendons-${option.value}`}
                        value={option.value}
                        checked={formData.veins_and_tendons.includes(
                          option.value,
                        )}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.veins_and_tendons,
                              option.value,
                            ];
                          } else {
                            updatedValues = formData.veins_and_tendons.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            veins_and_tendons: updatedValues,
                          }));
                          if (errors.veins_and_tendons) {
                            setErrors({
                              ...errors,
                              veins_and_tendons: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`veinsAndTendons-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.veins_and_tendons && (
            <div className="invalid-feedback">{errors.veins_and_tendons}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="body_temperature" className="form-label">
            Body Temperature <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.body_temperature ? "is-invalid" : ""}`}
              type="button"
              id="bodyTemperatureDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'bodyTemperature' ? null : 'bodyTemperature')}
              aria-expanded={isDropdownOpen === 'bodyTemperature'}
            >
              {formData.body_temperature.length > 0
                ? `${formData.body_temperature.length} option(s) selected`
                : "Select body temperature(s)"}
            </button>
            {isDropdownOpen === 'bodyTemperature' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="bodyTemperatureDropdown"
              >
                {[
                  { value: "Warm", label: "Warm" },
                  { value: "Cold", label: "Cold" },
                  { value: "Normal", label: "Normal" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`bodyTemperature-${option.value}`}
                        value={option.value}
                        checked={formData.body_temperature.includes(
                          option.value,
                        )}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.body_temperature,
                              option.value,
                            ];
                          } else {
                            updatedValues = formData.body_temperature.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            body_temperature: updatedValues,
                          }));
                          if (errors.body_temperature) {
                            setErrors({
                              ...errors,
                              body_temperature: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`bodyTemperature-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.body_temperature && (
            <div className="invalid-feedback">{errors.body_temperature}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="temperature_preference" className="form-label">
            Temperature Preference <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.temperature_preference ? "is-invalid" : ""}`}
              type="button"
              id="temperaturePreferenceDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'temperaturePreference' ? null : 'temperaturePreference')}
              aria-expanded={isDropdownOpen === 'temperaturePreference'}
            >
              {formData.temperature_preference.length > 0
                ? `${formData.temperature_preference.length} option(s) selected`
                : "Select temperature preference(s)"}
            </button>
            {isDropdownOpen === 'temperaturePreference' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="temperaturePreferenceDropdown"
              >
                {[
                  {
                    value: "Prefers cold weather",
                    label: "Prefers cold weather",
                  },
                  {
                    value: "Prefers warm weather",
                    label: "Prefers warm weather",
                  },
                  { value: "Can tolerate both", label: "Can tolerate both" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`temperaturePreference-${option.value}`}
                        value={option.value}
                        checked={formData.temperature_preference.includes(
                          option.value,
                        )}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.temperature_preference,
                              option.value,
                            ];
                          } else {
                            updatedValues =
                              formData.temperature_preference.filter(
                                (d) => d !== option.value,
                              );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            temperature_preference: updatedValues,
                          }));
                          if (errors.temperature_preference) {
                            setErrors({
                              ...errors,
                              temperature_preference: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`temperaturePreference-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.temperature_preference && (
            <div className="invalid-feedback">
              {errors.temperature_preference}
            </div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="eyes" className="form-label">
            Eyes <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.eyes ? "is-invalid" : ""}`}
              type="button"
              id="eyesDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'eyes' ? null : 'eyes')}
              aria-expanded={isDropdownOpen === 'eyes'}
            >
              {formData.eyes.length > 0
                ? `${formData.eyes.length} option(s) selected`
                : "Select eyes(s)"}
            </button>
            {isDropdownOpen === 'eyes' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="eyesDropdown"
              >
                {[
                  { value: "Brown", label: "Brown" },
                  { value: "Black", label: "Black" },
                  { value: "Blue", label: "Blue" },
                  { value: "Bright", label: "Bright" },
                  { value: "Dull", label: "Dull" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`eyes-${option.value}`}
                        value={option.value}
                        checked={formData.eyes.includes(option.value)}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [...formData.eyes, option.value];
                          } else {
                            updatedValues = formData.eyes.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            eyes: updatedValues,
                          }));
                          if (errors.eyes) {
                            setErrors({
                              ...errors,
                              eyes: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`eyes-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.eyes && <div className="invalid-feedback">{errors.eyes}</div>}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="teeth_and_gums" className="form-label">
            Teeth and Gums <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.teeth_and_gums ? "is-invalid" : ""}`}
              type="button"
              id="teethAndGumsDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'teethAndGums' ? null : 'teethAndGums')}
              aria-expanded={isDropdownOpen === 'teethAndGums'}
            >
              {formData.teeth_and_gums.length > 0
                ? `${formData.teeth_and_gums.length} option(s) selected`
                : "Select teeth and gums(s)"}
            </button>
            {isDropdownOpen === 'teethAndGums' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="teethAndGumsDropdown"
              >
                {[
                  { value: "Healthy", label: "Healthy" },
                  { value: "Gum problems", label: "Gum problems" },
                  { value: "Tooth decay", label: "Tooth decay" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`teethAndGums-${option.value}`}
                        value={option.value}
                        checked={formData.teeth_and_gums.includes(option.value)}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.teeth_and_gums,
                              option.value,
                            ];
                          } else {
                            updatedValues = formData.teeth_and_gums.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            teeth_and_gums: updatedValues,
                          }));
                          if (errors.teeth_and_gums) {
                            setErrors({
                              ...errors,
                              teeth_and_gums: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`teethAndGums-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.teeth_and_gums && (
            <div className="invalid-feedback">{errors.teeth_and_gums}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="voice_nature" className="form-label">
            Voice Nature <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.voice_nature ? "is-invalid" : ""}`}
              type="button"
              id="voiceNatureDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'voiceNature' ? null : 'voiceNature')}
              aria-expanded={isDropdownOpen === 'voiceNature'}
            >
              {formData.voice_nature.length > 0
                ? `${formData.voice_nature.length} option(s) selected`
                : "Select voice nature(s)"}
            </button>
            {isDropdownOpen === 'voiceNature' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="voiceNatureDropdown"
              >
                {[
                  { value: "Soft", label: "Soft" },
                  { value: "Loud", label: "Loud" },
                  { value: "Hoarse", label: "Hoarse" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`voiceNature-${option.value}`}
                        value={option.value}
                        checked={formData.voice_nature.includes(option.value)}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.voice_nature,
                              option.value,
                            ];
                          } else {
                            updatedValues = formData.voice_nature.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            voice_nature: updatedValues,
                          }));
                          if (errors.voice_nature) {
                            setErrors({
                              ...errors,
                              voice_nature: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`voiceNature-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.voice_nature && (
            <div className="invalid-feedback">{errors.voice_nature}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="appetite" className="form-label">
            Appetite <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.appetite ? "is-invalid" : ""}`}
              type="button"
              id="appetiteDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'appetite' ? null : 'appetite')}
              aria-expanded={isDropdownOpen === 'appetite'}
            >
              {formData.appetite.length > 0
                ? `${formData.appetite.length} option(s) selected`
                : "Select appetite(s)"}
            </button>
            {isDropdownOpen === 'appetite' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="appetiteDropdown"
              >
                {[
                  { value: "Moderate", label: "Moderate" },
                  { value: "Robust", label: "Robust" },
                  { value: "Low", label: "Low" },
                  { value: "Irregular", label: "Irregular" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`appetite-${option.value}`}
                        value={option.value}
                        checked={formData.appetite.includes(option.value)}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.appetite,
                              option.value,
                            ];
                          } else {
                            updatedValues = formData.appetite.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            appetite: updatedValues,
                          }));
                          if (errors.appetite) {
                            setErrors({
                              ...errors,
                              appetite: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`appetite-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.appetite && (
            <div className="invalid-feedback">{errors.appetite}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="taste_preference" className="form-label">
            Taste Preference <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.taste_preference ? "is-invalid" : ""}`}
              type="button"
              id="tastePreferenceDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'tastePreference' ? null : 'tastePreference')}
              aria-expanded={isDropdownOpen === 'tastePreference'}
            >
              {formData.taste_preference.length > 0
                ? `${formData.taste_preference.length} option(s) selected`
                : "Select taste preference(s)"}
            </button>
            {isDropdownOpen === 'tastePreference' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="tastePreferenceDropdown"
              >
                {[
                  { value: "Sweet", label: "Sweet" },
                  { value: "Salty", label: "Salty" },
                  { value: "Sour", label: "Sour" },
                  { value: "Spicy", label: "Spicy" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`tastePreference-${option.value}`}
                        value={option.value}
                        checked={formData.taste_preference.includes(
                          option.value,
                        )}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.taste_preference,
                              option.value,
                            ];
                          } else {
                            updatedValues = formData.taste_preference.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            taste_preference: updatedValues,
                          }));
                          if (errors.taste_preference) {
                            setErrors({
                              ...errors,
                              taste_preference: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`tastePreference-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.taste_preference && (
            <div className="invalid-feedback">{errors.taste_preference}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="sweating" className="form-label">
            Sweating <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.sweating ? "is-invalid" : ""}`}
              type="button"
              id="sweatingDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'sweating' ? null : 'sweating')}
              aria-expanded={isDropdownOpen === 'sweating'}
            >
              {formData.sweating.length > 0
                ? `${formData.sweating.length} option(s) selected`
                : "Select sweating(s)"}
            </button>
            {isDropdownOpen === 'sweating' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="sweatingDropdown"
              >
                {[
                  { value: "Moderate", label: "Moderate" },
                  { value: "Profuse", label: "Profuse" },
                  { value: "Scanty", label: "Scanty" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`sweating-${option.value}`}
                        value={option.value}
                        checked={formData.sweating.includes(option.value)}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.sweating,
                              option.value,
                            ];
                          } else {
                            updatedValues = formData.sweating.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            sweating: updatedValues,
                          }));
                          if (errors.sweating) {
                            setErrors({
                              ...errors,
                              sweating: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`sweating-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.sweating && (
            <div className="invalid-feedback">{errors.sweating}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="bowel_habits" className="form-label">
            Bowel Habits <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.bowel_habits ? "is-invalid" : ""}`}
              type="button"
              id="bowelHabitsDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'bowelHabits' ? null : 'bowelHabits')}
              aria-expanded={isDropdownOpen === 'bowelHabits'}
            >
              {formData.bowel_habits.length > 0
                ? `${formData.bowel_habits.length} option(s) selected`
                : "Select bowel habits(s)"}
            </button>
            {isDropdownOpen === 'bowelHabits' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="bowelHabitsDropdown"
              >
                {[
                  { value: "Regular", label: "Regular" },
                  { value: "Constipated", label: "Constipated" },
                  { value: "Loose", label: "Loose" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`bowelHabits-${option.value}`}
                        value={option.value}
                        checked={formData.bowel_habits.includes(option.value)}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.bowel_habits,
                              option.value,
                            ];
                          } else {
                            updatedValues = formData.bowel_habits.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            bowel_habits: updatedValues,
                          }));
                          if (errors.bowel_habits) {
                            setErrors({
                              ...errors,
                              bowel_habits: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`bowelHabits-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.bowel_habits && (
            <div className="invalid-feedback">{errors.bowel_habits}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="urination" className="form-label">
            Urination <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.urination ? "is-invalid" : ""}`}
              type="button"
              id="urinationDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'urination' ? null : 'urination')}
              aria-expanded={isDropdownOpen === 'urination'}
            >
              {formData.urination.length > 0
                ? `${formData.urination.length} option(s) selected`
                : "Select urination(s)"}
            </button>
            {isDropdownOpen === 'urination' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="urinationDropdown"
              >
                {[
                  { value: "Normal", label: "Normal" },
                  { value: "Frequent", label: "Frequent" },
                  { value: "Scanty", label: "Scanty" },
                  { value: "Burning", label: "Burning" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`urination-${option.value}`}
                        value={option.value}
                        checked={formData.urination.includes(option.value)}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.urination,
                              option.value,
                            ];
                          } else {
                            updatedValues = formData.urination.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            urination: updatedValues,
                          }));
                          if (errors.urination) {
                            setErrors({
                              ...errors,
                              urination: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`urination-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.urination && (
            <div className="invalid-feedback">{errors.urination}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="sleep" className="form-label">
            Sleep <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.sleep ? "is-invalid" : ""}`}
              type="button"
              id="sleepDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'sleep' ? null : 'sleep')}
              aria-expanded={isDropdownOpen === 'sleep'}
            >
              {formData.sleep.length > 0
                ? `${formData.sleep.length} option(s) selected`
                : "Select sleep(s)"}
            </button>
            {isDropdownOpen === 'sleep' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="sleepDropdown"
              >
                {[
                  { value: "6-7 hours", label: "6-7 hours" },
                  { value: "Less than 6 hours", label: "Less than 6 hours" },
                  { value: "More than 8 hours", label: "More than 8 hours" },
                  { value: "Disturbed", label: "Disturbed" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`sleep-${option.value}`}
                        value={option.value}
                        checked={formData.sleep.includes(option.value)}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [...formData.sleep, option.value];
                          } else {
                            updatedValues = formData.sleep.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            sleep: updatedValues,
                          }));
                          if (errors.sleep) {
                            setErrors({
                              ...errors,
                              sleep: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`sleep-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.sleep && (
            <div className="invalid-feedback">{errors.sleep}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="psychological_state" className="form-label">
            Psychological State <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.psychological_state ? "is-invalid" : ""}`}
              type="button"
              id="psychologicalStateDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'psychologicalState' ? null : 'psychologicalState')}
              aria-expanded={isDropdownOpen === 'psychologicalState'}
            >
              {formData.psychological_state.length > 0
                ? `${formData.psychological_state.length} option(s) selected`
                : "Select psychological state(s)"}
            </button>
            {isDropdownOpen === 'psychologicalState' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="psychologicalStateDropdown"
              >
                {[
                  { value: "Calm", label: "Calm" },
                  { value: "Anxious", label: "Anxious" },
                  { value: "Irritable", label: "Irritable" },
                  { value: "Depressed", label: "Depressed" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`psychologicalState-${option.value}`}
                        value={option.value}
                        checked={formData.psychological_state.includes(
                          option.value,
                        )}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [
                              ...formData.psychological_state,
                              option.value,
                            ];
                          } else {
                            updatedValues = formData.psychological_state.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            psychological_state: updatedValues,
                          }));
                          if (errors.psychological_state) {
                            setErrors({
                              ...errors,
                              psychological_state: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`psychologicalState-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.psychological_state && (
            <div className="invalid-feedback">{errors.psychological_state}</div>
          )}
        </div>
        <div className="col-lg-4 mb-3 col-md-6 col-sm-12">
          <label htmlFor="memory" className="form-label">
            Memory <span className="text-danger">*</span>
          </label>
          <div className="dropdown">
            <button
              className={`btn btn-outline-secondary dropdown-toggle w-100 text-left ${errors.memory ? "is-invalid" : ""}`}
              type="button"
              id="memoryDropdown"
              onClick={() => setIsDropdownOpen(isDropdownOpen === 'memory' ? null : 'memory')}
              aria-expanded={isDropdownOpen === 'memory'}
            >
              {formData.memory.length > 0
                ? `${formData.memory.length} option(s) selected`
                : "Select memory(s)"}
            </button>
            {isDropdownOpen === 'memory' && (
              <ul
                className="dropdown-menu show w-100 p-2"
                aria-labelledby="memoryDropdown"
              >
                {[
                  { value: "Good", label: "Good" },
                  { value: "Moderate", label: "Moderate" },
                  { value: "Poor", label: "Poor" },
                ].map((option) => (
                  <li key={option.value} className="mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`memory-${option.value}`}
                        value={option.value}
                        checked={formData.memory.includes(option.value)}
                        onChange={(e) => {
                          let updatedValues;
                          if (e.target.checked) {
                            updatedValues = [...formData.memory, option.value];
                          } else {
                            updatedValues = formData.memory.filter(
                              (d) => d !== option.value,
                            );
                          }
                          setFormData((prev) => ({
                            ...prev,
                            memory: updatedValues,
                          }));
                          if (errors.memory) {
                            setErrors({
                              ...errors,
                              memory: "",
                            });
                          }
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`memory-${option.value}`}
                      >
                        {option.label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.memory && (
            <div className="invalid-feedback">{errors.memory}</div>
          )}
        </div>
        <div className="col-lg-12 mb-3">
          <label
            htmlFor="additional_clinical_information"
            className="form-label"
          >
            Additional Clinical Information
          </label>
          <textarea
            className={`form-control ${errors.additional_clinical_information ? "is-invalid" : ""}`}
            id="additional_clinical_information"
            name="additional_clinical_information"
            value={formData.additional_clinical_information}
            onChange={handleInputChange}
            rows="3"
          ></textarea>
          {errors.additional_clinical_information && (
            <div className="invalid-feedback">
              {errors.additional_clinical_information}
            </div>
          )}
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
                  <td>
                    <strong>Name:</strong>
                  </td>
                  <td>{formData.full_name}</td>
                  <td>
                    <strong>Date of Birth:</strong>
                  </td>
                  <td>{formData.date_of_birth}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Gender:</strong>
                  </td>
                  <td>{formData.gender}</td>
                  <td>
                    <strong>Height:</strong>
                  </td>
                  <td>{formData.height}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Weight:</strong>
                  </td>
                  <td>{formData.weight}</td>
                  <td>
                    <strong>Email:</strong>
                  </td>
                  <td>{formData.email}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Marital Status:</strong>
                  </td>
                  <td>{formData.marital_status}</td>
                  <td>
                    <strong>Occupation:</strong>
                  </td>
                  <td>{formData.occupation}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Contact Number:</strong>
                  </td>
                  <td>{formData.mobile_number}</td>
                  <td>
                    <strong>Address:</strong>
                  </td>
                  <td>{formData.address}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Chief Complaint:</strong>
                  </td>
                  <td>{formData.main_disease_problem}</td>
                  <td>
                    <strong>Reference:</strong>
                  </td>
                  <td>{formData.references}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col-12 mb-4">
            <h5 className="sub-title">Medical Information</h5>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>
                    <strong>Family History:</strong>
                  </td>
                  <td>{formData.disease_history.join(", ")}</td>
                  <td>
                    <strong>Mode of Onset:</strong>
                  </td>
                  <td>{formData.mode_of_onset}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Problem Start:</strong>
                  </td>
                  <td>{formData.problem_start_description}</td>
                  <td>
                    <strong>Problem Progress:</strong>
                  </td>
                  <td>{formData.progression_over_time}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Past History:</strong>
                  </td>
                  <td>{formData.medical_history}</td>
                  <td>
                    <strong>Any Surgery:</strong>
                  </td>
                  <td>{formData.surgeries}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Number of Pregnancies:</strong>
                  </td>
                  <td>{formData.number_of_pregnancies}</td>
                  <td>
                    <strong>Number of Alive Kids:</strong>
                  </td>
                  <td>{formData.number_of_living_children}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Mode of Delivery:</strong>
                  </td>
                  <td>{formData.mode_of_delivery}</td>
                  <td>
                    <strong>Menstrual History:</strong>
                  </td>
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
                  <td>
                    <strong>Diagnosing Doctor:</strong>
                  </td>
                  <td>{formData.diagnosing_doctor_name}</td>
                  <td>
                    <strong>Hospital/Clinic:</strong>
                  </td>
                  <td>{formData.hospital_clinic_name}</td>
                </tr>
                <tr>
                  <td>
                    <strong>City:</strong>
                  </td>
                  <td>{formData.city}</td>
                  <td>
                    <strong>Date of Diagnosis:</strong>
                  </td>
                  <td>{formData.date_of_diagnosis || "Not provided"}</td>
                </tr>
                <tr>
                  <td colSpan="4">
                    <strong>Other Chronic Diseases:</strong>{" "}
                    {formData.other_chronic_disease}
                  </td>
                </tr>
                <tr>
                  <td colSpan="4">
                    <strong>Current Treatment:</strong>{" "}
                    {formData.past_medications}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col-12 mb-4">
            <h5 className="sub-title">Lifestyle Assessment</h5>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>
                    <strong>Habits:</strong>
                  </td>
                    <td>
                      {(() => {
                        const selectedHabits = Object.keys(formData.habits).filter(habit => formData.habits[habit] === "Yes");
                        return selectedHabits.length > 0 ? selectedHabits.map(habit => `${habit}: Yes`).join(", ") : "None";
                      })()}
                    </td>
                  <td>
                    <strong>Type of Exercise:</strong>
                  </td>
                  <td>{formData.type_of_exercise || "Not provided"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Frequency:</strong>
                  </td>
                  <td>{formData.frequency || "Not provided"}</td>
                  <td>
                    <strong>Mental Workload:</strong>
                  </td>
                  <td>{formData.mental_workload || "Not provided"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Stress Levels:</strong>
                  </td>
                  <td>{formData.stress_levels || "Not provided"}</td>
                  <td>
                    <strong>Social Interaction Level:</strong>
                  </td>
                  <td>{formData.social_interaction_level || "Not provided"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Number of Pregnancies:</strong>
                  </td>
                  <td>{formData.number_of_pregnancies || "Not provided"}</td>
                  <td>
                    <strong>Number of Living Children:</strong>
                  </td>
                  <td>{formData.number_of_living_children || "Not provided"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Number of Living Children:</strong>
                  </td>
                  <td>
                    {formData.number_of_living_children || "Not provided"}
                  </td>
                  <td>
                    <strong>Mode of Delivery:</strong>
                  </td>
                  <td>{formData.mode_of_delivery || "Not provided"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Menstrual History:</strong>
                  </td>
                  <td>{formData.menstrual_history || "Not provided"}</td>
                  <td>
                    <strong>Gynecological Surgery:</strong>
                  </td>
                  <td>{formData.gynaecological_surgery || "Not provided"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="col-12 mb-4">
            <h5 className="sub-title">
              Physical & Psychological Characteristics
            </h5>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>
                    <strong>Body Build:</strong>
                  </td>
                  <td>{formData.body_build.join(", ")}</td>
                  <td>
                    <strong>Complexion:</strong>
                  </td>
                  <td>{formData.complexion.join(", ")}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Skin Nature:</strong>
                  </td>
                  <td>{formData.skin_nature.join(", ")}</td>
                  <td>
                    <strong>Hair Nature:</strong>
                  </td>
                  <td>{formData.hair_nature.join(", ")}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Premature Greying/Balding:</strong>
                  </td>
                  <td>{formData.premature_greying_or_balding.join(", ")}</td>
                  <td>
                    <strong>Joint Characteristics:</strong>
                  </td>
                  <td>{formData.joint_characteristics.join(", ")}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Veins & Tendons:</strong>
                  </td>
                  <td>{formData.veins_and_tendons.join(", ")}</td>
                  <td>
                    <strong>Body Temperature:</strong>
                  </td>
                  <td>{formData.body_temperature.join(", ")}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Temperature Preference:</strong>
                  </td>
                  <td>{formData.temperature_preference.join(", ")}</td>
                  <td>
                    <strong>Eyes:</strong>
                  </td>
                  <td>{formData.eyes.join(", ")}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Teeth & Gums:</strong>
                  </td>
                  <td>{formData.teeth_and_gums.join(", ")}</td>
                  <td>
                    <strong>Voice Nature:</strong>
                  </td>
                  <td>{formData.voice_nature.join(", ")}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Appetite:</strong>
                  </td>
                  <td>{formData.appetite.join(", ")}</td>
                  <td>
                    <strong>Taste Preference:</strong>
                  </td>
                  <td>{formData.taste_preference.join(", ")}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Sweating:</strong>
                  </td>
                  <td>{formData.sweating.join(", ")}</td>
                  <td>
                    <strong>Bowel Habits:</strong>
                  </td>
                  <td>{formData.bowel_habits.join(", ")}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Urination:</strong>
                  </td>
                  <td>{formData.urination.join(", ")}</td>
                  <td>
                    <strong>Sleep:</strong>
                  </td>
                  <td>{formData.sleep.join(", ")}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Psychological State:</strong>
                  </td>
                  <td>{formData.psychological_state.join(", ")}</td>
                  <td>
                    <strong>Memory:</strong>
                  </td>
                  <td>{formData.memory.join(", ")}</td>
                </tr>
                <tr>
                  <td colSpan="4">
                    <strong>Additional Clinical Information:</strong>{" "}
                    {formData.additional_clinical_information || "Not provided"}
                  </td>
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
                  <div
                    className={`step ${currentStep >= 1 ? "active" : ""} ${completedSteps.includes(1) ? "completed" : ""}`}
                  >
                    <div className="step-number">
                      {completedSteps.includes(1) ? <FaCheck /> : "1"}
                    </div>
                    <span>Personal Info</span>
                  </div>
                  <div
                    className={`step ${currentStep >= 2 ? "active" : ""} ${completedSteps.includes(2) ? "completed" : ""}`}
                  >
                    <div className="step-number">
                      {completedSteps.includes(2) ? <FaCheck /> : "2"}
                    </div>
                    <span>Primary Health Concern</span>
                  </div>
                  <div
                    className={`step ${currentStep >= 3 ? "active" : ""} ${completedSteps.includes(3) ? "completed" : ""}`}
                  >
                    <div className="step-number">
                      {completedSteps.includes(3) ? <FaCheck /> : "3"}
                    </div>
                    <span>LIFESTYLE ASSESSMENT</span>
                  </div>
                  <div
                    className={`step ${currentStep >= 4 ? "active" : ""} ${completedSteps.includes(4) ? "completed" : ""}`}
                  >
                    <div className="step-number">
                      {completedSteps.includes(4) ? <FaCheck /> : "4"}
                    </div>
                    <span>AYURVEDIC CONSTITUTION ANALYSIS</span>
                  </div>
                  <div
                    className={`step ${currentStep >= 5 ? "active" : ""} ${completedSteps.includes(5) ? "completed" : ""}`}
                  >
                    <div className="step-number">
                      {completedSteps.includes(5) ? <FaCheck /> : "5"}
                    </div>
                    <span>Preview</span>
                  </div>
                </div>
              </div>

              {/* Show alert if there's a message */}
              {submitMessage && (
                <div
                  className={`alert ${submitMessage.includes("Error") ? "alert-danger" : "alert-success"} my-4`}
                >
                  {submitMessage}
                </div>
              )}

              {/* Always show form if there's an error or if no submission yet */}
              {!submitMessage || submitMessage.includes("Error") ? (
                <form onSubmit={handleSubmit}>
                  {renderStep()}

                  {/* Show loading message for Step 1 */}
                  {currentStep === 1 && isLoadingConsultData && (
                    <div className="alert alert-info mt-3" role="alert">
                      ⏳ Loading your consultation data...
                    </div>
                  )}

                  <div className="form-navigation mt-4 d-flex justify-content-between">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={prevStep}
                        disabled={isSubmitting || isLoadingConsultData}
                      >
                        <FaArrowLeft className="me-2" />
                        Previous
                      </button>
                    )}

                    {currentStep < 5 && (
                      <button
                        type="button"
                        className="btn btn-primary ms-auto"
                        onClick={nextStep}
                        disabled={
                          isSubmitting ||
                          (currentStep === 1 && isLoadingConsultData)
                        }
                      >
                        {isLoadingConsultData ? "⏳ Loading Data..." : "Next"}
                        {!isLoadingConsultData && (
                          <FaArrowRight className="ms-2" />
                        )}
                      </button>
                    )}

                    {currentStep === 5 && (
                      <button
                        type="submit"
                        className="btn btn-success ms-auto"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Consultation"}
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
