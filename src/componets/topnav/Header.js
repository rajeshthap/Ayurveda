import React from "react";
import { Link } from "react-router-dom";
import "../../assets/css/stylecss.css";
import "../../assets/css/Header.css";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import {  FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { Button } from "react-bootstrap";


function Header() {
  return (
    <div className="top-nav d-flex align-items-center">
      <div className="container d-flex justify-content-center justify-content-md-between">

      <div className="contact-info  d-flex align-items-center">
   <HiOutlineMail className="mail-icon me-1" /> info@trilokayurveda.com
</div>


        <div className="
 d-flex align-items-center">
       < MdOutlinePhoneAndroid /> +91-9837071030, +91-9758253472
        </div>

       

        <div className="social-links d-none d-md-flex align-items-center">
          <ul className="ayur-social-link">

            <li>
              <Link to="">
               <FaFacebookF className="social-icon facebook-icon" />

              </Link>
            </li>

            <li>
              <Link to="">
                 <Link to="">
               <FaTwitter className="social-icon facebook-icon" />

              </Link>
              </Link>
            </li>

            <li>
              <Link to="">
                <Link to="">
               <FaWhatsapp className="social-icon facebook-icon" />

              </Link>
              </Link>
            </li>
            <li>
              <Link to="" className="text-light"><FaInstagram size={15} /></Link>
            </li>
        
          </ul>
           
        </div>
 <Link to="/Login">
  <Button className="login-btn">Login</Button>
</Link>
      </div>
    </div>
  );
}

export default Header;
