import React, { useState } from "react";
import { Nav, Offcanvas, Collapse } from "react-bootstrap";
import {
  FaTachometerAlt,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronRight,
  FaImages,
  
  FaUsers,
  FaBook,
  FaBuilding,
  FaImage,
  FaTools,
  FaComments,
  FaCube,
  FaProjectDiagram,
  FaServer,
  FaUserCircle,
} from "react-icons/fa";
import axios from "axios";
import "../../assets/css/dashboard.css";
import { Link } from "react-router-dom";
import {
  FaInfoCircle,
 
  FaEdit,
  FaListUl,
  FaBullseye,
  FaPlusSquare,
  FaTasks
} from "react-icons/fa";

// import BRLogo from "../../assets/images/brainrock_logo.png";




const LeftNav = ({ sidebarOpen, setSidebarOpen, isMobile, isTablet }) => {
    // const { logout } = useContext(AuthContext);
    // const { user } = useContext(AuthContext);
// const emp_id = user?.unique_id;  // This is the correct value

    const [userRole, setUserRole] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };
  



const menuItems = [
    {
      icon: <FaTachometerAlt />,
      label: "Dashboard",
      path: "/TotalConsultNow",
      active: true,
    },

      {
      icon: <FaTachometerAlt />,
      label: "Patient Feedback",
      path: "/TotalFeedback",
      active: true,
    },

     {
      icon: <FaTachometerAlt />,
      label: "Patient Qol",
      path: "/TotalQol",
      active: true,
    },

     {
      icon: <FaTachometerAlt />,
      label: "Contact Us",
      path: "/TotalContact",
      active: true,
    },
    
   
     {
      icon: <FaImages />,
      label: "Carousel",
      submenu: [
        {
          label: "Add Carousel",
          path: "/AddCarousel",
          icon: <FaImage />,
        },
         {
          label: "Manage Carousel",
          path: "/ManageCarousel",
          icon: <FaImage />,
        },
        
        
       
      ],
    },
    {
      icon: <FaProjectDiagram />,
      label: "The Journey",
      submenu: [
        {
          label: "Add Journey",
          path: "/AddJourney",
          icon: <FaImage />,
        },
         {
          label: "Manage Journey",
          path: "/ManageJourney",
          icon: <FaImage />,
        },
      ],
    },

     {
      icon: <FaProjectDiagram />,
      label: "Success Stories",
      submenu: [
        {
          label: "Add Success Story",
          path: "/AddSuccessStories",
          icon: <FaImage />,
        },
         {
          label: "Manage Success Story",
          path: "/ManageSuccessStories",
          icon: <FaImage />,
        },
      ],
    },

    {
      icon: <FaProjectDiagram />,
      label: "Webinar",
      submenu: [
        {
          label: "Add Webinar",
          path: "/AddWebinar",
          icon: <FaImage />,
        },
         {
          label: "Manage Webinar",
          path: "/ManageWebinars",
          icon: <FaImage />,
        },
      ],
    },

     {
      icon: <FaProjectDiagram />,
      label: "Testinomials",
      submenu: [
        {
          label: "Add Testinomial",
          path: "/AddTestinomial",
          icon: <FaImage />,
        },
         {
          label: "Manage Testinomial",
          path: "/ManageTestinomial",
          icon: <FaImage />,
        },
      ],
    },
   {
  icon: <FaInfoCircle />,   // About Us main
  label: "About Us",
  submenu: [
    {
      label: "Add Profile",
      path: "/AddProfile",
      icon: <FaUserCircle />, // profile
    },
     {
          label: "Manage Profile",
          path: "/ManageProfile",
          icon: <FaImage />,
        },
    {
      label: "Add About Us",
      path: "/AddAboutUs",
      icon: <FaEdit />, // add/edit content
    },
    {
      label: "Manage About Us",
      path: "/ManageAboutUs",
      icon: <FaListUl />, // manage/list
    },
  ],
},
{
  icon: <FaBullseye />, // Our Focus main
  label: "Our Focus",
  submenu: [
    {
      label: "Add Auto-Immune Diseases",
      path: "/AddOurFocus",
      icon: <FaPlusSquare />, // add focus
    },
    {
      label: "Manage Auto-Immune Diseases",
      path: "/ManageOurFocus",
      icon: <FaTasks />, // manage focus
    },

     {
      label: "Add Degenerative Disorders",
      path: "/AddDigenerative",
      icon: <FaPlusSquare />, // add focus
    },
    {
      label: "Manage Degenerative Disorders",
      path: "/ManageDigenerative",
      icon: <FaTasks />, // manage focus
    },

      {
      label: "Add CNCDs",
      path: "/AddCncds",
      icon: <FaPlusSquare />, // add focus
    },
    {
      label: "Manage CNCDs",
      path: "/ManageCncds",
      icon: <FaTasks />, // manage focus
    },
     {
      label: "Add Wellness Solutions",
      path: "/AddWellnessolution",
      icon: <FaPlusSquare />, // add focus
    },
    {
      label: "Manage Wellness Solutions",
      path: "/ManageWellnessolution",
      icon: <FaTasks />, // manage focus
    },

      {
      label: "Add Metabolic Disorders",
      path: "/AddMetabolicDisorders",
      icon: <FaPlusSquare />, // add focus
    },
    {
      label: "Manage Metabolic Disorders",
      path: "/ManageMetabolicDisorders",
      icon: <FaTasks />, // manage focus
    },

      {
      label: "Add Own Manufacturing",
      path: "/AddOwnManufacturing",
      icon: <FaPlusSquare />, // add focus
    },
    {
      label: "Manage Own Manufacturing",
      path: "/ManageOwnManufacturing",
      icon: <FaTasks />, // manage focus
    },
  ],
},


 {
      icon: <FaTachometerAlt />,
      label: "Footer",
      path: "/ManageFooter",
      active: true,
    },

     {
      icon: <FaTachometerAlt />,
      label: "Manage Consent",
      path: "/ManageConsent",
      active: true,
    },

    {
      icon: <FaTachometerAlt />,
      label: "Manage Clinic",
      path: "/ManageClinic",
      active: true,
    },

     {
      icon: <FaTachometerAlt />,
      label: "Manage Care",
      path: "/ManageCare",
      active: true,
    },

     {
      icon: <FaTachometerAlt />,
      label: "Manage Aim",
      path: "/ManageAim",
      active: true,
    },

    {
      icon: <FaTachometerAlt />,
      label: "Manage Safety",
      path: "/ManageSafety",
      active: true,
    },

    {
      icon: <FaTachometerAlt />,
      label: "Call to Action",
      path: "/CalltoAction",
      active: true,
    },

     {
      icon: <FaTachometerAlt />,
      label: "Manage Hero Section",
      path: "/ManageHeroSection",
      active: true,
    },

     {
      icon: <FaTachometerAlt />,
      label: "Manage Contact Us",
      path: "/ManageContactUs",
      active: true,
    },
    
    
  
  {
      icon: <FaImages />,
      label: "Feature",
      submenu: [
        {
          label: "Add FAQ",
          path: "/AddFQA",
          icon: <FaImage />,
        },
         {
          label: "Manage FAQ",
          path: "/ManageFQA",
          icon: <FaImage />,
        },
         {
          label: "Add Presentation Awards",
          path: "/AddPresentationAwards",
          icon: <FaImage />,
        },
         {
          label: "Manage Presentation Awards",
          path: "/ManagePresentationAwards",
          icon: <FaImage />,
        },
        
         {
          label: "Add Media Gallery",
          path: "/AddMediaGallery",
          icon: <FaImage />,
        },
         {
          label: "Manage Media Gallery",
          path: "/ManageMediaGallery",
          icon: <FaImage />,
        },
         {
          label: "Manage Disclamir",
          path: "/ManageDisclamier",
          icon: <FaImage />,
        },
       
      ],
    },


     {
      icon: <FaImages />,
      label: "Researches",
      submenu: [
        {
          label: "Add Researches",
          path: "/AddResearches",
          icon: <FaImage />,
        },
        
         {
          label: "Manage Researches",
          path: "/ManageResearches",
          icon: <FaImage />,
        },
        
        
       
      ],
    },
  

   {
      icon: <FaImages />,
      label: "Blogs",
      submenu: [
        {
          label: "Add Blogs",
          path: "/AddBlog  ",
          icon: <FaImage />,
        },
         {
          label: "Manage Blogs",
          path: "/ManageBlog",
          icon: <FaImage />,
        },
        
        
       
      ],
    },
   

    
  
  ];


  
  

  //  Auto-close sidebar when switching to mobile or tablet
  

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo">
             
              {/* <span className="logo-text"><img src={BRLogo} alt="text"></img></span> */}
            </div>
          </div>
        </div>

        <Nav className="sidebar-nav flex-column">
          
        {menuItems
  .filter(item =>
    item.allowedRoles ? item.allowedRoles.includes(userRole) : true
  )
  .map((item, index) => (
    <div key={index}>
      {/* If submenu exists */}
      {item.submenu ? (
        <Nav.Link
          className={`nav-item ${item.active ? "active" : ""}`}
          onClick={() => toggleSubmenu(index)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-text">{item.label}</span>
          <span className="submenu-arrow">
            {openSubmenu === index ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        </Nav.Link>
      ) : (
        <Link
          to={item.path}
          className={`nav-item nav-link ${item.active ? "active" : ""}`}
          onClick={() => setSidebarOpen(false)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-text">{item.label}</span>
        </Link>
      )}

      {/* Submenu */}
      {item.submenu && (
        <Collapse in={openSubmenu === index}>
          <div className="submenu-container">
            {item.submenu.map((subItem, subIndex) => (
              <Link
                key={subIndex}
                to={subItem.path}
                className="submenu-item nav-link"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="submenu-icon">{subItem.icon}</span>
                <span className="nav-text br-text-sub">{subItem.label}</span>
              </Link>
            ))}
          </div>
        </Collapse>
      )}
    </div>
  ))}

        </Nav>

        <div className="sidebar-footer">
          <Nav.Link
            className="nav-item logout-btn"
        //    onClick={logout}
          >
            <span className="nav-icon">
              <FaSignOutAlt />
            </span>
            <span className="nav-text">Logout</span>
          </Nav.Link>
        </div>
      </div>

      {/*  Mobile / Tablet Sidebar (Offcanvas) */}
  <Offcanvas
  show={(isMobile || isTablet) && sidebarOpen}
  onHide={() => setSidebarOpen(false)}
  className="mobile-sidebar"
  placement="start"
  backdrop={true}
  scroll={false}
  enforceFocus={false} //  ADD THIS LINE — fixes close button focus issue
>
  <Offcanvas.Header closeButton className="br-offcanvas-header">
    <Offcanvas.Title className="br-off-title">Menu</Offcanvas.Title>
  </Offcanvas.Header>

  <Offcanvas.Body className="br-offcanvas">
    <Nav className="flex-column">
      {menuItems.map((item, index) => (
        <div key={index}>
          {item.submenu ? (
            <Nav.Link
              className={`nav-item ${item.active ? "active" : ""}`}
              onClick={() => toggleSubmenu(index)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text br-nav-text-mob">{item.label}</span>
              <span className="submenu-arrow">
                {openSubmenu === index ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            </Nav.Link>
          ) : (
            <Link
              to={item.path}
              className={`nav-item nav-link ${item.active ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text br-nav-text-mob">{item.label}</span>
            </Link>
          )}

          {item.submenu && (
            <Collapse in={openSubmenu === index}>
              <div className="submenu-container">
                {item.submenu.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    to={subItem.path}
                    className="submenu-item nav-link"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="nav-text">{subItem.label}</span>
                  </Link>
                ))}
              </div>
            </Collapse>
          )}
        </div>
      ))}
    </Nav>
  </Offcanvas.Body>
</Offcanvas>

    </>
  );
};

export default LeftNav;
