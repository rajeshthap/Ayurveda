import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import BgShape2 from "../../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../../assets/images/bg-leaf2.png";
import TheJourneyimg from "../../../assets/images/The-Journey.png";
import { Link } from "react-router-dom";

function Thejourney() {
  const [journeyData, setJourneyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Journey data from API
  useEffect(() => {
    const fetchJourneyData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://mahadevaaya.com/trilokayurveda/trilokabackend/api/journey-item/",
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Journey data");
        }

        const result = await response.json();
        console.log("GET API Response:", result);

        if (result.success && result.data.length > 0) {
          setJourneyData(result.data[0]);
        } else {
          throw new Error("No Journey data found");
        }
      } catch (err) {
        console.error("Error fetching Journey data:", err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJourneyData();
  }, []);

  // Function to render modules
  const renderModules = () => {
    if (!journeyData || !journeyData.module || journeyData.module.length === 0) {
      return null;
    }

    return (
      <div className="modules-container mt-4">
        {journeyData.module.map((module, index) => {
          const isModuleObject = typeof module === "object" && module !== null;
          const moduleContent = isModuleObject ? module.content : module;
          const moduleDescription = isModuleObject ? module.description : "";

          return (
            <div key={index} className="module-item mb-2 p-3 bg-light rounded">
              <h5 className="module-title-text">{moduleContent}</h5>
              {moduleDescription && (
                <p
                  className="module-description-text mt-2"
                  
                >
                  {moduleDescription}
                </p>
              )}

            </div>
          );
        })}
      </div>
    );
  };

  // Hardcoded journey milestones to display in Col(8)
  const journeyMilestones = (
    <div className="journey-milestones mt-4">
      {/* <p>A Seed is sown.... and a Dream unfolds...:</p>
      <p>.... 1993 - A young aspiring Harsh Sehgal, with a strong desire to serve humanity, joins B.A.M.S. (Bachelor of Ayurvedic Medicine and Surgery).</p>
      <p>.... 2000 - A modest beginning with a saving of just INR 3,000/-(saved during his college days) led him to open his first clinic in the garage of his home.</p> */}
    </div>
  );

  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2 className='heading-wrapper' >The Journey</h2>
          <div className="ayur-bread-list">
            <span>
                <Link to="/" >Home</Link>
            </span>
            <span className="ayur-active-page">/ The Journey</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="ayur-heading-wrap ayur-about-head">
                  {isLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading Journey content...</p>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger text-center">
                      Error loading content: {error}
                    </div>
                  ) : journeyData ? (
                    <>
                      {/* Two-column layout for image and content */}
                      <Row>
                        <Col lg={4} md={12} sm={12}>
                          <div className="about-image-container">
                            <img
                              src={
                                journeyData.image
                                  ? `https://mahadevaaya.com/trilokayurveda/trilokabackend${journeyData.image}`
                                  : TheJourneyimg
                              }
                              alt={journeyData.title}
                              className="img-fluid rounded"
                            />
                          </div>
                        </Col>
                        <Col lg={8} md={12} sm={12} className="d-flex flex-column">
                          <div className="about-content text-start">
                            <h4 className='heading-extend' >{journeyData.title}</h4>
                            <div
                              className="about-description"
                              
                              dangerouslySetInnerHTML={{
                                __html: journeyData.description.replace(/\n/g, '<br />')
                              }}
                            />
                            {/* Added journey milestones here */}
                            {journeyMilestones}
                          </div>
                        </Col>
                      </Row>

                      {/* Full-width row for modules */}
                      <Row >
                        <Col lg={12} md={12} sm={12}>
                          <div className="modules-section">
                            {renderModules()}
                          </div>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <div className="alert alert-warning text-center">
                      No content available
                    </div>
                  )}
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

export default Thejourney;