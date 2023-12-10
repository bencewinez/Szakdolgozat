import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserContext } from '../UserContext';
import { useParams, useNavigate  } from 'react-router-dom';
import "../componentStyles/LessonSite.css";
import ScrollUp from '../components/ScrollUp';
import 'react-quill/dist/quill.snow.css';
import "react-quill/dist/quill.core.css";

const LessonSite = () => {
  const [lessonData, setLessonData] = useState({});
  const [lessonNotFound, setLessonNotFound] = useState(false);
  const { userInfo } = useContext(UserContext);
  const { lUrlSlug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/lessons/getLesson/${lUrlSlug}`);
        if (response.ok) {
          const data = await response.json();
          const currentDateTime = new Date();
          const releaseDateTime = new Date(data.releaseDate);
          if (releaseDateTime > currentDateTime) {
            setLessonNotFound(true);
          } else {
            setLessonData(data);
          }
        } else if (response.status === 404) {
          setLessonNotFound(true);
        } else {
          console.error('Hiba történt a lekérdezés közben:', response.statusText);
        }
      } catch (error) {
        console.error('Hiba történt a lekérdezés közben:', error);
      }
    };

    fetchLessonData();
  }, [lUrlSlug]);

  const handleFinishLesson = async () => {
    try {
      const response = await fetch(`http://localhost:4000/lessons/updateLessonStatus/${userInfo.id}/${lessonData._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newStatus: 2,
        }),
        credentials: 'include',
      });

      const result = await response.json();

      if (response.ok) {
        alert('A lecke sikeresen feldolgozásra került!');
        navigate(`/`);
      } else {
        console.error('Hiba történt a státusz frissítése során:', result.error);
      }
    } catch (error) {
      console.error('Hiba történt a státusz frissítése során:', error);
    }
  };

  return (
    <div className='default_bg'>
      <Navbar />
      <div className='default_bg'>
        <div className='introBar'>
          <div className='introBox'>
            {lessonNotFound ? (
              <h1>Nem létezik a lecke</h1>
            ) : (
              <>
                <p className='subjectName'>{lessonData.subjectName}</p>
                <h1 className='lessonName'><strong>{lessonData.name}</strong></h1>
                <p className='authorName'>Szerző: {lessonData.authorName}</p>
                <p className='releaseDate'>Megjelenés: {lessonData.releaseDate}</p>
              </>
            )}
          </div>
        </div>
          <div className='contentBox'>
            <div className="view ql-editor" dangerouslySetInnerHTML={{ __html: lessonData.content }} />
            <div className='btnBox'>
              <div className='btn' onClick={handleFinishLesson}>BEFEJEZÉS</div>
            </div>
          </div>
      </div>
      <ScrollUp/>
      <Footer />
    </div>
  )
}

export default LessonSite