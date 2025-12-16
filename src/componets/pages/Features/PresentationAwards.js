import React from 'react';
import PA1 from '../../../assets/images/PA1.jpeg';
import PA2 from '../../../assets/images/PA2.jpeg';
import PA3 from '../../../assets/images/PA3.jpeg';
import { Link } from 'react-router-dom';
import { Row, Col, Container } from 'react-bootstrap';

const PresentationAwards = () => {
  return (
    <div className="ayur-bgcover">
      {/* Header Section */}
      <div className='about-bg'>
        <div className='ayur-bread-content text-center'>
          <h2 className="mb-3">Presentations & Awards</h2>
          <p className="text-white">Wellness Center and Speciality Clinic for Chronic Disorders</p>
        </div>
      </div>

      {/* Images Section */}
      <Container className="py-5">
        <Row className="g-4">
          <Col md={4} sm={12} className="text-center">
            <div className="event-image-container">
              <img src={PA1} alt="Presentation" className="img-fluid rounded shadow" />
              <p className="mt-3">Expert Presentation</p>
            </div>
          </Col>
          <Col md={4} sm={12} className="text-center">
            <div className="event-image-container">
              <img src={PA2} alt="Conference" className="img-fluid rounded shadow" />
              <p className="mt-3">International Conference</p>
            </div>
          </Col>
          <Col md={4} sm={12} className="text-center">
            <div className="event-image-container">
              <img src={PA3} alt="Participants" className="img-fluid rounded shadow" />
              <p className="mt-3">Participants Gathering</p>
            </div>
          </Col>
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

export default PresentationAwards;