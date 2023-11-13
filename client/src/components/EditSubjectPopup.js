
import React, { useRef, useState, useEffect } from 'react';
import { FaTimes } from "react-icons/fa";
import ReactModal from 'react-modal';
import "../componentStyles/EditSubjectPopupStyles.css"

const EditSubjectPopup = ({ isOpen, onRequestClose, subjectId, onSubjectEdit }) => {
    const [subjectTopics, setSubjectTopics] = useState([]);
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newTopic, setNewTopic] = useState('');

    const form = useRef();

    useEffect(() => {
        if (subjectId) {
            fetch(`http://localhost:4000/getSubject/${subjectId}`)
                .then((response) => response.json())
                .then((data) => {
                    setNewName(data.name);
                    setNewDescription(data.description);
                    setNewTopic(data.topic);
                })
                .catch((error) => {
                    console.error('Hiba a tantárgy részleteinek lekérdezésekor: ', error);
                });
        }
    }, [subjectId]);

    useEffect(() => {
        fetch('http://localhost:4000/getSubjectTopics')
          .then((response) => response.json())
          .then((data) => {
            setSubjectTopics(data);
          })
          .catch((error) => {
            console.error('Hiba a Tantárgy Témakörök lekérdezésekor: ', error);
          });
    }, []);

    const handleEditSubject = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4000/updateSubject/${subjectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newName,
                    description: newDescription,
                    topic: newTopic,
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
        <form ref={form} onSubmit={handleEditSubject}>
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
            required>
            </textarea>

            <label>Új témakör:</label>
            <select name="category"
                onChange={ev => setNewTopic(ev.target.value)}
                required>
                <option value="">Válasszon kategóriát!</option>
                {subjectTopics.map((subjectTopic) => (
                <option key={subjectTopic._id} value={subjectTopic._id}>{subjectTopic.name}</option>
                ))}
            </select>

            <input type="submit" className="btn" value="Mentés" />
        </form>
    </div>
    </ReactModal>
  )
}

export default EditSubjectPopup;