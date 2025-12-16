import React from 'react';

// Import images at the top
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import Inneraboutimg from '../../../assets/images/Diseases.jpg'
import {  useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaNotesMedical } from 'react-icons/fa';
import '../../../assets/css/autoimmune.css'
import { MdOutlineSick } from 'react-icons/md';


function DegenerativeDiseases() {

    const navigate = useNavigate();

  return (

    <div className="ayur-bgcover ayur-about-sec">
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2>Ankylosing Spondylosis (AS)</h2>

          <div class="ayur-bread-list">
            <span>
              <a href="/">Home </a>
            </span>
            <span class="ayur-active-page">/Alzheimer disease</span>
          </div>
        </div>
      </div>
      <div className="row ">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us-ann">
         <div className="row align-items-center">

          {/* Image */}
          <div className="col-lg-6 col-md-12 mb-4">
            <div className="ayur-about-img ayur-img-hover">
              <img src={Inneraboutimg} alt="Ankylosing Spondylosis" />
            </div>
          </div>

          {/* Content */}
          <div className="col-lg-6 col-md-12">
            <div className="ayur-heading-wrap ayur-about-head">

              <h3>
                <FaHeartbeat className="me-2 text-success" />
                Alzheimer disease
              </h3>

              {/* SYNONYMS CARD */}
              <div className="ayur-info-card">
                <h5>
                  <FaNotesMedical className="me-2" />
                SYNONYMS
                </h5>
                <ul className="ayur-icon-list">
                  <li>Presenile Dementia</li>
                  <li>Rheumatic Spondylitis (RS)</li>
                  <li>Dementia (DEM)</li>
                  <li>JSenile Dementia</li>
                  <li>Alzheimer’s Type</li>
                </ul>
              </div>
              {/* SYMPTOMS CARD */}
              <div className="ayur-info-card mt-4">
                <h5>
                  <MdOutlineSick className="me-2" />
                  SYMPTOMS
                </h5>
                <ul className="ayur-icon-list">
                  <li>Recent memory loss that affects job skills</li>
                  <li>Difficulty in performing familiar tasks</li>
                  <li>Problems with language</li>
                  <li>Disorientation of time and place</li>
                  <li>Problems with abstract thinking</li>
                </ul>
              </div>

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

export default DegenerativeDiseases;
