import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../componentStyles/SearchSubjectBarStyles.css';

const SearchSubjectBar = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    onSearch(searchText);
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className='searchSubjectBar'>
      <input
        type='text'
        className='searchSubjectBarInput'
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <div className='searchSubjectBarRow'>
        <button className='searchBtn' onClick={handleSearch}>
          KERESÉS
        </button>
        <NavLink to={`/`} onClick={refreshPage}>
          <button className='searchBtn'>FRISSÍT</button>
        </NavLink>
      </div>
    </div>
  );
};

export default SearchSubjectBar;