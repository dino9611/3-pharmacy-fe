import React, { useState, useEffect } from 'react';
import {
  Typography,
  Menu,
  Tooltip,
  MenuItem,
  Box,
  IconButton,
  Badge,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';
import './styles/Header.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import Login from './Login';
import Register from './Register';
import ForgetPass from './ForgetPassword';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { API_URL } from '../constants/api';
import { useLocation } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

const Header = () => {
  const authState = useSelector((state) => state.auth);
  const cartState = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const location = useLocation();

  //? Fetch prescription data
  const [customData, setcustomData] = useState([]);
  const id = authState.id;
  const getCustom = async () => {
    try {
      let results = await axios.get(`${API_URL}/custom/usercustom`, {
        params: { id },
      });
      setcustomData(results.data);
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    getCustom();
  }, []);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(false);
  };

  const onLogout = () => {
    dispatch({ type: 'logout' });
    navigate('/');
    localStorage.removeItem('token');
  };

  // Modal login
  const [openLogin, setOpenLogin] = useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);

  //Ini Modal Dialog Forget Password
  const [openDialog, setopenDialog] = useState(false);
  const handleopenDialog = () => {
    setOpen(false);
    setopenDialog(true);
  };
  const handlecloseDialog = () => setopenDialog(false);

  // Modal Register
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Navigate
  const navigate = useNavigate();

  return (
    <div>
      <Login open={openLogin} handleClose={handleCloseLogin} />
      <Register
        open={open}
        handleClose={handleClose}
        setOpen={setOpen}
        handleopenDialog={handleopenDialog}
      />
      <ForgetPass
        setopenDialog={setopenDialog}
        openDialog={openDialog}
        handlecloseDialog={handlecloseDialog}
        handleopenDialog={handleopenDialog}
      />
      <div className='flex justify-between items-center bg-primary1 h-24 phone:h-16 px-6 phone:px-4 font-poppins'>
        <div className='flex'>
          <p
            onClick={() => navigate('/')}
            className='header-font-style hover:text-gray-200 text-3xl phone:text-xl cursor-pointer'
          >
            Tokobat
          </p>
          <button
            // className='text-white py-1 px-3 rounded hover:bg-peach-light hover:shadow-md ml-4 phone:text-xs phone:ml-1'
            onClick={() => navigate('/products')}
            className={
              'text-xs uppercase mx-2 p-2 font-bold block rounded-lg ' +
              (location.pathname.includes('products')
                ? 'text-gray-800 bg-fourth2'
                : 'text-gray-300 hover:text-white hover:shadow-2xl hover:brightness-200')
            }
          >
            Products
          </button>
          <button
            className={
              'text-xs uppercase mx-2 p-2 font-bold block rounded-lg ' +
              (location.pathname.includes('prescriptions')
                ? 'text-gray-800 bg-fourth2'
                : 'text-gray-300 hover:text-white hover:shadow-2xl hover:brightness-200')
            }
            onClick={() => navigate('/prescriptions')}
          >
            Prescriptions
          </button>
        </div>
        <div className='flex items-center'>
          {authState.isLogin ? (
            <>
              <Link to='/order-list'>
                <Tooltip title='Orders'>
                  <div className='hover:bg-black hover:bg-opacity-10 rounded-full w-12 h-12 phone:w-8 phone:h-8 flex'>
                    <svg
                      className='h-8 w-8 phone:w-6 phone:h-6 text-white self-center mx-auto'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' />
                      <path
                        fillRule='evenodd'
                        d='M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                </Tooltip>
              </Link>
              <Link to='/cart'>
                <span className='relative inline-block mr-4 phone:mr-2'>
                  <Tooltip title='Cart'>
                    <div className='hover:bg-black hover:bg-opacity-10 rounded-full w-12 h-12 phone:w-8 phone:h-8 phone:mt-1 flex'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='w-8 h-8 phone:w-6 phone:h-6 text-white self-center mx-auto'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path d='M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' />
                      </svg>
                    </div>
                  </Tooltip>
                  {!cartState.length ? (
                    ''
                  ) : (
                    <span class='absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 phone:w-4 phone:h-4 text-xs font-bold leading-none text-red-100 transform translate-x-1 bg-red-600 rounded-full'>
                      {cartState.length}
                    </span>
                  )}
                </span>
              </Link>
              <Link to='/prescription'>
                <IconButton
                  size='large'
                  aria-label='show 17 new notifications'
                  sx={{ marginRight: 2 }}
                >
                  <Badge badgeContent={customData.length} color='error'>
                    <DescriptionOutlinedIcon
                      sx={{ color: 'white', fontSize: '2rem' }}
                    />
                  </Badge>
                </IconButton>
              </Link>
              <p className='text-light-light cursor-pointer mr-2 phone:hidden'>
                {authState.username}
              </p>
              <Box sx={{ flexGrow: 0 }}>
                <button onClick={handleOpenUserMenu}>
                  {!authState.avatar ? (
                    <p className='w-10 h-10 phone:w-7 phone:h-7 bg-white rounded-full flex items-center justify-center text-lg font-semibold text-primary1'>
                      {authState.username.charAt(0)}
                    </p>
                  ) : (
                    <Avatar
                      src={API_URL + authState.avatar}
                      className='w-10 h-10 phone:w-8 phone:h-8 overflow-hidden rounded-full'
                    />
                    // <img
                    //   src={API_URL + authState.avatar}
                    //   alt={authState.username.charAt(0)}
                    //   onError={(e) => {
                    //     e.currentTarget.src = '/default_profile_pic.jpg';
                    //     e.currentTarget.onerror = null;
                    //   }}
                    //   className='w-10 h-10 phone:w-8 phone:h-8 overflow-hidden rounded-full'
                    // />
                  )}
                </button>
                <Menu
                  sx={{ mt: '45px' }}
                  id='menu-appbar'
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={anchorElUser}
                  onClose={handleCloseUserMenu}
                >
                  {authState.role === 'admin' && (
                    <MenuItem onClick={() => navigate('/admin')}>
                      <Typography textAlign='center'>Admin</Typography>
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => navigate('/user_profile')}>
                    <Typography textAlign='center'>My profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={onLogout}>
                    <Typography textAlign='center'>Log out</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <>
              <button
                className=' text-white mr-4 hover:text-gray-200 rounded phone:text-sm'
                onClick={handleOpenLogin}
              >
                Login
              </button>
              <button
                variant='contained'
                className='btn btn-blue px-3 py-1 rounded phone:text-sm phone:px-2'
                onClick={handleOpen}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
