import React, { useContext, useState  } from 'react'
import { NavLink } from "react-router-dom"
import ReactModal from 'react-modal'
import { Navigate } from "react-router-dom"
import "../componentStyles/NavbarProfileStyles.css"
import { UserContext } from "../UserContext"

import { useHistory } from 'react-router-dom';

ReactModal.setAppElement('#root')

const NavbarProfile = ({ isOpen, onRequestClose }) => {

    const {setUserInfo, userInfo} = useContext(UserContext);
    const [redirect,setRedirect] = useState(false);

    function logout(){
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
        alert('Sikeres Kijelentkezés!');
        setRedirect(true);
    }

    const email = userInfo?.email;

    if (redirect) {
        window.location.reload();
        return<Navigate to={'/'}/>
    }

  return (
    <ReactModal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Profil"
    className="navbarProfileModal"
    overlayClassName="navbarProfileOverlay"
    >
        <div className='profileBar'>
            <ul>
                <li className='usernameLi'>
                <NavLink to="/profil">Teljes Név</NavLink>
                </li>
                <li className='mysubjectsLi'>
                <NavLink to="/sajattantargyaim">Saját Tantárgyaim</NavLink>
                </li>
                <li className='subjectsLi'>
                <NavLink to="/tantargyaim">Tantárgyaim</NavLink>
                </li>
                <li className='logoutLi'>
                <NavLink onClick={logout}>Kijelentkezés</NavLink>
                </li>
            </ul>
        </div>
    </ReactModal>
  )
}

export default NavbarProfile