import React, { useState, useRef, useEffect  } from 'react'
import { NavLink } from "react-router-dom"
import { Navigate } from "react-router-dom"
import "../componentStyles/AddSubjectFormStyles.css"


const AddSubjectForm = () => {
  const form = useRef();
  const [agree, setAgree] = useState(false);

  const checkboxHandler = (e) => {
    setAgree(e.target.checked);
  }

return (
    <div>
      <form ref={form} /* onSubmit={addSubject} */>
        <h1 className='newSubjectH1'>Új tantárgy létrehozása</h1>
        <h2 className='newSubjectH2'>Ezen az oldalon hozhat létre új tantárgyat, melyet később akár módosíthat is.</h2>

        <label>Tantárgy neve:</label>
          <input
          type="text"
          name="name"

          required>           
          </input>

        <label>Tantárgy leírása:</label>
          <textarea
          rows={6}
          placeholder="Maximum 300 karakter hosszú."
          name="description"
          maxLength="300"
          required>

          </textarea>

        <label>Kategória kiválasztása:</label>

        <select name="category" required>
          <option value="">Válasszon kategóriát!</option>

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