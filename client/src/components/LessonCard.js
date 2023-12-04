import React from 'react';
import { NavLink } from 'react-router-dom';
import "../componentStyles/LessonCardStyles.css";

const LessonCard = (props) => {
  const { name, releaseDate, lUrlSlug, _id  } = props.lesson;
  const { userId } = props;
  console.log(_id);
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
  
      if (response.ok) {
        console.log(result.message);
      } else {
        console.error('Hiba történt a státusz frissítése során:', result.error);
      }
    } catch (error) {
      console.error('Hiba történt a státusz frissítése során:', error);
    }
  };

  return (
    <div className='lessonCard'>
      <div>
        <NavLink to={`/leckek/${lUrlSlug}`} onClick={handleClick}>
          <h3>{name}</h3>
        </NavLink>
        <p>Megjelenése: {releaseDate}</p>
      </div>
        <p>Státusz</p>
    </div>
  )
}

export default LessonCard