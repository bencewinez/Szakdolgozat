import React, { useContext, useState, useEffect  } from 'react'
import { NavLink } from "react-router-dom"
import ReactModal from 'react-modal'
import { Navigate } from "react-router-dom"
import { UserContext } from "../UserContext"
import "../componentStyles/NavbarProfileStyles.css"

ReactModal.setAppElement('#root')

const NavbarProfile = ({ isOpen, onRequestClose }) => {

    const {setUserInfo, userInfo} = useContext(UserContext);
    const [redirect,setRedirect] = useState(false);
    const [userAttributes, setUserAttributes] = useState({});

    useEffect(() => {
        if (userInfo) {
            fetchUserProfile();
        }
    }, [userInfo]);
    
    const fetchUserProfile = () => {
        fetch('http://localhost:4000/userProfile', {
            credentials: 'include',
        })
        .then((response) => response.json())
        .then((data) => {
            setUserAttributes(data);
        })
        .catch((error) => {
            console.error('Hiba a felhasználó lekérése közben: ', error);
        });
    };

    function logout(){
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
        alert('Sikeres Kijelentkezés!');
        setRedirect(true);
    }

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
                <p>{userAttributes.name}</p>
                </li>
                <li>
                <NavLink to="/profil" className='usernameLia'><p className='usernameLia'>Profilom</p></NavLink>
                </li>
                <li className='mysubjectsLi'>
                <NavLink to="/sajattantargyaim" className='mysubjectsLia'><p className='mysubjectsLia'>Saját Tantárgyaim</p></NavLink>
                </li>
                <li className='subjectsLi'>
                <NavLink to="/tantargyaim" className='subjectsLia'><p className='subjectsLia'>Tantárgyaim</p></NavLink>
                </li>
                <li className='logoutLi'>
                <NavLink onClick={logout} className='logoutLia'><p className='logoutLia'>Kijelentkezés</p></NavLink>
                </li>
            </ul>
        </div>
    </ReactModal>
  )
}

export default NavbarProfile