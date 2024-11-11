import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter ,Route , Routes } from 'react-router-dom';
import Registration from './Components/resellerRegistration';
import Login from './Components/login';
import Dashboard from './Components/Dashboard';
import BuyDiamonds from './Components/BuyDiamond';
import TransactionHistory from './Components/TransacttionHistory';
import EditProfile from './Components/EditProfile';
import DiamondTransfer from './Components/DiamondTransfer';

function App() {

  return(<BrowserRouter >
    <Routes>
    <Route path="/" element={<Registration/>}> </Route>
    <Route path="/login" element={<Login/>}> </Route>
    <Route path="/dashboard" element={<Dashboard/>}> </Route>
    <Route path="/buydiamonds" element={<BuyDiamonds/>}> </Route>
    <Route path="/transactions" element={<TransactionHistory/>}> </Route>
    <Route path="/editprofile" element={<EditProfile/>}> </Route>
    <Route path="/transfer" element={<DiamondTransfer/>}> </Route>

    </Routes>
    </BrowserRouter>)
  
}

export default App
