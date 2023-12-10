
import React, { useRef, useState, useEffect } from 'react';
import { FaTimes } from "react-icons/fa";
import ReactModal from 'react-modal';
import "../componentStyles/EditSubjectPopupStyles.css"
import { useParams } from 'react-router-dom';

const EditSubjectPopup = ({ isOpen, onRequestClose, subjectId, onSubjectEdit }) => {
    const { urlSlug } = useParams();
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const form = useRef();

    useEffect(() => {
        if (urlSlug) {
            fetch(`http://localhost:4000/subjects/getSubject/${urlSlug}`)
                .then((response) => response.json())
                .then((data) => {
                    setNewName(data.name);
                    setNewDescription(data.description);
                })
                .catch((error) => {
                    console.error('Hiba a tantárgy részleteinek lekérdezésekor: ', error);
                });
        }
    }, [urlSlug]);

    const handleEditSubject = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/subjects/updateSubject/${subjectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newName,
                    description: newDescription,
                }),
                credentials: 'include',
            });
            if (response.ok) {
                alert('A tantárgy módosítása sikeres!');
                onSubjectEdit();
            } else {
                alert('Hiba a tantárgy módosítása során! Próbálja meg újra később!');
            }
        } catch (error) {
            console.error('Hiba a folyamat során:', error);
        } finally {
            onRequestClose();
        }
        window.location.reload();
    }

  return (
    <ReactModal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Tantárgy módosítása"
    className="editSubjectModal"
    overlayClassName="editSubjectOverlay"
    center
    >
    <div>
        <form ref={form} onSubmit={handleEditSubject} className='editSubjectForm'>
            <div className="editSubjectClose" onClick={onRequestClose}>
            <FaTimes size={25} style={{ color: "#000" }} />
            </div>

            <h1 className='editSubjectH1'>Tantárgy módosítása</h1>

            <label>Új név (Az url nem fog megváltozni!):</label>
            <input
            type="text"
            id="newName"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={newName}
            />

            <label>Új leírás (Maximum 300 karakter hosszú):</label>
            <textarea
            rows={6}
            placeholder={newDescription}
            value={newDescription}
            maxLength="300"
            onChange={ev => setNewDescription(ev.target.value)}
            >
            </textarea>
            <input type="submit" className="btn" value="Mentés" />
        </form>
    </div>
    </ReactModal>
  )
}

export default EditSubjectPopup;