import "../componentStyles/NavbarStyles.css"
import { NavLink } from "react-router-dom"
import { FaBars, FaTimes } from "react-icons/fa"
import LogoImage from "../assets/logo/logoKep.png"
import LoginForm from "./LoginForm"

import React, { useState } from 'react'

const Navbar  = () => {

    const [click, setClick] = useState(false);
    const [color, setColor] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const handleClick = () => setClick(!click);
    const changeColor = () => {
        if (window.scrollY >= 100) {
            setColor(true);
        } else {
            setColor(false);
        }
    }

    const handleLoginClick = () => {
        setShowLogin(true);
    }

    const closeLoginModal = () => {
        setShowLogin(false);
    }

    window.addEventListener("scroll", changeColor);
    
  return (
     <div className={color ? "header header-scrolling" : "header"}>
        <NavLink to="/">
            <img className="logoImage" src={ LogoImage } alt="ΣDU"/>
        </NavLink>
        <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li>
                <NavLink onClick={handleLoginClick}>BEJELENTKEZÉS</NavLink>
            </li>
            <li>
                <NavLink to="/regisztracio" activeClassName="active">REGISZTRÁCIÓ</NavLink>
            </li>
        </ul>
        <div className="hamburger" onClick={handleClick}>
            {click ? ( <FaTimes size={25} style={{color: "#000"}}/> ) : ( <FaBars size={25} style={{color: "#000"}}/> )}
        </div>
        <LoginForm isOpen={showLogin} onRequestClose={closeLoginModal} />
    </div>
  )
}

export default Navbar

