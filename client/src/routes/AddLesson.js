import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollUp from '../components/ScrollUp';
import "../componentStyles/AddLessonStyles.css";

const AddLesson = () => {
  const [value, setValue] = useState('');

  const [lessonName, setLessonName] = useState('');
  const [lessonReleaseDate, setLessonReleaseDate] = useState('');
  const [subjectUrlSlug, setSubjectUrlSlug] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const urlParts = window.location.pathname.split('/');
    const foundSlugIndex = urlParts.findIndex(part => part === 'tantargyak');
    
    if (foundSlugIndex !== -1 && urlParts.length > foundSlugIndex + 1) {
      setSubjectUrlSlug(urlParts[foundSlugIndex + 1]);
    }
  }, []);

  const handleCreateLesson = async () => {
    if (!lessonName || !lessonReleaseDate || !value) {
      alert('Minden mezőt ki kell töltenie!');
      return;
    }
    const currentDate = new Date().toISOString().slice(0, 16).replace("T", " ");
    if (lessonReleaseDate < currentDate) {
      alert('A megjelenés dátuma nem lehet korábbi a jelenlegi időpontnál!');
      return;
    }
    try {
      const response = await fetch(`http://localhost:4000/lessons/createLesson/${subjectUrlSlug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          lessonName,
          lessonReleaseDate,
          value,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        alert('A lecke sikeresen létre lett hozva, mely a tantárgy oldalán megjelenik a kiválasztott időpontban!');
        navigate(`/tantargyak/${encodeURIComponent(subjectUrlSlug)}`);
      } else {
        const errorData = await response.json();
        if (errorData.error === 'Ez a lecke név már létezik!') {
          alert('Már létezik lecke ezzel a névvel a tantárgyhoz, kérjük módosítsa azt!');
        } else {
          console.error('Hiba a lecke létrehozása során:', response.statusText);
          alert('Hiba a lecke létrehozása során! Próbálja meg később!');
        }
      }
    } catch (error) {
      console.error('Hiba a lecke létrehozása során:', error);
      alert('Hiba a lecke létrehozása során! Próbálja meg később!');
    }
  };

  const modules = {
    toolbar: [
      [{ 'font': ['sans', 'serif', 'monospace'] }],               // Font
      [{ 'size': ['small', false, 'large', 'huge'] }],            // Size
      ['bold', 'italic', 'underline', 'strike'],                  // Inline
      [{ 'color': [] }, { 'background': [] }],                    // Color, Background Color
      [{ 'script': 'sub' }, { 'script': 'super' }],               // Superscript/Subscript
      ['image', 'video'],                                         // Image, Video
      ['link'],                                                   // Link

      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                  // Header
      [{ 'align': [] }],                                          // Text Alignment
      [{ 'blockquote': 'blockquote' }],                           // Block
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],              // List
      [{ 'code-block': 'code-block' }],                           // Code Block
      ['clean'],                                                  // Clear Formatting
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image', 'video',
    'color', 'background',
    'font',
    'size',
    'script',
    'align',
    'code-block',
  ];

  return (
    <div className='default_bg'>
        <Navbar />
        <div className='newLessonBoxIntro'>
          <h1>Új lecke hozzáadása</h1>
          <h5>Stílus visszavonásához jelölje ki a területet és kattintson az utolsó 'Tx' gombra!</h5>
          <button className='submitBtn' onClick={handleCreateLesson}>LÉTREHOZÁS</button>
          <br></br>
        </div>
        <div className='newLessonForm'>
          <form className='newLessonForm'>
            <label>Lecke neve:</label>
            <input
            type="text"
            value={lessonName}
            onChange={ev => setLessonName(ev.target.value)}
            >           
            </input>

            <label>Megjelenés dátuma:</label>
            <input
            type="datetime-local"
            value={lessonReleaseDate}
            onChange={ev => setLessonReleaseDate(ev.target.value)}
            >           
            </input>
          </form>
        </div>
        <div className='newLessonBox'>
          <ReactQuill
          theme="snow"
          /* style={quillStyle} */
          modules={modules}
          formats={formats}
          value={value}
          onChange={setValue}
          />
          <br></br>
        </div>
        <ScrollUp/>
        <Footer />
    </div>
  )
}

export default AddLesson