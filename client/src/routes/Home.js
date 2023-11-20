import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SearchSubjectTopics from '../components/SearchSubjectTopics'
import SearchSubjectBar from '../components/SearchSubjectBar'
import '../componentStyles/HomeStyles.css'
import SearchSubjectResults from '../components/SearchSubjectResults'
import { useState } from 'react'

const Home = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
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
            <SearchSubjectBar />
          </div>
          <div className='resultBox'>
            <SearchSubjectResults selectedTopic={selectedTopic} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home