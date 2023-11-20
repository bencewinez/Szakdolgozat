import '../componentStyles/SubjectCardStyles.css';
import { NavLink } from 'react-router-dom';

const SubjectCard = ({ subject }) => {
    const { name, author, topic, urlSlug } = subject;
return (
    <div className='subjectCard'>
        <p>{topic}</p>
        <NavLink to={`/tantargyak/${urlSlug}`} className="mysubjectsLia">
            <h3>{name}</h3>                 
        </NavLink>
        <p>Készítette: {author}</p>
    </div>
  );
};

export default SubjectCard;