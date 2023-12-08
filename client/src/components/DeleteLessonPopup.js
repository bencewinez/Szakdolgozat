import React, { useRef  } from 'react'
import { FaTimes } from "react-icons/fa"
import ReactModal from 'react-modal'

const DeleteLessonPopup = ({ isOpen, onRequestClose, lessonId  }) => {
    const form = useRef();
    console.log(lessonId);

    const deleteLesson = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`http://localhost:4000/deleteLesson/${lessonId}`, {
            method: 'DELETE',
            credentials: 'include',
          });
    
          if (response.ok) {
            alert('A lecke sikeresen törölve!');
          } else {
            alert('Hiba a lecke törlése során! Próbálja meg később!');
          }
        } catch (error) {
          console.error('Hiba a folyamat során:', error);
        } finally {
          onRequestClose();
        }
      };

  return (
    <ReactModal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="ProfilTörlés"
    className="deleteProfileModal"
    overlayClassName="deleteProfileOverlay"
    center
    >
    <div>
        <form ref={form} onSubmit={deleteLesson}>
    
        <div className="deleteProfileClose" onClick={onRequestClose}>
            <FaTimes size={25} style={{color: "#000"}}/>
        </div>
    
        <h1 className='deleteProfileh1'>Biztosan törölni szeretné a leckét a meglévők közül?</h1>
        
        <input type="submit" className="btn" value="IGEN" />
        <button className="btn" onClick={onRequestClose}>MÉGSEM</button>
        </form>
    </div>
    </ReactModal>
  )
}

export default DeleteLessonPopup