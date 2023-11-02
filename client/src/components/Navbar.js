import "../componentStyles/NavbarStyles.css"
import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from "react-router-dom"
import { FaBars, FaTimes } from "react-icons/fa"
import LogoImage from "../assets/logo/logoKep.png"
import LoginForm from "./LoginForm"
import NavbarProfile from "./NavbarProfile"
import { UserContext } from "../UserContext"

const Navbar  = () => {
    const [click, setClick] = useState(false);
    const [color, setColor] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showNavbarProfile, setShowNavbarProfile] = useState(false);

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

    const handleNavbarProfileClick = () => {
        setShowNavbarProfile(true);
    }

    const closeNavbarProfileModal = () => {
        setShowNavbarProfile(false);
    }

    const {setUserInfo, userInfo} = useContext(UserContext);

    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        }).then(response => {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
            });
        });
    }, []);

    const email = userInfo?.email;
    window.addEventListener("scroll", changeColor);
    
  return (
    <div>
        {email && (
            <div className={color ? "headerProfile headerProfile-scrolling" : "headerProfile"}>
            <NavLink to="/">
                <img className="logoImage" src={ LogoImage } alt="ΣDU"/>
            </NavLink>
            <div className="hamburger2" onClick={() => {
                if(!showNavbarProfile){
                    setShowNavbarProfile(true);
                    handleClick();
                    handleNavbarProfileClick();
                } else {
                    handleClick();
                    setShowNavbarProfile(false);
                }                        
            }}>
                {click ? ( <FaTimes size={25} style={{color: "#000"}}/> ) : ( <FaBars size={25} style={{color: "#000"}}/> )}
            </div> 
            <NavbarProfile isOpen={showNavbarProfile} onRequestClose={closeNavbarProfileModal} />
            </div>
        )}

        {!email && (
            <div className={color ? "header header-scrolling" : "header"}>
            <NavLink to="/">
                <img className="logoImage" src={ LogoImage } alt="ΣDU"/>
            </NavLink>
                    <ul className={click ? "nav-menu active" : "nav-menu"}>
                          <li>
                          <NavLink onClick={handleLoginClick} className='loginBtn'>BEJELENTKEZÉS</NavLink>
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
        )}
    </div>
    
  )
}

export default Navbar

