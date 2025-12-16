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
      title: "Alzheimer disease ",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },
    {
      id: 2,
      title: "Atherosclerosis",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },
 {
      id: 3,
      title: "Avascular Necrosis ",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },
     {
      id: 4,
      title: "Cardiovascular Diseases ",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },
     {
      id: 5,
      title: "Cervical Spondylosis ",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },
      {
      id: 6,
      title: "Chronic Obstructive Pulmonary Disease ",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },
     {
      id: 7,
      title: "Lumbar Spondylosis  ",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },
    {
      id: 8,
      title: "Osteo-Arthritis    ",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },
    {
      id: 9,
      title: "Osteoporosis    ",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    }, 
     {
      id: 10,
      title: "Paralysis    ",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },  
     {
      id: 11,
      title: "Parkinson Disease     ",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },  
     {
      id: 12,
      title: "Progressive Supranuclear Palsy      ",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },  
     {
      id: 13,
      title: "Sciatica      ",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },  
     {
      id: 14,
      title: "Vascular Dementia       ",
      icon: <FaHeartbeat />,
      link: "/internal-medicine" // The route this card will navigate to
    },  
  ];
  return (

    <div className="ayur-bgcover ayur-about-sec">
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2>Degenerative Disorders</h2>
          <div class="ayur-bread-list">
            <span>
              <a href="AutoImmune">Home </a>
            </span>
            <span class="ayur-active-page">/Degenerative Disorders</span>
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
            <Col lg={3} md={6} sm={12} key={card.id} className="mb-4"  onClick={() => navigate("/DegenerativeDiseases")}
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
