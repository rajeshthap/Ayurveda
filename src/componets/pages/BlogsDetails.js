import React, { useState, useEffect } from 'react';
import '../../assets/css/blog.css';
import { Link, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { Container, Row, Col, Card } from 'react-bootstrap';
import BgShape2 from '../../assets/images/bg-shape2.png';
import BgLeaf2 from '../../assets/images/bg-leaf2.png';

const BlogsDetails = () => {
  const location = useLocation();
  const blogId = location.state?.id; // Get ID from state passed from Blogs component
  const [blogPost, setBlogPost] = useState(null);
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

  // Fetch the specific blog post from API
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        // Try two different approaches to fetch the blog post
        let url, data;
        
        // Option 1: Try to get by ID directly (if API supports it)
        // url = `${API_BASE_URL}/api/blog-items/${blogId}`;
        
        // Option 2: Try using a query parameter (as you were attempting)
        url = `${API_BASE_URL}/api/blog-items/?id=${blogId}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Failed to fetch blog post");
        }
        
        const result = await response.json();
        console.log("GET API Response:", result);
        
        // Handle different response structures
        let postData;
        if (result.success && result.data) {
          // If the API returns an array of items, find the one with matching ID
          if (Array.isArray(result.data)) {
            postData = result.data.find(item => item.id == blogId);
          } else {
            // If it's already a single object
            postData = result.data;
          }
        } else {
          throw new Error("Blog post not found");
        }
        
        if (!postData) {
          throw new Error(`Blog post with ID ${blogId} not found`);
        }
        
        // Process data to format dates
        const processedPost = { ...postData };
        
        // Format date field
        if (processedPost.date) {
          const postDate = new Date(processedPost.date);
          processedPost.formatted_date = postDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
        
        // Format created_at date
        if (processedPost.created_at) {
          const createdDate = new Date(processedPost.created_at);
          processedPost.formatted_created_at = createdDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
        
        // Add full image URL
        if (processedPost.image) {
          processedPost.fullImageUrl = getImageUrl(processedPost.image);
        }
        
        setBlogPost(processedPost);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setError(error.message || "An error occurred while fetching the blog post");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (blogId) {
      fetchBlogPost();
    } else {
      setError("No blog post ID provided");
      setIsLoading(false);
    }
  }, [blogId]);

  return (
    <div className="ayur-bgcover ayur-about-sec">
      {/* Breadcrumb Section */}
      <div className='about-bg'>
        <div className='ayur-bread-content'>
          <h2 style={{ fontWeight: 'bold' }}>Blog Details</h2>
          <div className="ayur-bread-list">
            <span>
              <Link to="/">Home</Link>
            </span>
            <span>
              <Link to="/blog">Blog</Link>
            </span>
            <span className="ayur-active-page">/ {blogPost?.title || 'Details'}</span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="ayur-bgcover ayur-about-sec">
          <div className="container fluid about-us">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="ayur-heading-wrap ayur-about-head">
                  {isLoading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading blog post...</p>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger text-center">
                      Error loading content: {error}
                    </div>
                  ) : blogPost ? (
                    <>
                      {/* Two-column layout for image and content */}
                      <Row className="mt-4">
                        <Col lg={4} md={12} sm={12}>
                          <div className="about-image-container">
                            {blogPost.image ? (
                              <img
                                src={blogPost.fullImageUrl || getImageUrl(blogPost.image)}
                                alt={blogPost.title}
                                className="img-fluid rounded"
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
                        </Col>
                        <Col lg={8} md={12} sm={12} className="d-flex flex-column">
                          <div className="about-content text-start">
                            <h3 style={{ fontWeight: 'bold', fontSize: '2rem' }}>{blogPost.title}</h3>
                            
                            <div className="blog-detail-date mb-3">
                              <FaCalendarAlt className="me-2" />
                              {blogPost.formatted_date || blogPost.date}
                            </div>
                            
                            <div 
                              className="about-description"
                              style={{ fontSize: '1.2rem' }}
                              dangerouslySetInnerHTML={{ 
                                __html: blogPost.description.replace(/\n/g, '<br />') 
                              }}
                            />
                            

                            
                            <div className="blog-detail-actions mt-4">
                              <Link to="/Blogs" className="btn btn-outline-primary">
                                <FaArrowLeft className="me-2" />
                                Back to Blog
                              </Link>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <div className="alert alert-warning text-center">
                      Blog post not found.
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

export default BlogsDetails;