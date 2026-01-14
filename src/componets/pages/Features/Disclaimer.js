import React, { useState, useEffect } from 'react';
 
// Import images at the top
import AboutImg from '../../../assets/images/about-img.png';
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import Inneraboutimg from '../../../assets/images/about-img-inner.png'
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';
 
const Disclaimer = () => {
  const [disclaimerData, setDisclaimerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchDisclaimerData = async () => {
      try {
        const response = await fetch('https://mahadevaaya.com/trilokayurveda/trilokabackend/api/disclamier-items/');
        if (!response.ok) {
          throw new Error('Failed to fetch disclaimer data');
        }
        const data = await response.json();
        setDisclaimerData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
 
    fetchDisclaimerData();
  }, []);
 
  if (loading) {
    return <div>Loading...</div>;
  }
 
  if (error) {
    return <div>Error: {error}</div>;
  }
 
  // Extract the disclaimer content from the API response
  const disclaimerContent = disclaimerData?.data?.[0]?.module?.[0]?.description || '';
 
  // Split the content by numbered points and format them
  const formatDisclaimerContent = (content) => {
    if (!content) return [];
    
    // Split by numbered points (e.g., "1.", "2.", etc.)
    const points = content.split(/\d+\./).filter(point => point.trim());
    
    return points.map((point, index) => {
      // Remove any leading/trailing whitespace and newlines
      const cleanPoint = point.trim();
      return {
    
        content: cleanPoint
      };
    });
  };
 
  const formattedPoints = formatDisclaimerContent(disclaimerContent);
 
  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2>Disclaimer</h2>
          <div class="ayur-bread-list">
            <span>
                <Link to="/" >Home</Link>
            </span>
            <span class="ayur-active-page">/ Disclaimer</span>
          </div>
        </div>
      </div>
 
      <div className="row ">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us">
            <div className="row">
          
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="ayur-heading-wrap ayur-about-head">
                  <h3>Disclaimer</h3>
                  <h4>"Important Information About Our Services</h4>
                  <div>
                    {formattedPoints.map((point) => (
                      <div key={point.id} >
                        {/* <h5> {point.id}:</h5> */}
                        <p>{point.content}</p>
                      </div>
                    ))}
                  </div>
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
 
export default Disclaimer;