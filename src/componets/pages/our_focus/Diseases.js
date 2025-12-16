import React from 'react';

// Import images at the top
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import Inneraboutimg from '../../../assets/images/Diseases.jpg'
import {  useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaNotesMedical } from 'react-icons/fa';
import '../../../assets/css/autoimmune.css'
import { MdOutlineSick } from 'react-icons/md';


function Diseases() {

    const navigate = useNavigate();
     const cardData = [
    {
      id: 1,
      title: "Ankylosing Spondylosis (AS)",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },
    {
      id: 2,
      title: "Arthritic Heart Disease (AHD)",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },
 {
      id: 3,
      title: "Auto-immune Hepatitis (AIH)",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },
     {
      id: 4,
      title: "Auto-immune Pancreatitis (AIP)",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" 
    },
     {
      id: 5,
      title: "Auto-immune Thyroiditis (AIT)",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" 
    },
      {
      id: 5,
      title: "Auto-immune Urticaria (AIU)",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },
  ];
  return (

    <div className="ayur-bgcover ayur-about-sec">
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2>Ankylosing Spondylosis (AS)</h2>

          <div class="ayur-bread-list">
            <span>
              <a href="index.html">Home </a>
            </span>
            <span class="ayur-active-page">/Ankylosing Spondylosis (AS)</span>
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
                Ankylosing Spondylosis (AS)
              </h3>

              {/* SYNONYMS CARD */}
              <div className="ayur-info-card">
                <h5>
                  <FaNotesMedical className="me-2" />
                  Synonyms
                </h5>
                <ul className="ayur-icon-list">
                  <li>Ankylosing Spondylitis (AS)</li>
                  <li>Rheumatic Spondylitis (RS)</li>
                  <li>Ankylosing Polyarthritis (APA)</li>
                  <li>Juvenile–Adolescent Spondylitis (JAS)</li>
                </ul>
              </div>

              {/* SYMPTOMS CARD */}
              <div className="ayur-info-card mt-4">
                <h5>
                  <MdOutlineSick className="me-2" />
                  Symptoms
                </h5>
                <ul className="ayur-icon-list">
                  <li>Pain and stiffness in spine and hips</li>
                  <li>Early morning stiffness</li>
                  <li>Loss of appetite, weight loss & fatigue</li>
                  <li>Cardiomyopathy</li>
                  <li>Crohn’s disease or ulcerative colitis</li>
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

export default Diseases;
