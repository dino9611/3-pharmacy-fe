import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles'
import { API_URL } from "../constants/api";
import axios from "axios";
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'

const ForgotText = styled(TextField)({
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
const ForgetPass = ({setopenDialog, openDialog, handlecloseDialog}) => {

    const [username, setusername] = useState("")
    const inputHandler = (e) => {
        setusername([e.target.name] = e.target.value)
    }

    const sendClick = (e) => {
        e.preventDefault()
        submitValidation()
    }
    const submitValidation = async() => {
        let option = {
            params:{
                username: username
            }
        }
        try {
            const res = await axios.get(`${API_URL}/auth/validasi/password`, option)
            Swal.fire(
                `Sent!`,
                `Please Check your Email to Change your Account!`,
                `success`
            )
            console.log(res.data)
            setopenDialog(!openDialog)
        } catch (error) {
            toast.error(error.response.data.message ||"Server Error", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
            })
        }
    }




    return(
        <div>
            <Dialog open={openDialog} onClose={handlecloseDialog}>
                <DialogTitle>Username Validation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To reset your password, please enter your username here. We
                        will send validation link to your email for changing password.
                    </DialogContentText>
                    <ForgotText 
                    autoFocus
                    fullWidth
                    margin="dense"
                    variant="standard"
                    name="username"
                    value={username}
                    onChange={inputHandler}
                    />
                </DialogContent>
                <DialogActions>
                <Button  onClick={handlecloseDialog} sx={{color: '#66806A'}}>Cancel</Button>
                <Button onClick={sendClick} sx={{color: '#66806A'}} >Send</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ForgetPass