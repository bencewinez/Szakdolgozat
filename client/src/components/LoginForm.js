import React, { useContext, useRef, useState  } from 'react'
import { FaTimes } from "react-icons/fa"
import ReactModal from 'react-modal'
import { Navigate } from "react-router-dom"
import "../componentStyles/LoginFormStyles.css"
import { UserContext } from '../UserContext'


const LoginForm = ({ isOpen, onRequestClose }) => {
const form = useRef();

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [redirect,setRedirect] = useState(false);
const {setUserInfo} = useContext(UserContext);

async function login(ev){
  ev.preventDefault();
  
  const response = await fetch('http://localhost:4000/login', {
    method: 'POST',
    body: JSON.stringify({email, password}),
    headers: {'Content-Type':'application/json'},
    credentials: 'include',    
  });
  if (response.ok){
    response.json().then(userInfo => {
      setUserInfo(userInfo);
      alert('Sikeres Bejelentkezés!');
      setRedirect(true);
    });
  } else {
    alert('Nem megfelelő felhasználónév vagy jelszó!');
  }
}

if (redirect) {
  return<Navigate to={'/'}/>
}

return (
  <ReactModal
  isOpen={isOpen}
  onRequestClose={onRequestClose}
  contentLabel="Bejelentkezés"
  className="loginModal"
  overlayClassName="loginOverlay"
  center
  >
    <div>
      <form ref={form} onSubmit={login}>

      <div className="loginClose" onClick={onRequestClose}>
          <FaTimes size={25} style={{color: "#000"}}/>
      </div>

      <h1 className='loginh1'>Bejelentkezés</h1>

          <label>E-mail cím:</label>
          <input type="email"
          value={email} onChange={ev => setEmail(ev.target.value)}
          required ></input>

          <label>Jelszó:</label>
          <input type="password"
          value={password} onChange={ev => setPassword(ev.target.value)}
          required></input>

          <input type="submit" class="btn" value="BEJELENTKEZEK" />

      </form>
    </div>
  </ReactModal>
  );
};

export default LoginForm;