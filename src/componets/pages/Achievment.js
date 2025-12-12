import React from 'react';

// Import images at the top
import AchieveIcon1 from '../../assets/images/achieve-icon1.png';
import AchieveIcon2 from '../../assets/images/achieve-icon2.png';
import AchieveIcon3 from '../../assets/images/achieve-icon3.png';
import AchieveIcon4 from '../../assets/images/achieve-icon4.png';

function Achievment() {
  return (
    <div className="ayur-bgcover ayur-achievement-sec">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4 col-md-12 col-sm-12">
            <div className="ayur-heading-wrap ayur-heading-left">
              <h5>Our Recent Achievements</h5>
              <h3>Benefit From Choosing The Best</h3>
            </div>
          </div>
          <div className="col-lg-8 col-md-12 col-sm-12">
            <div className="ayur-achieve-box-wrapper">
              <div className="ayur-achieve-box">
                <div className="ayur-achieve-icon">
                  <img src={AchieveIcon1} alt="icon" />
                </div>
                <div className="ayur-achieve-text">
                  <h2 className="ayur-counting" data-to="25">25</h2>
                  <p>Years Experience</p>
                </div>
              </div>

              <div className="ayur-achieve-box">
                <div className="ayur-achieve-icon">
                  <img src={AchieveIcon2} alt="icon" />
                </div>
                <div className="ayur-achieve-text">
                  <h2 className="ayur-counting" data-to="60">60</h2>
                  <p>Happy Customers</p>
                </div>
              </div>

              <div className="ayur-achieve-box">
                <div className="ayur-achieve-icon">
                  <img src={AchieveIcon3} alt="icon" />
                </div>
                <div className="ayur-achieve-text">
                  <h2 className="ayur-counting" data-to="800">800</h2>
                  <p>Our Products</p>
                </div>
              </div>

              <div className="ayur-achieve-box">
                <div className="ayur-achieve-icon">
                  <img src={AchieveIcon4} alt="icon" />
                </div>
                <div className="ayur-achieve-text">
                  <h2 className="ayur-counting percent" data-to="100%">100</h2>
                  <p>Product Purity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Achievment;
