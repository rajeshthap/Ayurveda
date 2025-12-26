import React, { useState, useEffect } from 'react'
import BgShape2 from '../../../assets/images/bg-shape2.png'
import BgLeaf2 from '../../../assets/images/bg-leaf2.png'
import { Link } from 'react-router-dom'

const API_BASE = 'https://mahadevaaya.com/trilokayurveda/trilokabackend'

const CareHome = () => {
  const [careData, setCareData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCareData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${API_BASE}/api/who-care-item/`, { method: 'GET' })
        if (!response.ok) throw new Error('Failed to fetch Care data')
        const result = await response.json()
        if (result.success && result.data && result.data.length > 0) {
          setCareData(result.data[0])
        } else {
          throw new Error('No Care data found')
        }
      } catch (err) {
        setError(err.message || 'Error fetching data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCareData()
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

  return (
    <div className="ayur-bgcover ayur-about-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-12 col-sm-12">
            <div className="ayur-about-img">
              {isLoading ? (
                <div style={{height: '300px', background: '#f4f4f4'}} />
              ) : careData ? (
                careData.image ? (
                  <img
                    src={`${API_BASE}${careData.image}`}
                    alt={careData.title}
                    data-tilt=""
                    data-tilt-max="10"
                    data-tilt-speed="1000"
                    data-tilt-perspective="1000"
                    style={{ willChange: 'transform' }}
                  />
                ) : (
                  <div style={{height: '300px', background: '#f4f4f4'}} />
                )
              ) : (
                <div style={{height: '300px', background: '#f4f4f4'}} />
              )}
             
            </div>
          </div>
          <div className="col-lg-8 col-md-12 col-sm-12">
            <div className="ayur-heading-wrap ayur-about-head">
              <h3>{careData ? careData.title : 'Who This Care Is For'}</h3>
              {isLoading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-danger">Error: {error}</p>
              ) : (
                <>
                  <div
                    className="mb-3"
                    dangerouslySetInnerHTML={{
                      __html: careData.description
                        ? careData.description.replace(/\r\n\r\n/g, '<br /><br />').replace(/\r\n/g, '<br />')
                        : '',
                    }}
                  />

                  {/* Modules: show truncated 20 words per module */}
                  {careData && careData.module && careData.module.length > 0 && (
                    <div className="mt-3">
                      {careData.module.map((module, idx) => {
                        const moduleTitle = module[0]
                        const moduleDescription = module[1]
                        return (
                          <div key={idx} className="mb-2">
                            <h5>{moduleTitle}</h5>
                            <p>{truncateWords(moduleDescription, 20)}</p>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <Link to="/Care" className="ayur-btn" onClick={scrollToTop}>
                    Know More
                  </Link>
                </>
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
  )
}

export default CareHome