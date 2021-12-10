import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_URL } from '../constants/api';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    borderRadius: '15px',
    boxShadow: 24,
    p: 4,

};
const Login = ({ open, handleClose }) => {
    const dispatch = useDispatch()

    // Input Data Login
    const [inputLogin, setInputLogin] = useState({
        usernamemail: "",
        password: ""
    })
    const inputHandler = (e) => {
        setInputLogin({ ...inputLogin, [e.target.name]: e.target.value })
    }

    // Lihat Password
    const [lihatpw, setLihatpw] = useState("password")
    const lihatpwHandler = (e) => {
        if (e.target.checked) {
            setLihatpw("text")
        } else {
            setLihatpw("password")
        }
    }

    // Alert akun tidak terdaftar
    const [accAlert, setAccAlert] = useState(true)

    const onLogin = async () => {
        const { usernamemail, password } = inputLogin
        // Kalo inputnya kurang gaboleh
        if (!usernamemail || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                timer: 1500,
                timerProgressBar: true
            })
            return
        }
        try {
            let res = await axios.post(`${API_URL}/auth/login`, {
                username: usernamemail,
                email: usernamemail,
                password: password
            })
            // alert kalo akunnya ga ada
            if (!res.data.length) {
                setAccAlert(false)
                return
            }
            setAccAlert(true)
            localStorage.setItem("token", res.headers["access-token"])
            dispatch({ type: "login", payload: res.data[0] })
            handleClose()
            Swal.fire({
                icon: 'success',
                title: 'Yay!',
                text: 'Log in success',
                timer: 1500,
                timerProgressBar: true
            })
        } catch (error) {
            console.log(error);
            alert(error.message)
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
                <Box sx={style} style={{ textAlign: "center" }}>
                    <div className="mb-8">
                        <Typography
                            id="modal-modal-title" variant="h4"
                            component="h4" fontWeight={'bold'}
                        >
                            Login
                        </Typography>
                    </div>
                    <div className="mb-3">
                        <TextField
                            fullWidth size="small"
                            id="outlined-basic" label="Username or Email"
                            variant="outlined" name="usernamemail"
                            onChange={inputHandler} color="success"
                        />
                    </div>
                    <div className="mb-3">
                        <TextField
                            fullWidth size="small"
                            id="outlined-basic" label="Password"
                            variant="outlined" type={lihatpw}
                            name="password" onChange={inputHandler} color="success"
                        />
                    </div>
                    <div className="mb-3" hidden={accAlert}>
                        <Alert severity="error">Account is not registered!</Alert>
                    </div>
                    <div className="mb-3 flex justify-between">
                        <div>
                            <input type="checkbox" onChange={lihatpwHandler} /> Show Password
                        </div>
                        <Link to="/" className="text-indigo-500 hover:underline" style={{ color: "#0000EE" }}>Forgot password?</Link>
                    </div>
                    <Button variant="contained" onClick={onLogin} style={{ backgroundColor: "#66806a" }}>Login</Button>
                </Box>
            </Modal>
        </div>
    )
}

export default Login
