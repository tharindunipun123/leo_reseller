import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter ,Route , Routes } from 'react-router-dom';

import Registration from './Components/resellerRegistration';
import Login from './Components/login';
import Dashboard from './Components/dashboard';

function App() {

  return(<BrowserRouter >
    <Routes>
    <Route path="/" element={<Registration/>}> </Route>
    <Route path="/login" element={<Login/>}> </Route>
    <Route path="/dashboard" element={<Dashboard/>}> </Route>
    </Routes>
    </BrowserRouter>)
  
}

export default App
