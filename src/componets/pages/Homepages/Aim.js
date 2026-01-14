import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import { Link } from 'react-router-dom';

const API_BASE = 'https://mahadevaaya.com/trilokayurveda/trilokabackend';

function Aim() {
  const [aimData, setAimData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Aim data from API
  useEffect(() => {
    const fetchAimData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/ouraim-item/`, {
          method: 'GET',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch Aim data');
        }
        
        const result = await response.json();
        console.log("GET API Response:", result);
        
        if (result.success && result.data.length > 0) {
          setAimData(result.data[0]);
        } else {
          throw new Error('No Aim data found');
        }
      } catch (err) {
        console.error('Error fetching Aim data:', err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAimData();
  }, []);

  // Function to render modules in a single column
  const renderModules = () => {
    if (!aimData || !aimData.module || aimData.module.length === 0) {
      return null;
    }

    return (
      <div className="modules-container mt-4">
        {aimData.module.map((module, index) => {
          // For the Aim API, module is an array with [title, description]
          const moduleTitle = module[0];
          const moduleDescription = module[1];
          
          return (
            <div key={index} className="module-item mb-2 p-3 bg-light rounded">
              <h5 className="module-title-text">{moduleTitle}</h5>
              <p className="module-description-text mt-2">
                {moduleDescription}
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
          <h2 className='heading-wrapper' >Aim</h2>
          <div className="ayur-bread-list">
            <span>
                <Link to="/" >Home</Link>
            </span>
            <span className="ayur-active-page">/ Aim</span>
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
                      <p className="mt-2">Loading Aim content...</p>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger text-center">
                      Error loading content: {error}
                    </div>
                  ) : aimData ? (
                    <>
                      {/* Two-column layout for image and content */}
                      <Row className="mt-4">
                        <Col lg={4} md={12} sm={12}>
                          <div className="about-image-container">
                            {aimData.image ? (
                              <img
                                src={`${API_BASE}${aimData.image}`}
                                alt={aimData.title}
                                className="img-fluid rounded"
                              />
                            ) : (
                              <div className="no-image-placeholder bg-light rounded d-flex align-items-center justify-content-center" >
                                <p className="text-muted">No image available</p>
                              </div>
                            )}
                          </div>
                        </Col>
                        <Col lg={8} md={12} sm={12} className="d-flex flex-column">
                          <div className="about-content text-start">
                            <h4 className='heading-extend'>{aimData.title}</h4>
                            <div 
                              className="about-description"
                              dangerouslySetInnerHTML={{ 
                                __html: aimData.description.replace(/\r\n\r\n/g, '<br /><br />').replace(/\r\n/g, '<br />') 
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

export default Aim;