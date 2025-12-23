
import './App.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/poppins";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../src/custom/style.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from './componets/pages/Home';
import NavBar from './componets/topnav/NavBar';
import Footer from './componets/footer/Footer';
import Dashboard from './componets/dash_board/Dashboard';
import AboutUs from './componets/pages/about_us/AboutUs';
import Thejourney from './componets/pages/about_us/Thejourney';
import Vaidyaharshsehgal from './componets/pages/about_us/Vaidyaharshsehgal';
import Profbhavnasingh from './componets/pages/about_us/Profbhavnasingh';
import Vaidyajasminesehgal from './componets/pages/about_us/Vaidyajasminesehgal';
import OwnManufacturing from './componets/pages/our_focus/OwnManufacturing';
import InternalOthercnds from './componets/pages/our_focus/InternalOthercnds';
import Degenerative from './componets/pages/our_focus/Degenerative';
import AutoImmune from './componets/pages/our_focus/AutoImmune';
import Internalwellnesssol from './componets/pages/our_focus/Internalwellnesssol';
import Diseases from './componets/pages/our_focus/Diseases';
import Faqs from './componets/pages/Features/Faqs';
import PresentationAwards from './componets/pages/Features/PresentationAwards';
import MediaGallery from './componets/pages/Features/MediaGallery';
import PatientsGuide from './componets/pages/Features/PatientsGuide';
import Feedback from './componets/pages/Features/Feedback';
import ExternalLinks from './componets/pages/Features/ExternalLinks';
import Disclaimer from './componets/pages/Features/Disclaimer';
import DegenerativeDiseases from './componets/pages/our_focus/DegenerativeDiseases';
import Researchers from './componets/pages/Researchers';
import Blogs from './componets/pages/Blogs';
import ContactUs from './componets/pages/ContactUs';
import Login from './componets/all_login/Login';
import AddAboutUs from './componets/dash_board/about_us/AddAboutUs';
import ManageAboutUs from './componets/dash_board/about_us/ManageAboutUs';
import AddJourney from './componets/dash_board/Journey/AddJourney';
import ManageJourney from './componets/dash_board/Journey/ManageJourney';
import AddProfbhavnasingh from './componets/dash_board/about_us/AddProfbhavnasingh';
import AddProfile from './componets/dash_board/about_us/AddProfile';
import AddAutoImmune from './componets/dash_board/our_focus_dashboard/AddAutoImmune';
import ManageProfile from './componets/dash_board/about_us/ManageProfile';
import ManageFQA from './componets/dash_board/features_page/ManageFQA';
import AddFQA from './componets/dash_board/features_page/AddFQA';
import AddOurFocus from './componets/dash_board/our_focus_dashboard/AddOurFocus';
import ManageOurFocus from './componets/dash_board/our_focus_dashboard/ManageOurFocus';
import ManagePresentationAwards from './componets/dash_board/features_page/ManagePresentationAwards';
import AddPresentationAwards from './componets/dash_board/features_page/AddPresentationAwards';
import AddMediaGallery from './componets/dash_board/features_page/AddMediaGallery';
import ManageMediaGallery from './componets/dash_board/features_page/ManageMediaGallery';
import ManageDisclamier from './componets/dash_board/features_page/ManageDisclamier';
import AddDigenerative from './componets/dash_board/our_focus_dashboard/AddDigenerative';
import ManageDigenerative from './componets/dash_board/our_focus_dashboard/ManageDigenerative';
import AddCncds from './componets/dash_board/our_focus_dashboard/AddCncds';
import ManageCncds from './componets/dash_board/our_focus_dashboard/ManageCncds';
import AddWellnessolution from './componets/dash_board/our_focus_dashboard/AddWellnessolution';
import ManageWellnessolution from './componets/dash_board/our_focus_dashboard/ManageWellnessolution';
import AddMetabolicDisorders from './componets/dash_board/our_focus_dashboard/AddMetabolicDisorders';
import ManageMetabolicDisorders from './componets/dash_board/our_focus_dashboard/ManageMetabolicDisorders';
import MetabolicDisorders from './componets/pages/our_focus/MetabolicDisorders';
import AddOwnManufacturing from './componets/dash_board/our_focus_dashboard/AddOwnManufacturing';
import ManageOwnManufacturing from './componets/dash_board/our_focus_dashboard/ManageOwnManufacturing';
import AddBlog from './componets/dash_board/AddBlog';
import ManageBlog from './componets/dash_board/ManageBlog';
import AddCarousel from './componets/dash_board/carousel/AddCarousel';
import ManageCarousel from './componets/dash_board/carousel/ManageCarousel';
import ManageFooter from './componets/dash_board/ManageFooter';
import BlogsDetails from './componets/pages/BlogsDetails';
import AddTestinomial from './componets/dash_board/Testinomials/AddTestinomial';
import ManageTestinomial from './componets/dash_board/Testinomials/ManageTestinomial';
import ConsultNow from './componets/Consult_now/ConsultNow';
import AddResearches from './componets/dash_board/researches/AddResearches';
import ManageResearches from './componets/dash_board/researches/ManageResearches';
import CommingSoon from './componets/CommingSoon';
import TotalConsultNow from './componets/dash_board/total_consult_now/TotalConsultNow';
import Profile from './componets/pages/about_us/Profile';


function App() {
  
   const location = useLocation();

  const hiddenPaths = new Set([
    "/Dashboard",
    "/AddAboutUs",
     "/ManageAboutUs",
      "/AddJourney",
      "/ManageJourney",
      "/AddProfbhavnasingh",
      "/AddProfile",
      "/ManageProfile",
      "/AddAutoImmune",
      "/AddFQA",
      "/ManageFQA",
      "/AddOurFocus",
      "/ManageOurFocus",
      "/AddPresentationAwards",
      "/ManagePresentationAwards",
      "/ManageMediaGallery",
      "/AddMediaGallery",
      "/ManageDisclamier",
      "/AddDigenerative",
      "/ManageDigenerative",
      "/AddCncds",
      "/ManageCncds",
      "/AddWellnessolution",
      "/ManageWellnessolution",
      "/AddMetabolicDisorders",
      "/ManageMetabolicDisorders",
      "/AddOwnManufacturing",
      "/ManageOwnManufacturing",
      "/AddBlog",
      "/ManageBlog",
      "/AddCarousel",
      "/ManageCarousel",
      "/ManageFooter",
      "/AddTestinomial",
      "/ManageTestinomial",
      "/ManageResearches",
      "/AddResearches",
      "/TotalConsultNow"


     ]);

  const hiddenFooter1 = new Set([
    "/Dashboard",
    "/AddAboutUs",
    "/ManageAboutUs",
    "/AddJourney",
    "/ManageJourney",
    "/AddProfbhavnasingh",
    "/AddProfile" ,
    "/ManageProfile",
    "/AddAutoImmune",
    "/AddFQA",
    "/ManageFQA",
    "/AddOurFocus",
    "/ManageOurFocus",
    "/AddPresentationAwards",
    "/ManagePresentationAwards",
    "/ManageMediaGallery",
    "/AddMediaGallery",
    "/ManageDisclamier",
    "/AddDigenerative",
    "/ManageDigenerative",
    "/AddCncds",
    "/ManageCncds",
    "/AddWellnessolution",
    "/ManageWellnessolution",
    "/AddMetabolicDisorders",
    "/ManageMetabolicDisorders",
    "/AddOwnManufacturing",
    "/ManageOwnManufacturing",
    "/AddBlog",
    "/ManageBlog",
    "/AddCarousel",
    "/ManageCarousel",
    "/ManageFooter",
    "/AddTestinomial",
    "/ManageTestinomial",
    "/ManageResearches",
    "/AddResearches",
    "/TotalConsultNow"

  ]);

    const shouldHideNavbar = hiddenPaths.has(location.pathname);
  const shouldHideFooter1 = hiddenFooter1.has(location.pathname);
  return (
    <>
    
      {!shouldHideNavbar && <NavBar />}


<Routes>
<Route path="/" element={<Home />} />

<Route path="/Dashboard" element={<Dashboard />} />
<Route path="/AboutUs" element={<AboutUs />} />
<Route path="/Thejourney" element={<Thejourney />} />
<Route path="/Vaidyaharshsehgal" element={<Vaidyaharshsehgal />} />
<Route path="/Profbhavnasingh" element={<Profbhavnasingh />} />
<Route path="/Vaidyajasminesehgal" element={<Vaidyajasminesehgal />} />
<Route path="/OwnManufacturing" element={<OwnManufacturing />} />
<Route path="/Internalwellnesssol" element={<Internalwellnesssol />} />
<Route path="/InternalOthercnds" element={<InternalOthercnds />} />
<Route path="/Degenerative" element={<Degenerative />} />
<Route path="/AutoImmune" element={<AutoImmune />} />
<Route path="/Diseases" element={<Diseases />} />
<Route path="/Faqs" element={<Faqs/>} />
<Route path="/PresentationAwards" element={<PresentationAwards/>} />
<Route path="/MediaGallery" element={<MediaGallery/>} />
<Route path="/PatientsGuide" element={<PatientsGuide/>} />
<Route path="/Feedback" element={<Feedback/>} />
<Route path="/ExternalLinks" element={<ExternalLinks/>} />
<Route path="/Disclaimer" element={<Disclaimer/>} />
<Route path="/DegenerativeDiseases" element={<DegenerativeDiseases/>} />
<Route path="/MetabolicDisorders" element={<MetabolicDisorders/>} />
<Route path="/Researchers" element={<Researchers/>} />
<Route path="/Blogs" element={<Blogs/>} />
<Route path="/ContactUs" element={<ContactUs/>} />
<Route path="/AddAboutUs" element={<AddAboutUs />} />
<Route path="/AddProfile" element={<AddProfile />} />
<Route path="/ManageProfile" element={<ManageProfile />} />
<Route path="/ManageAboutUs" element={<ManageAboutUs />} />
<Route path="/AddJourney" element={<AddJourney/>} />
<Route path="/ManageJourney" element={<ManageJourney />} />
<Route path="/AddCarousel" element={<AddCarousel/>} />
<Route path="/ManageCarousel" element={<ManageCarousel />} />
<Route path="/Login" element={<Login />} />
<Route path="/AddProfbhavnasingh" element={<AddProfbhavnasingh />} />
<Route path="/AddAutoImmune" element={<AddAutoImmune />} />
<Route path="/AddFQA" element={<AddFQA />} />
<Route path="/ManageFQA" element={<ManageFQA />} />
<Route path="/AddOurFocus" element={<AddOurFocus />} />
<Route path="/ManageOurFocus" element={<ManageOurFocus />} />
<Route path="/AddDigenerative" element={<AddDigenerative/>} />
<Route path="/ManageDigenerative" element={<ManageDigenerative />} />
<Route path="/AddCncds" element={<AddCncds/>} />
<Route path="/ManageCncds" element={<ManageCncds />} />
<Route path="/AddWellnessolution" element={<AddWellnessolution/>} />
<Route path="/ManageWellnessolution" element={<ManageWellnessolution />} />
<Route path="/AddMetabolicDisorders" element={<AddMetabolicDisorders/>} />
<Route path="/ManageMetabolicDisorders" element={<ManageMetabolicDisorders />} />
<Route path="/AddOwnManufacturing" element={<AddOwnManufacturing/>} />
<Route path="/ManageOwnManufacturing" element={<ManageOwnManufacturing />} />
<Route path="/AddTestinomial" element={<AddTestinomial/>} />
<Route path="/ManageTestinomial" element={<ManageTestinomial />} />
<Route path="/AddPresentationAwards" element={<AddPresentationAwards />} />
<Route path="/ManagePresentationAwards" element={<ManagePresentationAwards />} />
<Route path="/AddMediaGallery" element={<AddMediaGallery />} />
<Route path="/ManageMediaGallery" element={<ManageMediaGallery />} />
<Route path="/ManageDisclamier" element={<ManageDisclamier />} />
<Route path="/ManageDisclamier" element={<ManageDisclamier />} />
<Route path="/AddBlog" element={<AddBlog />} />
<Route path="/ManageBlog" element={<ManageBlog />} />
<Route path="/ManageFooter" element={<ManageFooter />} />
<Route path="/BlogsDetails" element={<BlogsDetails />} />
<Route path="/ConsultNow" element={<ConsultNow />} />
<Route path="/AddResearches" element={<AddResearches />} />
<Route path="/ManageResearches" element={<ManageResearches />} />
<Route path="/CommingSoon" element={<CommingSoon />} />
<Route path="/TotalConsultNow" element={<TotalConsultNow/>} />
<Route path="/Profile" element={<Profile/>} />

{/* <Route path="*" element={<NotFound />} />  */}
</Routes>

  {!shouldHideFooter1 && <Footer />}
  </>
  );
}
export default App;
