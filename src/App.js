import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from './constants/api';
import './App.css';
import 'tailwindcss/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';
import Verified from './pages/user/verifyPage';
import ChangePassword from './pages/user/Changepass';
import UserMenu from './pages/UserMenu';
import AdminMenu from './pages/admin/AdminMenu';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.log(error.response);
    if (error.response.status === 401)
      // document.location.reload();
      window.location.reload();
    return Promise.reject(error);
  }
);

export default function App() {
  // Redux
  const dispatch = useDispatch();
  const authReducer = useSelector((state) => state.auth);

  // loading
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
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
          Swal.fire({
            icon: 'info',
            title: 'Oops...',
            text: 'Your session is over, please re-login!',
            timer: 1500,
            timerProgressBar: true,
            confirmButtonColor: '#22577A',
          });
          localStorage.removeItem('token');
          navigate('/');
        } finally {
          setLoading(false);
        }
      };
      keepLoggedIn();
    } else {
      setLoading(false);
    }
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className='text-center'>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className='bg-lightblue'>
      <Routes>
        <Route path={'/*'} element={<UserMenu />} />
        {authReducer.role === 'admin' && (
          <Route path={'/admin/*'} element={<AdminMenu />} />
        )}

        <Route path={'/verified'} element={<Verified />} />
        <Route path={'/change'} element={<ChangePassword />} />

        <Route path={'/404'} element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

function NotFound() {
  return (
    <div
      class='
    flex
    items-center
    justify-center
    w-screen
    h-screen
    bg-gradient-to-r
    from-indigo-600
    to-blue-400
  '
    >
      <div class='px-40 py-20 bg-white rounded-md shadow-xl'>
        <div class='flex flex-col items-center'>
          <h1 class='font-bold text-blue-600 text-9xl'>404</h1>

          <h6 class='mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl'>
            <span class='text-red-500'>Oops!</span> Page not found
          </h6>

          <p class='mb-8 text-center text-gray-500 md:text-lg'>
            The page you’re looking for doesn’t exist.
          </p>

          <a
            href='/'
            class='px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100'
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
