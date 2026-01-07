import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ---- IMPORT ALL IMAGES HERE ----
import LogoFinal from "../../assets/images/logo-final.jpg";
import Header from "./Header";
import "../../assets/css/responsive.css";
import "../../assets/css/stylecss.css";
import { Link } from "react-router-dom";
import "../../assets/css/NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  // State to manage which submenus are open
  const [submenuStates, setSubmenuStates] = useState({
    about: false,
    focus: false,
    features: false,
    resources: false,
  });

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  // Function to handle main menu item CLICK
  const handleMenuClick = (key, e) => {
    e.preventDefault();
    
    // Close all other submenus and toggle the current one
    setSubmenuStates((prev) => ({
      ...Object.fromEntries(Object.keys(prev).map(k => [k, k === key ? !prev[k] : false])),
    }));
  };

  // Function to handle submenu item CLICK
  const handleSubmenuClick = (path, e) => {
    e.preventDefault();
    navigate(path);
    
    // When an item is clicked, close all submenus
    setSubmenuStates({
      about: false,
      focus: false,
      features: false,
      resources: false,
    });
    
    // Close mobile menu if on mobile/tablet
    if (isMobileOrTablet) {
      setIsMenuOpen(false);
    }
  };

  // Function to reset everything (used for Home, Blogs, etc.)
  const resetMenu = () => {
    setSubmenuStates({
      about: false,
      focus: false,
      features: false,
      resources: false,
    });
    
    // Close mobile menu if on mobile/tablet
    if (isMobileOrTablet) {
      setIsMenuOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.ayur-has-menu') && !event.target.closest('.ayur-submenu')) {
        setSubmenuStates({
          about: false,
          focus: false,
          features: false,
          resources: false,
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobileOrTablet(window.innerWidth <= 991);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("ayur-mobile-menu");
    } else {
      document.body.classList.remove("ayur-mobile-menu");
    }
  }, [isMenuOpen]);

  return (
    <>
      <Header />
      <div className="ayur-menu-wrapper">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-2 col-md-4 col-sm-5 col-6">
              <div className="ayur-menu-logo">
                <Link to="/" onClick={resetMenu}>
                  <img src={LogoFinal} alt="logo" />
                </Link>
              </div>
            </div>

            <div className="col-lg-10 col-md-8 col-sm-7 col-6">
              <div className={`ayur-navmenu-wrapper ${isMenuOpen ? "menu-open" : ""}`}>
                <div className="ayur-nav-menu">
                  <ul>
                    <li className="active">
                      <Link to="/" onClick={resetMenu}>Home</Link>
                    </li>

                    <li className="ayur-has-menu">
                      <button onClick={(e) => handleMenuClick("about", e)}>
                        About Us
                        <svg version="1.1" x="0" y="0" viewBox="0 0 491.996 491.996">
                          <g>
                            <path d="m484.132 124.986-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86-7.208 0-13.964 2.792-19.036 7.86l-183.84 183.848L62.056 108.554c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968 2.788-19.036 7.856l-16.12 16.128c-10.496 10.488-10.496 27.572 0 38.06l219.136 219.924c5.064 5.064 11.812 8.632 19.084 8.632h.084c7.212 0 13.96-3.572 19.024-8.632l218.932-219.328c5.072-5.064 7.856-12.016 7.864-19.224 0-7.212-2.792-14.068-7.864-19.128z"></path>
                          </g>
                        </svg>
                      </button>
                      <ul className={`ayur-submenu ${submenuStates.about ? "ayur-submenu-open" : ""}`}>
                        <li><Link to="/AboutUs" onClick={(e) => handleSubmenuClick("/AboutUs", e)}>About Us</Link></li>
                        <li><Link to="/Profile" onClick={(e) => handleSubmenuClick("/Profile", e)}>Profile</Link></li>
                        <li><Link to="/Thejourney" onClick={(e) => handleSubmenuClick("/Thejourney", e)}>The Journey</Link></li>
                        <li><Link to="/Researchers" onClick={(e) => handleSubmenuClick("/Researchers", e)}>Researches</Link></li>
                        <li><Link to="/CommingSoon" onClick={(e) => handleSubmenuClick("/CommingSoon", e)}>Articles</Link></li>
                      </ul>
                    </li>

                    {/* -------- OUR FOCUS ---------- */}
                    <li className="ayur-has-menu">
                      <button onClick={(e) => handleMenuClick("focus", e)}>
                        Our Focus
                        <svg version="1.1" x="0" y="0" viewBox="0 0 491.996 491.996">
                          <g>
                            <path d="m484.132 124.986-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86-7.208 0-13.964 2.792-19.036 7.86l-183.84 183.848L62.056 108.554c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968 2.788-19.036 7.856l-16.12 16.128c-10.496 10.488-10.496 27.572 0 38.06l219.136 219.924c5.064 5.064 11.812 8.632 19.084 8.632h.084c7.212 0 13.96-3.572 19.024-8.632l218.932-219.328c5.072-5.064 7.856-12.016 7.864-19.224 0-7.212-2.792-14.068-7.864-19.128z"></path>
                          </g>
                        </svg>
                      </button>
                      <ul className={`ayur-submenu ${submenuStates.focus ? "ayur-submenu-open" : ""}`}>
                        <li><Link to="/AutoImmune" onClick={(e) => handleSubmenuClick("/AutoImmune", e)}>Auto-Immune Diseases</Link></li>
                        <li><Link to="/Degenerative" onClick={(e) => handleSubmenuClick("/Degenerative", e)}>Degenerative Disorders</Link></li>
                        <li><Link to="/MetabolicDisorders" onClick={(e) => handleSubmenuClick("/MetabolicDisorders", e)}>Metabolic Disorders</Link></li>
                        <li><Link to="/InternalOthercnds" onClick={(e) => handleSubmenuClick("/InternalOthercnds", e)}>Other CNCD's</Link></li>
                        <li><Link to="/Internalwellnesssol" onClick={(e) => handleSubmenuClick("/Internalwellnesssol", e)}>Wellness Solutions</Link></li>
                        <li><Link to="/OwnManufacturing" onClick={(e) => handleSubmenuClick("/OwnManufacturing", e)}>Own Manufacturing</Link></li>
                      </ul>
                    </li>

                    {/* -------- FEATURES ---------- */}
                    <li className="ayur-has-menu">
                      <button onClick={(e) => handleMenuClick("features", e)}>
                        Features
                        <svg version="1.1" x="0" y="0" viewBox="0 0 491.996 491.996">
                          <g>
                            <path d="m484.132 124.986-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86-7.208 0-13.964 2.792-19.036 7.86l-183.84 183.848L62.056 108.554c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968 2.788-19.036 7.856l-16.12 16.128c-10.496 10.488-10.496 27.572 0 38.06l219.136 219.924c5.064 5.064 11.812 8.632 19.084 8.632h.084c7.212 0 13.96-3.572 19.024-8.632l218.932-219.328c5.072-5.064 7.856-12.016 7.864-19.224 0-7.212-2.792-14.068-7.864-19.128z"></path>
                          </g>
                        </svg>
                      </button>
                      <ul className={`ayur-submenu ${submenuStates.features ? "ayur-submenu-open" : ""}`}>
                        <li><Link to="/Faqs" onClick={(e) => handleSubmenuClick("/Faqs", e)}>FAQs</Link></li>
                        <li><Link to="/PresentationAwards" onClick={(e) => handleSubmenuClick("/PresentationAwards", e)}>Presentations & Awards</Link></li>
                        <li><Link to="/MediaGallery" onClick={(e) => handleSubmenuClick("/MediaGallery", e)}>Media Gallery</Link></li>
                        <li><Link to="/CommingSoon" onClick={(e) => handleSubmenuClick("/CommingSoon", e)}>Patient's Guide</Link></li>
                        <li><Link to="/CommingSoon" onClick={(e) => handleSubmenuClick("/CommingSoon", e)}>Consent Form</Link></li>
                        <li><Link to="/PatientFeedback" onClick={(e) => handleSubmenuClick("/PatientFeedback", e)}>Feedback</Link></li>
                        <li><Link to="/CommingSoon" onClick={(e) => handleSubmenuClick("/CommingSoon", e)}>External Links</Link></li>
                        <li><Link to="/Disclaimer" onClick={(e) => handleSubmenuClick("/Disclaimer", e)}>Disclaimer</Link></li>
                      </ul>
                    </li>

                    {/* -------- RESOURCES ---------- */}
                    <li className="ayur-has-menu">
                      <button onClick={(e) => handleMenuClick("resources", e)}>
                        Resources
                        <svg version="1.1" x="0" y="0" viewBox="0 0 491.996 491.996">
                          <g>
                            <path d="m484.132 124.986-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86-7.208 0-13.964 2.792-19.036 7.86l-183.84 183.848L62.056 108.554c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968 2.788-19.036 7.856l-16.12 16.128c-10.496 10.488-10.496 27.572 0 38.06l219.136 219.924c5.064 5.064 11.812 8.632 19.084 8.632h.084c7.212 0 13.96-3.572 19.024-8.632l218.932-219.328c5.072-5.064 7.856-12.016 7.864-19.224 0-7.212-2.792-14.068-7.864-19.128z"></path>
                          </g>
                        </svg>
                      </button>
                      <ul className={`ayur-submenu ${submenuStates.resources ? "ayur-submenu-open" : ""}`}>
                        <li><Link to="/SuccessStories" onClick={(e) => handleSubmenuClick("/SuccessStories", e)}>Success Stories</Link></li>
              
                        <li><Link to="/Webinarss" onClick={(e) => handleSubmenuClick("/Webinarss", e)}>Webinars</Link></li>
              
                      </ul>
                    </li>

                    <li><Link to="/Blogs" onClick={resetMenu}>Blogs</Link></li>
                    <li><Link to="/ContactUs" onClick={resetMenu}>Contact Us</Link></li>
                    <li>
                      <Link className="ayur-btn-consult" to="/ConsultNow" onClick={resetMenu}>
                        Consult Now
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className={`ayur-toggle-btn ${isMenuOpen ? "active" : ""}`} onClick={handleMenuToggle}>
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