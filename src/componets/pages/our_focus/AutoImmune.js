import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FaHeartbeat, FaNotesMedical, FaArrowLeft } from 'react-icons/fa';
import { MdOutlineSick } from 'react-icons/md';
import '../../../assets/css/autoimmune.css';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';

function AutoImmune() {
  const navigate = useNavigate();
  const [focusItems, setFocusItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get the appropriate icon based on module key
  const getModuleIcon = (key) => {
    const keyLower = key.toLowerCase();
    if (keyLower.includes('synonym')) {
      return <FaNotesMedical className="me-2" />;
    } else if (keyLower.includes('symptom')) {
      return <MdOutlineSick className="me-2" />;
    } 
  };

  // Fetch all focus items on component mount
  useEffect(() => {
    const fetchFocusItems = async () => {
      try {
        const response = await fetch(
          'https://mahadevaaya.com/trilokayurveda/trilokabackend/api/ourfocus-autoimmunediseases-items/'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();

        if (result.success && result.data) {
          setFocusItems(result.data);
        } else {
          throw new Error('No data available');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchFocusItems();
  }, []);

  // Handle card click to show details
  const handleCardClick = (item) => {
    setSelectedItem(item);
  };

  // Handle back to list view
  const handleBackToList = () => {
    setSelectedItem(null);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="ayur-bgcover ayur-about-sec">
        <div className='about-bg'>
          <div className='ayur-bread-content'>
            <h2>Auto-Immune Diseases</h2>
            <div className="ayur-bread-list">
              <span><a href="/">Home</a></span>
              <span className="ayur-active-page">/ Auto-Immune Diseases</span>
            </div>
          </div>
        </div>

        <div className="container fluid about-us ann-heading">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading diseases...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="ayur-bgcover ayur-about-sec">
        <div className='about-bg'>
          <div className='ayur-bread-content'>
            <h2>Auto-Immune Diseases</h2>
            <div className="ayur-bread-list">
              <span><a href="/">Home</a></span>
              <span className="ayur-active-page">/ Auto-Immune Diseases</span>
            </div>
          </div>
        </div>

        <div className="container fluid about-us ann-heading">
          <Alert variant="danger" className="mt-4">
            {error}
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2>Auto-Immune Diseases</h2>
          <div className="ayur-bread-list">
            <span><a href="/">Home</a></span>
            <span className="ayur-active-page">/ Auto-Immune Diseases</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us ann-heading">
            {!selectedItem ? (
              // List View - Show all cards
              <>
                <h3>List of Diseases</h3>
                <h5>Wellness Center and Speciality Clinic for Chronic Disorders</h5>
                <Row className="ayur-cards-row">
                  {focusItems.map((item) => (
                    <Col
                      lg={3}
                      md={6}
                      sm={12}
                      key={item.id}
                      className="cards-pointer mb-4"
                      onClick={() => handleCardClick(item)}
                  
                    >
                      <div className="ayur-card">
                        <div className="ayur-card-icon">
                          {item.icon ? (
                            <img
                              src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${item.icon}`}
                              alt={item.title}
                              className='ayur-card-icons'
          
                            />
                          ) : (
                            <FaHeartbeat />
                          )}
                        </div>
                        <div className="ayur-card-content card-text">
                          <h5>{item.title}</h5>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </>
            ) : (
              // Detail View - Show selected item details
              <>
                <div className="d-flex mb-4">
                  <button
                    className=" d-flex  ayur-back-btn"
                    onClick={handleBackToList}
                  >
                    <FaArrowLeft className="me-2" /> Back to List
                  </button>
                </div>

                <div className="detail-container">
                  {/* Image Column */}
                  <div className="image-column">
                    <div className="image-wrapper">
                      {selectedItem.image ? (
                        <img
                          src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${selectedItem.image}`}
                          alt={selectedItem.title}
                          className="detail-image"
                        />
                      ) : (
                        <div className="no-image-placeholder">
                          <p className="text-muted">No image available</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="content-column">
                    <div className="content-wrapper">
                      <h3 className="detail-title">
                        {selectedItem.title}
                      </h3>

                      {selectedItem.module && selectedItem.module.length > 0 ? (
                        <div className="modules-container">
                          {selectedItem.module.map((module, index) => (
                            <div key={index} className="ayur-info-card">
                              <h5>
                                {getModuleIcon(module[0])}
                                {module[0].toUpperCase()}
                              </h5>
                              <ul className="ayur-icon-list">
                                {module[1].split('\n').map((line, lineIndex) => (
                                  <li key={lineIndex}>{line}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Alert variant="info">
                          No detailed information available for this disease.
                        </Alert>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="ayur-bgshape ayur-about-bgshape">
            <img src={BgShape2} alt="img" />
            <img src={BgLeaf2} alt="img" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .detail-container {
          display: flex;
          gap: 30px;
          margin-bottom: 30px;
        }
        
        .image-column,
        .content-column {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .image-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 8px;
          background-color: #f8f9fa;
        }
        
        .detail-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        
        .no-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }
        
        .content-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .detail-title {
          margin-bottom: 20px;
          color: #2c3e50;
        }
        
        .modules-container {
          flex: 1;
          overflow-y: auto;
        }
        
        .ayur-info-card {
          margin-bottom: 20px;
        }
        
        .ayur-info-card:last-child {
          margin-bottom: 0;
        }
        
        .ayur-info-card h5 {
          color:#28a745;
          margin-bottom: 10px;
          font-weight: 600;
        }
        
        .ayur-icon-list {
          padding-left: 20px;
          margin: 0;
        }
        
        .ayur-icon-list li {
          margin-bottom: 8px;
          line-height: 1.6;
        }
        
        /* Responsive adjustments */
        @media (max-width: 991px) {
          .detail-container {
            flex-direction: column;
            gap: 20px;
          }
          
          .image-wrapper {
            min-height: 300px;
          }
          
          .content-wrapper {
            padding: 15px;
          }
        }
        
        @media (max-width: 576px) {
          .detail-container {
            gap: 15px;
          }
          
          .image-wrapper {
            min-height: 250px;
          }
          
          .content-wrapper {
            padding: 10px;
          }
          
          .detail-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  ); 
}

export default AutoImmune;