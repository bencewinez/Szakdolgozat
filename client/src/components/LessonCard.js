import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import DeleteLessonPopup from './DeleteLessonPopup';
import "../componentStyles/LessonCardStyles.css";

const LessonCard = (props) => {
  const { name, releaseDate, lUrlSlug, _id  } = props.lesson;
  const { userId } = props;
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);

  const handleClick = async () => {
    try {
      const response = await fetch(`http://localhost:4000/updateLessonStatus/${userId}/${_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newStatus: 1,
        }),
        credentials: 'include',
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error('Hiba történt a státusz frissítése során:', result.error);
      }
      
    } catch (error) {
      console.error('Hiba történt a státusz frissítése során:', error);
    }
  };

  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchLessonStatus = async () => {
      try {
        const response = await fetch(`http://localhost:4000/getLessonStatus/${userId}/${_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const result = await response.json();

        if (response.ok) {
          setStatus(result.status);
        } else {
          console.error('Hiba történt a státusz lekérdezése során:', result.error);
        }
      } catch (error) {
        console.error('Hiba történt a státusz lekérdezése során:', error);
      }
    };

    fetchLessonStatus();
  }, [userId, _id]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return 'Új lecke';
      case 1:
        return 'Folyamatban';
      case 2:
        return 'Feldolgozva';
      default:
        return 'Státusz';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return 'statusNew';
      case 1:
        return 'statusInProgress';
      case 2:
        return 'statusFinished';
      default:
        return 'statusNew';
    }
  };

  return (
    <div className={`lessonCard ${getStatusClass(status)}`}>
      <div>
        <FaTrash onClick={() => setDeletePopupOpen(true)} style={{ cursor: 'pointer' }} />
        <NavLink to={`/leckek/${lUrlSlug}`} onClick={handleClick}>
          <h3>{name}</h3>
        </NavLink>
        <h6>Megjelenése: {releaseDate}</h6>
      </div>
      <p>{getStatusLabel(status)}</p>
        {deletePopupOpen && (
        <DeleteLessonPopup
          isOpen={deletePopupOpen}
          onRequestClose={() => setDeletePopupOpen(false)}
          lessonId={_id}
        />
        )}
    </div>
  )
}

export default LessonCard