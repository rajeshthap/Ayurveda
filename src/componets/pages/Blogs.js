import React from 'react';
import MG1 from '../../assets/images/MG1.jpg';
import MG2 from '../../assets/images/MG2.jpg';
import MG3 from '../../assets/images/MG3.jpg';
import '../../assets/css/blog.css';
import { Link } from 'react-router-dom';

const Blogs = () => {
  const blogPosts = [
    {
      id: 1,
      date: '2019-06-07',
      title: 'blog for testing second',
      description: 'Exploring the integration of traditional Ayurvedic practices with modern clinical approaches for holistic wellness.',
      image: MG1
    },
    {
      id: 2,
      date: '2019-06-08',
      title: 'blog for testing',
      description: 'Understanding the role of herbal formulations in managing chronic disorders through evidence-based research.',
      image: MG2
    },
    {
      id: 3,
      date: '2019-06-16',
      title: 'third blog for testing',
      description: 'Clinical experiences with Panchakarma therapies and their impact on lifestyle-related health conditions.',
      image: MG3
    }
  ];

  return (
    <div className="ayur-bgcover ayur-about-sec">
      {/* Breadcrumb Section */}
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2>Blog</h2>
          <div class="ayur-bread-list">
            <span>
              <Link to="/">Home</Link>
            </span>
            <span class="ayur-active-page">/ Blog</span>
          </div>
        </div>
      </div>

      <div className="blogs-container">
        <div className="blogs-header">
          <h1>Blog</h1>
          <h2>Wellness Center and Speciality Clinic for Chronic Disorders</h2>
        </div>
        
        <div className="blog-cards">
          {blogPosts.map((post) => (
            <div key={post.id} className="blog-card">
              <div className="blog-image">
                <img src={post.image} alt={post.title} />
              </div>
              <div className="blog-content">
                <div className="blog-date">{post.date}</div>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-description">{post.description}</p>
                <button className="read-more-btn">Read More</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;