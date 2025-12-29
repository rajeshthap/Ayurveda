import React, { useState, useEffect } from 'react';
import '../../assets/css/blog.css';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import BgShape2 from '../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../assets/images/bg-leaf2.png';

const Blogs = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Base URL for API
  const API_BASE_URL = "https://mahadevaaya.com/trilokayurveda/trilokabackend";

  // Function to get the full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If the image path already includes the full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // If the image path starts with a slash, prepend the base URL
    if (imagePath.startsWith('/')) {
      return `${API_BASE_URL}${imagePath}`;
    }

    // Otherwise, prepend the base URL with a slash
    return `${API_BASE_URL}/${imagePath}`;
  };

  // Function to limit text to 30 words
  const limitTo30Words = (text) => {
    if (!text) return '';

    const words = text.split(' ');
    if (words.length <= 30) return text;

    return words.slice(0, 30).join(' ') + '...';
  };

  // Fetch blog posts from API
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const url = `${API_BASE_URL}/api/blog-items/`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }

        const result = await response.json();
        console.log("GET API Response:", result);

        if (result.success && result.data) {
          // Process data to format dates
          const processedPosts = result.data.map(post => {
            const processedPost = { ...post };

            // Format date field
            if (post.date) {
              const postDate = new Date(post.date);
              processedPost.formatted_date = postDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
            }

            // Add full image URL
            if (post.image) {
              processedPost.fullImageUrl = getImageUrl(post.image);
            }

            return processedPost;
          });

          setBlogPosts(processedPosts);
        } else {
          throw new Error("No blog posts found");
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setError(error.message || "An error occurred while fetching blog posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className="ayur-bgcover ayur-about-sec">
      {/* Breadcrumb Section */}
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2 className='heading-wrapper' >Blog</h2>
          <div className="ayur-bread-list">
            <span>
              <Link to="/">Home</Link>
            </span>
            <span className="ayur-active-page">/ Blog</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="ayur-heading-wrap ayur-about-head">
                  <div className="blogs-header">
                    <h4 className='heading-extend' >Blog</h4>
                    <div className='about-description'>Wellness Center and Speciality Clinic for Chronic Disorders</div>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading blog posts...</p>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger text-center">
                      Error: {error}
                    </div>
                  ) : (
                    <div className="blog-cards">
                      {blogPosts.length === 0 ? (
                        <div className="text-center my-5">
                          No blog posts found.
                        </div>
                      ) : (
                        blogPosts.map((post) => (
                          <div key={post.id} className="blog-card">
                            <div className="blog-image">
                              {post.image ? (

                                <img
                                  src={post.fullImageUrl || getImageUrl(post.image)}
                                  alt={post.title}
                                  onError={(e) => {
                                    // Fallback to a default image if the image fails to load
                                    e.target.src = '/path/to/default/image.jpg';
                                  }}
                                />
                              ) : (
                                <div className="no-image-placeholder">
                                  <span>No Image Available</span>
                                </div>
                              )}
                            </div>
                            <div className="blog-content">
                              <div className="blog-date">
                                <FaCalendarAlt className="me-2" />
                                {post.formatted_date || post.date}
                              </div>
                              <div className='ayur-tpro-text'>
                                <h3 className="">{post.title}</h3>
                              </div>
                              <p className="blog-description">
                                {limitTo30Words(post.description)}
                              </p>
                              <Link
                                to="/BlogsDetails"
                                state={{ id: post.id }}
                                className="read-more-btn"
                              >
                                Read More
                              </Link>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
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
};

export default Blogs;