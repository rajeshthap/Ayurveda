import React from 'react';
 
// Import images at the top
import AboutImg from '../../../assets/images/about-img.png';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import Inneraboutimg from '../../../assets/images/about-img-inner.png'
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';
 
const Disclaimer = () => {
  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2>Disclaimer</h2>
          <div class="ayur-bread-list">
            <span>
              <a href="index.html">Home </a>
            </span>
            <span class="ayur-active-page">/ Disclaimer</span>
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
                  <h3>Disclaimer</h3>
                  <h4>"Important Information About Our Services</h4>
                  <div>
                    {/* Add your disclaimer content here */}
                    <h5 className='pt-3'>Medical Advice:</h5>
                    <p>The information provided on this website is for educational purposes only and is not intended as medical advice. The content is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
                    
                    <h5>Treatment Results:</h5>
                    <p>Individual results may vary. The testimonials and examples used are exceptional results and do not apply to the average person. They are not intended to represent or guarantee that anyone will achieve the same or similar results. Each individual's success depends on their background, dedication, desire, and motivation.</p>
                    
                    <h5>Product Information:</h5>
                    <p>The herbal formulations and products mentioned on this website are not intended to diagnose, treat, cure, or prevent any disease. These statements have not been evaluated by the Food and Drug Administration or any other regulatory authority. Please consult your healthcare provider before using any herbal products.</p>
                  </div>
 
                  <Link to="#" className="ayur-btn">
                    Contact Us
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
 
export default Disclaimer;