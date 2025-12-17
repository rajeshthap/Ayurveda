import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import TheJourneyimg from '../../../assets/images/The-Journey.png';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaLeaf, FaHeartbeat, FaUserMd } from 'react-icons/fa';
import '../../../assets/css/about.css';

function Thejourney() {
  const [journeyData, setJourneyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Journey data from API
  useEffect(() => {
    const fetchJourneyData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://mahadevaaya.com/trilokayurveda/trilokabackend/api/journey-item/', {
          method: 'GET',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch Journey data');
        }
        
        const result = await response.json();
        console.log("GET API Response:", result);
        
        if (result.success && result.data.length > 0) {
          setJourneyData(result.data[0]);
        } else {
          throw new Error('No Journey data found');
        }
      } catch (err) {
        console.error('Error fetching Journey data:', err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJourneyData();
  }, []);

  // Function to render modules with icons
  const renderModules = () => {
    if (!journeyData || !journeyData.module || journeyData.module.length === 0) {
      return null;
    }

    // Define icons for modules
    const moduleIcons = [
      <FaLeaf className="module-icon" />,
      <FaHeartbeat className="module-icon" />,
      <FaUserMd className="module-icon" />,
      <FaCheckCircle className="module-icon" />
    ];

    return (
      <div className="modules-section mt-4">
        <h4 className="modules-title">Key Milestones</h4>
        <Row className="g-4">
          {journeyData.module.map((module, index) => (
            <Col md={6} key={index}>
              <Card className="module-card h-100">
                <Card.Body className="d-flex align-items-start">
                  <div className="icon-wrapper me-3">
                    {moduleIcons[index % moduleIcons.length]}
                  </div>
                  <div>
                    <Card.Title as="h5" className="module-title-text">{module}</Card.Title>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className='The-Journey-bg'>
        <div className='ayur-bread-content'>
          <h2>The Journey</h2>
          <div className="ayur-bread-list">
            <span>
              <Link to="/">Home </Link>
            </span>
            <span className="ayur-active-page">/ The Journey</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="ayur-bgcover ayur-about-sec">
          <Container fluid className="about-us">
            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading Journey content...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger text-center">
                Error loading content: {error}
              </div>
            ) : journeyData ? (
              <Row className="align-items-center">
                <Col lg={5} md={12} sm={12}>
                  <div className="ayur-about-img">
                    <div className="image-container">
                      <img
                        src={journeyData.image 
                          ? `https://mahadevaaya.com/trilokayurveda/trilokabackend${journeyData.image}` 
                          : TheJourneyimg}
                        alt={journeyData.title}
                        className="img-fluid rounded shadow-lg"
                        data-tilt=""
                        data-tilt-max="10"
                        data-tilt-speed="1000"
                        data-tilt-perspective="1000"
                        style={{
                          willChange: 'transform',
                          transform:
                            'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                        }}
                      />
                      <div className="image-overlay"></div>
                    </div>
                  </div>
                </Col>
                <Col lg={7} md={12} sm={12}>
                  <div className="ayur-heading-wrap ayur-about-head">
                    <div className="section-header">
                      <span className="sub-title">Our Journey</span>
                      <h3 className="main-title">{journeyData.title}</h3>
                      <div className="title-divider">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                    
                    <div className="about-content">
                      <div 
                        className="about-description"
                        dangerouslySetInnerHTML={{ 
                          __html: journeyData.description.replace(/\n/g, '<br />') 
                        }}
                      />
                      
                      {renderModules()}
                      
                      <div className="about-meta mt-4">
                        <div className="meta-item">
                          <span className="meta-label">Established:</span>
                          <span className="meta-value">
                            {new Date(journeyData.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long' 
                            })}
                          </span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Last Updated:</span>
                          <span className="meta-value">
                            {new Date(journeyData.updated_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <Link to="#" className="ayur-btn mt-4">
                        Know More
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            ) : (
              <div className="alert alert-warning text-center">
                No content available
              </div>
            )}
          </Container>
          <div className="ayur-bgshape ayur-about-bgshape">
            <img src={BgShape2} alt="img" />
            <img src={BgLeaf2} alt="img" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Thejourney;