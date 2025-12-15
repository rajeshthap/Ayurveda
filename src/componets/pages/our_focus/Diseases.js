import React from "react";

// Import images at the top
import AboutImg from "../../../assets/images/about-img.png";
import BgShape2 from "../../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../../assets/images/bg-leaf2.png";
import Inneraboutimg from "../../../assets/images/Diseases.jpg";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { FaHeartbeat } from "react-icons/fa";
import "../../../assets/css/autoimmune.css";

function Diseases() {
  const navigate = useNavigate();

  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className="about-bg">
        <div className="ayur-bread-content">
          <h2>Ankylosing Spondylosis</h2>
          <div class="ayur-bread-list">
            <span>
              <a href="index.html">Home </a>
            </span>
            <span class="ayur-active-page">/Ankylosing Spondylosis</span>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-lg-6 col-md-12 col-sm-12">
          <div className="ayur-about-img">
            <img
              src={Inneraboutimg}
              alt="img"
              data-tilt=""
              data-tilt-max="10"
              data-tilt-speed="1000"
              data-tilt-perspective="1000"
              style={{
                willChange: "transform",
                transform:
                  "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
              }}
            />
          </div>
        </div>
        <div className="col-lg-6 col-md-12 col-sm-12">
          <div className="ayur-heading-wrap ayur-about-head">
            <h3>Ankylosing Spondylosis (AS)</h3>
           
            <div>
             <h5 className="pt-3">SYNONYMS:</h5>

<ul className="ayur-synonyms-list">
  <li>Ankylosing Spondylitis (AS)</li>
  <li>Rheumatic Spondylitis (RS)</li>
  <li>Ankylosing Polyarthritis (APA)</li>
  <li>Juvenile–Adolescent Spondylitis (JAS)</li>
</ul>

              <h5 className="pt-3">SYMPTOMS:</h5>
              <ul className="ayur-synonyms-list">
            <li>   Pain and stiffness in spine and hips
Early morning stiffness
Loss of appetite, weight loss, fatigue
Cardiomyopathy
Crohns disease or ulcerative colitis.</li>
              </ul>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
}

export default Diseases;
