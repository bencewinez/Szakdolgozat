import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SearchSubjectTopics from '../components/SearchSubjectTopics'
import SearchSubjectBar from '../components/SearchSubjectBar'
import '../componentStyles/HomeStyles.css'
import SearchSubjectResults from '../components/SearchSubjectResults'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    navigate(`/?page=1&pageSize=5&topic=${selectedTopic}&search=${text}`);
  };

  return (
    <div className='default_bg'>
      <Navbar />
      <div className='homeRow'>
        <div className='searchSubjectTopics'>
          <SearchSubjectTopics onTopicClick={handleTopicSelect} setSelectedTopic={setSelectedTopic} />
        </div>
        <div className='homeColumn'>
          <div className='searchBarBox'>
            <SearchSubjectBar onSearch={handleSearch} />
          </div>
          <div className='resultBox'>
            <SearchSubjectResults selectedTopic={selectedTopic} searchText={searchText} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home