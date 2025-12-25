import React, { useState, useEffect } from 'react';
import '../../assets/css/research.css';
import { Link } from 'react-router-dom';
import BgShape2 from '../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../assets/images/bg-leaf2.png';
import { IoEye } from "react-icons/io5";
import { FaDownload } from "react-icons/fa";

const Researchers = () => {
  const [researchData, setResearchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        const response = await fetch('https://mahadevaaya.com/trilokayurveda/trilokabackend/api/researches-items/');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setResearchData(data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchResearchData();
  }, []);

  // Function to get the full URL for PDFs
  const getPdfUrl = (pdfPath) => {
    // The API already returns the full path, so just prepend the base URL if needed
    if (pdfPath.startsWith('/media/')) {
      return `https://mahadevaaya.com/trilokayurveda/trilokabackend${pdfPath}`;
    }
    return pdfPath;
  };

  return (
    <>
      <div className="ayur-bgcover ayur-about-sec">
        {/* Breadcrumb Section */}
        <div className='about-bg'>
          <div className='ayur-bread-content'>
            <h2 style={{ fontWeight: 'bold', color: '#28a745' }}>Researchers</h2>
            <div className="ayur-bread-list">
              <span>
                <Link to="/">Home</Link>
              </span>
              <span className="ayur-active-page">/ Researchers</span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="ayur-bgcover ayur-about-sec">
            <div className="container fluid about-us">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="ayur-heading-wrap ayur-about-head">
                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading research data...</p>
                      </div>
                    ) : error ? (
                      <div className="alert alert-danger text-center">
                        Error: {error}
                      </div>
                    ) : (
                      <>
                        <div className="researchers-section">
                          <h2 style={{ fontWeight: 'bold', color: '#28a745' }}>Research Publications</h2>
                          
                          <div className="research-container">
                            {researchData.map((researcher) => (
                              <div key={researcher.id} className="researcher-profile mb-4 p-3 bg-light rounded">
                                <h3>{researcher.title}</h3>
                                <div className="row">
                                  {/* Left side - PDF Info and Buttons */}
                                  <div className="col-md-4">
                                    <div className="pdf-container">
                                      <div className="pdf-item mb-3">
                                        <h5>Research Document</h5>
                                        {researcher.pdf_files && (
                                          <>
                                            <div className="pdf-button-container">
                                              <a 
                                                href={getPdfUrl(researcher.pdf_files)} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="pdf-button view"
                                              >
                                              <i className='research-icon'><IoEye  /> </i>   
                                                View PDF
                                              </a>
                                              <a 
                                                href={getPdfUrl(researcher.pdf_files)} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="pdf-button download"
                                              >
                                                <i className='research-icon'>  <FaDownload /></i>
                                                Download PDF
                                              </a>
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Right side - Description */}
                                  <div className="col-md-8">
                                    <div className="description-container">
                                      <div className="description-item mb-4">
                                        <h5>Research Description</h5>
                                        <div className="description-content">
                                          {researcher.description && (
                                            <p dangerouslySetInnerHTML={{ __html: researcher.description }}></p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
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
    </>
  );
};

export default Researchers;