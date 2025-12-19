import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';
import Like from '../../../assets/images/like.svg';
import LikeFill from '../../../assets/images/like-fill.svg';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';

const API_BASE =
  'https://mahadevaaya.com/trilokayurveda/trilokabackend';

const PresentationAwards = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${API_BASE}/api/presentationandaward-items/`
    )
      .then((res) => res.json())
      .then((data) => {
        // ✅ IMPORTANT FIX
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
      {/* Header Section - Same as AboutUs */}
      <div className='about-bg'>
        <div className='ayur-bread-content text-center'>
          <h2 style={{ fontWeight: 'bold' }}>Presentations & Awards</h2>
          <div className="ayur-bread-list">
            <span>
              <a href="index.html">Home </a>
            </span>
            <span className="ayur-active-page">/ Presentations & Awards</span>
          </div>
        </div>
      </div>

      {/* Main Content Section - Same structure as AboutUs */}
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
                      <p className="mt-2">Loading Presentations & Awards content...</p>
                    </div>
                  ) : items.length === 0 ? (
                    <div className="alert alert-warning text-center">
                      No presentations available.
                    </div>
                  ) : (
                    <>
                      {/* Content Header */}
                      <h3 style={{ fontWeight: 'bold', fontSize: '2rem', marginBottom: '2rem' }}>Presentations & Awards</h3>
                      
                      {/* Presentation Items Grid */}
                      <div className="row">
                        {items.map((item) => (
                          <div
                            className="col-lg-4 col-md-6 col-sm-6"
                            key={item.id}
                          >
                            <div className="ayur-tpro-box">
                              <div className="ayur-tpro-img">
                                <img
                                  src={`${API_BASE}${item.image}`}
                                  alt={item.title}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    console.error('Image failed to load:', e.target.src);
                                  }}
                                />

                                <div className="ayur-tpro-sale">
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

                                  <div className="ayur-tpro-like">
                                    <Link
                                      to=""
                                      className="ayur-tpor-click"
                                    >
                                      <img
                                        src={Like}
                                        className="unlike"
                                        alt="like"
                                      />
                                      <img
                                        src={LikeFill}
                                        className="like"
                                        alt="like-fill"
                                      />
                                    </Link>
                                  </div>
                                </div>
                              </div>

                              <div className="ayur-tpro-text">
                                <h3>
                                  <Link to="#">
                                    {item.title}
                                  </Link>
                                </h3>

                                <div className="ayur-tpro-price"></div>

                                <div className="ayur-tpro-btn">
                                  <Link to="#" className="ayur-btn">
                                    <span>read more</span>
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
          
          {/* Background shapes - Same as AboutUs */}
          <div className="ayur-bgshape ayur-about-bgshape">
            <img src={BgShape2} alt="img" />
            <img src={BgLeaf2} alt="img" />
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-light py-4">
      
      </footer>
    </div>
  );
}

export default PresentationAwards;