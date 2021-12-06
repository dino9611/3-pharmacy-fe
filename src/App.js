import React, {useState} from 'react';
import './App.css';
import "tailwindcss/tailwind.css"

import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage';

function App() {

  

  return (
    <div >
      <Routes>
        <Route path={'/'} element={<LandingPage />} />
      </Routes>
    </div>
  );
}

export default App;
