import React, { useContext, useState, useEffect  } from 'react'
import { NavLink } from "react-router-dom"
import ReactModal from 'react-modal'
import { Navigate } from "react-router-dom"
import { UserContext } from "../UserContext"
import { FaLongArrowAltLeft, FaTrash } from "react-icons/fa"
import "../componentStyles/NavbarProfileStyles.css"
import DeleteSubjectPopup from './DeleteSubjectPopup'

ReactModal.setAppElement('#root')

const NavbarProfile = ({ isOpen, onRequestClose }) => {

    const {setUserInfo, userInfo} = useContext(UserContext);
    const [redirect,setRedirect] = useState(false);
    const [userAttributes, setUserAttributes] = useState({});
    const [isSubjectsActive, setIsSubjectsActive] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [isMySubjectsActive, setIsMySubjectsActive] = useState(false);
    const [mySubjects, setMySubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

    useEffect(() => {
        if (userInfo) {
            fetchUserProfile();
            getSubjects();
            getMySubjects();
        }
    }, [userInfo]);
    
    const fetchUserProfile = () => {
        fetch('http://localhost:4000/userProfile', {
            credentials: 'include',
        })
        .then((response) => response.json())
        .then((data) => {
            setUserAttributes(data);
        })
        .catch((error) => {
            console.error('Hiba a felhasználó lekérése közben: ', error);
        });
    };

    const getSubjects = () => {
        fetch('http://localhost:4000/getSubjectNames', {
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                setSubjects(data);
            })
            .catch((error) => {
                console.error('Hiba a tantárgyak lekérése közben: ', error);
            });
    };

    const getMySubjects = () => {
        fetch('http://localhost:4000/getMySubjects', {
            credentials: 'include',
        })
            .then((response) => response.json())
            .then((data) => {
                setMySubjects(data);
            })
            .catch((error) => {
                console.error('Hiba a tantárgyak lekérése közben: ', error);
            });
    };

    function logout(){
        fetch('http://localhost:4000/logout', {
            credentials: 'include',
            method: 'POST',
        });
        setUserInfo(null);
        alert('Sikeres Kijelentkezés!');
        setRedirect(true);
    }

    if (redirect) {
        window.location.reload();
        return<Navigate to={'/'}/>
    }

    return (
        <ReactModal
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          contentLabel="Profil"
          className="navbarProfileModal"
          overlayClassName="navbarProfileOverlay"
        >
        {isSubjectsActive ? (
            <div className="profileBar">
                <div
                    className="backArrow"
                    onClick={() => setIsSubjectsActive(false)}
                >
                    <FaLongArrowAltLeft size={25} style={{ color: "#000" }} /> Vissza
                </div>
                <ul>
                    <li className="usernameLi">
                        <p>Tantárgyaim</p>
                    </li>
                    {subjects.map((subject) => (
                    <li key={subject._id} className="mysubjectsLi">
                        <div className="subjectContainer">
                            <NavLink to={`/tantargyak/${subject.urlSlug}`} className="mysubjectsLia">
                                <p className="mysubjectsLia">{subject.name}</p>
                            </NavLink>
                            <FaTrash size={16}
                            style={{ color: "#000" }}
                            onClick={() => {
                                setSelectedSubject(subject._id);
                                setIsDeletePopupOpen(true);
                            }}/>
                        </div>
                    </li>
                    ))}
                    <li className="logoutLi">
                        <p>Vissza a tetejére!</p>
                    </li>
                </ul>
            </div>
        ) : isMySubjectsActive ? (
            <div className="profileBar">
                <div
                    className="backArrow"
                    onClick={() => setIsMySubjectsActive(false)}
                >
                    <FaLongArrowAltLeft size={25} style={{ color: "#000" }} /> Vissza
                </div>
                <ul>
                    <li className="usernameLi">
                        <p>Saját Tantárgyaim</p>
                    </li>
                    <li className="mysubjectsLi">
                        <NavLink to="/ujtantargy" className="usernameLia">
                            <p className="usernameLia">Új tantárgy létrehozása</p>
                        </NavLink>
                    </li>
                    {mySubjects.map((subject) => (
                        <li key={subject._id} className="mysubjectsLi">
                            <NavLink to={`/tantargyak/${subject.urlSlug}`} className="mysubjectsLia">
                                <p className="mysubjectsLia">{subject.name}</p>
                            </NavLink>
                        </li>
                    ))}
                    <li className="logoutLi">
                        <p>Vissza a tetejére!</p>
                    </li>
                </ul>
            </div>
        ) : (
            <div className="profileBar">
                <ul>
                    <li className="usernameLi">
                        <p>{userAttributes.name}</p>
                    </li>
                    <li>
                        <NavLink to="/profil" className="usernameLia">
                            <p className="usernameLia">Profilom</p>
                        </NavLink>
                    </li>
                    <li className="mysubjectsLi">
                        <NavLink
                            className="subjectsLia"
                            onClick={() => setIsMySubjectsActive(true)}
                        >
                            <p className="subjectsLia">Saját Tantárgyaim</p>
                        </NavLink>
                    </li>
                    <li className="subjectsLi">
                        <NavLink
                            className="subjectsLia"
                            onClick={() => setIsSubjectsActive(true)}
                        >
                            <p className="subjectsLia">Tantárgyaim</p>
                        </NavLink>
                    </li>
                    <li className="logoutLi">
                        <NavLink onClick={logout} className="logoutLia">
                            <p className="logoutLia">Kijelentkezés</p>
                        </NavLink>
                    </li>
                </ul>
            </div>
        )}
        <DeleteSubjectPopup
            isOpen={isDeletePopupOpen}
            onRequestClose={() => setIsDeletePopupOpen(false)}
            subjectId={selectedSubject}
        />
        </ReactModal>
    );
}

export default NavbarProfile