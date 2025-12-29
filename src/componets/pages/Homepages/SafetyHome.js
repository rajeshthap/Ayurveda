import React, { useState, useEffect } from 'react'
import BgShape2 from '../../../assets/images/bg-shape2.png'
import BgLeaf2 from '../../../assets/images/bg-leaf2.png'
import { Link } from 'react-router-dom'
import "../../../assets/css/Aim.css"
const API_BASE = 'https://mahadevaaya.com/trilokayurveda/trilokabackend'

const SafetyHome = () => {
  const [safetyData, setSafetyData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSafetyData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${API_BASE}/api/safety-item/`, { method: 'GET' })
        if (!response.ok) throw new Error('Failed to fetch Safety data')
        const result = await response.json()
        if (result.success && result.data && result.data.length > 0) {
          setSafetyData(result.data[0])
        } else {
          throw new Error('No Safety data found')
        }
      } catch (err) {
        setError(err.message || 'Error fetching data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSafetyData()
  }, [])

   const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const truncateWords = (text, limit) => {
    if (!text) return ''
    const words = text.replace(/\s+/g, ' ').trim().split(' ')
    if (words.length <= limit) return text
    return words.slice(0, limit).join(' ') + '...'
  }

  // Function to strip HTML tags for subtitle
  const stripHtml = (html) => {
    if (!html) return ''
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  // Get first 15 words of description for subtitle
  const getDescriptionSubtitle = (description) => {
    const plainText = stripHtml(description)
    return truncateWords(plainText, 15)
  }

  return (
    <div className="ayur-bgcover ayur-about-sec safety-and-transparency">
      <div className="container">
        {/* Title and subtitle section - moved above and centered like OurExpertise */}
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="ayur-heading-wrap">
              <h3>{safetyData ? safetyData.title : 'Safety & Transparency'}</h3>
              <h5>{safetyData ? getDescriptionSubtitle(safetyData.description) : 'Loading...'}</h5>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4 col-md-12 col-sm-12">
            <div className="ayur-about-img">
              {isLoading ? (
                <div className='image-sty'/>
              ) : safetyData ? (
                safetyData.image ? (
                  <img
                    src={`${API_BASE}${safetyData.image}`}
                    alt={safetyData.title}
                    data-tilt=""
                    data-tilt-max="10"
                    data-tilt-speed="1000"
                    data-tilt-perspective="1000"
              
                  />
                ) : (
                  <div className='image-sty' />
                )
              ) : (
                <div className='image-sty'/>
              )}
            </div>
          </div>
          
          <div className="col-lg-8 col-md-12 col-sm-12">
            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-danger">Error: {error}</p>
            ) : (
              <>
                {/* Modules: show all modules as bullet points without word limit */}
                {safetyData && safetyData.module && safetyData.module.length > 0 && (
                  <div className="ayur-about-head">
                    <ul className="safety-module-list" >
                      {safetyData.module.map((moduleItem, idx) => (
                        <li key={idx} >
                          {moduleItem}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link to="/Safety" className="ayur-btn" onClick={scrollToTop}>
                  Know More
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="ayur-bgshape ayur-about-bgshape">
        <img src={BgShape2} alt="img" />
        <img src={BgLeaf2} alt="img" />
      </div>
    </div>
  )
}

export default SafetyHome