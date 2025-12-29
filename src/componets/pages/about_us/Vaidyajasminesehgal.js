import React, { useState, useEffect } from "react";
import axios from "axios";
import BgShape2 from "../../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../../assets/images/bg-leaf2.png";
import { FaAward } from "react-icons/fa";
import { Link } from "react-router-dom";
import team2 from '../../../assets/images/team-2.png'
import { Row } from "react-bootstrap";
import '../../../assets/css/Profile.css';

function Vaidyajasminesehgal() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('https://mahadevaaya.com/trilokayurveda/trilokabackend/api/profile-items/');
        if (response.data.success && response.data.data.length > 0) {
          // Find the profile with ID 12 (Vaidya Jasmine Sehgal)
          const jasmineProfile = response.data.data.find(profile => profile.id === 12);
          if (jasmineProfile) {
            setProfileData(jasmineProfile);
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
  const thesisTitle = profileData.module.find(item => item.content === "Thesis Title :");
  const professionalExperience = profileData.module.find(item => item.content === "Professional Experience");

 

  // Parse the description to extract contact information and education
  const descriptionLines = profileData.description.split('\r\n').filter(line => line.trim() !== '');
  
  // Separate contact info and education
  let contactInfo = [];
  let educationInfo = [];
  let foundEducation = false;
  
  descriptionLines.forEach(line => {
    if (line === "Educational Qualification") {
      foundEducation = true;
      return;
    }
    if (foundEducation) {
      educationInfo.push(line);
    } else {
      contactInfo.push(line);
    }
  });

  // Function to get the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return team2;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/media/')) {
      return `https://mahadevaaya.com/trilokayurveda/trilokabackend${imagePath}`;
    }
    
    return `https://mahadevaaya.com/trilokayurveda/trilokabackend/${imagePath}`;
  };

  // Function to format education text with green year
  const formatEducationText = (text) => {
    if (!text) return "";
    
    // Extract BAMS information
    const bamsMatch = text.match(/B\.A\.M\.S\..*?([A-Za-z]+\s+\d{4})/);
    if (bamsMatch) {
      const bamsYear = bamsMatch[1];
      const bamsWithoutYear = text.replace(bamsYear, "").trim();
      
      return (
        <p>
          {bamsWithoutYear}
          <span className="year-txt" >{bamsYear}</span>
        </p>
      );
    }
    
    return <p>{text}</p>;
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
                      <p>Director</p>
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
                    <p>Director</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-12 col-sm-12">
                <div className="ayur-heading-wrap ayur-about-head">
                  <h3>Trilok Ayurveda</h3>
                  {contactInfo.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}

                  {educationInfo.length > 0 && (
                    <div className="pt-4">
                      <h5>Educational Qualification</h5>
                      {educationInfo.map((line, index) => (
                        <div key={index}>
                          {formatEducationText(line)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Row className="ayur-heading-wrap ayur-about-head">
                <div>
                  {thesisTitle && (
                    <>
                      <h5 className="pt-4">{thesisTitle.content}</h5>
                      <p>{thesisTitle.description}</p>
                    </>
                  )}
                  
                  {professionalExperience && (
                    <>
                      <h5 className="pt-2">{professionalExperience.content}</h5>
                      {professionalExperience.description.split('\n').map((paragraph, index) => (
                        paragraph.trim() !== '' ? <p key={index}>{paragraph}</p> : null
                      ))}
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

export default Vaidyajasminesehgal;