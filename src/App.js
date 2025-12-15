
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
function App() {
  
   const location = useLocation();

  const hiddenPaths = new Set([
    "/Dashboard",

     ]);

  const hiddenFooter1 = new Set([
    "",
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


{/* <Route path="*" element={<NotFound />} />  */}
</Routes>

  {!shouldHideFooter1 && <Footer />}
  </>
  );
}
export default App;
