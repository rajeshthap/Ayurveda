import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// React Icons (SVG replacements)
import { BiSolidQuoteRight } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function OurTestimonial() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('https://mahadevaaya.com/trilokayurveda/trilokabackend/api/testimonials-items/');
        const result = await response.json();

        if (result.success) {
          setTestimonials(result.data);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
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
            <p>Loading testimonials...</p>
          </div>
        </div>
      </div>
    );
  }

  const baseURL = 'https://mahadevaaya.com/trilokayurveda/trilokabackend';

  return (
    <div className="ayur-bgcover ayur-testimonial-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="ayur-heading-wrap ayur-test-head">
              <h3>Our Testimonial</h3>
              <h5>What Our&nbsp;Client’s&nbsp;Say</h5>
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
                    <p>{testimonial.description}</p>
                  </div>

                  <div className="ayur-test-namesec">
                    <div className="ayur-testname">
                      <img
                        src={`${baseURL}${testimonial.image}`}
                        alt={`${testimonial.full_name}-photo`}
                      />
                      <h3>{testimonial.full_name}</h3>
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