import React from 'react';

// Import images at the top
import AboutImg from '../../../assets/images/about-img.png';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import { Link } from 'react-router-dom';


function AboutUs() {
  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className="container">
        <div className="row about-us">
        About US
        </div>
      </div>
      <div className="ayur-bgshape ayur-about-bgshape">
        <img src={BgShape2} alt="img" />
        <img src={BgLeaf2} alt="img" />
      </div>
    </div>
  );
}

export default AboutUs;
