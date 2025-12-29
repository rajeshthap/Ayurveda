import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import BgShape2 from '../assets/images/bg-shape2.png';
import BgLeaf2 from '../assets/images/bg-leaf2.png';
import { Link } from 'react-router-dom';


function CommingSoon() {
  const [aboutData, setAboutData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch About Us data from API




  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2 className='heading-wrapper' >Coming Soon</h2>
          <div className="ayur-bread-list">
            <span>
              <a href="/">Home </a>
            </span>
            <span className="ayur-active-page">/ Coming Soon</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="ayur-heading-wrap ayur-about-head">

                  <>
                    <div className='text-center bg-gray-200 opacity-75 p-8 rounded-lg'>
                      <h2>Coming Soon</h2>
                    </div>
                  </>

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

export default CommingSoon;