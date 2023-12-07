import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollUp from '../components/ScrollUp'

const NotFound = () => {
  return (
    <div className='home_bg'>
      <Navbar />
      <div className='service_h1'>
        <h1>Az oldal nem található.</h1>
      </div>
      <ScrollUp/>
      <Footer />
    </div>
  )
}

export default NotFound