import React, { useState, useEffect } from 'react';
import { FaArrowCircleUp } from "react-icons/fa";
import '../componentStyles/ScrollUpStyles.css'

const ScrollUp = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const threshold = 200;
  
        setIsVisible(scrollY > threshold);
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  
  return (
    <div className={`scrollArrow ${isVisible ? 'visible' : ''}`} onClick={scrollToTop}>
        <FaArrowCircleUp />
    </div>
  )
}

export default ScrollUp