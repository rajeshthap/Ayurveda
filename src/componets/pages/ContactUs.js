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
    const { name, value } = e.target;
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
      alert('Thank you for your message! We will contact you soon.');
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
      alert('There was an error sending your message. Please try again later.');
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
            <h1>Contact Us</h1>
            <h2>Wellness Center and Speciality Clinic for Chronic Disorders</h2>
          </div>
          
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
                  <h4>Trilok Ayurveda</h4>
                  <p>123 Wellness Street, Health City, India</p>
                  <p>456 Ayurveda Lane, Herbal District, India</p>
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
                  <p>+91 - 1234567890</p>
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
                  <p>vdharsh@trilokayurveda.com</p>
                  <p>info@trilokayurveda.com</p>
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