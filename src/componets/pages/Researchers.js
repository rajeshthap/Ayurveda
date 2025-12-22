import React, { useState, useEffect } from 'react';
import '../../assets/css/research.css';
import { Link } from 'react-router-dom';

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
    // Remove 'research_pdfs/' prefix if it exists to avoid duplication
    const cleanPath = pdfPath.startsWith('research_pdfs/') ? pdfPath : `research_pdfs/${pdfPath}`;
    return `https://mahadevaaya.com/trilokayurveda/trilokabackend/media/${cleanPath}`;
  };

  return (
    <div className="ayur-bgcover ayur-about-sec">
      {/* Breadcrumb Section */}
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2>Researchers</h2>
          <div className="ayur-bread-list">
            <span>
              <Link to="/">Home</Link>
            </span>
            <span className="ayur-active-page">/ Researchers</span>
          </div>
        </div>
      </div>

      <div className="researchers-container">
        <div className="researchers-header">
          <h1>Trilok Ayurveda</h1>
          <h2>Wellness Center and Speciality Clinic for Chronic Disorders</h2>
        </div>

        <div className="researchers-section">
          <h2>Research Publications</h2>
          
          {loading ? (
            <div className="loading-message">Loading research data...</div>
          ) : error ? (
            <div className="error-message">Error: {error}</div>
          ) : (
            <div className="research-container">
              {researchData.map((researcher) => (
                <div key={researcher.id} className="researcher-profile">
                  <h3>{researcher.title}</h3>
                  <div className="row">
                    {/* Left side - PDFs */}
                    <div className="col-md-3">
                      <div className="pdf-container">
                        {researcher.module.map((item, itemIndex) => {
                          const pdfUrl = getPdfUrl(item[0]);
                          return (
                            <div key={itemIndex} className="pdf-item mb-3">
                              <h5>Research {itemIndex + 1}</h5>
                              {item[0] && (
                                <div className="pdf-viewer">
                                  {/* Using object tag for better PDF display */}
                                  <object
                                    data={pdfUrl}
                                    type="application/pdf"
                                    width="100%"
                                    height="200px"
                                    title={`PDF ${itemIndex + 1}`}
                                  >
                                    <p>PDF cannot be displayed. 
                                      <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Click here to download</a>
                                    </p>
                                  </object>
                                  <div className="pdf-download">
                                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                                      View PDF
                                    </a>
                                    <a href={pdfUrl} download className="btn btn-sm btn-secondary ml-2">
                                      Download PDF
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Right side - Descriptions */}
                    <div className="col-md-9">
                      <div className="description-container">
                        {researcher.module.map((item, itemIndex) => (
                          <div key={itemIndex} className="description-item mb-4">
                            <h5>Research {itemIndex + 1}</h5>
                            <div className="description-content">
                              {item[1] && (
                                <p dangerouslySetInnerHTML={{ __html: item[1] }}></p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Researchers;