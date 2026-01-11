import React, { useState } from 'react';
import '../../assets/css/contact.css';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    full_name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [validated, setValidated] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const validateForm = () => {
    let newErrors = {
      full_name: '',
      email: '',
      subject: '',
      message: ''
    };
    let isValid = true;

    // Validate full name
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Validate subject
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
      isValid = false;
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // For text fields, remove numbers
    if (type === 'text') {
      const textOnly = value.replace(/[0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: textOnly
      }));
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    
    setValidated(true);
    
    if (!validateForm()) {
      return;
    }
    
    // Create FormData object
    const data = new FormData();
    data.append('full_name', formData.full_name);
    data.append('email', formData.email);
    data.append('subject', formData.subject);
    data.append('message', formData.message);
    
    // API call
    fetch('https://mahadevaaya.com/trilokayurveda/trilokabackend/api/contact-us/', {
      method: 'POST',
      body: data
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      setSubmitMessage("Thank you for your message! We will contact you soon.");
      setFormData({ full_name: '', email: '', subject: '', message: '' });
      setErrors({
        full_name: '',
        email: '',
        subject: '',
        message: ''
      });
      setValidated(false);
    })
    .catch(error => {
      console.error('Error:', error);
      setSubmitMessage("There was an error sending your message. Please try again later.");
    });
  };

  return (
    <div className="ayur-bgcover ayur-about-sec">
      {/* Breadcrumb Section */}
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2>Contact Us</h2>
          <div class="ayur-bread-list">
            <span>
              <Link to="/">Home</Link>
            </span>
            <span class="ayur-active-page">/ Contact Us</span>
          </div>
        </div>
      </div>

      <div className="trilok-contact-page">
        <div className="trilok-contact-container">
          <div className="trilok-contact-header">
      
            <h4 className='heading-extend' >Contact Us</h4>
            
            <div className='about-description'>Wellness Center and Speciality Clinic for Chronic Disorders</div>
                  
          </div>
          
          {submitMessage && (
            <div className={`alert ${submitMessage.includes('Error') ? 'alert-danger' : 'alert-success'} my-4`}>
              {submitMessage}
            </div>
          )}
          
          <div className="trilok-contact-content">
            <div className="trilok-contact-info">
              <h3>Contact Info</h3>
              
              <div className="trilok-info-item">
                <div className="trilok-info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="trilok-info-content">
                  <h4>Trilok Ayurveda: Dehradun</h4>
                  <p>475, Lane-8, Street-8, Rajendra Nagar, Dehradun – 248001 (UK)</p>
                  <p>Land mark: Near Govind Niwas wedding point</p>
                  <p>Google location:</p>
                  <div className="map-container">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3443.3101874914964!2d78.02352577!3d30.34213321!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929ff3110c039%3A0x5cded829d275e38c!2sTrilok%20Ayurveda%20Speciality%20Clinic%20for%20Chronic%20Disorders!5e0!3m2!1sen!2sin!4v1767613486738!5m2!1sen!2sin%22" 
                      width="80%" 
                      height="150" 
                      className='address-trilok'
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Trilok Ayurveda Dehradun Location"
                    ></iframe>
                  </div>
                </div>
              </div>
              
              <div className="trilok-info-item">
                <div className="trilok-info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="trilok-info-content">
                  <h4>Trilok Ayurveda: Rishikesh</h4>
                  <p>270, Nirmal Block – B, Tehri Punarvas Sthal, Pashulok, Rishikesh – 249201 (UK)</p>
                  <p>Land mark: Near Shiv chowk, Tehri Visthapit</p>
                  <p>Google location:</p>
                  <div className="map-container">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4409.104768474175!2d78.27164757291504!3d30.05624125223899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39093e37b557d6e1%3A0x7891ef3001bc900d!2sTrilok%20Ayurveda%20Wellness%20Center%20and%20Speciality%20Clinic%20for%20Chronic%20Disorders!5e0!3m2!1sen!2sin!4v1767973883641!5m2!1sen!2sin" 
                      width="80%" 
                      height="150" 
                      className='address-trilok'
                      allowFullScreen="" 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Trilok Ayurveda Rishikesh Location"
                    ></iframe>
                  </div>
                </div>
              </div>
              
              <div className="trilok-info-item">
                <div className="trilok-info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="trilok-info-content">
                  <h4>Phone</h4>
                  <p>+91 - 9837071030</p>
                  <p>+91 - 9758253472</p>
                  <p>(Call hours: 9 AM – 7 PM IST)</p>
                </div>
              </div>
              
              <div className="trilok-info-item">
                <div className="trilok-info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="trilok-info-content">
                  <h4>Email</h4>
                 <p>info@trilokayurveda.com</p>
                  <p>cure@trilokayurveda.com</p>
                </div>
              </div>
              
              {/* Clinic Hours Section */}
              <div className="trilok-info-item">
                <div className="trilok-info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="trilok-info-content">
                  <h4>🕒 Clinic Hours</h4>
                  <div className="clinic-hours-table">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th>Timing</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Monday–Saturday</td>
                          <td>9:00 AM – 1:00 PM & 4:00 PM – 7:00 PM</td>
                        </tr>
                        <tr>
                          <td>Sunday</td>
                          <td>Closed (Online consultations available)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Online Consultations Section */}
              <div className="trilok-info-item">
                <div className="trilok-info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14,2 14,8 20,8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10,9 9,9 8,9"></polyline>
                  </svg>
                </div>
                <div className="trilok-info-content">
                  <h4>💻 Online Consultations Available</h4>
                  <p>We offer secure video consultations via WhatsApp</p>
                </div>
              </div>
              
              {/* Disclaimer Section */}
              <div className="trilok-info-item">
                <div className="trilok-info-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div className="trilok-info-content">
                  <h4>Disclaimer:</h4>
                  <ol>
                    <li>For non-emergency administrative and clinical communication only.</li>
                    <li>This contact section is intended for information, appointments, and documentation-related queries.</li>
                    <li>No emergency medical services are provided through this platform.</li>
                    <li>Responses are provided during official clinic working hours only.</li>
                    <li>Communication through this section does not constitute medical advice.</li>
                    <li>All communications are subject to clinic policies, consent, and applicable laws.</li>
                  </ol>
                </div>
              </div>
            </div>
            
            <div className="trilok-contact-form">
              <h3>Get In Touch</h3>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="full_name">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="full_name"
                    placeholder="Full Name" 
                    value={formData.full_name}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      // Prevent numbers from being typed
                      if (/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    required
                    isInvalid={!!errors.full_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.full_name}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email address *</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email"
                    placeholder="name@example.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="subject">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="subject"
                    placeholder="Subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      // Prevent numbers from being typed
                      if (/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    required
                    isInvalid={!!errors.subject}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.subject}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="message">
                  <Form.Label>Message *</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={5}
                    name="message"
                    placeholder="Your Message" 
                    value={formData.message}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.message}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.message}
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Button variant="" type="submit" className="ayur-btn">
                  Send Message
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 