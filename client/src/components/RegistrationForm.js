import React, { useState, useRef  } from 'react'
import { NavLink } from "react-router-dom"
import "../componentStyles/RegistrationFormStyles.css"


const RegistrationForm = () => {
  const form = useRef();
  const [agree, setAgree] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const checkboxHandler = (e) => {
    setAgree(e.target.checked);
  }

  async function register(ev){
    ev.preventDefault();
    
      const passwordInput = form.current.password;
      const confirmPasswordInput = form.current.passwordConfirm;

      if (passwordInput.value === confirmPasswordInput.value) {
        const response = await fetch('http://localhost:4000/register', {
          method: 'POST',
          body: JSON.stringify({name, email, password, userType}),
          headers: {'Content-Type':'application/json'},
        })
        if (response.status === 200){
          alert('A regisztráció sikeres!');       
        } else {
          alert('A regisztráció sikertelen, próbálja meg újra!');
        }
      } else {
        setPasswordError('A két jelszónak meg kell egyeznie!');
      }
  }

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState(0);


  return (
    <div>
      <form ref={form} onSubmit={register}>

      <h1 className='loginh1'>Regisztráció</h1>

          <label>Név:</label>
          <input type="text" name="name"
          value={name}
          onChange={ev => setName(ev.target.value)}
          required></input>

          <label>E-mail cím:</label>
          <input type="email" name="email"
          value={email}
          onChange={ev => setEmail(ev.target.value)}
          required></input>

          <label>Jelszó:</label>
          <input type="password" name="password"
          value={password}
          onChange={ev => setPassword(ev.target.value)}
          required></input>

          <label>Jelszó megerősítése:</label>
          <input type="password" name="passwordConfirm" required></input>
          {passwordError && <p className="error">{passwordError}</p>}

          <label>Fiók típusa:</label>

          <label>Tanár <input type="radio" name="userType"
          value={1}
          onChange={() => setUserType(1)}
          required></input></label>

          <label>Tanuló <input type="radio" name="userType"
          value={0}
          onChange={() => setUserType(0)}
          required></input></label>

          <label class='checkbox_label'>
            <input class="aszfCheckbox" type="checkbox" id="agree" checked={agree} onChange={checkboxHandler} />
            <span class="aszfCheckbox" htmlFor="agree"> Elfogadom az <NavLink to="/aszf" target="_blank" class="aszfCheckbox2">Általános Szerződési Feltételek</NavLink>et és az <NavLink to="/adatvedelmi_nyilatkozat" target="_blank" class="aszfCheckbox2">Adatvédelmi Nyilatkozat</NavLink>ot.</span>
          </label>
                       

          <input type="submit" disabled={!agree} class="btn" value="REGISZTRÁLOK" />

      </form>
    </div>
  )
}

export default RegistrationForm