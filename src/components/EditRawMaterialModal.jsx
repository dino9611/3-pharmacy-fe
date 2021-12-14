import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
// ? redux
import { useDispatch } from 'react-redux';
import { editRawMaterial } from '../redux/actions/rawMaterialActions';

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

  const onCancelClick = (e) => {
    e.preventDefault();
    setOpen(false);
    setinput({
      materialName: '',
      bottleChange: '',
      unitPerBottle: '',
      priceRpPerUnit: '',
      unit: '',
    });
  };
  const onConfirmClick = (e) => {
    e.preventDefault();
    const {
      index,
      id,
      materialName,
      bottleChange,
      unitPerBottle,
      priceRpPerUnit,
      unit,
    } = input;
    const init = initInput.current;
    dispatch(
      editRawMaterial({
        index,
        id,
        materialName: init.materialName !== materialName && materialName,
        bottleChange:
          init.bottleChange !== bottleChange && parseInt(bottleChange),
        unitPerBottle: init.unitPerBottle !== unitPerBottle && unitPerBottle,
        priceRpPerUnit:
          init.priceRpPerUnit !== priceRpPerUnit && priceRpPerUnit,
        unit: init.unit !== unit && unit,
      })
    );
    setOpen(false);
    setinput({
      materialName: '',
      bottleChange: '',
      unitPerBottle: '',
      priceRpPerUnit: '',
      unit: '',
    });
    // window.location.reload(false);
  };
  const inputHandler = (e) =>
    setinput({ ...input, [e.target.name]: e.target.value });

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
            {title}
          </Typography>

          {/*//! inputs */}
          <CssTextField
            name='materialName'
            value={input.materialName}
            onChange={inputHandler}
            fullWidth
            label='raw material name'
            id='custom-css-outlined-input'
            sx={{ mt: 1 }}
          />
          <CssTextField
            name='bottleChange'
            value={input.bottleChange}
            onChange={inputHandler}
            fullWidth
            type='number'
            label='bottle change'
            id='custom-css-outlined-input'
            sx={{ mt: 1 }}
          />
          <CssTextField
            name='unitPerBottle'
            value={input.unitPerBottle}
            onChange={inputHandler}
            fullWidth
            type='number'
            label='unit per bottle'
            id='custom-css-outlined-input'
            sx={{ mt: 1 }}
          />
          <CssTextField
            name='priceRpPerUnit'
            value={input.priceRpPerUnit}
            onChange={inputHandler}
            fullWidth
            type='number'
            label='price Rp per unit'
            id='custom-css-outlined-input'
            sx={{ mt: 1 }}
          />
          <CssTextField
            name='unit'
            value={input.unit}
            onChange={inputHandler}
            fullWidth
            type='text'
            label='unit'
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
