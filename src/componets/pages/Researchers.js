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
    // The API already returns the full path, so just prepend the base URL if needed
    if (pdfPath.startsWith('/media/')) {
      return `https://mahadevaaya.com/trilokayurveda/trilokabackend${pdfPath}`;
    }
    return pdfPath;
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
                    {/* Left side - PDF */}
                    <div className="col-md-3">
                      <div className="pdf-container">
                        <div className="pdf-item mb-3">
                          <h5>Research Document</h5>
                          {researcher.pdf_files && (
                            <div className="pdf-viewer">
                              {/* Using object tag for better PDF display */}
                              <object
                                data={getPdfUrl(researcher.pdf_files)}
                                type="application/pdf"
                                width="100%"
                                height="200px"
                                title={`PDF for ${researcher.title}`}
                              >
                                <p>PDF cannot be displayed. 
                                  <a href={getPdfUrl(researcher.pdf_files)} target="_blank" rel="noopener noreferrer">Click here to download</a>
                                </p>
                              </object>
                              <div className="pdf-download">
                                <a href={getPdfUrl(researcher.pdf_files)} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                                  View PDF
                                </a>
                                <a href={getPdfUrl(researcher.pdf_files)} download className="btn btn-sm btn-secondary ml-2">
                                  Download PDF
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right side - Description */}
                    <div className="col-md-9">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Researchers;