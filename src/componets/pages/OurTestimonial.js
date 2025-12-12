import React, { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Import all images
import TestImg1 from '../../assets/images/test-img1.png';
import TestImg2 from '../../assets/images/test-img2.png';

// React Icons (SVG replacements)
import { BiSolidQuoteRight } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function OurTestimonial() {
  const testimonials = [
    {
      id: 1,
      text: "Amet minim mollit non deserunt ullamco est sit aliqua as dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
      name: "Leslie Alexander",
      image: TestImg1
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.",
      name: "Brooklyn Simmons",
      image: TestImg2
    },
    {
      id: 3,
      text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
      name: "Jane Doe",
      image: TestImg1
    }
  ];

  return (
    <div className="ayur-bgcover ayur-testimonial-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="ayur-heading-wrap ayur-test-head">
              <h5>Our Testimonial</h5>
              <h3>What Our&nbsp;Client’s&nbsp;Say</h3>
            </div>
          </div>
        </div>

        <div className="ayur-testimonial-section">
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-button-prev',
              nextEl: '.swiper-button-next',
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 2,
              },
            }}
            className="ayur-testimonial-slider"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="ayur-test-box">
                  <div className="ayur-test-text">
                    <p>{testimonial.text}</p>
                  </div>

                  <div className="ayur-test-namesec">
                    <div className="ayur-testname">
                      <img src={testimonial.image} alt="image-photo" />
                      <h3>{testimonial.name}</h3>
                    </div>

                    <div className="ayur-testquote">
                      <BiSolidQuoteRight size={74} color="#CD8973" style={{ opacity: 0.1 }} />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Prev Button */}
          <div className="swiper-button-prev" tabIndex="0" role="button" aria-label="Previous slide">
            <IoIosArrowBack size={34} color="#797979" />
          </div>

          {/* Next Button */}
          <div className="swiper-button-next" tabIndex="0" role="button" aria-label="Next slide">
            <IoIosArrowForward size={34} color="#CD8973" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurTestimonial;