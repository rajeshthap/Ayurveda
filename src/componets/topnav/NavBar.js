import React, { useState } from "react"; // <-- IMPORT useState

// ---- IMPORT ALL IMAGES HERE ----
import LogoFinal from "../../assets/images/logo-final.jpg";
import Header from "./Header";
import "../../assets/css/responsive.css";
import "../../assets/css/stylecss.css";
import { Link } from "react-router-dom";
import "../../assets/css/NavBar.css";

function NavBar() {
  // ---- NEW: State to manage the mobile menu ----
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ---- NEW: Function to toggle the menu state ----
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <Header />
      <div className="ayur-menu-wrapper">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-2 col-md-4 col-sm-5 col-6">
              <div className="ayur-menu-logo">
                <img src={LogoFinal} alt="logo" />
              </div>
            </div>

            <div className="col-lg-10 col-md-8 col-sm-7 col-6">
              {/* 
                ---- NEW: Add a conditional class 'menu-open' to the wrapper ----
                This class will be used in our CSS to show the mobile menu.
              */}
              <div className={`ayur-navmenu-wrapper ${isMenuOpen ? 'menu-open' : ''}`}>

                <div className="ayur-nav-menu">
                  <ul>
                    <li className="active"><Link to="#">Home</Link></li>

                    <li className="ayur-has-menu">
                      <Link to="/">
                        About Us
                        <svg version="1.1" x="0" y="0" viewBox="0 0 491.996 491.996">
                          <g>
                            <path d="m484.132 124.986-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86-7.208 0-13.964 2.792-19.036 7.86l-183.84 183.848L62.056 108.554c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968 2.788-19.036 7.856l-16.12 16.128c-10.496 10.488-10.496 27.572 0 38.06l219.136 219.924c5.064 5.064 11.812 8.632 19.084 8.632h.084c7.212 0 13.96-3.572 19.024-8.632l218.932-219.328c5.072-5.064 7.856-12.016 7.864-19.224 0-7.212-2.792-14.068-7.864-19.128z"></path>
                          </g>
                        </svg>
                      </Link>

                      <ul className="ayur-submenu">
                        <li><Link to="/AboutUs">About Us</Link></li>
                        <li><Link to="#">The Journey</Link></li>
                        <li><Link to="#">Vaidya Harsh Sehgal, M.D. (Ayu.)</Link></li>
                        <li><Link to="#">Vaidya Jasmine Sehgal, M.D. (Ayu.)</Link></li>
                        <li><Link to="#">Prof.(Dr.) Bhavna Singh, M.D. (Ayu.), Ph.D.</Link></li>
                      </ul>
                    </li>

                    {/* -------- OUR FOCUS ---------- */}
                    <li className="ayur-has-menu">
                      <Link to="">
                        Our Focus
                        <svg version="1.1" x="0" y="0" viewBox="0 0 491.996 491.996">
                          <g>
                            <path d="m484.132 124.986-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86-7.208 0-13.964 2.792-19.036 7.86l-183.84 183.848L62.056 108.554c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968 2.788-19.036 7.856l-16.12 16.128c-10.496 10.488-10.496 27.572 0 38.06l219.136 219.924c5.064 5.064 11.812 8.632 19.084 8.632h.084c7.212 0 13.96-3.572 19.024-8.632l218.932-219.328c5.072-5.064 7.856-12.016 7.864-19.224 0-7.212-2.792-14.068-7.864-19.128z"></path>
                          </g>
                        </svg>
                      </Link>

                      <ul className="ayur-submenu">
                        <li><Link to="#">Auto-Immune Diseases</Link></li>
                        <li><Link to="#">Degenerative Disorders</Link></li>
                        <li><Link to="#">Metabolic Disorders</Link></li>
                        <li><Link to="#">Other CNCD's</Link></li>
                        <li><Link to="#">Wellness Solutions</Link></li>
                        <li><Link to="#">Own Manufacturing</Link></li>
                      </ul>
                    </li>

                    {/* -------- FEATURES ---------- */}
                    <li className="ayur-has-menu">
                      <Link to="">
                        Features
                        <svg version="1.1" x="0" y="0" viewBox="0 0 491.996 491.996">
                          <g>
                            <path d="m484.132 124.986-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86-7.208 0-13.964 2.792-19.036 7.86l-183.84 183.848L62.056 108.554c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968 2.788-19.036 7.856l-16.12 16.128c-10.496 10.488-10.496 27.572 0 38.06l219.136 219.924c5.064 5.064 11.812 8.632 19.084 8.632h.084c7.212 0 13.96-3.572 19.024-8.632l218.932-219.328c5.072-5.064 7.856-12.016 7.864-19.224 0-7.212-2.792-14.068-7.864-19.128z"></path>
                          </g>
                        </svg>
                      </Link>

                      <ul className="ayur-submenu">
                        <li><Link to="#">FAQs</Link></li>
                        <li><Link to="#">Presentations & Awards</Link></li>
                        <li><Link to="#">Media Gallery</Link></li>
                        <li><Link to="#">Patient's Guide</Link></li>
                        <li><Link to="#">Feedback</Link></li>
                        <li><Link to="#">External Links</Link></li>
                        <li><Link to="#">Disclaimer</Link></li>
                      </ul>
                    </li>

                    <li><Link to="#">Researches</Link></li>
                    <li><Link to="#">Blogs</Link></li>
                    <li><Link to="#">Contact Us</Link></li>
                  </ul>
                </div>

                {/* 
                  ---- NEW: Add onClick handler and conditional 'active' class ----
                  The 'active' class is for styling the hamburger into an 'X'.
                */}
                <div className={`ayur-toggle-btn ${isMenuOpen ? 'active' : ''}`} onClick={handleMenuToggle}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;