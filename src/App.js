import React, {useState} from 'react';
import './App.css';
import "tailwindcss/tailwind.css"
import { ToastContainer } from 'react-toastify'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import 'react-toastify/dist/ReactToastify.css';
import Verified from './pages/user/verifyPage';
import ChangePassword from './pages/user/Changepass';
import Userprofile from './pages/user/UserProfile';

function App() {

  

  return (
    <div >
      <Routes>
        <Route path={'/'} element={<LandingPage />} />
        <Route path={'/verified'} element={<Verified/>} />
        <Route path={'/change'} element={<ChangePassword/>} />
        <Route path={'/profile'} element={<Userprofile/>} />
      </Routes>
      <ToastContainer/>
    </div>
  );
}

export default App;
