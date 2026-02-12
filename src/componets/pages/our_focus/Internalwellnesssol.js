import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FaHeartbeat, FaNotesMedical, FaArrowLeft } from 'react-icons/fa';
import { MdOutlineSick } from 'react-icons/md';
import '../../../assets/css/autoimmune.css';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';

function Internalwellnesssol() {
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
          'https://mahadevaaya.com/trilokayurveda/trilokabackend/api/ourfocus-wellnesssolutions-items/'
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
            <h2>Wellness Solutions</h2>
            <div className="ayur-bread-list">
              <span><a href="/">Home</a></span>
              <span className="ayur-active-page">/ Wellness Solutions</span>
            </div>
          </div>
        </div>

        <div className="container fluid about-us ann-heading">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading wellness solutions...</p>
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
            <h2>Wellness Solutions</h2>
            <div className="ayur-bread-list">
              <span><a href="/">Home</a></span>
              <span className="ayur-active-page">/ Wellness Solutions</span>
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
          <h2>Wellness Solutions</h2>
          <div className="ayur-bread-list">
            <span><a href="/">Home</a></span>
            <span className="ayur-active-page">/ Wellness Solutions</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us ann-heading">
            {!selectedItem ? (
              // List View - Show all cards
              <>
                <h3>Wellness Solutions</h3>
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
                <div className="d-flex  mb-4">
                  <button
                    className=" d-flex align-items-center ayur-back-btn"
                    onClick={handleBackToList}
                  >
                    <FaArrowLeft className="me-2" /> Back to List
                  </button>
                </div>

                <div className="row ">
                  {/* Images */}
                  {selectedItem.gallery_images && selectedItem.gallery_images.length > 0 ? (
                    <div className="col-lg-6 col-md-12 mb-4">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {selectedItem.gallery_images.map((image, index) => (
                          <div key={index} className="ayur-about-img ayur-img-hover">
                            <img
                              src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${image}`}
                              alt={`${selectedItem.title} - Gallery ${index + 1}`}
                              className="img-fluid rounded"
                              style={{ width: '100%', height: 'auto' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="col-lg-6 col-md-12 mb-4">
                      <div className="ayur-about-img ayur-img-hover">
                        <div className="bg-light d-flex align-items-center justify-content-center rounded" style={{ minHeight: '300px' }}>
                          <p className="text-muted">No images available</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="col-lg-6 col-md-12">
                    <div className="ayur-heading-wrap ayur-about-head">
                      {/* Title with icon */}
                      <h3>
                      
                        {selectedItem.title}
                      </h3>

                      {selectedItem.module && selectedItem.module.length > 0 ? (
                        selectedItem.module.map((module, index) => (
                          <div key={index} className="ayur-info-card mb-4">
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
                        ))
                      ) : (
                        <Alert variant="info">
                          No detailed information available for this wellness solution.
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
    </div>
  );
}

export default Internalwellnesssol;