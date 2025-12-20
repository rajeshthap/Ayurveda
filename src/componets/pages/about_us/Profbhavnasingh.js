import React, { useState, useEffect } from "react";
import axios from "axios";
import BgShape2 from "../../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../../assets/images/bg-leaf2.png";
import { Link } from "react-router-dom";
import team3 from '../../../assets/images/team-3.png'
import { Row } from "react-bootstrap";

function Profbhavnasingh() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('https://mahadevaaya.com/trilokayurveda/trilokabackend/api/profile-items/');
        if (response.data.success && response.data.data.length > 0) {
          // Find the profile with ID 13 (Prof. Bhavna Singh)
          const bhavnaProfile = response.data.data.find(profile => profile.id === 13);
          if (bhavnaProfile) {
            setProfileData(bhavnaProfile);
          } else {
            setError('Profile not found');
          }
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile data');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div className="ayur-bgcover ayur-about-sec">Loading...</div>;
  }

  if (error) {
    return <div className="ayur-bgcover ayur-about-sec">{error}</div>;
  }

  if (!profileData) {
    return <div className="ayur-bgcover ayur-about-sec">No profile data available</div>;
  }

  // Parse modules from the API response
  const educationalQualification = profileData.module.find(item => item.content === "Educational Qualification");
  const thesisTitle = profileData.module.find(item => item.content === "Thesis Title :");
  const researchPapers = profileData.module.find(item => item.content === "Research Papers Published");
  const professionalExperience = profileData.module.find(item => item.content === "Professional Experience");
  const publications = profileData.module.find(item => item.content === "Publications");

  // Parse the description to extract contact information
  const descriptionLines = profileData.description.split('\r\n').filter(line => line.trim() !== '');

  // Function to get the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return team3;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/media/')) {
      return `https://mahadevaaya.com/trilokayurveda/trilokabackend${imagePath}`;
    }
    
    return `https://mahadevaaya.com/trilokayurveda/trilokabackend/${imagePath}`;
  };

  // Function to format educational qualification with green year
  const formatEducationText = (text) => {
    if (!text) return "";
    
    // Split text into separate qualifications
    const qualifications = text.split('\n\n').filter(q => q.trim() !== '');
    
    return qualifications.map((qualification, index) => {
      // Extract year from the qualification
      const yearMatch = qualification.match(/([A-Za-z]+\s+\d{4})$/);
      if (yearMatch) {
        const year = yearMatch[1];
        const qualificationWithoutYear = qualification.replace(year, "").trim();
        
        return (
          <p key={index}>
            {qualificationWithoutYear}
            <span className="year-txt" style={{ color: 'green' }}>{year}</span>
          </p>
        );
      }
      
      return <p key={index}>{qualification}</p>;
    });
  };

  // Function to format research papers as list items
  const formatResearchPapers = (text) => {
    if (!text) return [];
    
    // Split text into separate papers
    return text.split('\n').filter(paper => paper.trim() !== '').map((paper, index) => {
      // Check if it starts with a number (like "1. Singh B...")
      if (/^\d+\./.test(paper)) {
        return <li key={index}>{paper}</li>;
      }
      return <li key={index}>{paper}</li>;
    });
  };

  // Function to format professional experience as list items
  const formatProfessionalExperience = (text) => {
    if (!text) return [];
    
    // Split text into separate experiences
    return text.split('\n').filter(exp => exp.trim() !== '').map((exp, index) => {
      // Check if it starts with a dash or bullet point
      if (/^[-•]/.test(exp)) {
        return <li key={index}>{exp.substring(1).trim()}</li>;
      }
      return <li key={index}>{exp}</li>;
    });
  };

  // Function to format publications as list items
  const formatPublications = (text) => {
    if (!text) return [];
    
    // Split text into separate publications
    return text.split('\n').filter(pub => pub.trim() !== '').map((pub, index) => {
      // Check if it starts with a dash or bullet point
      if (/^[-•]/.test(pub)) {
        return <li key={index}>{pub.substring(1).trim()}</li>;
      }
      return <li key={index}>{pub}</li>;
    });
  };

  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className="about-bg">
        <div className="ayur-bread-content">
          <h2>{profileData.title} {profileData.full_name}</h2>
          <div class="ayur-bread-list">
            <span>
              <Link to="/">Home </Link>
            </span>
            <span class="ayur-active-page">/ {profileData.title} {profileData.full_name}</span>
          </div>
        </div>
      </div>

      <div className="row ">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-sm-6">
                <div className="ayur-team-box">
                  <div className="ayur-team-img-wrapper">
                    <div className="ayur-team-img">
                      <img src={getImageUrl(profileData.image)} alt="team member" />
                    </div>
                    <div className="ayur-team-hoverimg">
                      <div className="ayur-team-hoversmall">
                        <img src={getImageUrl(profileData.image)} alt="team member" />
                      </div>
                      <p>Research Associate</p>
                      <div className="ayur-team-sociallink">
                        <Link to="">{/* Facebook SVG */}</Link>
                        <Link to="">{/* Twitter SVG */}</Link>
                        <Link to="">{/* Github SVG */}</Link>
                        <Link to="">{/* Instagram SVG */}</Link>
                      </div>
                    </div>
                  </div>
                  <div className="ayur-team-name">
                    <h3> {profileData.full_name}</h3>
                    <p>{profileData.designation}</p>
                    <p>Research Associate</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-12 col-sm-12">
                <div className="ayur-heading-wrap ayur-about-head">
                  <h3>Trilok Ayurveda</h3>
                  {descriptionLines.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}

                  {educationalQualification && (
                    <div className="pt-4">
                      <h5>{educationalQualification.content}</h5>
                      {formatEducationText(educationalQualification.description)}
                    </div>
                  )}
                </div>
              </div>
              <Row className="ayur-heading-wrap ayur-about-head">
                <div>
                  {thesisTitle && (
                    <>
                      <h5 className="pt-4">{thesisTitle.content}</h5>
                      {thesisTitle.description.split('\n\n').map((thesis, index) => (
                        <p key={index}>{thesis}</p>
                      ))}
                    </>
                  )}
                  
                  {researchPapers && (
                    <>
                      <h5 className="pt-2">{researchPapers.content}</h5>
                      <ul>
                        {formatResearchPapers(researchPapers.description)}
                      </ul>
                    </>
                  )}
                  
                  {professionalExperience && (
                    <>
                      <h5 className="pt-2">{professionalExperience.content}</h5>
                      <ul>
                        {formatProfessionalExperience(professionalExperience.description)}
                      </ul>
                    </>
                  )}

                  {publications && (
                    <>
                      <h5 className="pt-2">{publications.content}</h5>
                      <p>{publications.description.split('\n\n')[0]}</p>
                      <ul>
                        {formatPublications(publications.description.split('\n\n')[1])}
                      </ul>
                    </>
                  )}

                  <Link to="#" className="ayur-btn">
                    Know More
                  </Link>
                </div>
              </Row>
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

export default Profbhavnasingh;