import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bgShape5 from '../../assets/images/bg-shape5.png';
import bgLeaf5 from '../../assets/images/bg-leaf5.png';

const API_BASE = 'https://mahadevaaya.com/trilokayurveda/trilokabackend';

function OurTeam() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/profile-items/`)
      .then((res) => res.json())
      .then((data) => {
        setTeamMembers(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('API Error:', err);
        setLoading(false);
      });
  }, []);

  // Function to get the specific path for each team member
  const getMemberPath = (id) => {
    switch (id) {
      case 11: return '/Vaidyaharshsehgal';
      case 12: return '/Vaidyajasminesehgal';
      case 13: return '/Profbhavnasingh';
      default: return '/team';
    }
  };

  // Function to handle card click and scroll to top
  const handleCardClick = () => {
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="ayur-bgcover ayur-team-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading team information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sort team members by ID in ascending order
  const sortedTeamMembers = [...teamMembers].sort((a, b) => a.id - b.id);

  return (
    <div className="ayur-bgcover ayur-team-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="ayur-heading-wrap">
              <h3>Trusted &amp; Certificated Team</h3>
              <h5>Meet Our Expert Professionals</h5>
            </div>
          </div>
        </div>
        <div className="row">
          {sortedTeamMembers.map((member) => (
            <div key={member.id} className="col-lg-4 col-md-6 col-sm-6 mb-4">
              <Link
                to={getMemberPath(member.id)}
                className="team-card-link"
                onClick={handleCardClick}
              >
                <div className="ayur-team-box h-100 d-flex flex-column">
                  <div className="ayur-team-img-wrapper">
                    <div className="ayur-team-img">
                      <img
                        src={`${API_BASE}${member.image}`}
                        alt={member.full_name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://picsum.photos/seed/team/300/300.jpg';
                        }}
                      />
                    </div>
                    <div className="ayur-team-hoverimg">
                      <div className="ayur-team-hoversmall">
                        <img
                          src={`${API_BASE}${member.image}`}
                          alt={member.full_name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://picsum.photos/seed/team/300/300.jpg';
                          }}
                        />
                      </div>
                      <p>{member.designation}</p>
                      <div className="ayur-team-sociallink">
                        <a href="#" onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625H5.09v-2.316h3.658V9.25c0-3.607 2.163-5.603 5.438-5.603 1.576 0 2.933.118 3.33.171v3.79h-2.286c-1.79 0-2.136.85-2.136 2.097v2.416h4.273l-.558 2.316h-3.715v5.625C13.074 15.397 16 12.066 16 8.049z" />
                          </svg>
                        </a>
                        <a href="#" onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
                            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                          </svg>
                        </a>
                        <a href="#" onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                          </svg>
                        </a>
                        <a href="#" onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.232s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.167-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.167-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="ayur-team-name flex-grow-1 d-flex flex-column justify-content-center text-center p-3">
                    <h3 className="mb-2">{member.full_name}</h3>
                    <p className="mb-1">{member.title}</p>
                    <p className="mb-0">{member.designation}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Background Shapes */}
      {/* <div className="ayur-bgshape ayur-team-bgshape">
        <img src={bgShape5} alt="bg shape" />
        <img src={bgLeaf5} alt="bg leaf" />
      </div> */}
    </div>
  );
}

export default OurTeam;