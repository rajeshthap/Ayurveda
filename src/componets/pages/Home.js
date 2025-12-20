import React from "react";
import "../../assets/css/home.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-creative";


// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-creative";
import "../../assets/css/responsive.css";
import "../../assets/css/stylecss.css"

import OurExpertise from "./OurExpertise";
import PresentationsAwards from "./PresentationsAwards";
import About from "./about_us/About";
import Achievment from "./Achievment";
import PureAyurveda from "./PureAyurveda";
import OurTestimonial from "./OurTestimonial";
import OurTeam from "./OurTeam";
import BannerSection from "./BannerSection";
import MediaGallery from "./Features/MediaGallery";

function Home() {
  return (
     <>
   <BannerSection />
     <OurExpertise />
     <PresentationsAwards />
       <MediaGallery showBannerOnly={true} />
     {/* <About /> */}
     {/* <Achievment />
     <PureAyurveda />
  
     <OurTestimonial /> */}
     <OurTeam />
    </>
  );
}

export default Home;
