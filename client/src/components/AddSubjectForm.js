import React, { useState, useRef, useEffect, useContext } from 'react'
import { NavLink } from "react-router-dom"
import { Navigate } from "react-router-dom"
import "../componentStyles/AddSubjectFormStyles.css"


const AddSubjectForm = () => {
  const form = useRef();
  const [agree, setAgree] = useState(false);
  const [subjectTopics, setSubjectTopics] = useState([]);

  const [subjectName, setSubjectName] = useState('');
  const [subjectDescription, setSubjectDescription] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/getSubjectTopics')
      .then((response) => response.json())
      .then((data) => {
        setSubjectTopics(data);
      })
      .catch((error) => {
        console.error('Hiba a Tantárgy Témakörök lekérdezésekor: ', error);
      });
  }, []);

  const checkboxHandler = (e) => {
    setAgree(e.target.checked);
  }

  const addSubject = (e) => {
    e.preventDefault();

    const name = subjectName;
    const description = subjectDescription;
    const topic = selectedTopic;

    if (!name || !description || !topic) {
      alert('Minden mezőt ki kell töltenie!');
      return;
    }
    fetch('http://localhost:4000/addSubject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        topic,
      }),
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        alert('A tantárgy sikeresen létrehozásra került, ami innentől megtalálható a Saját Tantárgyaim menüpont alatt!');
      })
      .catch((error) => {
        alert('Hiba a tantárgy létrehozása közben! Próbálja meg újra később!');
      });
  };

return (
    <div>
      <form ref={form} onSubmit={addSubject}>
        <h1 className='newSubjectH1'>Új tantárgy létrehozása</h1>
        <h2 className='newSubjectH2'>Ezen az oldalon hozhat létre új tantárgyat, melyet később akár módosíthat is.</h2>

        <label>Tantárgy neve:</label>
          <input
          type="text"
          value={subjectName}
          onChange={ev => setSubjectName(ev.target.value)}
          required>           
          </input>

        <label>Tantárgy leírása:</label>
          <textarea
          rows={6}
          placeholder="Maximum 300 karakter hosszú."
          value={subjectDescription}
          maxLength="300"
          onChange={ev => setSubjectDescription(ev.target.value)}
          required>
          </textarea>

        <label>Kategória kiválasztása:</label>

        <select name="category"
        onChange={ev => setSelectedTopic(ev.target.value)}
        required>
          <option value="">Válasszon kategóriát!</option>
          {subjectTopics.map((subjectTopic) => (
          <option key={subjectTopic._id} value={subjectTopic._id}>{subjectTopic.name}</option>
          ))}
        </select>
        
        <br></br>
        <label class='checkbox_label'>
            <input class="aszfCheckbox" type="checkbox" id="agree" checked={agree} onChange={checkboxHandler} />
            <span class="aszfCheckbox" htmlFor="agree"> Elfogadom az <NavLink to="/aszf" target="_blank" class="aszfCheckbox2">Általános Szerződési Feltételek</NavLink>et és az <NavLink to="/adatvedelmi_nyilatkozat" target="_blank" class="aszfCheckbox2">Adatvédelmi Nyilatkozat</NavLink>ot.</span>
        </label>

        <input type="submit" disabled={!agree} class="btn" value="LÉTREHOZÁS" />
      </form>
    </div>
  )
}

export default AddSubjectForm