import React, { useContext, useRef, useState  } from 'react'
import { FaTimes } from "react-icons/fa"
import ReactModal from 'react-modal'
import { Navigate } from "react-router-dom"
import { UserContext } from '../UserContext'
import "../componentStyles/DeleteProfilePopupStyles.css"

const DeleteProfilePopup = ({ isOpen, onRequestClose }) => {
const form = useRef();

const [redirect,setRedirect] = useState(false);
const {setUserInfo} = useContext(UserContext);

async function deleteProfile(ev) {
    ev.preventDefault();

    const response = await fetch('http://localhost:4000/auth/deleteProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      console.log('OK');
      setUserInfo(null);
      alert('A profil sikeresen törölve!');
      setRedirect(true);
    } else {
      alert('Hiba történt a profil törlése során!');
    }
  }

if (redirect) {
  return<Navigate to={'/'}/>
}

return (
  <ReactModal
  isOpen={isOpen}
  onRequestClose={onRequestClose}
  contentLabel="ProfilTörlés"
  className="deleteProfileModal"
  overlayClassName="deleteProfileOverlay"
  center
  >
    <div>
        <form ref={form} onSubmit={deleteProfile}>

        <div className="deleteProfileClose" onClick={onRequestClose}>
            <FaTimes size={25} style={{color: "#000"}}/>
        </div>

        <h1 className='deleteProfileh1'>Biztosan törölni szeretné a profilját?</h1>

        <input type="submit" class="btn" value="IGEN" />
        <button class="btn" onClick={onRequestClose}>MÉGSEM</button>
      </form>
    </div>
  </ReactModal>
  );
};

export default DeleteProfilePopup;