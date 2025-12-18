import React, { useState, useEffect } from "react";
import axios from "axios";
import BgShape2 from "../../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../../assets/images/bg-leaf2.png";
import { FaAward } from "react-icons/fa";
import { Link } from "react-router-dom";
import team1 from '../../../assets/images/team-1.png'
import { Row } from "react-bootstrap";

function Vaidyaharshsehgal() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('https://mahadevaaya.com/trilokayurveda/trilokabackend/api/profile-items/');
        if (response.data.success && response.data.data.length > 0) {
          // Find the profile with ID 11 (Vaidya Harsh Sehgal) or use the first profile
          const harshProfile = response.data.data.find(profile => profile.id === 11) || response.data.data[0];
          setProfileData(harshProfile);
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

  // Check if awards data exists in the API response
  // Looking for awards in the modules or as a separate field
  const awardsModule = profileData.module.find(item => item.content === "Felicitations/Awards" || item.content === "Awards");
  
  // Parse awards data from API if available, otherwise use hardcoded awards
  let awards = [];
  
  if (awardsModule && awardsModule.description) {
    // Try to parse awards from the description
    const awardLines = awardsModule.description.split('\n').filter(line => line.trim() !== '');
    awards = awardLines.map((line, index) => {
      // Try to extract year from the line
      const yearMatch = line.match(/(\d{1,2}\s+[A-Za-z]+\s+\d{4}|\d{4})/);
      const year = yearMatch ? yearMatch[1] : '';
      
      // Extract title (everything before the year or the whole line if no year)
      const title = year ? line.substring(0, line.indexOf(year)).trim() : line.trim();
      
      return {
        icon: <FaAward className="text-warning" />,
        title: title,
        year: year
      };
    });
  } else {
    // Fallback to hardcoded awards if not in API
    awards = [
      {
        icon: <FaAward className="text-warning" />,
        title: 'Uttarakhand Gaurav',
        year: '16th Nov. 2008'
      },
      {
        icon: <FaAward className="text-warning" />,
        title: 'Technocrat\'s Excellency Award',
        year: '23rd Dec. 2006'
      },
      {
        icon: <FaAward className="text-warning" />,
        title: 'Uttarakhand Ratna',
        year: '1st Oct. 2006'
      }
    ];
  }

  // Parse the description to extract contact information
  const descriptionLines = profileData.description.split('\r\n').filter(line => line.trim() !== '');

  // Function to get the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return team1;
    
    // If the image path is already a full URL, return it as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If the image path starts with /media/, construct the full URL
    if (imagePath.startsWith('/media/')) {
      return `https://mahadevaaya.com/trilokayurveda/trilokabackend${imagePath}`;
    }
    
    // For any other case, construct the URL with the base path
    return `https://mahadevaaya.com/trilokayurveda/trilokabackend/${imagePath}`;
  };

  // Function to format educational qualification with green year
  const formatEducationText = (text) => {
    if (!text) return "";
    
    // Extract MD information
    const mdMatch = text.match(/M\.D\. \(Ayu\.\).*?([A-Za-z]+\.?\s?\d{4})/);
    if (mdMatch) {
      const mdText = text.substring(0, text.indexOf(mdMatch[1]) + mdMatch[1].length);
      const mdYear = mdMatch[1];
      const mdWithoutYear = mdText.replace(mdYear, "").trim();
      
      return (
        <p>
          {mdWithoutYear}
          <span className="year-txt" style={{ color: 'green' }}>{mdYear}</span>
        </p>
      );
    }
    
    return <p>{text}</p>;
  };

  // Extract BAMS information separately
  const extractBAMSInfo = (text) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    const bamsLine = lines.find(line => line.includes("B.A.M.S."));
    
    if (bamsLine) {
      const bamsMatch = bamsLine.match(/B\.A\.M\.S\..*?([A-Za-z]+\.?\s?\d{4})/);
      if (bamsMatch) {
        const bamsYear = bamsMatch[1];
        const bamsWithoutYear = bamsLine.replace(bamsYear, "").trim();
        
        return (
          <p>
            {bamsWithoutYear}
            <span className="year-txt" style={{ color: 'green' }}>{bamsYear}</span>
          </p>
        );
      }
    }
    
    return null;
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
                      <img src={getImageUrl(profileData.image)} alt="team member 1" />
                    </div>
                    <div className="ayur-team-hoverimg">
                      <div className="ayur-team-hoversmall">
                        <img src={getImageUrl(profileData.image)} alt="team member 1" />
                      </div>
                      <p>Founder and CEO</p>
                      <div className="ayur-team-sociallink">
                        <Link to="">{/* Facebook SVG */}</Link>
                        <Link to="">{/* Twitter SVG */}</Link>
                        <Link to="">{/* Github SVG */}</Link>
                        <Link to="">{/* Instagram SVG */}</Link>
                      </div>
                    </div>
                  </div>
                  <div className="ayur-team-name">
                    <h3>{profileData.title} {profileData.full_name}</h3>
                    <p>{profileData.designation}</p>
                    <p>Founder and CEO</p>
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
                      {extractBAMSInfo(educationalQualification.description)}
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
                  
                  {researchPapers && (
                    <>
                      <h5 className="pt-2">{researchPapers.content}</h5>
                      {researchPapers.description.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </>
                  )}
                  
                  {professionalExperience && (
                    <>
                      <h5 className="pt-2">{professionalExperience.content}</h5>
                      <ul>
                        <li>Ayurvedic consultant, with clinical practice since April 2000.</li>
                        <li>Assistant Professor in the PG Department of DravyaGuna, Uttaranchal Ayurvedic Medical College, Rajpur Road, Dehradun, November 2018 onwards.</li>
                      </ul>
                      {professionalExperience.description.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </>
                  )}

                  <h5 className="pt-2">Felicitations/Awards</h5>
                  <p>Felicitated for the exemplary work in the field of Ayurveda:</p>
                  <p></p>
                  <div className="row g-4">
                    {awards.map((award, index) => (
                      <div key={index} className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm award-card">
                          <div className="card-body text-center p-4">
                            <div className="award-icon mb-3">
                              {award.icon}
                            </div>
                            <h5 className="card-title">{award.title}</h5>
                            <div className="text-muted mb-2">{award.year}</div>
                            <p className="card-text">{award.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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

export default Vaidyaharshsehgal;