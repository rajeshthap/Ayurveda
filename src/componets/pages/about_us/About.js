import React from 'react';

// Import images at the top
import AboutImg from '../../../assets/images/about-img.png';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import { Link } from 'react-router-dom';


function MediaGallery() {
  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="ayur-about-img">
              <img
                src={AboutImg}
                alt="img"
                data-tilt=""
                data-tilt-max="10"
                data-tilt-speed="1000"
                data-tilt-perspective="1000"
                className='ayur-inneraboutimg'

              />
              <div className="ayur-about-exp">
                <p>25</p>
                <p>Years of Experience</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="ayur-heading-wrap ayur-about-head">
              <h3>Media Gallery</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
              </p>
              <Link to="MediaGallery" className="ayur-btn">
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
  );
}

export default MediaGallery;
