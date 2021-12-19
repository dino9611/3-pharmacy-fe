import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { API_URL } from './constants/api';
import './App.css';
import 'tailwindcss/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';
import Verified from './pages/user/verifyPage';
import ChangePassword from './pages/user/Changepass';
import Userprofile from './pages/user/UserProfile';
import LandingPage from './pages/LandingPage';
import Products from './pages/Products';
import AdminHome from './pages/admin/AdminHome';
import AdminMenu from './pages/admin/AdminMenu';

function App() {
  // Redux
  const dispatch = useDispatch();

  // Keep Log in
  useEffect(() => {
    let token = localStorage.getItem('token');
    if (token) {
      const keepLoggedIn = async () => {
        try {
          let res = await axios.get(`${API_URL}/auth/keeploggedin`, {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          });
          dispatch({ type: 'login', payload: res.data[0] });
        } catch (error) {
          alert('Sesi anda habis, silahkan Log in lagi');
          localStorage.removeItem('token');
        }
      };
      keepLoggedIn();
    }
  }, [dispatch]);

  return (
    <div>
      <Routes>
        <Route path={'/'} element={<LandingPage />} />
        <Route path={'/admin/*'} element={<AdminMenu />} />
        <Route path={'/verified'} element={<Verified />} />
        <Route path={'/change'} element={<ChangePassword />} />
        <Route path={'/profile'} element={<Userprofile />} />
        <Route path={'/products'} element={<Products />} />
        <Route path={'/adminhome'} element={<AdminHome />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
