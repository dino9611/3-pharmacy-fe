import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { API_URL } from '../constants/api';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 7
};

const UserCustomModal = ({openCustom, handleClose}) => {
    const authState = useSelector(state => state.auth)
    const [file, setfile] = useState(null);
    const fileInput = React.useRef(null);


    const onFileChange = (e) => {
        if (e.target.files[0]) {
          setfile(e.target.files[0]);
        } else {
          setfile(null);
        }
    };


    const onCloseHandler = () => {
        setfile(null)
        handleClose()
    }

    const onConfirmHandler = async () => {
        if (file == null){
            alert("Please Upload your Prescription")
            return
        }
        const formData = new FormData()
        formData.append('custom', file)
        try {
            let results = await axios.post(API_URL + `/custom/upload/${authState.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            onCloseHandler()
            Swal.fire(
                `Upload Success!`,
                `Please wait for our Admin review the Prescription!`,
                `success`
            );
            console.log(results)
        } catch (error) {
            console.log(error)
            alert(error)
        }

    }
    return (
        <div>
            <input
                ref={fileInput}
                type='file'
                className='hidden'
                onChange={onFileChange}
            />
            <Modal
            open={openCustom}
            onClose={onCloseHandler}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Made by Order
                </Typography>
                <div className='flex flex-col items-center'>
                    <Button variant="contained" onClick={() => fileInput.current.click()} style={{ backgroundColor: "#66806a" }} sx={{mb:2}}>
                            Upload Prescription
                    </Button>
                    {file ? (
                        <img
                        className='object-contain h-64 w-96 bg-gray-200 rounded-lg'
                        src={URL.createObjectURL(file)}
                        alt={file}
                        ></img>
                    ) : (
                        <div className='h-64 w-96 bg-gray-200 rounded-lg' />
                    )}
                    <Button onClick={onConfirmHandler} variant="contained" style={{ backgroundColor: "#66806a" }} sx={{mt:2}}>
                            Confirm
                    </Button>
                </div>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Ini nanti buat footer please take note 
                </Typography>
            </Box>
            </Modal>
        </div>
    );
}

export default UserCustomModal