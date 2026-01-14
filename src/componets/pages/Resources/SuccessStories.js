import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Spinner, Alert, Modal, Tabs, Tab, Card } from 'react-bootstrap';
import { FaPlayCircle, FaFilePdf, FaImage, FaArrowLeft } from 'react-icons/fa';
import '../../../assets/css/stylecss.css';
import '../../../assets/css/Success.css';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';

function SuccessStories() {
  const navigate = useNavigate();
  const [successStories, setSuccessStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [activeTab, setActiveTab] = useState('videos'); // Default to videos tab

  // Fetch all success stories on component mount
  useEffect(() => {
    const fetchSuccessStories = async () => {
      try {
        const response = await fetch(
          'https://mahadevaaya.com/trilokayurveda/trilokabackend/api/oursuccess-stories-item/'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setSuccessStories(result.data);
        } else {
          throw new Error('No data available');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchSuccessStories();
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

  // Render loading state
  if (loading) {
    return (
      <div className="ayur-bgcover ayur-about-sec">
        <div className='about-bg'>
          <div className='ayur-bread-content'>
            <h3>Success Stories</h3>
            <div className="ayur-bread-list">
              <span><a href="/">Home</a></span>
              <span className="ayur-active-page">/ Success Stories</span>
            </div>
          </div>
        </div>
        
        <div className="container fluid about-us ann-heading">
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading success stories...</p>
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
            <h3>Success Stories</h3>
            <div className="ayur-bread-list">
              <span><a href="/">Home</a></span>
              <span className="ayur-active-page">/ Success Stories</span>
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
          <h2>Success Stories</h2>
          <div className="ayur-bread-list">
            <span><a href="/">Home</a></span>
            <span className="ayur-active-page">/ Success Stories</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us ann-heading">
            <h2>Success Stories</h2>
            <h5>Inspiring Journeys to Wellness</h5>
            
            {/* Tabs for Videos, Images, and PDFs */}
            <Tabs
              id="success-stories-tabs"
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
                  {successStories.filter(story => story.video_link).length > 0 ? (
                    successStories.filter(story => story.video_link).map((story) => (
                      <Col md={6} lg={4} className="mb-4" key={story.id}>
                        <Card className="h-100">
                          <Card.Header className='ayur-tpro-text-web card-header'>
                            <h4 >{story.title}</h4>
                          </Card.Header>
                          <Card.Body>
                            <div className="video-thumbnail-container position-relative mb-3">
                              <img
                                src={getYouTubeThumbnailUrl(story.video_link)}
                                alt="Video thumbnail"
                                className="img-fluid rounded video-thumbnail"
                    
                                onClick={() => openVideoModal(story.video_link)}
                              />
                              <div 
                                className="position-absolute top-50 start-50 translate-middle video-play-icon"
                    
                                onClick={() => openVideoModal(story.video_link)}
                              >
                                <div className="d-flex align-items-center justify-content-center bg-white rounded-circle p-3">
                                  <FaPlayCircle size={30} className="text-danger" />
                                </div>
                              </div>
                            </div>
                            <Card.Text>
                                  <h5 >{story.description}</h5></Card.Text>
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

              {/* Images Tab */}
              <Tab eventKey="images" title={
                <span>
                  <FaImage className="me-2" /> Images
                </span>
              }>
                <Row>
                  {successStories.filter(story => story.image).length > 0 ? (
                    successStories.filter(story => story.image).map((story) => (
                      <Col md={6} lg={4} className="mb-4" key={story.id}>
                        <Card className="h-100">
                          <Card.Header className='ayur-tpro-text-web'>
                            <h4>{story.title}</h4>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-3">
                              <img
                                src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${story.image}`}
                                alt={story.title}
                                className="img-fluid rounded video-thumbnail"
                              
                              />
                            </div>
                            <Card.Text>
                                <h5> {story.description}</h5></Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <div className="text-center py-5 w-100">
                      <p className="text-muted">No images available.</p>
                    </div>
                  )}
                </Row>
              </Tab>

              {/* PDFs Tab */}
              <Tab eventKey="pdfs" title={
                <span>
                  <FaFilePdf className="me-2" /> PDFs
                </span>
              }>
                <Row>
                  {successStories.filter(story => story.pdf_file).length > 0 ? (
                    successStories.filter(story => story.pdf_file).map((story) => (
                      <Col md={6} lg={4} className="mb-4" key={story.id}>
                        <Card className="h-100">
                          <div className='ayur-tpro-text-web card-header'>
                            <h4>{story.title}</h4>
                          </div>
                          <Card.Body>
                            <div className="d-flex justify-content-center mb-3">
                              <FaFilePdf size={80} className="text-danger" />
                            </div>
                            <Card.Text><h5>{story.description}</h5></Card.Text>
                            <div className="d-flex justify-content-center mt-3">
                              <a
                                href={`https://mahadevaaya.com/trilokayurveda/trilokabackend${story.pdf_file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-danger"
                              >
                                <FaFilePdf className="me-2" />
                                View PDF
                              </a>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <div className="text-center py-5 w-100">
                      <p className="text-muted">No PDFs available.</p>
                    </div>
                  )}
                </Row>
              </Tab>
            </Tabs>
          </div>
          
          <div className="ayur-bgshape ayur-about-bgshape">
            <img src={BgShape2} alt="img" />
            <img src={BgLeaf2} alt="img" />
          </div>
        </div>
      </div>

      {/* Video Modal - Increased Size */}
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

     
    </div>
  );
}

export default SuccessStories;