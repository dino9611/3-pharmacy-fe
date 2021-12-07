import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

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
const Register = ({open, handleClose}) => {

    //! ini dibawah taro dihalaman lain.
    // const [open, setOpen] = useState(false)
    // const handleOpen = () => setOpen(true);
    // const handleClose = () => setOpen(false);
    // <Button onClick={handleOpen}>Open modal</Button>
    // <Register open={open} handleClose={handleClose}/>



    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight={'bold'} >
                        Register an Account
                    </Typography>
                    {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography> */}
                    
                </Box>
            </Modal>
        </div>
    )
}

export default Register
