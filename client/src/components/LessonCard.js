import React from 'react';
import { NavLink } from 'react-router-dom';
import "../componentStyles/LessonCardStyles.css";

const LessonCard = (props) => {
    const { name, releaseDate, lUrlSlug } = props.lesson;
    
  return (
    <div className='lessonCard'>
        <NavLink to={`/leckek/${lUrlSlug}`}>
            <h3>{name}</h3>
        </NavLink>
        <p>Megjelenése: {releaseDate}</p>
    </div>
  )
}

export default LessonCard