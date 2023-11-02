import React from 'react'
import Navbar from '../components/Navbar'
import EditProfileForm from "../components/EditProfileForm"
import Footer from '../components/Footer'

const Profile = () => {
  return (
    <div className='default_bg'>
        <Navbar />
        <br></br>
        <EditProfileForm />
        <Footer />
    </div>
  )
}

export default Profile