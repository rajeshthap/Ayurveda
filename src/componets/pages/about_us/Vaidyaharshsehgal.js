import React from "react";

// Import images at the top

import BgShape2 from "../../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../../assets/images/bg-leaf2.png";
import { FaAward } from "react-icons/fa";
import { Link } from "react-router-dom";
import team1 from '../../../assets/images/team-1.png'

import { Row } from "react-bootstrap";
const awards = [
  {
    icon: <FaAward className="text-warning" />,
    title: 'Uttarakhand Gaurav',
    year: '16th Nov. 2008'
  },
  {
    icon: <FaAward className="text-warning" />,
    title: 'Technocrat’s Excellency Award',
    year: '23rd Dec. 2006'
  },
  {
    icon: <FaAward className="text-warning" />,
    title: 'Uttarakhand Ratna',
    year: '1st Oct. 2006'
  }
];


function Vaidyaharshsehgal() {
  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className="about-bg">
        <div className="ayur-bread-content">
          <h2>Vaidya Harsh Sehgal, M.D. (Ayu.)</h2>
          <div class="ayur-bread-list">
            <span>
              <Link to="/">Home </Link>
            </span>
            <span class="ayur-active-page">/ Vaidya Harsh Sehgal, M.D. (Ayu.)</span>
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
                      <img src={team1} alt="team member 1" />
                    </div>
                    <div className="ayur-team-hoverimg">
                      <div className="ayur-team-hoversmall">
                        <img src={team1} alt="team member 1" />
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
                    <h3>Vaidya Harsh Sehgal, M.D. (Ayu.)</h3>
                    <p>Physician, Researcher</p>
                    <p>Founder and CEO</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-12 col-sm-12">
                <div className="ayur-heading-wrap ayur-about-head">


                  <h3>Trilok Ayurveda</h3>
                  <p>270, Nirmal Block – B, Tehri Punarvas Sthal, Pashulok, Rishikesh – 249201 (UK)
                    475, Lane-8, Street-8, Rajendra Nagar, Dehradun – 248001 (UK)</p>
                  <p> Ph.: +91-9837071030, +91-9758253472</p>
                  <p> Email: vdharsh@trilokayurveda.com, vdharsh@hotmail.com</p>




                  <div className="pt-4">

                    <h5>Educational Qualification
                    </h5>
                    <p>
                      M.D. (Ayu.) (Ayurved Vachaspati), DravyaGuna Vigyan, <b>75.80%</b>
                      Uttaranchal Ayurvedic Medical College, Dehradun,
                      Uttarakhand Ayurved University, Uttarakhand, India.
                      <span className="year-txt">Nov. 2018</span>
                    </p>
                    <p>B.A.M.S. (Bachelor of Ayurvedic Medicine and Surgery), <b>64.33%</b>
                      SSN Ayurvedic College and Research Institute, Bargarh,
                      Sambalpur University, Orissa, India. <span className="year-txt">April 2000</span></p>

                  </div>


                </div>


              </div>
              <Row className="ayur-heading-wrap ayur-about-head">

                <div>
                  <h5 className="pt-4" >Thesis Title :</h5>
                  <p>Clinical Efficacy of Kalamegha (Andrographis paniculata (Burm.f.) Wall. ex Nees) in Vatarakta (Gout)</p>
                  <h5 className="pt-2">Research Papers Published</h5>
                  <p>1. Sehgal, H., Singh, B., & Thapliyal, S. (2018). Role of Kalmegha (Andrographis paniculata (Burm.F.) Wall. Ex Nees) in treating Vatarakta (Gout). Journal of Drug Delivery and Therapeutics, 8(6), 98-101. https://doi.org/10.22270/jddt.v8i6.2024</p>
                  <p>2. Bhavna Singh and Harsh Sehgal.2018, A Scientific Study of Kalmegh I.E. Andrographis Paniculata (Burm.f.) Wall. Ex. Nees. Int J Recent Sci Res. 9(2), pp. 24409-24412. DOI:http://dx.doi.org/10.24327/ijrsr.2018.0902.1656</p>

                  <h5 className="pt-2">Professional Experience</h5>
                  <ul>
                    <li>Ayurvedic consultant, with clinical practice since April 2000.</li>
                    <li>Assistant Professor in the PG Department of DravyaGuna, Uttaranchal Ayurvedic Medical College, Rajpur Road, Dehradun, November 2018 onwards.</li>
                  </ul>
                  <p>Two decades of rich clinical experience and expertise in treating, Degenerative, Auto-immune, Metabolic and other Chronic Non-Communicable Disorders (CNCD’s) through herbs based internal medicines. The key to holistic treatment is the portfolio of self manufactured 125 (and growing) herbal formulations. The purpose is to provide individualized precision medicine and to maintain the quality.</p>
                  <p>He has been accredited with treating Alzheimer’s and Autism, successfully through applied Ayurvedic principles. Invited as a resource person for the presentation of evidence based clinical results on varied subjects related to CNCD’s; conducted various workshops on Ayurvedic Dietetics, Yoga and Wellness programs at diverse National and International forums.</p>
                  <p>Travelled far and wide for patients’ visits; the list of patients includes almost every major city across the globe. His work done so far has extensively been covered by various print and electronic media.</p>

                  <h5 className="pt-2">Felicitations/Awards</h5>
                  <p>Felicitated for the exemplary work in the field of Ayurveda:</p>
                  <p></p>
                  <div className="row g-4">
                    {awards.map((award, index) => (
                      <div key={index} className="col-12 col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm award-card">
                          <div className="card-body text-center p-4">
                            <div className="award-icon mb-3">
                              <i className={`${award.icon} fa-3x text-primary`}></i>
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
