import React, { useState, useEffect } from "react"; // <-- IMPORT useState and useEffect

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

  // ---- NEW: State to manage submenu toggles ----
  const [submenuStates, setSubmenuStates] = useState({
    about: false,
    focus: false,
    features: false,
    resources: false, // Added for the Resources menu
  });

  // ---- NEW: State to manage hover delays ----
  const [hoverTimeout, setHoverTimeout] = useState(null);
  
  // ---- NEW: State to track if hover functionality is enabled ----
  const [hoverEnabled, setHoverEnabled] = useState(true);
  
  // ---- NEW: State to detect if device is mobile or tablet ----
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  // ---- NEW: Function to toggle submenu ----
  const toggleSubmenu = (key, e) => {
    e.preventDefault(); // Prevent navigation on click
    // Disable hover functionality when a dropdown is clicked
    setHoverEnabled(false);
    setSubmenuStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  
  // ---- NEW: Function to close all submenus ----
  const closeAllSubmenus = () => {
    setSubmenuStates({
      about: false,
      focus: false,
      features: false,
      resources: false,
    });
    // Re-enable hover functionality when closing submenus
    setHoverEnabled(true);
  };
  
  // ---- NEW: Function to open submenu on hover ----
  const openSubmenu = (key) => {
    // Only open submenu if hover is enabled and not on mobile/tablet
    if (!hoverEnabled || isMobileOrTablet) return;
    
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setSubmenuStates((prev) => ({ ...prev, [key]: true }));
  };
  
  // ---- NEW: Function to close submenu on hover out with delay ----
  const closeSubmenu = (key) => {
    // Only close submenu if hover is enabled and not on mobile/tablet
    if (!hoverEnabled || isMobileOrTablet) return;
    
    // Set a timeout to close the submenu after a short delay
    const timeout = setTimeout(() => {
      setSubmenuStates((prev) => ({ ...prev, [key]: false }));
    }, 100); // 100ms delay
    setHoverTimeout(timeout);
  };
  
  // ---- NEW: Function to re-enable hover functionality ----
  const reenableHover = () => {
    setHoverEnabled(true);
    closeAllSubmenus();
  };

  // ---- NEW: Effect to detect mobile/tablet devices ----
  useEffect(() => {
    const checkDevice = () => {
      setIsMobileOrTablet(window.innerWidth <= 991); // Assuming tablets are 991px or less
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("ayur-mobile-menu");
    } else {
      document.body.classList.remove("ayur-mobile-menu");
    }
    
    // Clean up timeout on unmount
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [isMenuOpen, hoverTimeout]);

  return (
    <>
      <Header />
      <div className="ayur-menu-wrapper">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-2 col-md-4 col-sm-5 col-6">
              <div className="ayur-menu-logo">
                <Link to="/" onClick={reenableHover}>
                  <img src={LogoFinal} alt="logo" />
                </Link>
              </div>
            </div>

            <div className="col-lg-10 col-md-8 col-sm-7 col-6">
              {/* 
                ---- NEW: Add a conditional class 'menu-open' to the wrapper ----
                This class will be used in our CSS to show the mobile menu.
              */}
              <div
                className={`ayur-navmenu-wrapper ${
                  isMenuOpen ? "menu-open" : ""
                }`}
              >
                <div className="ayur-nav-menu">
                  <ul>
                    <li className="active">
                      <Link to="/" onClick={reenableHover}>Home</Link>
                    </li>

                    <li 
                      className="ayur-has-menu"
                      onMouseEnter={() => openSubmenu("about")}
                      onMouseLeave={() => closeSubmenu("about")}
                    >
                      <Link to="/" onClick={(e) => toggleSubmenu("about", e)}>
                        About Us
                        <svg
                          version="1.1"
                          x="0"
                          y="0"
                          viewBox="0 0 491.996 491.996"
                        >
                          <g>
                            <path d="m484.132 124.986-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86-7.208 0-13.964 2.792-19.036 7.86l-183.84 183.848L62.056 108.554c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968 2.788-19.036 7.856l-16.12 16.128c-10.496 10.488-10.496 27.572 0 38.06l219.136 219.924c5.064 5.064 11.812 8.632 19.084 8.632h.084c7.212 0 13.96-3.572 19.024-8.632l218.932-219.328c5.072-5.064 7.856-12.016 7.864-19.224 0-7.212-2.792-14.068-7.864-19.128z"></path>
                          </g>
                        </svg>
                      </Link>

                      <ul
                        className={`ayur-submenu ${
                          submenuStates.about ? "ayur-submenu-open" : ""
                        }`}
                        onMouseEnter={() => openSubmenu("about")}
                        onMouseLeave={() => closeSubmenu("about")}
                      >
                        <li>
                          <Link to="/AboutUs" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            // Navigate after a short delay to ensure the menu closes first
                            setTimeout(() => {
                              window.location.href = "/AboutUs";
                            }, 100);
                          }}>About Us</Link>
                        </li>
                        <li>
                          <Link to="/Profile" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/Profile";
                            }, 100);
                          }}>Profile</Link>
                        </li>
                        <li>
                          <Link to="/Thejourney" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/Thejourney";
                            }, 100);
                          }}>The Journey</Link>
                        </li>
                        <li>
                          <Link to="/Researchers" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/Researchers";
                            }, 100);
                          }}>Researches</Link>
                        </li>
                        <li>
                          <Link to="/CommingSoon" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/CommingSoon";
                            }, 100);
                          }}>Articles</Link>
                        </li>
                      </ul>
                    </li>

                    {/* -------- OUR FOCUS ---------- */}
                    <li 
                      className="ayur-has-menu"
                      onMouseEnter={() => openSubmenu("focus")}
                      onMouseLeave={() => closeSubmenu("focus")}
                    >
                      <Link to="" onClick={(e) => toggleSubmenu("focus", e)}>
                        Our Focus
                        <svg
                          version="1.1"
                          x="0"
                          y="0"
                          viewBox="0 0 491.996 491.996"
                        >
                          <g>
                            <path d="m484.132 124.986-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86-7.208 0-13.964 2.792-19.036 7.86l-183.84 183.848L62.056 108.554c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968 2.788-19.036 7.856l-16.12 16.128c-10.496 10.488-10.496 27.572 0 38.06l219.136 219.924c5.064 5.064 11.812 8.632 19.084 8.632h.084c7.212 0 13.96-3.572 19.024-8.632l218.932-219.328c5.072-5.064 7.856-12.016 7.864-19.224 0-7.212-2.792-14.068-7.864-19.128z"></path>
                          </g>
                        </svg>
                      </Link>

                      <ul
                        className={`ayur-submenu ${
                          submenuStates.focus ? "ayur-submenu-open" : ""
                        }`}
                        onMouseEnter={() => openSubmenu("focus")}
                        onMouseLeave={() => closeSubmenu("focus")}
                      >
                        <li>
                          <Link to="/AutoImmune" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/AutoImmune";
                            }, 100);
                          }}>Auto-Immune Diseases</Link>
                        </li>
                        <li>
                          <Link to="/Degenerative" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/Degenerative";
                            }, 100);
                          }}>Degenerative Disorders</Link>
                        </li>
                        <li>
                          <Link to="/MetabolicDisorders" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/MetabolicDisorders";
                            }, 100);
                          }}>Metabolic Disorders</Link>
                        </li>
                        <li>
                          <Link to="/InternalOthercnds" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/InternalOthercnds";
                            }, 100);
                          }}>Other CNCD's</Link>
                        </li>
                        <li>
                          <Link to="/Internalwellnesssol" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/Internalwellnesssol";
                            }, 100);
                          }}>Wellness Solutions</Link>
                        </li>
                        <li>
                          <Link to="/OwnManufacturing" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/OwnManufacturing";
                            }, 100);
                          }}>Own Manufacturing</Link>
                        </li>
                      </ul>
                    </li>

                    {/* -------- FEATURES ---------- */}
                    <li 
                      className="ayur-has-menu"
                      onMouseEnter={() => openSubmenu("features")}
                      onMouseLeave={() => closeSubmenu("features")}
                    >
                      <Link to="" onClick={(e) => toggleSubmenu("features", e)}>
                        Features
                        <svg
                          version="1.1"
                          x="0"
                          y="0"
                          viewBox="0 0 491.996 491.996"
                        >
                          <g>
                            <path d="m484.132 124.986-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86-7.208 0-13.964 2.792-19.036 7.86l-183.84 183.848L62.056 108.554c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968 2.788-19.036 7.856l-16.12 16.128c-10.496 10.488-10.496 27.572 0 38.06l219.136 219.924c5.064 5.064 11.812 8.632 19.084 8.632h.084c7.212 0 13.96-3.572 19.024-8.632l218.932-219.328c5.072-5.064 7.856-12.016 7.864-19.224 0-7.212-2.792-14.068-7.864-19.128z"></path>
                          </g>
                        </svg>
                      </Link>

                      <ul
                        className={`ayur-submenu ${
                          submenuStates.features ? "ayur-submenu-open" : ""
                        }`}
                        onMouseEnter={() => openSubmenu("features")}
                        onMouseLeave={() => closeSubmenu("features")}
                      >
                        <li>
                          <Link to="/Faqs" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/Faqs";
                            }, 100);
                          }}>FAQs</Link>
                        </li>
                        <li>
                          <Link to="/PresentationAwards" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/PresentationAwards";
                            }, 100);
                          }}>Presentations & Awards</Link>
                        </li>
                        <li>
                          <Link to="/MediaGallery" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/MediaGallery";
                            }, 100);
                          }}>Media Gallery</Link>
                        </li>
                        <li>
                          <Link to="/CommingSoon" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/CommingSoon";
                            }, 100);
                          }}>Patient's Guide</Link>
                        </li>
                        <li>
                          <Link to="/CommingSoon" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/CommingSoon";
                            }, 100);
                          }}>Consent Form</Link>
                        </li>
                        <li>
                          <Link to="/CommingSoon" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/CommingSoon";
                            }, 100);
                          }}>Feedback</Link>
                        </li>
                        <li>
                          <Link to="/CommingSoon" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/CommingSoon";
                            }, 100);
                          }}>External Links</Link>
                        </li>
                        <li>
                          <Link to="/Disclaimer" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/Disclaimer";
                            }, 100);
                          }}>Disclaimer</Link>
                        </li>
                      </ul>
                    </li>

                    {/* -------- RESOURCES ---------- */}
                    <li 
                      className="ayur-has-menu"
                      onMouseEnter={() => openSubmenu("resources")}
                      onMouseLeave={() => closeSubmenu("resources")}
                    >
                      <Link to="" onClick={(e) => toggleSubmenu("resources", e)}>
                        Resources
                        <svg
                          version="1.1"
                          x="0"
                          y="0"
                          viewBox="0 0 491.996 491.996"
                        >
                          <g>
                            <path d="m484.132 124.986-16.116-16.228c-5.072-5.068-11.82-7.86-19.032-7.86-7.208 0-13.964 2.792-19.036 7.86l-183.84 183.848L62.056 108.554c-5.064-5.068-11.82-7.856-19.028-7.856s-13.968 2.788-19.036 7.856l-16.12 16.128c-10.496 10.488-10.496 27.572 0 38.06l219.136 219.924c5.064 5.064 11.812 8.632 19.084 8.632h.084c7.212 0 13.96-3.572 19.024-8.632l218.932-219.328c5.072-5.064 7.856-12.016 7.864-19.224 0-7.212-2.792-14.068-7.864-19.128z"></path>
                          </g>
                        </svg>
                      </Link>

                      <ul
                        className={`ayur-submenu ${
                          submenuStates.resources ? "ayur-submenu-open" : ""
                        }`}
                        onMouseEnter={() => openSubmenu("resources")}
                        onMouseLeave={() => closeSubmenu("resources")}
                      >
                        <li>
                          <Link to="/CommingSoon" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/CommingSoon";
                            }, 100);
                          }}>Success Stories</Link>
                        </li>
                        <li>
                          <Link to="/CommingSoon" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/CommingSoon";
                            }, 100);
                          }}>Testimonials</Link>
                        </li>
                        <li>
                          <Link to="/CommingSoon" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/CommingSoon";
                            }, 100);
                          }}>Webinars</Link>
                        </li>
                        <li>
                          <Link to="/CommingSoon" onClick={(e) => {
                            e.preventDefault();
                            closeAllSubmenus();
                            setTimeout(() => {
                              window.location.href = "/CommingSoon";
                            }, 100);
                          }}>Videos</Link>
                        </li>
                      </ul>
                    </li>
                  
                    <li>
                      <Link to="/Blogs" onClick={reenableHover}>Blogs</Link>
                    </li>
                    <li>
                      <Link to="/ContactUs" onClick={reenableHover}>Contact Us</Link>
                    </li>
                    <li>
                      <Link className="ayur-btn-consult" to="/ConsultNow" onClick={reenableHover}>
                        Consult Now
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* 
                  ---- NEW: Add onClick handler and conditional 'active' class ----
                  The 'active' class is for styling the hamburger into an 'X'.
                */}
                <div
                  className={`ayur-toggle-btn ${isMenuOpen ? "active" : ""}`}
                  onClick={handleMenuToggle}
                >
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