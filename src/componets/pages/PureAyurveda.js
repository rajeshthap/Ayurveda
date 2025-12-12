import React from 'react';

// Import images at the top
import WhyIcon1 from '../../assets/images/why-icon1.png';
import WhyIcon2 from '../../assets/images/why-icon2.png';
import WhyIcon3 from '../../assets/images/why-icon3.png';
import WhyIcon4 from '../../assets/images/why-icon4.png';
import TickIcon from '../../assets/images/tick.png';
import BgShape4 from '../../assets/images/bg-shape4.png';
import BgLeaf4 from '../../assets/images/bg-leaf4.png';

function PureAyurveda() {
  return (
    <div className="ayur-bgcover ayur-why-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="ayur-heading-wrap ayur-why-head">
              <h5>Best For You</h5>
              <h3>Why Pure Ayurveda</h3>
            </div>
          </div>
        </div>
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="ayur-why-secbox">
              <div className="ayur-why-box">
                <div className="ayur-why-boxicon">
                  <img src={WhyIcon1} alt="icon" />
                </div>
                <div className="ayur-why-boxtext">
                  <h4>100 % Organic</h4>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit</p>
                </div>
              </div>
              <div className="ayur-why-box">
                <div className="ayur-why-boxicon">
                  <img src={WhyIcon2} alt="icon" />
                </div>
                <div className="ayur-why-boxtext">
                  <h4>Best Quality</h4>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit</p>
                </div>
              </div>
              <div className="ayur-why-box">
                <div className="ayur-why-boxicon">
                  <img src={WhyIcon3} alt="icon" />
                </div>
                <div className="ayur-why-boxtext">
                  <h4>Hygienic Product</h4>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit</p>
                </div>
              </div>
              <div className="ayur-why-box">
                <div className="ayur-why-boxicon">
                  <img src={WhyIcon4} alt="icon" />
                </div>
                <div className="ayur-why-boxtext">
                  <h4>Health Care</h4>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="ayur-why-textheading">
              <h3>Solve Your Problem with The Power of Nature</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,it's sed do eiusmod tempor incididunt
                ut labore et dolore was a magna aliqua.Ut enim ad minim veniam,quis nostrud exercitation
                that is ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in to
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
              <ul>
                <li>
                  <img src={TickIcon} alt="icon" />
                  <p>Quis nostrud was exercitation.</p>
                </li>
                <li>
                  <img src={TickIcon} alt="icon" />
                  <p>Quis nostrud was exercitation.</p>
                </li>
                <li>
                  <img src={TickIcon} alt="icon" />
                  <p>Quis nostrud was exercitation.</p>
                </li>
                <li>
                  <img src={TickIcon} alt="icon" />
                  <p>Quis nostrud was exercitation.</p>
                </li>
              </ul>
              <p>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                dolore eu fugiat nulla pariatur.
              </p>
              <div className="ayur-why-btn">
                <a
                  href="https://kamleshyadav.com/html/pure-ayurveda/html/pureayurveda-demo/services.html"
                  className="ayur-btn"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ayur-bgshape ayur-why-bgshape">
        <img src={BgShape4} alt="img" />
        <img src={BgLeaf4} alt="img" />
      </div>
    </div>
  );
}

export default PureAyurveda;
