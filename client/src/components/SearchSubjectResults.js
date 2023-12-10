import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdFirstPage, MdLastPage, MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import SubjectCard from './SubjectCard';
import '../componentStyles/SearchSubjectTopics.css';
import '../componentStyles/SearchSubjectResultsStyles.css';

const SearchSubjectResults = ({ selectedTopic, searchText }) => {
  const [subjects, setSubjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const [maxPage, setMaxPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiUrl = `http://localhost:4000/subjects/getAllSubjects?page=${currentPage}&pageSize=${pageSize}`;
        if (selectedTopic) {
          apiUrl += `&topic=${selectedTopic}`;
        }
        const response = await fetch(apiUrl);
        const data = await response.json();
        const totalCount = data.totalCount;
        const calculatedMaxPage = Math.ceil(totalCount / pageSize);
        setMaxPage(calculatedMaxPage);
        const filteredSubjects = data.subjects.filter((subject) => {
          const { name, author, description } = subject;
          const lowerCaseSearchText = searchText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const lowerCaseName = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const lowerCaseAuthor = author.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          const lowerCaseDescription = description.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          return (
            lowerCaseName.includes(lowerCaseSearchText) ||
            lowerCaseAuthor.includes(lowerCaseSearchText) ||
            lowerCaseDescription.includes(lowerCaseSearchText)
          );
        });
        setSubjects(filteredSubjects);
      } catch (error) {
        console.error('Hiba a Tantárgyak lekérdezése közben:', error);
      }
    };

    fetchData();
  }, [currentPage, pageSize, selectedTopic, searchText]);

  const handlePageChange = (action) => {
    let newPage;
    switch (action) {
      case 'first':
        newPage = 1;
        break;
      case 'prev':
        newPage = currentPage > 1 ? currentPage - 1 : 1;
        break;
      case 'next':
        newPage = currentPage < maxPage ? currentPage + 1 : maxPage;
        break;
      case 'last':
        newPage = maxPage;
        break;
      default:
        newPage = 1;
    } 
    navigate(`${location.pathname}?page=${newPage}&pageSize=${pageSize}&topic=${selectedTopic}`);
    setCurrentPage(newPage);
  };

  return (
    <div className='resultsBox'>
      <PaginationButtons handlePageChange={handlePageChange} currentPage={currentPage} maxPage={maxPage} />
      {subjects.map((subject) => (
        <SubjectCard key={subject._id} subject={subject} />
      ))}
      <PaginationButtons handlePageChange={handlePageChange} currentPage={currentPage} maxPage={maxPage} />
    </div>
  );
};

const PaginationButtons = ({ handlePageChange, currentPage, maxPage }) => (
  <div className='pagination'>
    <MdFirstPage
      className={`paginationBtn ${currentPage === 1 ? 'disabled' : ''}`}
      size={25}
      style={{ color: currentPage === 1 ? 'green' : 'black' }}
      onClick={() => handlePageChange('first')}
      disabled={currentPage === 1}
    />
    <MdNavigateBefore
      className={`paginationBtn ${currentPage === 1 ? 'disabled' : ''}`}
      size={25}
      style={{ color: currentPage === 1 ? 'green' : 'black' }}
      onClick={() => handlePageChange('prev')}
      disabled={currentPage === 1}
    />
    <strong className='page'>{currentPage}. OLDAL</strong>
    <MdNavigateNext
      className={`paginationBtn ${currentPage === maxPage ? 'disabled' : ''}`}
      size={25}
      style={{ color: currentPage === maxPage ? 'green' : 'black' }}
      onClick={() => handlePageChange('next')}
      disabled={currentPage === maxPage}
    />
    <MdLastPage
      className={`paginationBtn ${currentPage === maxPage ? 'disabled' : ''}`}
      size={25}
      style={{ color: currentPage === maxPage ? 'green' : 'black' }}
      onClick={() => handlePageChange('last')}
      disabled={currentPage === maxPage}
    />
  </div>
);

export default SearchSubjectResults;