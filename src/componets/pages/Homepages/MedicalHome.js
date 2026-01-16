import React, { useState, useEffect } from 'react'
import BgShape2 from '../../../assets/images/bg-shape2.png'
import BgLeaf2 from '../../../assets/images/bg-leaf2.png'
import { Link } from 'react-router-dom'
import "../../../assets/css/Aim.css"

const API_BASE = 'https://mahadevaaya.com/trilokayurveda/trilokabackend'

const MedicalHome = () => {
  const [medicalData, setMedicalData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMedicalData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${API_BASE}/api/disclaimer-item/`, { method: 'GET' })
        if (!response.ok) throw new Error('Failed to fetch Medical data')
        const result = await response.json()
        if (result.success && result.data && result.data.length > 0) {
          setMedicalData(result.data[0])
        } else {
          throw new Error('No Medical data found')
        }
      } catch (err) {
        setError(err.message || 'Error fetching data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMedicalData()
  }, [])

   const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Function to strip HTML tags for subtitle
  const stripHtml = (html) => {
    if (!html) return ''
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  return (
    <div className="ayur-bgcover ayur-about-sec call-to-action">
      <div className="container">
        {/* Title and subtitle section - moved above and centered like OurExpertise */}
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            <div className="ayur-heading-wrap">
              <h3>{medicalData ? medicalData.title : 'Medical Disclaimer'}</h3>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-4 col-md-12 col-sm-12">
            <div className="ayur-about-img">
              {isLoading ? (
                <div className='image-sty' />
              ) : medicalData ? (
                medicalData.image ? (
                  <img
                    src={`${API_BASE}${medicalData.image}`}
                    alt={medicalData.title}
                    data-tilt=""
                    data-tilt-max="10"
                    data-tilt-speed="1000"
                    data-tilt-perspective="1000"
                  />
                ) : (
                  <div className='image-sty' />
                )
              ) : (
                <div className='image-sty' />
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
                {/* Full description without truncation */}
                {medicalData && medicalData.description && (
                  <div className="ayur-about-head">
                    <p>{stripHtml(medicalData.description)}</p>
                  </div>
                )}
                
               
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

export default MedicalHome