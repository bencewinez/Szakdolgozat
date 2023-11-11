import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Registration from './routes/Registration';
import NotFound from './routes/NotFound';
import Aszf from './routes/Aszf';
import Adatvedelem from './routes/Adatvedelem';
import Profile from './routes/Profile';
import AddSubject from './routes/AddSubject';
import SubjectSite from './routes/SubjectSite';
import { UserContext, UserContextProvider } from './UserContext';


import React from 'react'

const App = () => {
  return (
    <UserContextProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={ <Home /> } />
            <Route path='/' element={ <Home /> } />
            <Route path='/regisztracio' element={ <Registration /> } />
            <Route path='/profil' element={ <Profile /> } />
            <Route path='/ujtantargy' element={ <AddSubject/> }/>
            <Route path="/tantargyak/:urlSlug" element={<SubjectSite />} />
            <Route path='/aszf' element={ <Aszf /> } />
            <Route path='/adatvedelmi_nyilatkozat' element={ <Adatvedelem /> } />
            <Route path='*' element={ <NotFound /> } />
          </Routes>
      </BrowserRouter>
    </UserContextProvider>
  )
}

export default App