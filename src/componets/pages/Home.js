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
import "../../assets/css/stylecss.css";

import OurExpertise from "./OurExpertise";

import About from "./about_us/About";
import Achievment from "./Achievment";
import PureAyurveda from "./PureAyurveda";
import OurTestimonial from "./OurTestimonial";
import OurTeam from "./OurTeam";
import BannerSection from "./BannerSection";
import MediaGallery from "./Features/MediaGallery";
import PresentationAwards from "./Features/PresentationAwards";
import ClinicHome from "./Homepages/ClinicHome";
import CareHome from "./Homepages/CareHome";
import AimHome from "./Homepages/AimHome";
import CallHome from "./Homepages/CallHome";
import SafetyHome from "./Homepages/SafetyHome";
import MedicalHome from "./Homepages/MedicalHome";


function Home() {
  return (
    <>
      <BannerSection />
      
     <ClinicHome />
      <CareHome />
      <AimHome />
      <CallHome/>
      <SafetyHome/>
      <OurExpertise />
       <PresentationAwards showBanner={false} showAboutUsClass={false} />

      {/* <MediaGallery showBannerOnly={true} /> */}
      <OurTestimonial />

      
      <About />
      {/* <Achievment />
     <PureAyurveda />
  
    */}
      <OurTeam />
      <MedicalHome/>
    </>
  );
}

export default Home;
