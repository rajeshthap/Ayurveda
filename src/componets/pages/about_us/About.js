import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import images at the top
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';

function MediaGallery() {
  // State for storing the media gallery data
  const [mediaData, setMediaData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        const response = await fetch(
          'https://mahadevaaya.com/trilokayurveda/trilokabackend/api/media-gallery-content-item/'
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch media gallery data');
        }
        
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          setMediaData(result.data[0]); // Get the first item from the array
        } else {
          throw new Error('No media gallery data found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMediaData();
  }, []);

  // Function to extract number and text from sub_title
  const parseExperience = (subTitle) => {
    if (!subTitle) return { number: '', text: '' };
    
    // Try to extract a number at the beginning of the string
    const match = subTitle.match(/^(\d+)\s*(.*)$/);
    if (match) {
      return {
        number: match[1],
        text: match[2]
      };
    }
    
    // If no number at the beginning, return the whole string as text
    return {
      number: '',
      text: subTitle
    };
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="ayur-bgcover ayur-about-sec">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="ayur-bgcover ayur-about-sec">
        <div className="container">
          <div className="alert alert-danger" role="alert">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  // Extract experience number and text
  const experience = mediaData ? parseExperience(mediaData.sub_title) : { number: '', text: '' };

  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="ayur-about-img">
              {mediaData && mediaData.image ? (
                <img
                  src={`https://mahadevaaya.com/trilokayurveda/trilokabackend${mediaData.image}`}
                  alt="Media Gallery"
                  data-tilt=""
                  data-tilt-max="10"
                  data-tilt-speed="1000"
                  data-tilt-perspective="1000"
                  className='ayur-inneraboutimg'
                />
              ) : (
                <img
                  src={require('../../../assets/images/about-img.png')}
                  alt="img"
                  data-tilt=""
                  data-tilt-max="10"
                  data-tilt-speed="1000"
                  data-tilt-perspective="1000"
                  className='ayur-inneraboutimg'
                />
              )}
              {experience.number && (
                <div className="ayur-about-exp">
                  <p>{experience.number}</p>
                  <p>{experience.text}</p>
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="ayur-heading-wrap ayur-about-head">
              <h3>{mediaData ? mediaData.title : 'Media Gallery'}</h3>
              <p>
                {mediaData ? mediaData.description : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'}
              </p>
              <Link to="MediaGallery" className="ayur-btn">
                Know More
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="ayur-bgshape ayur-about-bgshape">
        <img src={BgShape2} alt="img" />
        <img src={BgLeaf2} alt="img" />
      </div>
    </div>
  );
}

export default MediaGallery;