import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Spinner, Alert, Modal, Tabs, Tab, Card, Button, Form } from 'react-bootstrap';
import { FaPlayCircle, FaFilePdf, FaImage, FaArrowLeft, FaCreditCard, FaMobileAlt } from 'react-icons/fa';
import '../../../assets/css/stylecss.css';
import '../../../assets/css/Success.css';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';

function Webinarss() {
  const navigate = useNavigate();
  const [webinars, setWebinars] = useState([]);
  const [paidWebinars, setPaidWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentForm, setPaymentForm] = useState({
    upiId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('videos');
  const [showPaidTab, setShowPaidTab] = useState(false);

  // Fetch all webinars on component mount
  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        const response = await fetch(
          'https://mahadevaaya.com/trilokayurveda/trilokabackend/api/webinars-items/'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setWebinars(result.data);
        } else {
          throw new Error('No data available');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchWebinars();
  }, []);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  // Generate YouTube thumbnail URL
  const getYouTubeThumbnailUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  // Open video modal
  const openVideoModal = (videoLink) => {
    const videoId = getYouTubeVideoId(videoLink);
    if (videoId) {
      setVideoUrl(`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`);
      setShowVideoModal(true);
    }
  };

  // Close video modal
  const closeVideoModal = () => {
    setShowVideoModal(false);
    setVideoUrl('');
  };

  // Open payment modal
  const openPaymentModal = (webinar) => {
    setSelectedWebinar(webinar);
    setShowPaymentModal(true);
  };

  // Close payment modal
  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedWebinar(null);
    setPaymentMethod('upi');
    setPaymentForm({
      upiId: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: ''
    });
  };

  // Handle payment form changes
  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm({
      ...paymentForm,
      [name]: value
    });
  };

  // Process payment
  const processPayment = (e) => {
    e.preventDefault();
    setPaymentProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentProcessing(false);
      closePaymentModal();
      
      // Add webinar to paid webinars after successful payment
      if (selectedWebinar) {
        setPaidWebinars([...paidWebinars, selectedWebinar.id]);
        setShowPaidTab(true);
        setActiveTab('paid-videos');
      }
    }, 2000);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="ayur-bgcover ayur-about-sec">
        <div className='about-bg'>
          <div className='ayur-bread-content'>
            <h3>Webinars</h3>
            <div className="ayur-bread-list">
              <span><a href="/">Home</a></span>
              <span className="ayur-active-page">/ Webinars</span>
            </div>
          </div>
        </div>
        
        <div className="container fluid about-us ann-heading">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading webinars...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="ayur-bgcover ayur-about-sec">
        <div className='about-bg'>
          <div className='ayur-bread-content'>
            <h2>Webinars</h2>
            <div className="ayur-bread-list">
              <span><a href="/">Home</a></span>
              <span className="ayur-active-page">/ Webinars</span>
            </div>
          </div>
        </div>
        
        <div className="container fluid about-us ann-heading">
          <Alert variant="danger" className="mt-4">
            {error}
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2>Webinars</h2>
          <div className="ayur-bread-list">
            <span><a href="/">Home</a></span>
            <span className="ayur-active-page">/ Webinars</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us ann-heading">
            <h2>Webinars</h2>
            <h5>Knowledge Sharing Sessions</h5>
            
            {/* Tabs for Videos and Paid Videos (conditionally rendered) */}
            <Tabs
              id="webinars-tabs"
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
            >
              {/* Videos Tab */}
              <Tab eventKey="videos" title={
                <span>
                  <FaPlayCircle className="me-2" /> Videos
                </span>
              }>
                <Row>
                  {webinars.filter(webinar => webinar.video_link).length > 0 ? (
                    webinars.filter(webinar => webinar.video_link).map((webinar) => (
                      <Col md={6} lg={4} className="mb-4" key={webinar.id}>
                        <Card className="h-100">
                          <Card.Header className='ayur-tpro-text-web'>
                            <h4>{webinar.title}</h4>
                          </Card.Header>
                          <Card.Body>
                            <div className="video-thumbnail-container position-relative mb-3">
                              <img
                                src={getYouTubeThumbnailUrl(webinar.video_link)}
                                alt="Video thumbnail"
                                className="img-fluid rounded video-thumbnail"
                        
                                onClick={() => openVideoModal(webinar.video_link)}
                              />
                              <div 
                                className="position-absolute top-50 start-50 translate-middle video-play-icon"
                            
                                onClick={() => openVideoModal(webinar.video_link)}
                              >
                                <div className="d-flex align-items-center justify-content-center bg-white rounded-circle p-3">
                                  <FaPlayCircle size={30} className="text-danger" />
                                </div>
                              </div>
                            </div>
                            <Card.Text>
                              <h5>{webinar.description}</h5>
                            </Card.Text>
                            <div className="d-flex justify-content-center mt-3">
                              <Button 
                                variant="danger" 
                                onClick={() => openPaymentModal(webinar)}
                              >
                                Pay Now
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <div className="text-center py-5 w-100">
                      <p className="text-muted">No videos available.</p>
                    </div>
                  )}
                </Row>
              </Tab>

              {/* Paid Videos Tab - Only show after payment */}
              {showPaidTab && (
                <Tab eventKey="paid-videos" title={
                  <span>
                    <FaPlayCircle className="me-2" /> Paid Videos
                  </span>
                }>
                  <Row>
                    {webinars.filter(webinar => paidWebinars.includes(webinar.id) && webinar.video_file).length > 0 ? (
                      webinars.filter(webinar => paidWebinars.includes(webinar.id) && webinar.video_file).map((webinar) => (
                        <Col md={12} className="mb-4" key={webinar.id}>
                          <Card>
                            <Card.Header className='ayur-tpro-text-web'>
                              <h4>{webinar.title}</h4>
                            </Card.Header>
                            <Card.Body>
                              <div className="video-container mb-3 ">
                                <video
                                  controls
                                  className='video-controlss'
                                  
                                >
                                  <source src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${webinar.video_file}`} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                              <Card.Text>
                                <h5>{webinar.description}</h5>
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))
                    ) : (
                      <div className="text-center py-5 w-100">
                        <p className="text-muted">No paid videos available. Please complete a payment to access premium content.</p>
                      </div>
                    )}
                  </Row>
                </Tab>
              )}
            </Tabs>
          </div>
          
          <div className="ayur-bgshape ayur-about-bgshape">
            <img src={BgShape2} alt="img" />
            <img src={BgLeaf2} alt="img" />
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Modal 
        show={showVideoModal} 
        onHide={closeVideoModal} 
        centered
        className="video-modal"
        dialogClassName="video-modal-dialog"
        contentClassName="video-modal-content"
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Video</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div className="video-container">
            <iframe
              title="Video Player"
              className="video-iframe"
              src={videoUrl}
              allowFullScreen
              frameBorder="0"
            ></iframe>
          </div>
        </Modal.Body>
      </Modal>

      {/* Payment Modal */}
      <Modal 
        show={showPaymentModal} 
        onHide={closePaymentModal} 
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Complete Your Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWebinar && (
            <div className="mb-4">
              <h5>{selectedWebinar.title}</h5>
              <p>{selectedWebinar.description}</p>
            </div>
          )}
          
          <Tabs
            id="payment-method-tabs"
            activeKey={paymentMethod}
            onSelect={(k) => setPaymentMethod(k)}
            className="mb-4"
          >
            <Tab eventKey="upi" title={
              <span>
                <FaMobileAlt className="me-2" /> UPI
              </span>
            }>
              <Form onSubmit={processPayment}>
                <Form.Group className="mb-3">
                  <Form.Label>UPI ID</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your UPI ID"
                    name="upiId"
                    value={paymentForm.upiId}
                    onChange={handlePaymentFormChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={paymentProcessing}>
                  {paymentProcessing ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Processing...</span>
                    </>
                  ) : (
                    'Pay with UPI'
                  )}
                </Button>
              </Form>
            </Tab>
            
            <Tab eventKey="card" title={
              <span>
                <FaCreditCard className="me-2" /> Debit/Credit Card
              </span>
            }>
              <Form onSubmit={processPayment}>
                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your card number"
                    name="cardNumber"
                    value={paymentForm.cardNumber}
                    onChange={handlePaymentFormChange}
                    required
                  />
                </Form.Group>
                
                <Row className="mb-3">
                  <Col>
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="MM/YY"
                      name="expiryDate"
                      value={paymentForm.expiryDate}
                      onChange={handlePaymentFormChange}
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Label>CVV</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="CVV"
                      name="cvv"
                      value={paymentForm.cvv}
                      onChange={handlePaymentFormChange}
                      required
                    />
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Name on Card</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name as on card"
                    name="cardName"
                    value={paymentForm.cardName}
                    onChange={handlePaymentFormChange}
                    required
                  />
                </Form.Group>
                
                <Button variant="primary" type="submit" disabled={paymentProcessing}>
                  {paymentProcessing ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Processing...</span>
                    </>
                  ) : (
                    'Pay with Card'
                  )}
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Webinarss;