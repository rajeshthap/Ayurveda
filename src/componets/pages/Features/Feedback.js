import React from 'react';
 
// Import images at the top
import AboutImg from '../../../assets/images/about-img.png';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import Inneraboutimg from '../../../assets/images/about-img-inner.png'
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';
 
const Feedback = () => {
  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2>Feedback</h2>
          <div class="ayur-bread-list">
            <span>
                <Link to="/" >Home</Link>
            </span>
            <span class="ayur-active-page">/ Feedback</span>
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
                    className='ayur-inneraboutimg'
                   
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="ayur-heading-wrap ayur-about-head">
                  <h3>Your Feedback</h3>
                  <h4>"We Value Your Opinion and Experience"</h4>
                  <div>
                    {/* Add your feedback content here */}
                    <h5 className='pt-3'>Share Your Experience:</h5>
                    <p>Your feedback is important to us as it helps us improve our services and provide the best possible care to our patients. Whether you've visited our wellness center, participated in our programs, or used our herbal products, we would love to hear about your experience.</p>
                    
                    <h5>How to Provide Feedback:</h5>
                    <p>You can share your feedback through our online form, email us directly, or speak with our staff during your next visit. We welcome both positive feedback and constructive suggestions. All feedback is reviewed by our management team and used to enhance our services.</p>
                    
                    <h5>Testimonials:</h5>
                    <p>If you've had a positive experience with Trilok Ayurveda, we invite you to share your story. Your testimonial may inspire others on their wellness journey. With your permission, we may feature your testimonial on our website or promotional materials.</p>
                  </div>
 
                  <Link to="#" className="ayur-btn">
                    Submit Feedback
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
 
export default Feedback;