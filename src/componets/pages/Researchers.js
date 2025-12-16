import React from 'react';
import '../../assets/css/research.css';
import { Link } from 'react-router-dom';

const Researchers = () => {
  // Research data for Vaidya Harsh Sehgal
  const harshSehgalResearch = [
    {
      title: "Clinical Evaluation of Trikatu & Kumari as Hypolipidemic Drug",
      authors: "Singh B, Upadhyay SD",
      year: "2018",
      journal: "International Journal of Ayurveda and Pharma Research",
      pages: "Vol. 6, Issue 5, pp. 12-18"
    },
    {
      title: "Efficacy of Ayurvedic formulations in management of chronic skin disorders",
      authors: "Sehgal H, Singh B",
      year: "2019",
      journal: "Journal of Ayurvedic and Herbal Medicine",
      pages: "Vol. 3, Issue 2, pp. 45-52"
    },
    {
      title: "Role of Panchakarma in lifestyle disorders: A clinical study",
      authors: "Sehgal H, Sharma A",
      year: "2020",
      journal: "AYU (An International Quarterly Journal of Research in Ayurveda)",
      pages: "Vol. 41, Issue 1, pp. 28-35"
    }
  ];

  // Research data for Prof.(Dr.) Bhavna Singh
  const bhavnaSinghResearch = [
    {
      title: "Clinical Evaluation of Trikatu & Kumari as Hypolipidemic Drug",
      authors: "Singh B, Upadhyay SD",
      year: "2018",
      journal: "International Journal of Ayurveda and Pharma Research",
      pages: "Vol. 6, Issue 5, pp. 12-18"
    },
    {
      title: "Ayurvedic management of osteoarthritis: A randomized controlled trial",
      authors: "Singh B, Kumar V, Sehgal H",
      year: "2019",
      journal: "Journal of Research in Ayurveda and Siddha",
      pages: "Vol. 40, Issue 3, pp. 112-120"
    },
    {
      title: "Standardization of Ayurvedic formulations: A review",
      authors: "Singh B, Patel R",
      year: "2020",
      journal: "World Journal of Pharmaceutical Research",
      pages: "Vol. 9, Issue 8, pp. 568-578"
    },
    {
      title: "Efficacy of Guggulu in hyperlipidemia: A clinical study",
      authors: "Singh B, Sehgal H, Sharma A",
      year: "2021",
      journal: "International Journal of Green Pharmacy",
      pages: "Vol. 15, Issue 1, pp. 78-85"
    }
  ];

  return (
    <div className="ayur-bgcover ayur-about-sec">
      {/* Breadcrumb Section */}
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2>Researchers</h2>
          <div class="ayur-bread-list">
            <span>
              <Link to="/">Home</Link>
            </span>
            <span class="ayur-active-page">/ Researchers</span>
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
          
          <div className="researcher-profile">
            <h3>Vaidya Harsh Sehgal</h3>
            <div className="research-list">
              {harshSehgalResearch.map((research, index) => (
                <div key={index} className="research-item">
                  <h4>{research.title}</h4>
                  <p><strong>Authors:</strong> {research.authors}</p>
                  <p><strong>Year:</strong> {research.year}</p>
                  <p><strong>Journal:</strong> {research.journal}</p>
                  <p><strong>Pages:</strong> {research.pages}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="researcher-profile">
            <h3>Prof.(Dr.) Bhavna Singh</h3>
            <div className="research-list">
              {bhavnaSinghResearch.map((research, index) => (
                <div key={index} className="research-item">
                  <h4>{research.title}</h4>
                  <p><strong>Authors:</strong> {research.authors}</p>
                  <p><strong>Year:</strong> {research.year}</p>
                  <p><strong>Journal:</strong> {research.journal}</p>
                  <p><strong>Pages:</strong> {research.pages}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Researchers;