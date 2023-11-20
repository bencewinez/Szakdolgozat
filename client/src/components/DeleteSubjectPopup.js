import React, { useRef  } from 'react'
import { FaTimes } from "react-icons/fa"
import ReactModal from 'react-modal'

const DeleteSubjectPopup = ({ isOpen, onRequestClose, subjectId  }) => {
    const form = useRef();

    const deleteSubject = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:4000/deleteSubject/${subjectId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                alert('A tantárgy sikeresen törölve!');
            } else {
                alert('Hiba a tantárgy törlése során! Próbálja meg később!');
            }
        } catch (error) {
            console.error('Hiba a folyamat során:', error);
        } finally {
            window.location.reload();
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
        <form ref={form} onSubmit={deleteSubject}>
    
        <div className="deleteProfileClose" onClick={onRequestClose}>
            <FaTimes size={25} style={{color: "#000"}}/>
        </div>
    
        <h1 className='deleteProfileh1'>Biztosan törölni szeretné a tantárgyat a meglévők közül?</h1>
        
        <input type="submit" className="btn" value="IGEN" />
        <button className="btn" onClick={onRequestClose}>MÉGSEM</button>
        </form>
    </div>
    </ReactModal>
)
}

export default DeleteSubjectPopup