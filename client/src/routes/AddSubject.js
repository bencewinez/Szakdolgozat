import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AddSubjectForm from '../components/AddSubjectForm'
import ScrollUp from '../components/ScrollUp';

const AddSubject = () => {
  return (
    <div className='default_bg'>
        <Navbar/>
        <br></br>
        <AddSubjectForm/>
        <ScrollUp/>
        <Footer/>
    </div>
  )
}

export default AddSubject