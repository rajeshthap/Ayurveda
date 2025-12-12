import React from "react";
import { Link } from "react-router-dom";

import {  FaInstagram } from "react-icons/fa";
function Header() {
  return (
    <div className="top-nav d-flex align-items-center">
      <div className="container d-flex justify-content-center justify-content-md-between">

        <div className="contact-info bi bi-envelope d-flex align-items-center">
          info@trilokayurveda.com
        </div>

        <div className="bi bi-phone
 d-flex align-items-center">
          +91-9837071030, +91-9758253472
        </div>

        <div className=" d-flex align-items-center">
          <button type="button" className="btn btn-success">Consult Now</button>
        </div>

        <div className="social-links d-none d-md-flex align-items-center">
          <ul className="ayur-social-link">

            <li>
              <Link to="">
                <svg width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6.74157 20V10.8777H9.80231L10.2615 7.32156H6.74157V5.05147C6.74157 4.0222 7.02622 3.32076 8.50386 3.32076L10.3854 3.31999V0.13923C10.06 0.0969453 8.94308 0 7.64308 0C4.92848 0 3.07002 1.65697 3.07002 4.69927V7.32156H0V10.8777H3.07002V20H6.74157Z"
                    fill="#E4D4CF"
                  />
                </svg>
              </Link>
            </li>

            <li>
              <Link to="">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M11.8138 8.46864L19.0991 0H17.3727L11.0469 7.3532L5.9944 0H0.166992L7.8073 11.1193L0.166992 20H1.89349L8.57377 12.2348L13.9095 20H19.7369L11.8133 8.46864H11.8138ZM9.4491 11.2173L8.67498 10.1101L2.51557 1.29967H5.16736L10.1381 8.40994L10.9122 9.51718L17.3735 18.7594H14.7218L9.4491 11.2177V11.2173Z"
                    fill="#E4D4CF"
                  />
                </svg>
              </Link>
            </li>

            <li>
              <Link to="">
                <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.89667 0C3.41417 0.000833333 0.5 3.51333 0.5 7.34333C0.5 9.11917 1.4925 11.335 3.08167 12.0375C3.535 12.2417 3.475 11.9925 3.865 10.5008C3.88295 10.4406 3.88454 10.3766 3.8696 10.3156C3.85466 10.2545 3.82374 10.1985 3.78 10.1533C1.50833 7.52583 3.33667 2.12417 8.5725 2.12417C16.15 2.12417 14.7342 12.6092 9.89083 12.6092C8.6425 12.6092 7.7125 11.6292 8.00667 10.4167C8.36333 8.9725 9.06167 7.42 9.06167 6.37917C9.06167 3.75583 5.15333 4.145 5.15333 7.62083C5.15333 8.695 5.53333 9.42 5.53333 9.42C5.53333 9.42 4.27583 14.5 4.0425 15.4492C3.6475 17.0558 4.09583 19.6567 4.135 19.8808C4.15917 20.0042 4.2975 20.0433 4.375 19.9417C4.49917 19.7792 6.01917 17.6108 6.445 16.0433C6.6 15.4725 7.23583 13.1558 7.23583 13.1558C7.655 13.9125 8.86333 14.5458 10.1508 14.5458C13.9808 14.5458 16.7492 11.1792 16.7492 7.00167C16.7358 2.99667 13.3083 0 8.89667 0Z"
                    fill="#E4D4CF"
                  />
                </svg>
              </Link>
            </li>

          
         
          
            <li>
              <Link to="" className="text-light"><FaInstagram size={15} /></Link>
            </li>

          </ul>
        </div>

      </div>
    </div>
  );
}

export default Header;
