import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaAngleRight } from "react-icons/fa"
import "../componentStyles/SubjectSite.css"

const SubjectSite = () => {
  const { urlSlug } = useParams();
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const subscribeBtn = document.querySelector('.subscribeBtn');
      const introBar = document.querySelector('.introBar');
      const screenHeight = window.innerHeight;
      const screenWidth = window.innerWidth;
      const scrollDistanceThreshold = 140;

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
          throw new Error('Hiba a tantárgy részleteinek lekérdezése közben!');
        }
        const subjectData = await response.json();
        setSubject(subjectData);
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

  return (
    <div className='default_bg'>
      <Navbar />
      {subject ? (
      <>
      <div className='introBar'>
        <div className='introBox'>
          <div className='topic'><FaAngleRight size={18} style={{color: "white"}}/>{subject.topic}</div>
          <p className='name'><strong>{subject.name}</strong></p>
          <p className='author'><strong>Készítette: {subject.author}</strong></p>
        </div>
        <div className='subscribeBtn' onClick={handleSubscribe}>FELIRATKOZÁS</div>
        <div className='introSubscribe'>

        </div>
      </div>
      </>
      ) : (
      <p>Betöltés...</p>
      )}
      <div className='subjectBox'>
        <div className='descriptionBox'>
          {subject ? (
          <>
          <p className='description'><strong>Leírás:</strong></p>
          <p className='description'>{subject.description}</p>
          </>
          ) : (
          <p>Leírás betöltése...</p>
          )}
        </div>
        <div className='lessonBox'>
          <p className='description'><strong>Leckék:</strong></p>
          <p className='description'>A leckék csak a tantárgy felvétele után lesznek láthatók!</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SubjectSite;