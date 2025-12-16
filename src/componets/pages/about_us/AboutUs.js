import React from 'react';

// Import images at the top
import AboutImg from '../../../assets/images/about-img.png';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import Inneraboutimg from '../../../assets/images/about-img-inner.png'
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';


function AboutUs() {
  return (

    <div className="ayur-bgcover ayur-about-sec">
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2>About Us</h2>
          <div class="ayur-bread-list">
            <span>
              <a href="index.html">Home </a>
            </span>
            <span class="ayur-active-page">/ About Us</span>
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
                  <h3>Trilok Ayurveda</h3>
                  <h4>"Wellness Center and Speciality Clinic for Chronic Disorders"</h4>
                  <div>

                    <h5 className='pt-3'>Internal Medicine:</h5>
                    <p>Two decades of rich clinical experience and expertise in treating, Degenerative, Auto-immune, Metabolic and other Chronic Non-Communicable Disorders (CNCD’s) through herbs based internal medicines. The key to holistic treatment is the portfolio of self manufactured 125 (and growing) herbal formulations. The purpose is to provide individualized precision medicine and to maintain the quality.</p>
                    <h5>Wellness Program:</h5>
                    <p>From “Illness to Wellness”, “Nirvana” is the core program of Trilok Ayurveda Wellness Center, nestled in the quaint environs of Himalayas settled at the banks of divine Ganga, dedicated to improving total health in terms of mind, body and soul detoxification and rejuvenation. It encompasses Yoga, Pranayam, Meditation, Panchkarma, Ayurvedic Dietetics and life-style related guidelines, Nadi pariksha (pulse assessment) and Ayurvedic Consultations.</p>

                  </div>

                  <Link to="/Thejourney" className="ayur-btn">
                    Know More
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

export default AboutUs;
