import React, { useContext, useEffect, useState, useRef  } from 'react'
import { NavLink } from "react-router-dom"
import { UserContext } from "../UserContext"
import "../componentStyles/EditProfileFormStyles.css"
import DeleteProfilePopup from './DeleteProfilePopup'

const EditProfileForm = () => {

    const formData = useRef();
    const formPassword = useRef();
    const formDeleteProfile = useRef();
    const {userInfo, setUserInfo} = useContext(UserContext);
    const [userAttributes, setUserAttributes] = useState({});

    const [newName, setnewName] = useState('');
    const [newEmail, setnewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showDeleteProfilePopup, setShowDeleteProfilePopup] = useState(false);

    const handleDeleteProfilePopup = (e) => {
        e.preventDefault();
        setShowDeleteProfilePopup(true);
    }

    const closeDeleteProfilePopupModal = () => {
        setShowDeleteProfilePopup(false);
    }

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

    async function editData(ev){
        ev.preventDefault();
        const response = await fetch('http://localhost:4000/changeData', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify({newName, newEmail}),
            headers: {'Content-Type':'application/json'},
        })
        if (response.status === 200) {
            alert('Az adat módosítás sikeres!');
        } else if (response.status === 402) {
            alert('A megadott e-mail cím már foglalt!');
        } else {
            alert('Az adat(ok) módosítása sikertelen, próbálja meg újra!');
        }
    }

    async function editPassword(ev){
        ev.preventDefault();
        
        const newPasswordInput = formPassword.current.newPassword;
        const confirmPasswordInput = formPassword.current.confirmPassword;

        if (newPasswordInput.value === confirmPasswordInput.value) {
            const response = await fetch('http://localhost:4000/changePassword', {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify({currentPassword, newPassword}),
                headers: {'Content-Type':'application/json'},
            })
            if (response.status === 200) {
                alert('A jelszó módosítása sikeres!');
            } else if (response.status === 400) {
                alert('A meglévő jelszó helytelen, próbálja meg újra!');
            } else {
                alert('A jelszó módosítása sikertelen, próbálja meg újra!');
            }
        } else {
            alert('A két új jelszónak meg kell egyeznie!');
        }
    }

    return (
    <div>
        <form ref={formData} onSubmit={editData}>
            <h1 className='regh1'>Alap adatok</h1>
            <h2 className='regh2'>A kívánt adat(ok) módosítása után kattintson a "MÓDOSÍTOK" gombra!</h2>

            <label>Név:</label>
            <input type="text" name="name"
            placeholder={userAttributes.name}
            value={newName}
            onChange={ev => setnewName(ev.target.value)}></input>

            <label>E-mail cím:</label>
            <input type="email" name="email"
            placeholder={userAttributes.email}
            value={newEmail}
            onChange={ev => setnewEmail(ev.target.value)}></input>             

            <input type="submit" className="btn" value="MÓDOSÍTOK" />
        </form>

        <form ref={formPassword} onSubmit={editPassword}>
            <h1 className='regh1'>Jelszó módosítása</h1>

            <label>Régi jelszó:</label>
            <input type="password" name="password"
            value={currentPassword}
            onChange={ev => setCurrentPassword(ev.target.value)}
            required></input>

            <label>Új jelszó:</label>
            <input type="password" name="newPassword"
            value={newPassword}
            onChange={ev => setNewPassword(ev.target.value)}
            required></input>

            <label>Új jelszó megerősítése:</label>
            <input type="password" name="confirmPassword" onChange={ev => setConfirmPassword(ev.target.value)}></input>         

            <input type="submit" className="btn" value="MÓDOSÍTOK"/>
        </form>

        <form ref={formDeleteProfile}>
            <h1 className='regh1'>Profil törlése</h1>    
            <h2 className='regh2'>FIGYELEM! A profil törlése esetén minden felvett tantárgyat elveszít!</h2>
            <button onClick={handleDeleteProfilePopup} className="btn">PROFIL TÖRLÉSE</button>
        </form>
        <DeleteProfilePopup isOpen={showDeleteProfilePopup} onRequestClose={closeDeleteProfilePopupModal} />
    </div>
  )
}

export default EditProfileForm