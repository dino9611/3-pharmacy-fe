import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
// ? redux
import { useDispatch } from 'react-redux';
import { editProduct } from '../redux/actions/productActions';

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

const EditModal = ({
  title,
  initInput,
  input,
  setinput,
  open,
  setOpen,
  handleClose,
}) => {
  const dispatch = useDispatch();
  const [file, setfile] = React.useState(null);
  const onFileChange = (e) => {
    if (e.target.files[0]) {
      setfile(e.target.files[0]);
    } else {
      setfile(null);
    }
  };

  const onCancelClick = (e) => {
    e.preventDefault();
    setOpen(false);
    setinput({ stock: '' });
  };
  const onConfirmClick = (e) => {
    e.preventDefault();
    const { id, stock } = input;
    const init = initInput.current;
    dispatch(
      editProduct(file, { id, stock: init.stock !== stock && parseInt(stock) })
    );
    setOpen(false);
    setinput({ stock: '' });
    // window.location.reload(false);
  };
  const inputHandler = (e) =>
    setinput({ ...input, [e.target.name]: e.target.value });

  return (
    <div>
      <input type='file' className='hidden' onChange={onFileChange} />
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
            {title}
          </Typography>

          {/*//! inputs */}
          <CssTextField
            name='stock'
            value={input.stock}
            onChange={inputHandler}
            fullWidth
            type='number'
            label='stock'
            id='custom-css-outlined-input'
            sx={{ mt: 1 }}
          />
          <ColorButton
            fullWidth
            variant='contained'
            sx={{ mt: 2 }}
            size='large'
            onClick={onCancelClick}
          >
            Cancel
          </ColorButton>
          <ColorButton
            fullWidth
            variant='contained'
            sx={{ mt: 2 }}
            size='large'
            onClick={onConfirmClick}
          >
            Confirm
          </ColorButton>
        </Box>
      </Modal>
    </div>
  );
};

export default EditModal;
