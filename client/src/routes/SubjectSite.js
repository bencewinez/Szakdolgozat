import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../componentStyles/SubjectSite.css"

const SubjectSite = () => {
  const { urlSlug } = useParams();
  const [subject, setSubject] = useState(null);

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

  return (
    <div>
        <Navbar />     
        {subject ? (
        <>
        <div className='introBar'>
            <div className='introBox'>
                <p className='topic'>{subject.topic}</p>
                <p className='author'>{subject.author}</p>
                <h1>{subject.name}</h1>
                <p className='description'>{subject.description}</p>
            </div>
        </div>
        </>
        ) : (
        <p>Betöltés...</p>
        )}
        <div className='subjectBox'>

        </div>   
        <Footer />
    </div>
  );
}

export default SubjectSite;