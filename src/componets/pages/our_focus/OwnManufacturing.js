import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import { FaHeartbeat, FaNotesMedical, FaArrowLeft } from 'react-icons/fa';
import { MdOutlineSick } from 'react-icons/md';
import '../../../assets/css/autoimmune.css';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';

function OwnManufacturing() {
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
    } else if (keyLower.includes('treatment') || keyLower.includes('therapy')) {
      return <FaHeartbeat className="me-2 text-success" />;
    } else if (keyLower.includes('cause')) {
      return <FaHeartbeat className="me-2 text-danger" />;
    } else if (keyLower.includes('prevention')) {
      return <FaHeartbeat className="me-2 text-primary" />;
    } else {
      return <FaHeartbeat className="me-2 text-info" />;
    }
  };

  // Fetch all focus items on component mount
  useEffect(() => {
    const fetchFocusItems = async () => {
      try {
        const response = await fetch(
          'https://mahadevaaya.com/trilokayurveda/trilokabackend/api/our-focus-own-manufacturing-items/'
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
            <h2>Own Manufacturing</h2>
            <div className="ayur-bread-list">
              <span><a href="/">Home</a></span>
              <span className="ayur-active-page">/ Own Manufacturing</span>
            </div>
          </div>
        </div>
        
        <div className="container fluid about-us ann-heading">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading manufacturing items...</p>
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
            <h2>Own Manufacturing</h2>
            <div className="ayur-bread-list">
              <span><a href="/">Home</a></span>
              <span className="ayur-active-page">/ Own Manufacturing</span>
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
          <h2>Own Manufacturing</h2>
          <div className="ayur-bread-list">
            <span><a href="/">Home</a></span>
            <span className="ayur-active-page">/ Own Manufacturing</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us ann-heading">
            {!selectedItem ? (
              // List View - Show all cards
              <>
                <h3>Our Manufacturing Products</h3>
                <h5>Wellness Center and Speciality Clinic for Chronic Disorders</h5>
                <Row className="ayur-cards-row">
                  {focusItems.map((item) => (
                    <Col 
                      lg={3} 
                      md={6} 
                      sm={12} 
                      key={item.id} 
                      className="mb-4"
                      onClick={() => handleCardClick(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="ayur-card">
                        <div className="ayur-card-icon">
                          {item.icon ? (
                            <img 
                              src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${item.icon}`} 
                              alt={item.title} 
                              style={{ width: '40px', height: '40px' }}
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
                <div className="d-flex align-items-center mb-4">
                  <button 
                    className="btn btn-link p-0 me-3 d-flex align-items-center" 
                    onClick={handleBackToList}
                  >
                    <FaArrowLeft className="me-2" /> Back to List
                  </button>
                </div>
                
                <div className="row align-items-center">
                  {/* Image */}
                  <div className="col-lg-6 col-md-12 mb-4">
                    <div className="ayur-about-img ayur-img-hover">
                      {selectedItem.image ? (
                        <img 
                          src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${selectedItem.image}`} 
                          alt={selectedItem.title} 
                          className="img-fluid rounded"
                        />
                      ) : (
                        <div className="bg-light d-flex align-items-center justify-content-center rounded" 
                             style={{ height: '300px' }}>
                          <p className="text-muted">No image available</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="col-lg-6 col-md-12">
                    <div className="ayur-heading-wrap ayur-about-head">
                      {/* Title with icon */}
                      <h3>
                        <FaHeartbeat className="me-2 text-success" />
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
                          No detailed information available for this product.
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

export default OwnManufacturing;