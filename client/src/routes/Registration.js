import React from 'react'
import Navbar from '../components/Navbar'
import RegistrationForm from "../components/RegistrationForm"
import Footer from '../components/Footer'
import ScrollUp from '../components/ScrollUp'

const Registration = () => {
  return (
    <div className='default_bg'>
        <Navbar />
        <br></br>
        <RegistrationForm />
        <ScrollUp/>
        <Footer />
    </div>
  )
}

export default Registration