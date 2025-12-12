import React from 'react';

// Import images at the top
import ProductImg1 from '../../assets/images/product-img1.jpg';
import ProductImg2 from '../../assets/images/product-img2.jpg';
import ProductImg3 from '../../assets/images/product-img3.jpg';
import Like from '../../assets/images/like.svg';
import LikeFill from '../../assets/images/like-fill.svg';
import BgShape1 from '../../assets/images/bg-shape1.png';
import BgLeaf1 from '../../assets/images/bg-leaf1.png';
import { Link } from 'react-router-dom';

function PresentationsAwards() {
  return (
    <>
      <div className="ayur-bgcover ayur-topproduct-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="ayur-heading-wrap">
                <h3>Presentations & Awards</h3>
              </div>
            </div>
          </div>
          <div className="row">
            {/* First Item */}
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="ayur-tpro-box">
                <div className="ayur-tpro-img">
                  <img src={ProductImg1} alt="img"  />
                  <div className="ayur-tpro-sale">
                    <p>Oct.2015</p>
                    <div className="ayur-tpro-like">
                      <Link to="" className="ayur-tpor-click">
                        <img src={Like} className="unlike" alt="like" />
                        <img src={LikeFill} className="like" alt="like-fill" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="ayur-tpro-text">
                  <h3>
                    <Link to="#">International Conference at TA</Link>
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

            {/* Second Item */}
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="ayur-tpro-box">
                <div className="ayur-tpro-img">
                  <img src={ProductImg2} alt="img" />
                  <div className="ayur-tpro-sale ayur-tpro-sale-off">
                    <p>16th Nov 2008</p>
                    <div className="ayur-tpro-like">
                      <Link to="" className="ayur-tpor-click">
                        <img src={Like} className="unlike" alt="like" />
                        <img src={LikeFill} className="like" alt="like-fill" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="ayur-tpro-text">
                  <h3>
                    <Link to="#">Loose Leaf Tea</Link>
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

            {/* Third Item */}
            <div className="col-lg-4 col-md-6 col-sm-6">
              <div className="ayur-tpro-box">
                <div className="ayur-tpro-img">
                  <img src={ProductImg3} alt="img" />
                  <div className="ayur-tpro-sale ayur-tpro-sale-trend">
                    <p>21st Sep 2003</p>
                    <div className="ayur-tpro-like">
                      <Link to="" className="ayur-tpor-click">
                        <img src={Like} className="unlike" alt="like" />
                        <img src={LikeFill} className="like" alt="like-fill" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="ayur-tpro-text">
                  <h3>
                    <Link to="#">World Alzheimer Day, Habitat World, N.Delhi</Link>
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
          </div>
        </div>

        {/* Background shapes */}
        <div className="ayur-bgshape ayur-tpro-bgshape">
          <img src={BgShape1} alt="img" />
          <img src={BgLeaf1} alt="img" />
        </div>
      </div>
    </>
  );
}

export default PresentationsAwards;
