import React from "react";

// Import images at the top
import AboutImg from "../../../assets/images/about-img.png";
import BgShape2 from "../../../assets/images/bg-shape2.png";
import BgLeaf2 from "../../../assets/images/bg-leaf2.png";
import Inneraboutimg from "../../../assets/images/about-img-inner.png";
import { Link } from "react-router-dom";
import { Row } from "react-bootstrap";

function Thejourney() {
  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className="about-bg">
        <div className="ayur-bread-content">
          <h2>The Journey</h2>
          <div class="ayur-bread-list">
            <span>
              <Link to="/">Home </Link>
            </span>
            <span class="ayur-active-page">/ The Journey</span>
          </div>
        </div>
      </div>

      <div className="row ">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us">
            <div className="row">
              <div className="col-lg-4 col-md-12 col-sm-12">
                <div className="ayur-about-img">
                  <img
                    src={Inneraboutimg}
                    alt="img"
                    data-tilt=""
                    data-tilt-max="10"
                    data-tilt-speed="1000"
                    data-tilt-perspective="1000"
                    style={{
                      willChange: "transform",
                      transform:
                        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-8 col-md-12 col-sm-12">
                <div className="ayur-heading-wrap ayur-about-head">
                  <h3>Trilok Ayurveda</h3>
                  <h4>
                    "Wellness Center and Speciality Clinic for Chronic
                    Disorders"
                  </h4>
                  <div>
                    <Row>
                      <h5>A Seed is sown.... and a Dream unfolds...:</h5>
                      <p>
                        .... 1993 - A young aspiring Harsh Sehgal, with a strong
                        desire to serve humanity, joins B.A.M.S. (Bachelor of
                        Ayurvedic Medicine and Surgery).
                      </p>
                      <p>
                        .... 2000 - A modest beginning with a saving of just INR
                        3,000/-(saved during his college days) led him to open
                        his first clinic in the garage of his home.
                      </p>
                      <p>
                        .... From successfully treating Alzheimer’s to
                        establishing various treatment protocols for a range of
                        Chronic Non-Communicable Disorders (CNCD’s - including
                        Auto-immune, Degenerative and Metabolic Disorders).
                      </p>
                      <p>
                        .... From treating Illness to conceptualizing varied
                        aspects of Wellness.
                      </p>
                      <p>
                        .... From a Garage to a sprawling Wellness Centre at the
                        banks of the River Ganga in Rishikesh, the ongoing
                        journey of Vaidya Harsh Sehgal has taken more than two
                        decades of persistent hard-work.... a journey both
                        Vaidya Harsh and Vaidya Jasmine Sehgal are delighted to
                        share both as professionals and life-partners, as they
                        serve humanity across the globe to bring healing and
                        wellness!
                      </p>

                      <h5>The Journey :The Dream …</h5>
                      <p>
                        From “Illness to Wellness”, “Nirvana” is the core
                        program of Trilok Ayurveda Wellness Center, nestled in
                        the quaint environs of Himalayas settled at the banks of
                        divine Ganga, dedicated to improving total health in
                        terms of mind, body and soul detoxification and
                        rejuvenation. It encompasses Yoga, Pranayam, Meditation,
                        Panchkarma, Ayurvedic Dietetics and life-style related
                        guidelines, Nadi pariksha (pulse assessment) and
                        Ayurvedic Consultations.
                      </p>
                      <p>
                        In his quest to do something innovative, young Harsh
                        chose to become a Vaidya – an Ayurvedic Physician, after
                        completing his higher secondary in 1993. Ayurveda was
                        not even considered a safe career option during those
                        days. Unpleasant and strong discouraging comments from
                        his friends and relatives started pouring in as there
                        was hardly any awareness about Ayurveda then.
                      </p>
                      <p>
                        Even within the family there were some serious doubts.
                        He being the only son, with no Ayurvedic or business
                        background, his father was very skeptical about his
                        decision of becoming a Vaidya and making a living out of
                        it. With such practical ground realities, Vaidya Harsh
                        Sehgal, after completing his bachelor’s - B.A.M.S.
                        (Bachelor of Ayurvedic Medicine and Surgery), from the
                        prestigious Sambalpur University, converted the garage
                        of his parental residence into a clinic, in Dehradun in
                        April 2000. Though he was offered a proper clinic, he
                        wanted to prove his mettle all by himself. Taking
                        blessings from his parents and with a meager amount of
                        only Rs. 3000/-, saved through five and half years of
                        his college, herbs were purchased. Medicines were
                        prepared in the backyard of his home and he started
                        practicing.
                      </p>
                      <p>
                        A famous quote by Henry David, an American author
                        inspired him-- “If you’ve built castles in the air, your
                        work need not be lost; that is where they should be……
                        Now put the foundations under them.”
                      </p>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <h5>The Beginning - Vision and Mission</h5>
                      <p>
                        During his bachelor years, Vaidya Harsh Sehgal
                        understood very well that the key to a successful
                        Ayurvedic practice is in one’s own manufacturing of
                        Ayurvedic medicines. The purpose was to provide
                        individualized precision medicines and to maintain the
                        quality always... a trait which Trilok Ayurveda followed
                        religiously till date.
                      </p>
                      <p>
                        Within the first six months of his practice the first
                        breakthrough was successfully treating Alzheimer’s, and
                        there has been no looking back ever since then. His
                        major contribution has been in the realms of many deemed
                        incurable life-threatening diseases like Cancer,
                        Hepatitis, Liver Cirrhosis and Dilated Cardio Myopathy
                        (DCMP) to debilitating disorders like Dementia, IBS, RA,
                        Autism, Avascular Necrosis (AVN), Psoriasis, Gout,
                        Sciatica, Asthma, Lumbago, and many more autoimmune,
                        degenerative and metabolic disorders.
                      </p>
                      <p>
                        Travelling far and wide, the patients have been from
                        almost every major city across the globe. Vaidya Harsh
                        Sehgal is the personal physician to the Birlas and their
                        extended family. His lucky garage has been visited by
                        many dignitaries.... from the Chief Minister to Senior
                        Bureaucrats, Army Generals to Bollywood Stars,
                        Scientists to even Doctors .… and the list goes on.
                      </p>
                      <p>
                        Invited as a resource person for the presentation of
                        evidence based clinical experience on varied subjects
                        related to CNCD’s, especially Alzheimer’s disease;
                        Vaidya Harsh Sehgal has also conducted various workshops
                        on Ayurvedic Dietetics, Yoga and Wellness programs at
                        diverse National and International forums.
                      </p>
                      <p>
                        Today he owns a sprawling Trilok Ayurveda Wellness
                        Centre at the banks of river Ganga in Rishikesh. This
                        centre has hosted an International Conference on CNCD's
                        in October 2015. It was a huge success and was attended
                        by the who’s who of the Ayurvedic Fraternity.
                      </p>
                      <p>
                        Vaidya Harsh Sehgal has been conferred with several
                        awards like the Uttarakhand Ratna Award, the
                        Technocrat’s Excellency Award, the Uttarakhand Gaurav,
                        etc. and various other felicitations followed. The work
                        done so far has extensively been covered by various
                        print and electronic media.
                      </p>
                      <h4>
                        The Vision and Mission has been very clear - finding
                        solutions to the deemed incurable diseases.
                      </h4>
                    </Row>
                  </div>

                  <div>
                    <Row>
                      <h5>About the organization –</h5>
                      <p>
                        From the concept to the delivery of the concept -
                        acquiring right knowledge and its safe and effective
                        application, collection of genuine herbs, preparation of
                        right formulations, dispensing of the right combination
                        as a part of individualized treatment with the
                        correction of diet and lifestyle issues, are the steps
                        undertaken. The notion of Wellness includes Yoga,
                        Pranayam, Meditation, Panchkarma, etc. All these aspects
                        of sickness and wellness are meticulously researched,
                        planned and then executed.
                      </p>
                      <p>
                        A team is many hands and one mind… this execution needs
                        an efficient team work. In March 2002, Vaidya Harsh
                        Sehgal was joined by Vaidya Jasmine as his professional
                        partner and life-partner. Vaidya Jasmine did her
                        bachelor’s - B.A.M.S. (Bachelor of Ayurvedic Medicine
                        and Surgery) in March 2000, from the prestigious Guru
                        Nanak Dev University, Punjab, India.
                      </p>
                      <p>
                        Life-Style corrections are a prerequisite for treatment
                        of Life-Style Disorders. An expert in Ayurvedic
                        Dietetics and Lifestyle management, Vaidya Jasmine
                        Sehgal has been instrumental in conceptualizing and
                        initiating “Trilok Ayurveda Wellness Center” nestled in
                        the quaint environs of Himalayas settled at the banks of
                        divine Ganga.
                      </p>
                    </Row>
                  </div>
                  <div>
                    <Row>
                      <h5>The Future –</h5>
                      <p>
                        Trilok Ayurveda (TA) is dedicated to providing
                        world-class herbal care in illness through Safe, Fast
                        Acting and Cost Effective treatment options and also
                        offers wellness solutions.
                      </p>
                      <p>
                        Rebellion is fundamental to innovation” is an old
                        saying; innovation only brings value when it is
                        reproducible; reproducibility is only possible through a
                        proper research methodology. Both Vaidya Harsh and
                        Vaidya Jasmine did their Masters - MD (Ayu.) in 2018 and
                        2019 respectively.
                      </p>
                      <p>
                        Based on their clinical practice spanning over a vast
                        period of more than two decades - the clinical
                        observations and results of each and every patient were
                        preserved and collected under the Black Box design. The
                        retrospective study on this clinical data highlights the
                        substantial evidence in the effective management of
                        various deemed incurable life-style diseases.
                      </p>
                      <p>
                        Recently, Vaidya Harsh Sehgal completed a clinical
                        research, prospective in style, wherein a hypothesis,
                        based on the previous studies on the various effects of
                        Kalamegha (Andrographis paniculata), was made; to assess
                        its efficacy in treating Vatarakta (Gout). The findings
                        were highly significant with p value at 5% level of
                        significance. The research is already in public domain.
                      </p>
                      <p>
                        Simultaneously, TA has plans in place to conduct
                        researches of various types, viz., literary research on
                        the practical applications of Ayurvedic principles,
                        retrospective clinical studies on Alzheimer’s and
                        Autism, observational studies regarding Ayurvedic
                        treatment protocol in the management of Dilated Cardio
                        Myopathy (DCMP), etc.
                      </p>
                      <p>
                        A practical handbook for the researchers, scientists,
                        clinicians and medical students regarding diverse
                        intrinsic and extrinsic variables and their role in
                        managing various life-style disorders is also in the
                        pipeline.
                      </p>
                    </Row>
                  </div>
                  <Link to="#" className="ayur-btn">
                    Know More
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="ayur-bgshape ayur-about-bgshape">
            <img src={BgShape2} alt="img" />
            <img src={BgLeaf2} alt="img" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Thejourney;
