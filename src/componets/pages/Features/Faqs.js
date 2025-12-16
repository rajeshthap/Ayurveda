import React, { useState } from 'react';

// Import only the necessary background images
import BgShape2 from '../../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../../assets/images/bg-leaf2.png';
import '../../../assets/css/Faqs.css';
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap';

const Faqs = () => {
    // State to track open FAQ items
    const [openIndex, setOpenIndex] = useState(null);

    // FAQ data with formatted answers
    const faqs = [
        {
            question: "How does Ayurveda work?",
            answer: "The body has certain rhythms, similar to nature. When these rhythms are balanced the body is healthy; when they are imbalanced the body becomes sick. Dosha, biological force or humor, constitution, Prakriti or nature, governs this system. Dosha is the 'password' of your body; once you understand your unique password you will be able to understand how your body works and how to keep it."
        },
        {
            question: "Why Ayurveda?",
            answer: "Ayurveda is a holistic approach. It takes body, mind and soul into consideration, instead of focusing on physical body. Medicines given are prepared from herbs (natural plants). Therefore, they have no side effects. Seeing is believing!"
        },
        {
            question: "What are the different types of Doshas?",
            answer: "Dosha is a Sanskrit word meaning the one which can pollute the body. There are three main types of Doshas and all three are needed to maintain balance in the body. If one is too high or too low, it causes imbalance. This aggravation is called Vikriti and the balance is called Prakriti. The three Doshas are as follows:\n\n<strong>Vata</strong> | The air type - This means all movements in the body and mind, for example, breathing, heartbeat, elimination, pulsation, blood circulation and thinking. These are all due to air. Our body weight is due to air and the pressure it creates on our bodies. When the air element is too high all of the things listed above will increase and the person will become sick or mentally imbalanced.\n\n<strong>Pitta</strong> | The fire / heat type - This is responsible for the metabolism and digestion in the body. Without adequate heat, your food cannot be properly digested and will become toxic in your system. Pitta dosha is also responsible for keeping the body warm.\n\n<strong>Kapha</strong> | The water type - Our body is made up of 70% water and this is controlled by Kapha Dosha. It is also responsible for lubrication in the body and provides stability. Lubrication is needed in the joints, skin and mouth. According to this people are called Vata type, Pitta type or Kapha type. Everybody is composed of all three doshas; if one of them is predominant the person is called mono-doshic. If two are predominant it is called bi-doshic and if all three are dominant then it is called tri-doshic or mixed."
        },
        {
            question: "What is ama (toxin as per Ayurveda)?",
            answer: "Ama is the by-product / waste material of metabolism that can be in any form: solid, liquid or gas. The body is like a factory, which manufactures a variety of things and produces a range of products. During the process of manufacturing waste products are naturally formed which should be eliminated. If they keep accumulating, disease process results."
        },
        {
            question: "When should an Ayurvedic Practitioner be consulted?",
            answer: "A person can consult a Practitioner at any time whether sick or not. If they are in a state of imbalance, medicine can be prescribed. If the person is healthy they can be advised on how to keep their body in a balanced state and according to their prakriti be told in what ways their body may react if the balance is not kept."
        },
        {
            question: "How long does it take to return to health?",
            answer: "A person can consult a Practitioner at any time whether sick or not. If they are in a state of imbalance, medicine can be pThis depends on the individual condition, severity of the illness and how long the person has had it. After dietary and herbal preparations have been given, feedback is needed to assess how long the whole process will take."
        },
        {
            question: "Are there any side effects to Ayurvedic medicine?",
            answer: "Generally it has been seen that there are no side effects, however if the dose is high some discomfort may be felt. Ayurvedic medicine has many positive effects; it can indirectly help with other conditions apart from the one being treated. This is because the herbs have been chosen due to fundamental principles of the body."
        },
        {
            question: "What is Yoga?",
            answer: "Yoga is a science of healthy living. It is a combination of physical, mental and spiritual practices that originated in ancient India. The word 'yoga' means union, referring to the union of body, mind and spirit. Yoga includes various techniques such as postures (asanas), breathing exercises (pranayama), meditation (dhyana) and ethical principles (yamas and niyamas) to promote overall well-being and harmony."
        },
        {
            question: "Does it matter that I'm not very flexible? ",
            answer: "Not at all! Yoga is for everyone, regardless of flexibility levels. The practice focuses on gradual improvement and finding comfort in each pose. With regular practice, flexibility and strength will naturally increase over time."

        },
        {
            question: "What is Sirodhara?",
            answer: "Sirodhara is a traditional Ayurvedic therapy that involves gently pouring a continuous stream of warm herbal oil or other therapeutic liquids onto the forehead, specifically the 'third eye' area. This treatment is known for its calming and rejuvenating effects on the mind and body, helping to reduce stress, anxiety, and promote deep relaxation."
        },
       
    ];

    // Toggle FAQ item
    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Function to format answer text with line breaks and bold text
    const formatAnswer = (text) => {
        return text.split('\n\n').map((paragraph, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ));
    };

    return (
        <div className="ayur-bgcover ayur-about-sec">
            <div className='about-bg'>
                <div className='ayur-bread-content'>
                    <h2 style={{ fontWeight: 'bold' }}>FAQs</h2>
                    <div class="ayur-bread-list">
                        <span>
                            <a href="index.html">Home </a>
                        </span>
                        <span class="ayur-active-page">/ FAQs</span>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="ayur-bgcover ayur-about-sec">
                    <div className="container fluid about-us">
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="ayur-heading-wrap ayur-about-head">
                                    <h3 style={{ fontWeight: 'bold', textAlign: 'center' }}>Frequently Asked Questions: </h3>
                                    <h4 style={{ fontWeight: 'bold', textAlign: 'center' }}>Wellness Center and Speciality Clinic for Chronic Disorders</h4>

                                    {/* FAQ Accordion */}
                                    <div className="ayur-faq-accordion">
                                        {faqs.map((faq, index) => (
                                            <div key={index} className="faq-item">
                                                <div
                                                    className={`faq-question ${openIndex === index ? 'active' : ''}`}
                                                    onClick={() => toggleFAQ(index)}
                                                >
                                                    <h4 style={{ fontWeight: 'bold' }}>{faq.question}</h4>
                                                    <span className="faq-icon">
                                                        {openIndex === index ? '−' : '+'}
                                                    </span>
                                                </div>
                                                {openIndex === index && (
                                                    <div className="faq-answer">
                                                        {formatAnswer(faq.answer)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

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

export default Faqs;