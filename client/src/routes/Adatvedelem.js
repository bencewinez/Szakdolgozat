import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollUp from '../components/ScrollUp'

const Adatvedelem = () => {
  return (
    <div className='home_bg'>
      <Navbar />
      <br></br>
      <br></br>
      <br></br>
      <div className='box'>
        <div className='box_h1'>
          <h1>Adatvédelmi Nyilatkozat</h1>
          <br></br>
          <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h2>
          <br></br>
          <h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h2>
          <br></br>
          <h2>ΣDU</h2>
        </div>
      </div>
      <ScrollUp />
      <Footer />
    </div>
  )
}

export default Adatvedelem