import React, { useEffect, useState } from 'react';

// Background images (UNCHANGED)
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';

import '../../../assets/css/Faqs.css';
import { Link } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';

const Faqs = () => {
    // Accordion open state (UNCHANGED)
    const [openIndex, setOpenIndex] = useState(null);

    // API data state
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch FAQs from API
    useEffect(() => {
        fetch('https://mahadevaaya.com/trilokayurveda/trilokabackend/api/faq-items/')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch FAQs');
                }
                return res.json();
            })
            .then((data) => {
                // Fix: Extract the data array from the response
                if (data.success && data.data) {
                    setFaqs(data.data);
                } else {
                    throw new Error('Invalid API response format');
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Toggle FAQ item (UNCHANGED)
    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Format answer text (UNCHANGED)
    const formatAnswer = (text) => {
        if (!text) return null;
        return text.split('\n\n').map((paragraph, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ));
    };

    return (
        <div className="ayur-bgcover ayur-about-sec">
            <div className="about-bg">
                <div className="ayur-bread-content">
                    <h2 className='heading-wrapper' >FAQs</h2>
                    <div className="ayur-bread-list">
                        <span>
                            <Link to="/">Home </Link>
                        </span>
                        <span className="ayur-active-page">/ FAQs</span>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="ayur-bgcover ayur-about-sec">
                    <div className="container fluid about-us">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="ayur-heading-wrap ayur-about-head">
                                    <h3 className='ayur-about-heading-wrap' >
                                        Frequently Asked Questions:
                                    </h3>
                                    <h4 className='ayur-about-heading-wrap'>
                                        Wellness Center and Speciality Clinic for Chronic Disorders
                                    </h4>

                                    {/* Loading */}
                                    {loading && (
                                        <div className="text-center mt-4">
                                            <Spinner animation="border" />
                                        </div>
                                    )}

                                    {/* Error */}
                                    {error && (
                                        <Alert variant="danger" className="mt-4 text-center">
                                            {error}
                                        </Alert>
                                    )}

                                    {/* FAQ Accordion - Fixed to handle the module array structure */}
                                    {!loading && !error && (
                                        <div className="ayur-faq-accordion">
                                            {faqs.map((faq, index) => (
                                                <div key={faq.id || index} className="faq-item">
                                                    <div
                                                        className={`faq-question ${openIndex === index ? 'active' : ''}`}
                                                        onClick={() => toggleFAQ(index)}
                                                    >
                                                        {/* Fixed: Access the first question in the module array */}
                                                        <h4 className='heading-wrapper' >
                                                            {faq.module && faq.module.length > 0 ? faq.module[0].question : 'No question available'}
                                                        </h4>
                                                        <span className="faq-icon">
                                                            {openIndex === index ? '−' : '+'}
                                                        </span>
                                                    </div>

                                                    {openIndex === index && (
                                                        <div className="faq-answer">
                                                            {/* Fixed: Access the first answer in the module array */}
                                                            {faq.module && faq.module.length > 0 
                                                                ? formatAnswer(faq.module[0].answer)
                                                                : 'No answer available'
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Images (UNCHANGED) */}
                    <div className="ayur-bgshape ayur-about-bgshape">
                        <img src={BgShape2} alt="img" />
                        <img src={BgLeaf2} alt="img" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faqs;