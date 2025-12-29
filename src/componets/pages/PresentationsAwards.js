import React, { useEffect, useState } from 'react';

// Static images (UNCHANGED)
import Like from '../../assets/images/like.svg';
import LikeFill from '../../assets/images/like-fill.svg';
import BgShape1 from '../../assets/images/bg-shape1.png';
import BgLeaf1 from '../../assets/images/bg-leaf1.png';

import { Link } from 'react-router-dom';

const API_BASE =
  'https://mahadevaaya.com/trilokayurveda/trilokabackend';

function PresentationsAwards() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${API_BASE}/api/presentationandaward-items/`
    )
      .then((res) => res.json())
      .then((data) => {
        // ✅ IMPORTANT FIX
        setItems(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('API Error:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="ayur-bgcover ayur-topproduct-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="ayur-heading-wrap">
                <h3>Presentations & Awards</h3>
                <h5>"Recognitions and Achievements in Ayurvedic Excellence"</h5>
              </div>
            </div>
          </div>

          <div className="row row-eq-height">
            {items.map((item) => (
              <div
                className="col-lg-4 col-md-6 col-sm-6 mb-4"
                key={item.id}
              >
                <div className="ayur-tpro-box card-height-fix">
                  <div className="ayur-tpro-img">
                    <img
                      src={`${API_BASE}${item.image}`}
                      alt={item.title}
                    />

                    <div className="ayur-tpro-sale">
                 
                        {new Date(item.date).toLocaleDateString(
                          'en-IN',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                     

                      <div className="ayur-tpro-like">
                        <Link
                          to=""
                          className="ayur-tpor-click"
                        >
                          <img
                            src={Like}
                            className="unlike"
                            alt="like"
                          />
                          <img
                            src={LikeFill}
                            className="like"
                            alt="like-fill"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="ayur-tpro-text">
                    <h3>
                      <Link to="#">
                        {item.title}
                      </Link>
                    </h3>

                    <div className="ayur-tpro-price"></div>

                    <div className="ayur-tpro-btn">
                      <Link to="#" className="ayur-btn">
                        <span>read more</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Optional: No data fallback */}
            {!loading && items.length === 0 && (
              <div className="text-center">
                <p>No presentations available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Background shapes (UNCHANGED) */}
        <div className="ayur-bgshape ayur-tpro-bgshape">
          <img src={BgShape1} alt="img" />
          <img src={BgLeaf1} alt="img" />
        </div>
      </div>
    </>
  );
}

export default PresentationsAwards;