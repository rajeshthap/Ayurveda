import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import { Link } from 'react-router-dom';

const API_BASE = 'https://mahadevaaya.com/trilokayurveda/trilokabackend';

function Safety() {
  const [safetyData, setSafetyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Safety data from API
  useEffect(() => {
    const fetchSafetyData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/safety-item/`, {
          method: 'GET',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch Safety data');
        }
        
        const result = await response.json();
        console.log("GET API Response:", result);
        
        if (result.success && result.data.length > 0) {
          setSafetyData(result.data[0]);
        } else {
          throw new Error('No Safety data found');
        }
      } catch (err) {
        console.error('Error fetching Safety data:', err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSafetyData();
  }, []);

  // Function to render modules in a single column
  const renderModules = () => {
    if (!safetyData || !safetyData.module || safetyData.module.length === 0) {
      return null;
    }

    return (
      <div className="modules-container mt-4">
        {safetyData.module.map((module, index) => {
          // For the Safety API, module is a string (not an array like other components)
          return (
            <div key={index} className="module-item mb-2 p-3 bg-light rounded">
              <p className="module-text">
                {module}
              </p>
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
          <h2 className='heading-wrapper' >Safety</h2>
          <div className="ayur-bread-list">
            <span>
                <Link to="/" >Home</Link>
            </span>
            <span className="ayur-active-page">/ Safety</span>
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
                      <p className="mt-2">Loading Safety content...</p>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger text-center">
                      Error loading content: {error}
                    </div>
                  ) : safetyData ? (
                    <>
                      {/* Two-column layout for image and content */}
                      <Row className="mt-4">
                        <Col lg={4} md={12} sm={12}>
                          <div className="about-image-container">
                            {safetyData.image ? (
                              <img
                                src={`${API_BASE}${safetyData.image}`}
                                alt={safetyData.title}
                                className="img-fluid rounded"
                              />
                            ) : (
                              <div className="no-image-placeholder bg-light rounded d-flex align-items-center justify-content-center">
                                <p className="text-muted">No image available</p>
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg={8} md={12} sm={12} className="d-flex flex-column">
                          <div className="about-content text-start">
                            <h4 className='heading-extend' >{safetyData.title}</h4>
                            <div 
                              className="about-description"
                              dangerouslySetInnerHTML={{ 
                                __html: safetyData.description.replace(/\r\n\r\n/g, '<br /><br />').replace(/\r\n/g, '<br />') 
                              }}
                            />
                            
                            {/* Modules section */}
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

export default Safety;