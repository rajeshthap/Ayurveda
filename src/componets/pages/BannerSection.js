import React, { useState, useEffect } from "react";

// Import leaf images
import BanLeafLeft from "../../assets/images/ban-leafleft.png";
import BanLeafRight from "../../assets/images/ban-leafright.png";
import "../../assets/css/banner.css";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

function BannerSection() {
  const [carouselData, setCarouselData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const response = await fetch('https://mahadevaaya.com/trilokayurveda/trilokabackend/api/carousel-items/');
        const result = await response.json();
        
        if (result.success) {
          setCarouselData(result.data);
        }
      } catch (error) {
        console.error('Error fetching carousel data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselData();
  }, []);

  if (loading) {
    return <div className="ayur-banner-section">Loading banner...</div>;
  }

  const baseURL = 'https://mahadevaaya.com/trilokayurveda/trilokabackend';

  return (
    <div className="ayur-banner-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="ayur-banner-heading">
              <h1>Trilok Ayurveda </h1>
              <br />
              <h2>Wellness Center and Speciality Clinic for Chronic Disorders</h2>
              <p>
                Two decades of rich clinical experience and expertise in treating
                Degenerative, Auto-immune, Metabolic and other Chronic Non-Communicable
                Disorders (CNCD's) through herbs based Internal Medicines.
              </p>
            </div>
          </div>
        </div>

        {/* Slider Section */}
        <div className="row">
          <div className="col-lg-12">
            <div className="ayur-banner-slider-sec">
              <Swiper
                modules={[Navigation, Autoplay, EffectCoverflow]}
                loop={true}
                navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={3}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: false,
                }}
                className="swiper ayur-banner-slider"
              >
                {carouselData.map((item) => (
                  <SwiperSlide key={item.id}>
                    <div className="ayur-ban-slide">
                      <img 
                        src={`${baseURL}${item.image}`} 
                        alt={item.title} 
                      />
                      <h1 className="ayur-ban-title">{item.title}</h1>
                      <p className="ayur-ban-desc">{item.description}</p>
                    </div>
                  </SwiperSlide>
                ))}

                {/* Navigation Buttons */}
                <div className="swiper-button-prev">
                  <svg width="46" height="22" viewBox="0 0 46 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M0.520424 9.74414L0.522022 9.74245L9.79254 0.51664C10.4871 -0.174498 11.6104 -0.171926 12.3017 0.522671C12.9929 1.21718 12.9903 2.34051 12.2958 3.03174L6.07152 9.22581H43.6452C44.6251 9.22581 45.4194 10.0201 45.4194 11C45.4194 11.9799 44.6251 12.7742 43.6452 12.7742H6.07161L12.2957 18.9683C12.9902 19.6595 12.9928 20.7828 12.3016 21.4773C11.6103 22.172 10.4869 22.1744 9.79245 21.4834L0.521931 12.2575C-0.17231 10.4354 0.520424 9.74414Z"
                      fill="#F6F1ED"
                    />
                  </svg>
                </div>

                <div className="swiper-button-next">
                  <svg width="46" height="22" viewBox="0 0 46 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M44.899 9.74414L44.8974 9.74245L35.6269 0.51664C34.9324 -0.174498 33.8091 -0.171926 33.1177 0.522671C32.4265 1.21718 32.4292 2.34051 33.1237 3.03174L39.3479 9.22581H1.77419C0.794307 9.22581 0 10.0201 0 11C0 11.9799 0.794307 12.7742 1.77419 12.7742H39.3478L33.1238 18.9683C32.4293 19.6595 32.4266 20.7828 33.1178 21.4773C33.8091 22.172 34.9326 22.1744 35.627 21.4834L44.8975 12.2575C45.5917 10.4354 44.899 9.74414Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </Swiper>
            </div>
          </div>
        </div>
      </div>

      {/* Leaf Images */}
      <div className="ayur-ban-leaf">
        <img src={BanLeafLeft} alt="leaf-image" />
        <img src={BanLeafRight} alt="leaf-image" />
      </div>

     
    </div>
  );
}

export default BannerSection;