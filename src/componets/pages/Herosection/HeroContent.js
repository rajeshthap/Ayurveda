import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import "../../../assets/css/MediaGallery.css"

const API_BASE = 'https://mahadevaaya.com/trilokayurveda/trilokabackend';

const HeroContent = ({ showBannerOnly = false }) => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Fetch hero data when component mounts
    fetch(`${API_BASE}/api/hero-component-item/`)
      .then((res) => res.json())
      .then((data) => {
        setHeroData(data.data && data.data.length > 0 ? data.data[0] : null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('API Error:', err);
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="ayur-bgcover ayur-about-sec">
      {/* 
        Header Section (Banner)
        This is now conditionally rendered.
        It will be hidden if showBannerOnly prop is true.
      */}
      {!showBannerOnly && (
        <div className='about-bg'>
          <div className='ayur-bread-content text-center'>
            <h2 className='heading-wrapper' >Hero Content</h2>
            <div className="ayur-bread-list">
              <span>
                  <Link to="/" >Home</Link>
              </span>
              <span className="ayur-active-page">/ Hero Content</span>
            </div>
          </div>
        </div>
      )}
      
      {/* 
        Main Content Section
        This section is now always rendered, regardless of the showBannerOnly prop.
      */}
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
                      <p className="mt-2">Loading Hero Content...</p>
                    </div>
                  ) : !heroData ? (
                    <div className="alert alert-warning text-center">
                      No hero content available.
                    </div>
                  ) : (
                    <>
                      {/* Content Header */}
                      <h3 className='heading-extend'>
                        {heroData.title}
                      </h3>
                      
                      {/* Hero Content Card */}
                      <div className="row">
                        <div className="col-lg-12">
                        
                            <div className="media-card-content">
                              <h4 className="media-card-heading mb-3">
                                {heroData.sub_title}
                              </h4>
                              
                              <div className="hero-description">
                                {heroData.description.split('\n\n').map((paragraph, index) => (
                                  <p key={index} className="mb-3">
                                    {paragraph}
                                  </p>
                                ))}
                              </div>
                              
                              
                            </div>
                          
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Background shapes are also only shown if the banner is shown */}
          {!showBannerOnly && (
            <div className="ayur-bgshape ayur-about-bgshape">
              <img src={BgShape2} alt="img" />
              <img src={BgLeaf2} alt="img" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroContent;