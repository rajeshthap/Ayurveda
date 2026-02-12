import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/css/testinomials.css';
import { BiSolidQuoteRight } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";

function TestimonialDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testimonial, setTestimonial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const response = await fetch(
          `https://mahadevaaya.com/trilokayurveda/trilokabackend/api/testimonials-items/?id=${id}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Testimonial Response:', result); // Debug log

        // Handle different response formats
        if (result.success) {
          // If response has success flag
          if (Array.isArray(result.data) && result.data.length > 0) {
            // If data is an array, get the first item
            setTestimonial(result.data[0]);
          } else if (result.data && typeof result.data === 'object' && !Array.isArray(result.data)) {
            // If data is a single object
            setTestimonial(result.data);
          } else {
            console.error('Unexpected data format:', result.data);
            setTestimonial(null);
          }
        } else if (Array.isArray(result)) {
          // If result is directly an array
          setTestimonial(result.length > 0 ? result[0] : null);
        } else if (typeof result === 'object' && result.id) {
          // If result itself is the testimonial object
          setTestimonial(result);
        } else {
          console.error('Unexpected response format:', result);
          setTestimonial(null);
        }
      } catch (error) {
        console.error('Error fetching testimonial:', error);
        setTestimonial(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      // Scroll to top when page loads
      window.scrollTo(0, 0);
      fetchTestimonial();
    }
  }, [id]);

  const baseURL = 'https://mahadevaaya.com/trilokayurveda/trilokabackend';

  const handleBackClick = () => {
    // Navigate to home page and scroll to testimonials section
    navigate('/');
    // Wait longer for page to fully load and render
    setTimeout(() => {
      const testimonialSection = document.getElementById('testimonial-section');
      if (testimonialSection) {
        // Scroll with smooth behavior and offset for header
        testimonialSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);
  };

  if (loading) {
    return (
      <div className="ayur-bgcover ayur-testimonial-detail-page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '18px', color: '#CD8973' }}>Loading testimonial...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!testimonial) {
    return (
      <div className="ayur-bgcover ayur-testimonial-detail-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <button 
                className="ayur-back-btn"
                onClick={handleBackClick}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '30px',
                  color: '#CD8973',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                <IoIosArrowBack size={24} />
                Back to Testimonials
              </button>
            </div>
          </div>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '18px', color: '#CD8973' }}>Testimonial not found. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ayur-bgcover ayur-testimonial-detail-page">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {/* Back Button */}
            <button 
              className="ayur-back-btn"
              onClick={handleBackClick}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '30px',
                color: '#CD8973',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              <IoIosArrowBack size={24} />
              Back to Testimonials
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="ayur-testimonial-detail-box">
              {/* Image Section */}
              {testimonial.image && (
                <div className="ayur-detail-image-sec">
                  <img
                    src={`${baseURL}${testimonial.image}`}
                    alt={testimonial.full_name || 'Testimonial'}
                    className="ayur-detail-image"
                    onError={(e) => {
                      console.log('Image failed to load:', testimonial.image);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Content Section */}
              <div className="ayur-detail-content-sec">
                <div className="ayur-detail-header">
                  <h2>{testimonial.full_name || 'Testimonial'}</h2>
                  <BiSolidQuoteRight
                    size={50}
                    color="#CD8973"
                    className='ayur-detail-quote-icon'
                  />
                </div>

                {/* Full Description */}
                <div className="ayur-detail-description">
                  <p>
                    {testimonial.description || 'No description available.'}
                  </p>
                </div>

                {/* Back Button at Bottom */}
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                  <button 
                    className="ayur-readmore-btn"
                    onClick={handleBackClick}
                    style={{
                      background: 'linear-gradient(135deg, #CD8973, #B8726B)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 35px',
                      borderRadius: '25px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Back to Testimonials
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialDetails;
