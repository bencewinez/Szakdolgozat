import React from 'react';
import { FaAngleRight } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import '../componentStyles/SearchSubjectBarStyles.css';

const SearchSubjectBar = () => {
  const refreshPage = () => {
    window.location.reload();
  };
  return (
    <div className='searchSubjectBar'>
      <input type='text' className='searchSubjectBarInput'></input>
      <div className='searchSubjectBarRow'>
        <button className='searchBtn'>KERESÉS</button>
        <NavLink to={`/`} onClick={refreshPage}>
              <button className='searchBtn'>FRISSÍT</button>
        </NavLink>
      </div>
    </div>
  )
}

export default SearchSubjectBar