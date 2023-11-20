import React, { useState, useEffect } from 'react';
import { FaAngleRight } from "react-icons/fa";
import '../componentStyles/SearchSubjectTopics.css';
import { NavLink } from 'react-router-dom';

const SearchSubjectTopics = ({ onTopicClick }) => {
  const [subjectTopics, setSubjectTopics] = useState([]);

  useEffect(() => {
    const fetchSubjectTopics = async () => {
      try {
        const response = await fetch('http://localhost:4000/getSubjectTopics');
        if (!response.ok) {
          throw new Error('Hiba a Tantárgy Témakörök lekérdezése közben!');
        }
        const topics = await response.json();
        setSubjectTopics(topics);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSubjectTopics();
  }, []);

  const handleTopicClick = async (topic) => {
    try {
      const response = await fetch('http://localhost:4000/getSubjectTopics');
      if (!response.ok) {
        throw new Error('Hiba a Tantárgy Témakörök lekérdezése közben!');
      }
      const topics = await response.json();
      const selectedTopicObject = topics.find((t) => t.name === topic);
      onTopicClick(selectedTopicObject._id);
      window.history.replaceState(null, '', `${window.location.pathname}?page=1&topic=${selectedTopicObject._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="subjectTopicsBox">
    <h1 className='subjectTitle'>Témakörök</h1>
    <ul className='subjectTopicList'>
      <li>
      <NavLink to={`/`} onClick={refreshPage} className='subjectTopicItem'>
        <FaAngleRight size={18} style={{ color: "black" }} /><p>Összes témakör</p>
      </NavLink>
      </li>
      {subjectTopics.map((topic) => (
        <li
          key={topic._id}
          className='subjectTopicItem'
          onClick={() => handleTopicClick(topic.name)}
        >
          <FaAngleRight size={18} style={{ color: "black" }} /><p>{topic.name}</p>
        </li>
        ))}
    </ul>
</div>
  );
}

export default SearchSubjectTopics;