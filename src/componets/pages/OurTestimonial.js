import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/testinomials.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// React Icons
import { BiSolidQuoteRight } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function OurTestimonial() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //   refs for navigation
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(
          'https://mahadevaaya.com/trilokayurveda/trilokabackend/api/testimonials-items/'
        );
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
      <div className="ayur-bgcover ayur-testimonial-sec" id="testimonial-section">
        <div className="container">
          <p>Loading testimonials...</p>
        </div>
      </div>
    );
  }

  const baseURL = 'https://mahadevaaya.com/trilokayurveda/trilokabackend';

  // Function to truncate text to a specific character count
  const truncateText = (text, charLimit = 150) => {
    if (text.length <= charLimit) return text;
    return text.substring(0, charLimit) + '...';
  };

  const handleReadMore = (id) => {
    navigate(`/testimonial-details/${id}`);
  };

  return (
    <div className="ayur-bgcover ayur-testimonial-sec" id="testimonial-section">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="ayur-heading-wrap ayur-test-head">
              <h3>Patient Testimonial</h3>
              <h5>What Our Client’s Say</h5>
            </div>
          </div>
        </div>

        <div className="ayur-testimonial-section">
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 2 },
            }}
            className="ayur-testimonial-slider"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="ayur-test-box">
                  <div className="ayur-test-text">
                    <p>{truncateText(testimonial.description, 150)}</p>
                  </div>

                  <div className="ayur-test-button-sec">
                    <button 
                      className="ayur-readmore-btn"
                      onClick={() => handleReadMore(testimonial.id)}
                    >
                      Read More
                    </button>
                  </div>

                  <div className="ayur-test-namesec">
                    <div className="ayur-testname">
                      <img
                        src={`${baseURL}${testimonial.image}`}
                        alt={testimonial.full_name}
                      />
                      <h3>{testimonial.full_name}</h3>
                    </div>

                    <div className="ayur-testquote">
                      <BiSolidQuoteRight
                        size={74}
                        color="#CD8973"
                        className='ayur-testquoteright'
                        
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            {/*Navigation buttons INSIDE swiper */}
            <div ref={prevRef} className="swiper-button-prev">
              <IoIosArrowBack size={34} color="#797979" />
            </div>

            <div ref={nextRef} className="swiper-button-next">
              <IoIosArrowForward size={34} color="#CD8973" />
            </div>
          </Swiper>
        </div>
      </div>
    </div>
  );
}

export default OurTestimonial;
