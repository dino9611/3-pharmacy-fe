import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { API_URL } from '../constants/api';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import {
    getRawMaterials,
    resetState as resetStateRawMaterial,
} from '../redux/actions/rawMaterialActions';
import CompositionSelect from './ProductCompSelect';
import StatusSelect from './StatusSelect';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 5
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


const CreatePrescription = ({open, handleClose, dataCustom, handleClosetest}) => {

    const compositions = useSelector(
      (state) => state.rawMaterialReducers.rawMaterials
    );
    const [file] = useState(null);
    // untuk getData RawMaterial
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getRawMaterials(1, 40));
        return () => {
          dispatch(resetStateRawMaterial('rawMaterials'));
        }
    },[dispatch])

    const initialInputVal = React.useMemo(() => {
        return {
          medicineName: '',
          qty: '',
          compositions: [],
          compositionsAmount: [],
          id: dataCustom?.id
        };
    }, []);
    const [dataPrescription, setdataPrescription] = useState(initialInputVal)


    const inputHandler = (e) => {
      setdataPrescription({ ...dataPrescription, [e.target.name]: e.target.value });
    }

    const onCancel = () => {
      handleClose()
      setdataPrescription(initialInputVal)
    }


    const onConfirm = async () => {
      if (!(dataPrescription.medicineName && dataPrescription.compositions.length && dataPrescription.qty)){
        alert("Please complete the data")
        return
      }
      let inputPrescription = {...dataPrescription, id : dataCustom.id}
      let {compositionsAmount} = inputPrescription
      inputPrescription.compositions.forEach((val, i, arr) => {
        arr[i] = [val, compositionsAmount[i]]
      })
      delete inputPrescription.compositionsAmount
      console.log(inputPrescription.compositions)
      try {
        await axios.post(`${API_URL}/custom/create`, inputPrescription)
        alert("Medicine Add Success")
        handleClosetest()
      } catch (error) {
        console.log(error)
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
            <Typography
              id='modal-modal-title'
              variant='h6'
              component='h2'
              fontWeight={'bold'}
              align={'center'}
            >
            Create Custom Medicine
            </Typography>
            <div className='flex justify-evenly '>
              <div className='flex flex-col items-center '>
                <img
                  className='object-contain h-64 w-96 bg-gray-200 rounded-lg mt-2'
                  src={API_URL + dataCustom?.image}
                  alt={file}
                ></img>
              </div>
              <div className='flex flex-col'>
                <div className='flex mr-1'>
                  <CssTextField
                    name='medicineName'
                    value={dataPrescription.medicineName}
                    onChange={inputHandler}
                    label='Medicine Name'
                    id='custom-css-outlined-input'
                    sx={{ mt: 1, width: 1 / 2, mr: 1 }}
                  />
                  <CssTextField
                    name='qty'
                    value= {dataPrescription.qty}
                    onChange={inputHandler}
                    type='number'
                    label='Quantity'
                    id='custom-css-outlined-input'
                    sx={{ mt: 1, width: 1 / 2 }}
                  />
                </div>
                <div>
                  <CompositionSelect
                    input={dataPrescription}
                    setinput={setdataPrescription}
                    options={compositions}
                    label={'Compositions'}
                  />
                </div>
              </div>
            </div>
            <ColorButton
              fullWidth
              variant='contained'
              sx={{ mt: 2 }}
              size='large'
              onClick={onCancel}
            >
              Cancel
            </ColorButton>
            <ColorButton
              fullWidth
              variant='contained'
              sx={{ mt: 2 }}
              size='large'
              onClick={onConfirm}
            >
              Confirm
            </ColorButton>  
          </Box>
        </Modal>
      </div>
    )
}

export default CreatePrescription