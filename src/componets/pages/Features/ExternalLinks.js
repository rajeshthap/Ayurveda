import React from 'react';
 
// Import images at the top
import AboutImg from '../../../assets/images/about-img.png';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import Inneraboutimg from '../../../assets/images/about-img-inner.png'
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';
 
const ExternalLinks = () => {
  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2>External Links</h2>
          <div class="ayur-bread-list">
            <span>
                <Link to="/" >Home</Link>
            </span>
            <span class="ayur-active-page">/ External Links</span>
          </div>
        </div>
      </div>
 
      <div className="row ">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us">
            <div className="row">
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="ayur-about-img">
                  <img
                    src={Inneraboutimg}
                    alt="img"
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
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="ayur-heading-wrap ayur-about-head">
                  <h3>External Links</h3>
                  <h4>"Valuable Resources for Your Wellness Journey"</h4>
                  <div>
                    {/* Add your external links content here */}
                    <h5 className='pt-3'>Ayurvedic Organizations:</h5>
                    <p>Explore these reputable Ayurvedic organizations and institutions that promote authentic Ayurvedic practices, research, and education worldwide. These resources provide valuable information about Ayurvedic principles, certification programs, and global initiatives.</p>
                    
                    <h5>Research & Publications:</h5>
                    <p>Access scientific journals, research papers, and publications that focus on Ayurvedic medicine and its integration with modern healthcare. These resources offer evidence-based information about the efficacy of Ayurvedic treatments for various health conditions.</p>
                    
                    <h5>Wellness Partners:</h5>
                    <p>Discover our network of wellness partners including yoga centers, meditation retreats, organic farms, and holistic health practitioners. These trusted partners share our commitment to natural healing and holistic wellness approaches.</p>
                  </div>
 
                  <Link to="#" className="ayur-btn">
                    Visit Resources
                  </Link>
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
 
export default ExternalLinks;