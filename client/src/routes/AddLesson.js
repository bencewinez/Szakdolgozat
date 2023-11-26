import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import "../componentStyles/AddLessonStyles.css"

const AddLesson = () => {
  const [value, setValue] = useState('');

  const [lessonName, setLessonName] = useState('');
  const [lessonReleaseDate, setLessonReleaseDate] = useState('');

  const quillStyle = {
    height: '85vh',
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
          <button className='submitBtn'>LÉTREHOZÁS</button>
          <br></br>
        </div>
        <div className='newLessonForm'>
          <form className='newLessonForm'>
            <label>Lecke neve:</label>
            <input
            type="text"
            value={lessonName}
            onChange={ev => setLessonName(ev.target.value)}
            required>           
            </input>

            <label>Megjelenés dátuma:</label>
            <input
            type="datetime-local"
            value={lessonReleaseDate}
            onChange={ev => setLessonReleaseDate(ev.target.value)}
            required>           
            </input>
          </form>
        </div>
        <div className='newLessonBox'>
          <ReactQuill
          theme="snow"
          style={quillStyle}
          modules={modules}
          formats={formats}
          value={value}
          onChange={setValue}
          />
          <br></br>
        </div>
        <Footer />
    </div>
  )
}

export default AddLesson