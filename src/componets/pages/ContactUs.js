import React, { useState } from 'react';
import '../../assets/css/contact.css';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will contact you soon.');
    setFormData({ name: '', email: '', message: '' });
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
              <form onSubmit={handleSubmit}>
                <div className="trilok-form-group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="trilok-form-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="trilok-form-group">
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="trilok-submit-btn">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;