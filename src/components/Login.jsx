import React, { useState } from 'react';
import {
  Box,
  Modal,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_URL } from '../constants/api';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: 300, md: 500
  },
  bgcolor: 'background.paper',
  borderRadius: '15px',
  boxShadow: 24,
  p: 4,
};
const Login = ({ open, handleClose }) => {
  const dispatch = useDispatch();

  // Input Data Login
  const [inputLogin, setInputLogin] = useState({
    usernamemail: '',
    password: '',
  });
  const inputHandler = (e) =>
    setInputLogin({ ...inputLogin, [e.target.name]: e.target.value });

  // Lihat Password
  const [lihatpw, setLihatpw] = useState('password');
  const lihatpwHandler = (e) => {
    if (e.target.checked) {
      setLihatpw('text');
    } else {
      setLihatpw('password');
    }
  };

  // Alert akun tidak terdaftar
  const [accAlert, setAccAlert] = useState(true);
  const [fillAlert, setFillAlert] = useState(true);

  // button
  const [disableButton, setDisableButton] = useState(false);

  const onLogin = async () => {
    const { usernamemail, password } = inputLogin;
    // Kalo inputnya kurang gaboleh
    if (!usernamemail || !password) {
      setFillAlert(false);
      return;
    }
    setDisableButton(true);
    try {
      let res = await axios.post(`${API_URL}/auth/login`, {
        username: usernamemail,
        email: usernamemail,
        password: password,
      });
      // alert kalo akunnya ga ada
      if (!res.data.length) {
        setAccAlert(false);
        return;
      }
      localStorage.setItem('token', res.headers['access-token']);
      dispatch({ type: 'login', payload: res.data[0] });
      handleClose();
      setFillAlert(true);
      setAccAlert(true);
      Swal.fire({
        icon: 'success',
        title: 'Yay!',
        text: 'Log in success',
        timer: 1500,
        timerProgressBar: true,
      });
      setInputLogin({
        usernamemail: '',
        password: '',
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setDisableButton(false);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style} style={{ textAlign: 'center' }}>
          <div className='mb-8 phone:mb-4'>
            <p
              className='font-bold text-3xl phone:text-2xl'
            >
              Login
            </p>
          </div>
          <div className='mb-3'>
            <TextField
              fullWidth
              size='small'
              label='Username or Email'
              variant='outlined'
              name='usernamemail'
              onChange={inputHandler}
              onKeyDown={(e) => e.key === 'Enter' && onLogin()}
              color='info'
            />
          </div>
          <div className='mb-3'>
            <TextField
              fullWidth
              size='small'
              label='Password'
              variant='outlined'
              type={lihatpw}
              name='password'
              onChange={inputHandler}
              onKeyDown={(e) => e.key === 'Enter' && onLogin()}
              color='info'
            />
          </div>
          <div className='mb-3' hidden={fillAlert}>
            <Alert severity='error'>Fill all fields!</Alert>
          </div>
          <div className='mb-3' hidden={accAlert}>
            <Alert severity='error'>Account is not registered!</Alert>
          </div>
          <div className='mb-3 flex phone:flex-col justify-between'>
            <div>
              <input type='checkbox' onChange={lihatpwHandler} /> Show Password
            </div>
            <Link
              to='/'
              className='text-indigo-500 hover:underline'
              style={{ color: '#0000EE' }}
            >
              Forgot password?
            </Link>
          </div>
          {disableButton ? (
            <Button
              disabled
              variant='contained'
              style={{ backgroundColor: '#22577A' }}
            >
              Login
            </Button>
          ) : (
            <Button
              variant='contained'
              onClick={onLogin}
              style={{ backgroundColor: '#22577A' }}
            >
              Login
            </Button>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Login;
