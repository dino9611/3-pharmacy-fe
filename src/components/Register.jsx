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
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
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
  backgroundColor: '#ceeaeb',
  '&:hover': {
    backgroundColor: '#38A3A5',
    color: 'white',
  },
}));
const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#38A3A5',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#ceeaeb',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ceeaeb',
    },
    '&:hover fieldset': {
      borderColor: '#38A3A5',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ceeaeb',
    },
  },
});
// const MySwal = withReactContent(Swal)
const Register = ({ open, handleClose, setOpen, handleopenDialog }) => {
  const [mistakeName, setmistakeName] = useState(false);
  const [mistakeEmail, setmistakeEmail] = useState(false);
  const [mistakePassword, setmistakePassword] = useState(false);
  const [mistakeFirst, setmistakeFirst] = useState(false);
  // const [usernameError, setusernameError] = useState("Username Harap Diisi")
  // const [emailError, setemailError] = useState("")
  const [errors, setErrors] = useState([]);
  const [showPassword, setshowPassword] = useState(false);
  const [addAccount, setaddAccount] = useState({
    username: '',
    email: '',
    password: '',
    retype: '',
    firstName: '',
    lastName: '',
  });

  //! Kumpulan Regex
  const regexChar = new RegExp('^(?=.{6,})');
  const regexCaps = new RegExp('^(?=.*[A-Z])');
  const regexLow = new RegExp('^(?=.*[a-z])');
  const regexNumb = new RegExp('^(?=.*[0-9])');
  const regexSpace = new RegExp('^(?!.*?[\\s])');
  const regexEmail = new RegExp('^(?=.*?[@])');
  // const regexSymbol = new RegExp("^(?!.*?[#?!@$%^&*}{:;])")
  // const passRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})")

  const handleShowPassword = () => {
    setshowPassword(!showPassword);
  };

  const formChecker = () => {
    let { username, email, password, firstName } = addAccount;
    setmistakeName(username ? false : true);
    setmistakePassword(password ? false : true);
    setmistakeEmail(email ? false : true);
    setmistakeFirst(firstName ? false : true);
  };

  const checkpass = (pass) => {
    let arr = [
      { func: regexChar, message: '6 Character Minimum' },
      { func: regexCaps, message: 'Password Must Have Uppercase' },
      { func: regexLow, message: 'Password Must Have Lowercase' },
      { func: regexNumb, message: 'Password Must Have Number' },
      { func: regexSpace, message: 'Password Cannot Have Spaces' },
    ];
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].func.test(pass)) {
        setmistakePassword(true);
        return arr[i].message;
      }
    }
    return '';
  };

  const passwordChecker = () => {
    let { username, email, password, retype, firstName } = addAccount;
    // Intinya password Minimal ada 6 Character, Capital,Lowercase,Number dan TIDAK BOLEH ada spasi
    //! Email harus ada @
    //! error akan dipush ke array
    let arr = [];
    if (password && retype) {
      if (checkpass(password)) {
        arr[0] = checkpass(password);
        setmistakePassword(true);
      }
    } else {
      arr[0] = 'Please fill Password & Retype Password';
      setmistakePassword(true);
    }
    if (password !== retype) {
      arr[0] = 'Password Are Not the Same';
      setmistakePassword(true);
    }
    if (username) {
      if (!regexChar.test(username)) {
        arr[1] = '6 Character Minimum';
        setmistakeName(true);
      }
    } else {
      arr[1] = 'Please fill Username';
      setmistakeName(true);
    }
    if (email) {
      if (!regexEmail.test(email)) {
        arr[2] = 'Email Isnt Correct';
        setmistakeEmail(true);
      }
    } else {
      arr[2] = 'Please fill Email';
      setmistakeEmail(true);
    }
    if (!firstName) {
      arr[3] = 'Please fill Username';
    }
    if (!arr.length) {
      registerHandler();
    } else {
      setErrors([...arr]);
      console.log(arr);
    }
  };
  const registerClick = (e) => {
    // let {username,email,password,retype,firstName} = addAccount
    e.preventDefault();
    formChecker();
    passwordChecker();
  };
  const inputHandler = (e) => {
    setaddAccount({ ...addAccount, [e.target.name]: e.target.value });
  };
  const registerHandler = async () => {
    // console.log(addAccount.username)
    // console.log(addAccount.firstName)
    const { username, email, password, firstName, lastName } = addAccount;
    try {
      await axios
        .post(`${API_URL}/auth/register`, {
          username,
          email,
          password,
          firstName,
          lastName,
        })
        .then(() => {
          Swal.fire(
            `Registered!`,
            `Please Check your Email to Verify your Account!`,
            `success`
          );
          setOpen(!open);
        });
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message || 'Server Error', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 5000,
      });
    }
  };

  return (
    <div>
      {/* <ForgetPass setopenDialog={setopenDialog} openDialog={openDialog} handlecloseDialog={handlecloseDialog} /> */}
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
            name='firstName'
            value={addAccount.firstName}
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
            value={addAccount.lastName}
            onChange={inputHandler}
            fullWidth
            label='Last Name'
            id='custom-css-outlined-input'
            sx={{ mt: 1 }}
          />
          <CssTextField
            name='username'
            value={addAccount.username}
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
            {errors[1]}
          </Typography>
          <CssTextField
            name='email'
            value={addAccount.email}
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
            {errors[2]}
          </Typography>
          <CssTextField
            name='password'
            value={addAccount.password}
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
            value={addAccount.retype}
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
          >
            <ErrorIcon sx={{ fontSize: 'medium', mr: 0.5 }} />
            {errors[0]}
          </Typography>
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
