import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Error';
import axios from 'axios';
import { API_URL } from '../constants/api';
import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
import {toast} from 'react-toastify'

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
      color: 'white'
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
const Register = ({open, handleClose, setOpen}) => {

    //! ini dibawah taro dihalaman lain.
    // const [open, setOpen] = useState(false)
    // const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);
    // <Button onClick={handleOpen}>Open modal</Button>
    // <Register open={open} handleClose={handleClose}/>
    const [mistakeName, setmistakeName] = useState(false)
    const [mistakeEmail, setmistakeEmail] = useState(false)
    const [mistakePassword, setmistakePassword] = useState(false)
    const [mistakeFirst, setmistakeFirst] = useState(false)
    const [passwordError, setpasswordError] = useState("")
    const [showPassword, setshowPassword] = useState(false)
    const [addAccount, setaddAccount] = useState({
        username: "",
        email: "",
        password: "",
        retype: "",
        firstName: "",
        lastName: ""
    })

    //! Kumpulan Regex
    const regexChar = new RegExp("^(?=.{6,})")
    const regexCaps = new RegExp("^(?=.*[A-Z])")
    const regexLow = new  RegExp("^(?=.*[a-z])")
    const regexNumb = new RegExp("^(?=.*[0-9])")
    // const passRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})")


    const handleShowPassword = () => {
        setshowPassword(!showPassword)
    }
    // useEffect (() => {

    // }, [passwordError])
    const formChecker = () => {
        let {username, email, password, firstName} = addAccount
        setmistakeName(username ? false : true)
        setmistakePassword(password ? false : true)
        setmistakeEmail(email ? false : true)
        setmistakeFirst(firstName ? false : true)
    }


    const passwordChecker = () => {
        let {username,email,password, retype, firstName} = addAccount
        // let passRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})")
        if (password && retype){
            if (regexChar.test(password)){
                if (regexCaps.test(password)){
                    if(regexLow.test(password)){
                        if(regexNumb.test(password)){
                            if(password === retype){
                                if(username && email && password && retype && firstName){
                                    registerHandler()
                                }else {
                                    return
                                }
                            }else{
                                setmistakePassword(true)
                                setpasswordError("Password Tidak Sama")
                            }
                        }else {
                            setmistakePassword(true)
                            setpasswordError("Password Harus ada Minimal 1 Angka")
                        }
                    }else {
                        setmistakePassword(true)
                        setpasswordError("Password Harus ada Minimal 1 Lower Case")
                    }
                }else {
                    setmistakePassword(true)
                    setpasswordError("Password Harus ada Minimal 1 Capital")
                }
            }else {
                setmistakePassword(true)
                setpasswordError("Karakter Minimal 6 Character")
            }
        }else {
            setmistakePassword(true)
            setpasswordError("Password Harap Diisi")
        }
    }
    const registerClick = (e) => {
        // let {username,email,password,retype,firstName} = addAccount
        e.preventDefault()
        formChecker()
        passwordChecker()
    }
    const inputHandler = (e) => {
        setaddAccount({...addAccount, [e.target.name] : e.target.value})
    }
    const registerHandler = async() => {
        // console.log(addAccount.username)
        // console.log(addAccount.firstName)
        const {username, email, password, firstName, lastName} = addAccount
        try {
            await axios.post(`${API_URL}/auth/register`, {
                username,
                email,
                password,
                firstName,
                lastName
            }).then (() => {
                Swal.fire(
                    `Registered!`,
                    `Please Check your Email to Verify your Account!`,
                    `success`
                )
                setOpen(!open)
            })
        } catch (error) {
            console.log(error.response.data.message)
            toast.error(error.response.data.message ||"Server Error", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
            })
        }
    }

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight={'bold'} align={'center'} >
                        Register an Account
                    </Typography>
                    <CssTextField name="username" value={addAccount.username} onChange={inputHandler} fullWidth label="Username" id="custom-css-outlined-input" sx={{mt: 1}}  />
                        <Typography display={mistakeName ? "block" : "none"} color='error' sx={{fontSize:12, mt:0.5, justifyContent:'center'}} ><ErrorIcon sx={{fontSize:'medium', mr:0.5}} />Username Harap diisi</Typography>
                    <CssTextField name="email" value={addAccount.email} onChange={inputHandler} fullWidth label="Email" id="custom-css-outlined-input" sx={{mt: 1}} />
                        <Typography display={mistakeEmail ? "block" : "none"} color='error' sx={{fontSize:12, mt:0.5, justifyContent:'center'}} ><ErrorIcon sx={{fontSize:'medium', mr:0.5}} />Email Harap diisi</Typography>
                    <CssTextField name="password" value={addAccount.password} onChange={inputHandler} fullWidth label="Password" id="custom-css-outlined-input" sx={{mt: 1}} type={showPassword ? "text" : "password" }
                    InputProps={{
                        endAdornment: 
                        <InputAdornment position="end">
                            <IconButton onClick={handleShowPassword}>
                                {showPassword ? <VisibilityOff/> : <Visibility/> } 
                            </IconButton>
                        </InputAdornment>,
                    }}
                    />
                    <CssTextField name="retype" value={addAccount.retype} onChange={inputHandler} fullWidth label="Re-Type Password" id="custom-css-outlined-input" sx={{mt: 1}} type={showPassword ? "text" : "password" }
                        InputProps={{
                            endAdornment: 
                            <InputAdornment position="end">
                                <IconButton onClick={handleShowPassword} >
                                    {showPassword ? <VisibilityOff/> : <Visibility/> } 
                                </IconButton>
                            </InputAdornment>,
                        }}
                    />
                        <Typography display={mistakePassword ? "block" : "none"} color='error' sx={{fontSize:12, mt:0.5, justifyContent:'center'}} ><ErrorIcon sx={{fontSize:'medium', mr:0.5}} />{passwordError}</Typography>
                    <CssTextField name="firstName" value={addAccount.firstName} onChange={inputHandler} fullWidth label="First Name" id="custom-css-outlined-input" sx={{mt: 1}} />
                        <Typography display={mistakeFirst ? "block" : "none"} color='error' sx={{fontSize:12, mt:0.5, justifyContent:'center'}} ><ErrorIcon sx={{fontSize:'medium', mr:0.5}} />First Name Harap diisi</Typography>
                    <CssTextField name="lastName" value={addAccount.lastName} onChange={inputHandler} fullWidth label="Last Name" id="custom-css-outlined-input" sx={{mt: 1}} />
                    <ColorButton  fullWidth variant="contained" sx={{mt:2}} size='large' onClick={registerClick} >
                            Register
                    </ColorButton>
                </Box>
            </Modal>
        </div>
    )
}

export default Register
