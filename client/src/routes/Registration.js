import React from 'react'
import Navbar from '../components/Navbar'
import RegistrationForm from "../components/RegistrationForm"
import Footer from '../components/Footer'

const Registration = () => {
  return (
    <div className='registration_bg'>
        <Navbar />
        <br></br>
        <RegistrationForm />
        <Footer />
    </div>
  )
}

export default Registration