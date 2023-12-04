import React, { useEffect, useState, useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserContext } from '../UserContext';
import { FaAngleRight, FaEdit, FaRegPlusSquare } from "react-icons/fa";
import EditSubjectPopup from '../components/EditSubjectPopup';
import DeleteSubjectPopup from '../components/DeleteSubjectPopup';
import LessonCard from '../components/LessonCard';
import "../componentStyles/SubjectSite.css";

const SubjectSite = () => {
  const { urlSlug } = useParams();
  const { userInfo } = useContext(UserContext);
  const [subject, setSubject] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [subjectNotFound, setSubjectNotFound] = useState(false);
  const scrollDistanceThreshold = 140;

  useEffect(() => {
    const handleScroll = () => {
      const subscribeBtn = document.querySelector('.subscribeBtn');
      const introBar = document.querySelector('.introBar');
      const screenHeight = window.innerHeight;
      const screenWidth = window.innerWidth;

      if (subscribeBtn && introBar && screenWidth > 1100) {
        const introBarBottom = introBar.getBoundingClientRect().bottom;
        const scrollDistance = window.scrollY;

        if (introBarBottom < screenHeight && scrollDistance > scrollDistanceThreshold) {
          subscribeBtn.classList.add('fixed');
        } else {
          subscribeBtn.classList.remove('fixed');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/getSubject/${urlSlug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setSubjectNotFound(true);
          } else {
            throw new Error('Hiba a tantárgy részleteinek lekérdezése közben!');
          }
        } else {
          const subjectData = await response.json();
          setSubject(subjectData);
          setSelectedSubject(subjectData._id);
        }
      } catch (error) {
        console.error(error);
        alert('Hiba történt a tantárgy lekérdezése közben! Kérjük próbálja meg újra később!');
      }
    };
    fetchSubjectData();
  }, [urlSlug]);

  const handleSubscribe = async () => {
    try {
      const response = await fetch(`http://localhost:4000/subscribe/${urlSlug}`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        alert('Sikeres feliratkozás! Innentől megtalálható lesz az a Tantárgyak menüpontban és hozzáférhet a leckékhez is!');
        window.location.reload();
      } else if (response.status === 409) {
        alert('Erre a tárgyra már feliratkozott!');
      } else {
        throw new Error('Hiba történt a feliratkozás közben! Próbálja meg később!');
      }
    } catch (error) {
      console.error(error);
      alert('Hiba történt a feliratkozás közben! Próbálja meg később!');
    }
  };

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await fetch('http://localhost:4000/getSubjectNames', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Hiba a feliratkozott tantárgyak lekérdezése közben!');
        }
        const subscribedSubjects = await response.json();
        const isUserSubscribed = subscribedSubjects.some(
          (subscribedSubject) => subscribedSubject.urlSlug === urlSlug
        );
        setIsSubscribed(isUserSubscribed);
      } catch (error) {
        console.error(error);
      }
    };

    if (subject) {
      checkSubscription();
    }
  }, [subject, urlSlug]);

  const handleEditClick = () => {
    setIsEditPopupOpen(true);
  };

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(`http://localhost:4000/getLessons/${selectedSubject}`);
        if (!response.ok) {
          throw new Error('Hiba a leckék lekérdezése közben!');
        }
        const lessonData = await response.json();
        const currentDateTime = new Date();
        const filteredLessons = lessonData.filter((lesson) => new Date(lesson.releaseDate) <= currentDateTime);
        setLessons(filteredLessons);
      } catch (error) {
        console.error(error);
        alert('Hiba történt a leckék lekérdezése közben! Kérjük próbálja meg újra később!');
      }
    };
  
    if (selectedSubject) {
      fetchLessons();
    }
  }, [selectedSubject]);

  return (
    <div className='default_bg'>
    <Navbar />
    {subjectNotFound ? (
      <div className='introBar'>
        <div className='introBox'>
          <h1>A tantárgy nem található!</h1>
        </div>
      </div>
    ) : subject ? (
      <>
        <div className='introBar'>
          <div className='introBox'>
            <div className='topic'><FaAngleRight size={18} style={{color: "white"}}/>{subject.topic}</div>
            <p className='name'><strong>{subject.name}</strong></p>
            <p className='author'><strong>Készítette: {subject.author}</strong></p>
            {userInfo && userInfo.id === subject.authorID && (
                  <div className='edit' onClick={handleEditClick}>
                    <FaEdit size={18} style={{ color: 'white' }} />
                    <p>
                      <strong>Módosítás</strong>
                    </p>
                  </div>
            )}
            {userInfo && userInfo.id === subject.authorID && (
                  <div className='edit'>      
                      <NavLink to={`/tantargyak/${urlSlug}/ujlecke`}>
                      <p><strong>Új lecke hozzáadása</strong></p>
                      </NavLink>
                    <FaRegPlusSquare size={18} style={{ color: 'white' }} />
                  </div>
            )}
          </div>
          {!isSubscribed ? (
            <div className='subscribeBtn' onClick={handleSubscribe}>
            FELIRATKOZÁS
            </div>
          ) : (
            <div className='deleteSubjectBtn'
              onClick={() => {
              setSelectedSubject(subject._id);
              setIsDeletePopupOpen(true);
              }}>
              FELIRATKOZVA
            </div>
          )}
          <DeleteSubjectPopup isOpen={isDeletePopupOpen} onRequestClose={() => setIsDeletePopupOpen(false)} subjectId={selectedSubject}/>
        </div>
        <div className='subjectBox'>
          {subject.description && (
            <div className='descriptionBox'>
              <p className='description'><strong>Leírás:</strong></p>
              <p className='description'>{subject.description}</p>
            </div>
          )}
          {isSubscribed && subject.lessonsCount > 0 ? (
            <div className='lessonBox'>
              <p className='description'><strong>Leckék:</strong></p>
              {lessons.map((lesson) => {
                console.log(lesson);
                return (
                  <LessonCard key={lesson._id} lesson={lesson} userId={userInfo?.id} />
                );
              })}
            </div>
          ) : isSubscribed ? (
            <p className='description'>Még nem jelent meg lecke a tantárgyhoz.</p>
          ) : (
            <p className='description'>A leckék csak a tantárgy felvétele után lesznek láthatók!</p>
          )}
        </div>
      </>
    ) : (
      <>
        <div className='introBar'>
          <div className='introBox'>
            <h1>A tantárgy nem található</h1>
          </div>
        </div>
        <div className='subjectBox'></div>
      </>
    )}
    <EditSubjectPopup isOpen={isEditPopupOpen} onRequestClose={() => setIsEditPopupOpen(false)} subjectId={subject?._id} />
    <Footer />
  </div>
  );
}

export default SubjectSite;