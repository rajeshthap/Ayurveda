import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import "../../../assets/css/MediaGallery.css"

const API_BASE = 'https://mahadevaaya.com/trilokayurveda/trilokabackend';

const MediaGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/media-gallery-items/`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('API Error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="ayur-bgcover ayur-about-sec">
      {/* Header Section - Same as PresentationAwards */}
      <div className='about-bg'>
        <div className='ayur-bread-content text-center'>
          <h2 style={{ fontWeight: 'bold' }}>Media Gallery</h2>
          <div className="ayur-bread-list">
            <span>
              <a href="index.html">Home </a>
            </span>
            <span className="ayur-active-page">/ Media Gallery</span>
          </div>
        </div>
      </div>

      {/* Main Content Section - Same structure as PresentationAwards */}
      <div className="row">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="ayur-heading-wrap ayur-about-head">
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading Media Gallery content...</p>
                    </div>
                  ) : items.length === 0 ? (
                    <div className="alert alert-warning text-center">
                      No media items available.
                    </div>
                  ) : (
                    <>
                      {/* Content Header */}
                      <h3 style={{ fontWeight: 'bold', fontSize: '2rem', marginBottom: '2rem' }}>Media Gallery</h3>
                      
                      {/* Media Items Grid */}
                      <div className="row">
                        {items.map((item) => (
                          <div
                            className="col-lg-4 col-md-6 col-sm-6 mb-4"
                            key={item.id}
                          >
                            <div className="media-card">
                              <div className="media-card-img-container">
                                {item.image ? (
                                  <img
                                    src={`${API_BASE}${item.image}`}
                                    alt={item.title}
                                    className="media-card-img"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      console.error('Image failed to load:', e.target.src);
                                    }}
                                  />
                                ) : (
                                  <div className="media-card-img-placeholder">
                                    <i className="fas fa-image fa-3x"></i>
                                  </div>
                                )}
                                
                                <div className="media-card-date">
                                  <p>
                                    {new Date(item.date).toLocaleDateString(
                                      'en-IN',
                                      {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                      }
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div className="media-card-content">
                                <h3>
                                  <Link to="#">
                                    {item.title}
                                  </Link>
                                </h3>

                                <div className="media-card-btn">
                                  <Link to="#" className="ayur-btn">
                                    <span>View More</span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Background shapes - Same as PresentationAwards */}
          <div className="ayur-bgshape ayur-about-bgshape">
            <img src={BgShape2} alt="img" />
            <img src={BgLeaf2} alt="img" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default MediaGallery;