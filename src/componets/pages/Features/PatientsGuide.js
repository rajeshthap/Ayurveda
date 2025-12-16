import React from 'react';
 
// Import images at the top
import AboutImg from '../../../assets/images/about-img.png';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import Inneraboutimg from '../../../assets/images/about-img-inner.png'
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';
 
const PatientsGuide = () => {
  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2>Patient's Guide</h2>
          <div class="ayur-bread-list">
            <span>
              <a href="index.html">Home </a>
            </span>
            <span class="ayur-active-page">/ Patient's Guide</span>
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
                  <h3>Patient's Guide</h3>
                  <h4>"Your Journey to Holistic Wellness"</h4>
                  <div>
                    {/* Add your patient guide content here */}
                    <h5 className='pt-3'>Before Your Visit:</h5>
                    <p>Prepare for your consultation by gathering your medical history, current medications, and any previous treatment records. Wear comfortable clothing for your examination, and arrive 15 minutes early to complete necessary paperwork.</p>
                    
                    <h5>During Your Treatment:</h5>
                    <p>Our Ayurvedic practitioners will conduct a thorough assessment including Nadi Pariksha (pulse diagnosis), tongue examination, and detailed health history review. Based on this evaluation, we'll create a personalized treatment plan that may include herbal medicines, dietary recommendations, lifestyle modifications, and Panchakarma therapies.</p>
                    
                    <h5>After Your Treatment:</h5>
                    <p>Follow the prescribed treatment plan diligently, including dietary guidelines and lifestyle recommendations. Keep a journal of your symptoms and progress, and attend all follow-up appointments. Our team is available to answer any questions you may have during your healing journey.</p>
                  </div>
 
                  <Link to="#" className="ayur-btn">
                    Download Full Guide
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
 
export default PatientsGuide;