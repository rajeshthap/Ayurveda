import React from 'react';

// Import images at the top

import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';

import { Link, useNavigate } from 'react-router-dom';
import { Row,Col } from 'react-bootstrap';
import { FaHeartbeat } from 'react-icons/fa';
import '../../../assets/css/autoimmune.css'


function Degenerative() {

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
      link: "/internal-medicine" // The route this card will navigate to
    },
     {
      id: 5,
      title: "Auto-immune Thyroiditis (AIT)",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
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
          <h2>Auto-Immune Diseases</h2>
          <div class="ayur-bread-list">
            <span>
              <a href="AutoImmune">Home </a>
            </span>
            <span class="ayur-active-page">/ Auto-Immune Diseases</span>
          </div>
        </div>
      </div>



      <div className="row ">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us ann-heading ">
            <h3>List of Diseases</h3>
               <h5>Wellness Center and Speciality Clinic for Chronic Disorders</h5>
            <Row className="ayur-cards-row">
         
          {cardData.map((card) => (
            <Col lg={3} md={6} sm={12} key={card.id} className="mb-4"  onClick={() => navigate("/Diseases")}
  style={{ cursor: "pointer" }} >
              {/* The entire card is now a Link */}
              <Link to={card.link} className="ayur-card-link">
                <div className="ayur-card">
                  <div className="ayur-card-icon">
                    {card.icon}
                  </div>
                  <div className="ayur-card-content card-text">
                    <h5>{card.title}</h5>
                    {/* <p>{card.description}</p> */}
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
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

export default Degenerative;
