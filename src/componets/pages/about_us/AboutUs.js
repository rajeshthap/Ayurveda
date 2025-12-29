import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import { Link } from 'react-router-dom';


function AboutUs() {
  const [aboutData, setAboutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch About Us data from API
  useEffect(() => {
    const fetchAboutUsData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://mahadevaaya.com/trilokayurveda/trilokabackend/api/aboutus-item/', {
          method: 'GET',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch About Us data');
        }
        
        const result = await response.json();
        console.log("GET API Response:", result);
        
        if (result.success && result.data.length > 0) {
          setAboutData(result.data[0]);
        } else {
          throw new Error('No About Us data found');
        }
      } catch (err) {
        console.error('Error fetching About Us data:', err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutUsData();
  }, []);

  // Function to render modules in a single column
  const renderModules = () => {
    if (!aboutData || !aboutData.module || aboutData.module.length === 0) {
      return null;
    }

    return (
      <div className="modules-container mt-4">
        {aboutData.module.map((module, index) => {
          // Check if module is an object with content and description properties
          const isModuleObject = typeof module === 'object' && module !== null;
          const moduleContent = isModuleObject ? module.content : module;
          const moduleDescription = isModuleObject ? module.description : '';
          
          return (
            <div key={index} className="module-item mb-4 p-3 bg-light rounded">
              <h5 className="module-title-text">{moduleContent}</h5>
              {moduleDescription && (
                <p className="module-description-text mt-2">
                  {moduleDescription}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2 className='heading-wrapper' >About Us</h2>
          <div className="ayur-bread-list">
            <span>
                <Link to="/" >Home</Link>
            </span>
            <span className="ayur-active-page">/ About Us</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="ayur-heading-wrap ayur-about-head">
                  {isLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading About Us content...</p>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger text-center">
                      Error loading content: {error}
                    </div>
                  ) : aboutData ? (
                    <>
                      {/* Two-column layout for image and content */}
                      <Row className="mt-4">
                        <Col lg={4} md={12} sm={12}>
                          <div className="about-image-container">
                            <img
                              src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${aboutData.image}`}
                              alt={aboutData.title}
                              className="img-fluid rounded "
                            />
                          </div>
                        </Col>
                        <Col lg={8} md={12} sm={12} className="d-flex flex-column">
                          <div className="about-content text-start">
                            <h4 className='heading-extend'>{aboutData.title}</h4>
                            <div 
                              className="about-description"
                              dangerouslySetInnerHTML={{ 
                                __html: aboutData.description.replace(/\n/g, '<br />') 
                              }}
                            />
                            
                            {/* Modules section moved here */}
                            <div className="modules-section">
                             
                              {renderModules()}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <div className="alert alert-warning text-center">
                      No content available
                    </div>
                  )}
                </div>
              </div>
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

export default AboutUs;