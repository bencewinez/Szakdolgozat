import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AddSubjectForm from '../components/AddSubjectForm'

const AddSubject = () => {
  return (
    <div className='default_bg'>
        <Navbar/>
        <br></br>
        <AddSubjectForm/>
        <Footer/>
    </div>
  )
}

export default AddSubject