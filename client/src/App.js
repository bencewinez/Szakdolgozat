import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Registration from './routes/Registration';
import NotFound from './routes/NotFound';
import Aszf from './routes/Aszf';
import Adatvedelem from './routes/Adatvedelem';


import React from 'react'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={ <Home /> } />
          <Route path='/' element={ <Home /> } />
          <Route path='/regisztracio' element={ <Registration /> } />
          <Route path='/aszf' element={ <Aszf /> } />
          <Route path='/adatvedelmi_nyilatkozat' element={ <Adatvedelem /> } />
          <Route path='*' element={ <NotFound /> } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App