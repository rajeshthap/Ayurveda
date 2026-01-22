import React, { useState, useEffect } from "react";
import axios from "axios";
import BgShape2 from "../../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../../assets/images/bg-leaf2.png";
import { Link } from "react-router-dom";
import team3 from '../../../assets/images/team-3.png'
import { Row } from "react-bootstrap";
import '../../../assets/css/Profile.css';

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

  // Parse the description to extract contact information
  const descriptionLines = profileData.description
    .split("\n")
    .filter((line) => line.trim() !== "");

  // Extract Educational Qualification module to display separately
  const educationalQualification = profileData.module.find(
    (item) => item.content === "Educational Qualification"
  );

  // Function to render module content dynamically
  const renderModuleContent = (module, index) => {
    if (!module.content && !module.description) return null;
    
    // Skip Educational Qualification as it's rendered separately
    if (module.content === "Educational Qualification") {
      return null;
    }
    
    // Special handling for Research Papers Published to display as list
    if (module.content === "Research Papers Published") {
      return (
        <div key={index} className="pt-2">
          <h5>{module.content}</h5>
          <ul>
            {module.description.split("\n").map((paragraph, pIndex) => (
              paragraph.trim() !== '' ? <li key={pIndex}>{paragraph}</li> : null
            ))}
          </ul>
        </div>
      );
    }
    
    // Special handling for Professional Experience to display as list
    if (module.content === "Professional Experience") {
      return (
        <div key={index} className="pt-2">
          <h5>{module.content}</h5>
          <ul>
            {module.description.split("\n").map((paragraph, pIndex) => (
              paragraph.trim() !== '' ? <li key={pIndex}>{paragraph}</li> : null
            ))}
          </ul>
        </div>
      );
    }
    
    // Special handling for Publications to display as list
    if (module.content === "Publications") {
      const publicationParts = module.description.split("\n\n");
      return (
        <div key={index} className="pt-2">
          <h5>{module.content}</h5>
          {publicationParts[0] && <p>{publicationParts[0]}</p>}
          {publicationParts[1] && (
            <ul>
              {publicationParts[1].split("\n").map((paragraph, pIndex) => (
                paragraph.trim() !== '' ? <li key={pIndex}>{paragraph}</li> : null
              ))}
            </ul>
          )}
        </div>
      );
    }
    
    // Default handling for all other modules
    return (
      <div key={index} className="pt-2">
        {module.content && <h5>{module.content}</h5>}
        {module.description && module.description.split("\n\n").map((paragraph, pIndex) => (
          paragraph.trim() !== '' ? <p key={pIndex}>{paragraph}</p> : null
        ))}
      </div>
    );
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
            <span className="year-txt">{year}</span>
          </p>
        );
      }
      
      return <p key={index}>{qualification}</p>;
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
                  
                  {/* Educational Qualification module displayed right after description */}
                  {educationalQualification && (
                    <div className="pt-2">
                      <h5>{educationalQualification.content}</h5>
                      {formatEducationText(educationalQualification.description)}
                    </div>
                  )}
                </div>
              </div>
              <Row className="ayur-heading-wrap ayur-about-head">
                <div>
                  {/* Render all modules from the API dynamically, excluding Educational Qualification */}
                  {profileData.module.map((module, index) => {
                    // Skip Educational Qualification module as it's already rendered above
                    if (module.content === "Educational Qualification") {
                      return null;
                    }
                    return renderModuleContent(module, index);
                  })}
                  
                 
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