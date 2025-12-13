
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

{/* <Route path="*" element={<NotFound />} />  */}
</Routes>

  {!shouldHideFooter1 && <Footer />}
  </>
  );
}
export default App;
