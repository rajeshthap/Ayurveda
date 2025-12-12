import React from 'react';
import team1 from '../../assets/images/team-1.png';
import team2 from '../../assets/images/team-2.png';
import team3 from '../../assets/images/team-3.png';
import team4 from '../../assets/images/team-4.png';
import bgShape5 from '../../assets/images/bg-shape5.png';
import bgLeaf5 from '../../assets/images/bg-leaf5.png';
import { Link } from 'react-router-dom';

function OurTeam() {
  return (
    <div className="ayur-bgcover ayur-team-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="ayur-heading-wrap">
              <h5>Our Team</h5>
              <h3>Trusted &amp; Certificated Team</h3>
            </div>
          </div>
        </div>
        <div className="row">
          {/* Team Member 1 */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="ayur-team-box">
              <div className="ayur-team-img-wrapper">
                <div className="ayur-team-img">
                  <img src={team1} alt="team member 1" />
                </div>
                <div className="ayur-team-hoverimg">
                  <div className="ayur-team-hoversmall">
                    <img src={team1} alt="team member 1" />
                  </div>
                  <p>Manager</p>
                  <div className="ayur-team-sociallink">
                    <Link to="">{/* Facebook SVG */}</Link>
                    <Link to="">{/* Twitter SVG */}</Link>
                    <Link to="">{/* Github SVG */}</Link>
                    <Link to="">{/* Instagram SVG */}</Link>
                  </div>
                </div>
              </div>
              <div className="ayur-team-name">
                <h3>Esther Howard</h3>
                <p>Manager</p>
              </div>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="ayur-team-box">
              <div className="ayur-team-img-wrapper">
                <div className="ayur-team-img">
                  <img src={team2} alt="team member 2" />
                </div>
                <div className="ayur-team-hoverimg">
                  <div className="ayur-team-hoversmall">
                    <img src={team2} alt="team member 2" />
                  </div>
                  <p>Manager</p>
                  <div className="ayur-team-sociallink">
                    <Link to="">{/* Facebook SVG */}</Link>
                    <Link to="">{/* Twitter SVG */}</Link>
                    <Link to="">{/* Github SVG */}</Link>
                    <Link to="">{/* Instagram SVG */}</Link>
                  </div>
                </div>
              </div>
              <div className="ayur-team-name">
                <h3>Darlene Robertson</h3>
                <p>Manager</p>
              </div>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="ayur-team-box">
              <div className="ayur-team-img-wrapper">
                <div className="ayur-team-img">
                  <img src={team3} alt="team member 3" />
                </div>
                <div className="ayur-team-hoverimg">
                  <div className="ayur-team-hoversmall">
                    <img src={team3} alt="team member 3" />
                  </div>
                  <p>Manager</p>
                  <div className="ayur-team-sociallink">
                    <Link to="">{/* Facebook SVG */}</Link>
                    <Link to="">{/* Twitter SVG */}</Link>
                    <Link to="">{/* Github SVG */}</Link>
                    <Link to="">{/* Instagram SVG */}</Link>
                  </div>
                </div>
              </div>
              <div className="ayur-team-name">
                <h3>Robert Fox</h3>
                <p>Manager</p>
              </div>
            </div>
          </div>

          {/* Team Member 4 */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="ayur-team-box">
              <div className="ayur-team-img-wrapper">
                <div className="ayur-team-img">
                  <img src={team4} alt="team member 4" />
                </div>
                <div className="ayur-team-hoverimg">
                  <div className="ayur-team-hoversmall">
                    <img src={team4} alt="team member 4" />
                  </div>
                  <p>Manager</p>
                  <div className="ayur-team-sociallink">
                    <Link to="">{/* Facebook SVG */}</Link>
                    <Link to="">{/* Twitter SVG */}</Link>
                    <Link to="">{/* Github SVG */}</Link>
                    <Link to="">{/* Instagram SVG */}</Link>
                  </div>
                </div>
              </div>
              <div className="ayur-team-name">
                <h3>Jenny Wilson</h3>
                <p>Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Shapes */}
      <div className="ayur-bgshape ayur-team-bgshape">
        <img src={bgShape5} alt="bg shape" />
        <img src={bgLeaf5} alt="bg leaf" />
      </div>
    </div>
  );
}

export default OurTeam;
