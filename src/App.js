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
import Userprofile from './pages/user/UserProfile';
import LandingPage from './pages/LandingPage';
import Products from './pages/Products';
import AdminMenu from './pages/admin/AdminMenu';
import Cart from './pages/user/Cart';
import CircularProgress from '@mui/material/CircularProgress';
import CheckOut from './pages/user/CheckOut';
import Swal from 'sweetalert2';
import UploadPayment from './pages/user/UploadPayment';
import ProductTransactionHistory from './pages/user/ProductTransactionHistory';
import { useNavigate } from 'react-router';

function App() {
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
  }, [dispatch]);

  if (loading) {
    return (
      <div className='text-center'>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path={'/'} element={<LandingPage />} />
        {authReducer.role === 'admin' && (
          <Route path={'/admin/*'} element={<AdminMenu />} />
        )}
        : null
        <Route path={'/verified'} element={<Verified />} />
        <Route path={'/change'} element={<ChangePassword />} />
        <Route path={'/profile'} element={<Userprofile />} />
        <Route path={'/products'} element={<Products />} />
        <Route path={'/cart'} element={<Cart />} />
        <Route path={'/checkout'} element={<CheckOut />} />
        <Route path={'/uploadpayment/:order_id'} element={<UploadPayment />} />
        <Route path={'/order-list'} element={<ProductTransactionHistory />} />
        <Route path={'/*'} element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;

function NotFound() {
  return <h1>Not Found</h1>;
}
