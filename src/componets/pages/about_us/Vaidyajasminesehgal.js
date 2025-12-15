import React from "react";

// Import images at the top

import BgShape2 from "../../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../../assets/images/bg-leaf2.png";
import { FaAward } from "react-icons/fa";
import { Link } from "react-router-dom";
import team2 from '../../../assets/images/team-2.png'

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


function Vaidyajasminesehgal() {
  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className="about-bg">
        <div className="ayur-bread-content">
          <h2>Vaidya Jasmine Sehgal, M.D. (Ayu.)</h2>
          <div class="ayur-bread-list">
            <span>
              <Link to="/">Home </Link>
            </span>
            <span class="ayur-active-page">/ Vaidya Jasmine Sehgal, M.D. (Ayu.)</span>
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
                      <img src={team2} alt="team member 2" />
                    </div>
                    <div className="ayur-team-hoverimg">
                      <div className="ayur-team-hoversmall">
                        <img src={team2} alt="team member 2" />
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
                    <h3>Vaidya Jasmine Sehgal, M.D. (Ayu.)</h3>
                    <p>Ayurvedic Dietetics and Wellness Expert</p>
                    <p>Director</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-12 col-sm-12">
                <div className="ayur-heading-wrap ayur-about-head">


                  <h3>Trilok Ayurveda</h3>
                  <p>270, Nirmal Block – B, Tehri Punarvas Sthal, Pashulok, Rishikesh – 249201 (UK)
                    475, Lane-8, Street-8, Rajendra Nagar, Dehradun – 248001 (UK)</p>
                  <p> Ph.: +91-9758253472, +91-9837071030</p>
                  <p> Email: jasmine@trilokayurveda.com, jasminesehgal20@gmail.com</p>




                  <div className="pt-4">

                    <h5>Educational Qualification
                    </h5>
                    <p>
                      M.D. (Ayu.) (Sch.), Samhita and Sidhanta,
                      Uttaranchal Ayurvedic Medical College, Dehradun,
                      Uttarakhand Ayurved University, Uttarakhand, India.
                      {/* <span className="year-txt">Nov. 2018</span> */}
                    </p>
                    <p>B.A.M.S. (Bachelor of Ayurvedic Medicine and Surgery), 67.70%
                      Dayanand Ayurvedic College, Jalandhar,
                      Guru Nanak Dev University, Punjab, India. <span className="year-txt">March 2000</span></p>

                  </div>


                </div>


              </div>
              <Row className="ayur-heading-wrap ayur-about-head">

                <div>
                  <h5 className="pt-4" >Thesis Title :</h5>
                  <p>A Critical Study of Ayurvedic Dietetics, in Vrihatrayi with respect to Ritu (Season)</p>

                  <h5 className="pt-2">Professional Experience</h5>
                  <ul>
                    <li>An Ayurvedic consultant, with expertise in Ayurvedic Dietetic and Wellness since March 2000.</li>
                  </ul>
                  <p>Life-Style corrections are a prerequisite to treat Life-Style Disorders. An expert in Ayurvedic Dietetics and Lifestyle management, she has been instrumental in conceptualizing and initiating “Trilok Ayurveda Wellness Center” nestled in the quaint environs of Himalayas settled at the banks of divine Ganga.</p>
                  <p>Today’s lifestyle pattern of hurry and worry and instant food has become a cause of many lifestyle related disorders, which do not have any answers in contemporary medical science.</p>
                  <p>From “Illness to Wellness”, “Nirvana” is the core program of Trilok Ayurveda, dedicated to improving total health in terms of mind, body and soul detoxification and rejuvenation. It encompasses Yoga, Pranayam, Meditation, Panchkarma, Healthy diet and life-style related guidelines, Nadi pariksha (pulse assessment) and Ayurvedic Consultations.</p>
                  <p>Each and every aspect of this program is tailor-made in accordance with individual constitution of ‘Tridoshas’. It is this uniqueness that has attracted people from all over the world to meet their health needs.</p>

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
