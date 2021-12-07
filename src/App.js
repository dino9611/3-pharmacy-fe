import React, {useState} from 'react';
import './App.css';
import "tailwindcss/tailwind.css"
import { ToastContainer } from 'react-toastify'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  

  return (
    <div >
      <Routes>
        <Route path={'/'} element={<LandingPage />} />
      </Routes>
      <ToastContainer/>
    </div>
  );
}

export default App;
