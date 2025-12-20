import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// Images
import care1 from "../../assets/images/care-img1.png";
import care2 from "../../assets/images/care-img2.png";
import care3 from "../../assets/images/care-img3.png";
import care4 from "../../assets/images/care-img4.png";
import care5 from "../../assets/images/care-img5.png";
import care6 from "../../assets/images/care-img6.png";
import { Link } from "react-router-dom";

function OurExpertise() {
  const data = [
    { img: care1, title: "Autoimmune Diseases", desc: "Cellular Cleansing – The Way Out", path: "/AutoImmune" },
    { img: care2, title: "Degenerative Disorders", desc: "There is a Hallmark Line of Action- the Rasayan Chikitsa!", path: "/Degenerative" },
    { img: care3, title: "Metabolic Disorders", desc: "A Good Metabolism – Key to Robust Health!", path: "/MetabolicDisorders" },
    { img: care4, title: "Other CNCD's", desc: "Life Without Too Much Style in the Lifestyle!", path: "/InternalOthercnds" },
    { img: care5, title: "Wellness Solutions", desc: "From Illness Wellness!", path: "/Internalwellnesssol" },
    { img: care6, title: "Own Manufacturing", desc: "Individualized precision Medicine & High Quality", path: "/OwnManufacturing" },
  ];

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="ayur-care-slider-wrapper">
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="ayur-heading-wrap">
            <h3>Our Expertise</h3>
            <h5>"Health and Wellness Solutions for Chronic Lifestyle Disorders"</h5>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="ayur-care-slider-sec">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            loop={true}
            slidesPerView={5}
            spaceBetween={20}
            breakpoints={{
              320: { slidesPerView: 2 },
              576: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              992: { slidesPerView: 5 },
            }}
            className="ayur-care-slider"
          >
            {data.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="ayur-careslide-box">
                  <Link to={item.path} onClick={scrollToTop}>
                    <div className="ayur-careslider-img">
                      <img src={item.img} alt={item.title} />
                    </div>
                  </Link>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Prev Button */}
          <div className="swiper-button-prev">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M20 0C31.0284 0 40 8.97164 40 20C40 31.0284 31.0284 40 20 40C8.97164 40 0 31.0284 0 20C0 8.97164 8.97164 0 20 0ZM13.8216 21.1784L22.155 29.5116C22.3096 29.6666 22.4932 29.7896 22.6955 29.8734C22.8977 29.9572 23.1145 30.0002 23.3334 30C23.5523 30.0002 23.769 29.9572 23.9712 29.8733C24.1735 29.7895 24.3571 29.6666 24.5117 29.5116C25.1634 28.86 25.1634 27.8066 24.5117 27.155L17.3566 20L24.5116 12.845C25.1633 12.1934 25.1633 11.14 24.5116 10.4884C23.86 9.83672 22.8066 9.83672 22.155 10.4884L13.8216 18.8217C13.17 19.4734 13.17 20.5266 13.8216 21.1784Z"
                fill="#D6CDCA"
              />
            </svg>
          </div>

          {/* Next Button */}
          <div className="swiper-button-next">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M20 0C8.97164 0 0 8.97164 0 20C0 31.0284 8.97164 40 20 40C31.0284 40 40 31.0284 40 20C40 8.97164 31.0284 0 20 0ZM26.1784 21.1784L17.845 29.5116C17.6904 29.6666 17.5068 29.7896 17.3045 29.8734C17.1023 29.9572 16.8855 30.0002 16.6666 30C16.4477 30.0002 16.231 29.9572 16.0288 29.8733C15.8265 29.7895 15.6429 29.6666 15.4883 29.5116C14.8366 28.86 14.8366 27.8066 15.4883 27.155L22.6434 20L15.4884 12.845C14.8367 12.1934 14.8367 11.14 15.4884 10.4884C16.14 9.83672 17.1934 9.83672 17.845 10.4884L26.1784 18.8217C26.83 19.4734 26.83 20.5266 26.1784 21.1784Z"
                fill="#CD8973"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurExpertise;