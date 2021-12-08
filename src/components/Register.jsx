import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios';
import { API_URL } from '../constants/api';
import Link from '@mui/material/Link';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  borderRadius: '15px',
  boxShadow: 24,
  p: 4,
};
const ColorButton = styled(Button)(({ theme }) => ({
  borderRadius: 10,
  color: 'black',
  backgroundColor: '#FFC286',
  '&:hover': {
    backgroundColor: '#66806A',
    color: 'white',
  },
}));
const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#B4C6A6',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#66806A',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#66806A',
    },
    '&:hover fieldset': {
      borderColor: '#FFC286',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#B4C6A6',
    },
  },
});
// const MySwal = withReactContent(Swal)
// const Register = ({ open, handleClose, setOpen, handleopenDialog }) => {
const Register = ({ handleClose, setOpen, handleopenDialog }) => {
  const [mistakeName, setmistakeName] = useState(false);
  const [mistakeEmail, setmistakeEmail] = useState(false);
  const [mistakePassword, setmistakePassword] = useState(false);
  const [mistakeFirst, setmistakeFirst] = useState(false);
  const [showPassword, setshowPassword] = useState(false);
  const [input, setaddAccount] = useState({
    username: '',
    email: '',
    password: '',
    retype: '',
    firstName: '',
    lastName: '',
  });
  const open = true;

  const handleShowPassword = () => {
    setshowPassword(!showPassword);
  };
  const formChecker = () => {
    let { username, email, password, firstName } = input;
    setmistakeName(username ? false : true);
    setmistakePassword(password ? false : true);
    setmistakeEmail(email ? false : true);
    setmistakeFirst(firstName ? false : true);
  };

  const registerClick = (e) => {
    // let {username,email,password,retype,firstName} = addAccount
    e.preventDefault();
    formChecker();
  };
  const inputHandler = (e) => {
    setaddAccount({ ...input, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Typography
            id='modal-modal-title'
            variant='h6'
            component='h2'
            fontWeight={'bold'}
            align={'center'}
          >
            Register an Account
          </Typography>
          <CssTextField
            name='username'
            value={input.username}
            onChange={inputHandler}
            fullWidth
            label='Username'
            id='custom-css-outlined-input'
            sx={{ mt: 1 }}
          />
          <Typography
            display={mistakeName ? 'block' : 'none'}
            color='error'
            sx={{ fontSize: 12, mt: 0.5, justifyContent: 'center' }}
          >
            <ErrorIcon sx={{ fontSize: 'medium', mr: 0.5 }} />
          </Typography>
          <CssTextField
            name='email'
            value={input.email}
            onChange={inputHandler}
            fullWidth
            label='Email'
            id='custom-css-outlined-input'
            sx={{ mt: 1 }}
          />
          <Typography
            display={mistakeEmail ? 'block' : 'none'}
            color='error'
            sx={{ fontSize: 12, mt: 0.5, justifyContent: 'center' }}
          >
            <ErrorIcon sx={{ fontSize: 'medium', mr: 0.5 }} />
          </Typography>
          <CssTextField
            name='password'
            value={input.password}
            onChange={inputHandler}
            fullWidth
            label='Password'
            id='custom-css-outlined-input'
            sx={{ mt: 1 }}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={handleShowPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <CssTextField
            name='retype'
            value={input.retype}
            onChange={inputHandler}
            fullWidth
            label='Re-Type Password'
            id='custom-css-outlined-input'
            sx={{ mt: 1 }}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={handleShowPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography
            display={mistakePassword ? 'block' : 'none'}
            color='error'
            sx={{ fontSize: 12, mt: 0.5, justifyContent: 'center' }}
          ></Typography>
          <CssTextField
            name='firstName'
            value={input.firstName}
            onChange={inputHandler}
            fullWidth
            label='First Name'
            id='custom-css-outlined-input'
            sx={{ mt: 1 }}
          />
          <Typography
            display={mistakeFirst ? 'block' : 'none'}
            color='error'
            sx={{ fontSize: 12, mt: 0.5, justifyContent: 'center' }}
          >
            <ErrorIcon sx={{ fontSize: 'medium', mr: 0.5 }} />
            First Name Harap diisi
          </Typography>
          <CssTextField
            name='lastName'
            value={input.lastName}
            onChange={inputHandler}
            fullWidth
            label='Last Name'
            id='custom-css-outlined-input'
            sx={{ mt: 1 }}
          />
          <div className='Forgot-Register'></div>
          <ColorButton
            fullWidth
            variant='contained'
            sx={{ mt: 2 }}
            size='large'
            onClick={registerClick}
          >
            Register
          </ColorButton>
        </Box>
      </Modal>
    </div>
  );
};

export default Register;
