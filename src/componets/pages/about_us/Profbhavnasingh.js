import React from "react";

// Import images at the top

import BgShape2 from "../../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../../assets/images/bg-leaf2.png";
import { FaAward } from "react-icons/fa";
import { Link } from "react-router-dom";

import team3 from '../../../assets/images/team-3.png'

import { Row } from "react-bootstrap";



function Profbhavnasingh() {
  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className="about-bg">
        <div className="ayur-bread-content">
          <h2>Prof.(Dr.) Bhavna Singh, M.D. (Ayu.), Ph.D.</h2>
          <div class="ayur-bread-list">
            <span>
              <Link to="/">Home </Link>
            </span>
            <span class="ayur-active-page">/ Prof.(Dr.) Bhavna Singh, M.D. (Ayu.), Ph.D.</span>
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
                      <img src={team3} alt="team member 3" />
                    </div>
                    <div className="ayur-team-hoverimg">
                      <div className="ayur-team-hoversmall">
                        <img src={team3} alt="team member 3" />
                      </div>
                      <p>Research Associate</p>
                      <div className="ayur-team-sociallink">
                        <Link to="">{/* Facebook SVG */}</Link>
                        <Link to="">{/* Twitter SVG */}</Link>
                        <Link to="">{/* Github SVG */}</Link>
                        <Link to="">{/* Instagram SVG */}</Link>
                      </div>
                    </div>
                  </div>
                  <div className="ayur-team-name">
                    <h3>Prof.(Dr.) Bhavna Singh, M.D. (Ayu.), Ph.D.</h3>
                    <p>Academician, Researcher and Author</p>
                    <p>Research Associate</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-12 col-sm-12">
                <div className="ayur-heading-wrap ayur-about-head">


                  <h3>Trilok Ayurveda</h3>
                  <p>270, Nirmal Block – B, Tehri Punarvas Sthal, Pashulok, Rishikesh – 249201 (UK)
                    475, Lane-8, Street-8, Rajendra Nagar, Dehradun – 248001 (UK)</p>
                  <p> Ph.: +91-9837071030, +91-9758253472</p>
                  <p>Email: singhbsbharti@gmail.com, info@trilokayurveda.com</p>




                  <div className="pt-4">

                    <h5>Educational Qualification
                    </h5>
                    <p>
                      Ph.D., Oriental Studies (Ayurveda),
                      Dev Sanskriti VishwaVidyalaya,
                      Haridwar, Uttarakhand, India
                      <span className="year-txt">April 2015</span>
                    </p>
                    <p>M.D. (Ayu.) (Ayurved Vachaspati), DravyaGuna Vigyan
                      National Institute of Ayurveda, Jaipur,
                      Rajasthan University, Rajasthan, India. <span className="year-txt">Oct. 2001</span></p>
                    <p>B.A.M.S. (Bachelor of Ayurvedic Medicine and Surgery), 67.15%
                      Rishikul State PG Ayurvedic College, Haridwar
                      Kanpur University, UttarPradesh, India. <span className="year-txt">Oct. 1993</span></p>
                  </div>


                </div>


              </div>
              <Row className="ayur-heading-wrap ayur-about-head">

                <div>
                  <h5 className="pt-4" >Thesis Title :</h5>
                  <p>In Ph.D. – A Clinical Evaluation of Trikatu alone and with Kumari Pulp as a Hypolipidemic Drug</p>
                  <p>In M.D. (Ayu.) – Shilajatu, Kutaki evam Khadir ka Sthaulya ke pariprekshya mein Guna-Karmatmak adhyayan</p>
                  <h5 className="pt-2">Research Papers Published</h5>
                  <ul>
                    <li>1. Singh B, Upadhyay SD. Clinical Evaluation of Trikatu & Kumari as Hypolipidemic Drug. Int J Ayurveda & Med Sc 2017; 2(1): 1-7.</li>
                    <li>Singh B, Kaur H. In silico documentation of medicinal plants in Lacchiwala range, Dehradun forest division, Uttarakhand (India). J Phytopharmacol 2018; 7(1):92-102.</li>
                    <li>Chaudhari A, Singh B. A Critical Review of Karvira (Nerium indicum Mill). Int J Ayurveda & Med Sc 2016; 1(2): 51-55.</li>
                    <li>Clinical evaluation of Shilajatu (Asphaltum punjabinum), Kutaki (p. kurroa), and Khadir (A. catechu) in the management of Sthaulya. Int.j.res.Ayurveda pharma;jul-aug;2013; www.ijrap.net</li>
                  </ul>
                  <h5 className="pt-2">Professional Experience</h5>
                  <ul>
                    <li> An Academician, Researcher and Author.</li>
                    <li>Professor and HOD in the PG Department of DravyaGuna, Uttaranchal Ayurvedic Medical College, Rajpur Road, Dehradun, September 2017 onwards.</li>
                    <li>Academician par excellence, she worked at various Institutes and held important portfolios:</li>
                    <li>As a Resident Medical Officer at Moolchand Hospital, New Delhi.</li>
                    <li> As an Ayurvedic Expert in Traditional Knowledge Digital Library (TKDL) project, pioneered by National Institute of Science Communication and Information Resources (NISCAIR) and Council of Scientific and Industrial Research (CSIR), New Delhi.</li>
                    <li>As a Research Associate in Review Monograph on Indian Medicinal Plants project initiated by Indian Council of Medical Research (ICMR), New Delhi.</li>
                    <li>Guided ten Post-Graduate research work and ongoing three studies are under her supervision.</li>
                  </ul>

                  <h5 className="pt-2">Publications</h5>
                  <p>Authored books in the field of Ayurveda:</p>
                  <ul>
                    <li>Fundamental DravyaGuna – Basic Concepts of DravyaGuna and General Pharmacology</li>
                    <li>Cancer and Medicinal Plants</li>
                  </ul>

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

export default Profbhavnasingh;
