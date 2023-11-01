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
    <div className={color ? "header header-scrolling" : "header"}>
        <NavLink to="/">
            <img className="logoImage" src={ LogoImage } alt="ΣDU"/>
        </NavLink>
        {!email && (
            <>
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
            </>
        )}

        {email && (
            <>
                <ul className={click ? "nav-menu active" : "nav-menu"}>
                    <li>
                    <NavLink onClick={handleNavbarProfileClick} className="profileBtn">PROFIL</NavLink>
                    </li>
                </ul>
            </>
        )}
        <LoginForm isOpen={showLogin} onRequestClose={closeLoginModal} />
        <NavbarProfile isOpen={showNavbarProfile} onRequestClose={closeNavbarProfileModal} />
    </div>

  )
}

export default Navbar

