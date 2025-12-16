import React from 'react';
import MG1 from '../../../assets/images/MG1.jpg';
import MG2 from '../../../assets/images/MG2.jpg';
import MG3 from '../../../assets/images/MG3.jpg';

import { Link } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';

const MediaGallery = () => {
  // Media data array
  const mediaItems = [
    {
      id: 1,
      image: MG1,
      source: "FEMINA",
      title: "Holistic approaches to chronic disorders"
    },
    
    {
      id: 2,
      image: MG2,
      source: "Hindustan Times",
      title: "Ayurvedic treatment for Alzheimer's disease"
    },
    {
      id: 3,
      image: MG3,
      source: "Health Today",
      title: "The science behind Panchakarma therapy"
    },
    
  ];

  return (
    <div className="ayur-bgcover">
      {/* Header Section */}
      <div className='about-bg'>
        <div className='ayur-bread-content text-center'>
          <h2 className="mb-3">Media Gallery</h2>
          <p className="text-white">Wellness Center and Speciality Clinic for Chronic Disorders</p>
        </div>
      </div>

      {/* Media Grid Section */}
      <Container className="py-5">
        <Row className="g-4">
          {mediaItems.map((item) => (
            <Col md={4} sm={6} xs={12} key={item.id} className="text-center">
              <div className="media-item-container">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="img-fluid rounded shadow mb-3"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="media-info">
                  <h5 className="text-success">{item.source}</h5>
                  <p className="media-title">{item.title}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Footer Section */}
      <footer className="bg-light py-4">
        <Container className="text-center">
          <div className="mb-3">
            <h3 className="text-success">Trilok Ayurveda</h3>
          </div>
          <p className="mb-2">Address: Trilok Ayurveda Rishikesh</p>
          <div className="quick-links">
            <Link to="/" className="mx-2 text-decoration-none text-dark">Home</Link> | 
            <Link to="/about" className="mx-2 text-decoration-none text-dark">About Us</Link>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default MediaGallery;