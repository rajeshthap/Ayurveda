import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import { Link } from 'react-router-dom';

const API_BASE = 'https://mahadevaaya.com/trilokayurveda/trilokabackend';

function Clinic() {
  const [clinicData, setClinicData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Clinic data from API
  useEffect(() => {
    const fetchClinicData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/our-clinic-item/`, {
          method: 'GET',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch Clinic data');
        }
        
        const result = await response.json();
        console.log("GET API Response:", result);
        
        if (result.success && result.data.length > 0) {
          setClinicData(result.data[0]);
        } else {
          throw new Error('No Clinic data found');
        }
      } catch (err) {
        console.error('Error fetching Clinic data:', err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClinicData();
  }, []);

  // Function to render modules in a single column
  const renderModules = () => {
    if (!clinicData || !clinicData.module || clinicData.module.length === 0) {
      return null;
    }

    return (
      <div className="modules-container mt-4">
        {clinicData.module.map((module, index) => {
          // For the Clinic API, module is an array with [title, description]
          const moduleTitle = module[0];
          const moduleDescription = module[1];
          
          return (
            <div key={index} className="module-item mb-4 p-3 bg-light rounded">
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
          <h2 style={{ fontWeight: 'bold' }}>Our Clinic</h2>
          <div className="ayur-bread-list">
            <span>
                <Link to="/" >Home</Link>
            </span>
            <span className="ayur-active-page">/ Our Clinic</span>
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
                      <p className="mt-2">Loading Clinic content...</p>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger text-center">
                      Error loading content: {error}
                    </div>
                  ) : clinicData ? (
                    <>
                      {/* Two-column layout for image and content */}
                      <Row className="mt-4">
                        <Col lg={4} md={12} sm={12}>
                          <div className="about-image-container">
                            <img
                              src={`${API_BASE}${clinicData.image}`}
                              alt={clinicData.title}
                              className="img-fluid rounded"
                            />
                          </div>
                        </Col>
                        <Col lg={8} md={12} sm={12} className="d-flex flex-column">
                          <div className="about-content text-start">
                            <h4 style={{ fontWeight: 'bold', fontSize: '2rem' }}>{clinicData.title}</h4>
                            <div 
                              className="about-description"
                              style={{ fontSize: '1.2rem' }}
                              dangerouslySetInnerHTML={{ 
                                __html: clinicData.description.replace(/\r\n\r\n/g, '<br /><br />').replace(/\r\n/g, '<br />') 
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

export default Clinic;