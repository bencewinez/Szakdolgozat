import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import "../componentStyles/LessonSite.css";

const LessonSite = () => {
  const [lessonData, setLessonData] = useState({});
  const [lessonNotFound, setLessonNotFound] = useState(false);
  const { lUrlSlug } = useParams();

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/getLesson/${lUrlSlug}`);
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
            <div dangerouslySetInnerHTML={{ __html: lessonData.content }} />
          </div>
      </div>
      <Footer />
    </div>
  )
}

export default LessonSite