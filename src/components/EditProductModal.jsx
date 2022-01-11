import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
// ? redux
import { useDispatch, useSelector } from 'react-redux';
import {
  editProduct,
  getProductCategories,
  resetState as resetStateProduct,
} from '../redux/actions/productActions';
import {
  getRawMaterials,
  resetState as resetStateRawMaterial,
} from '../redux/actions/rawMaterialActions';
import CompositionSelect from './ProductCompSelect';
import { API_URL } from '../constants/api';
import MultipleEdit from './ProductCategoryEdit';

import { toast } from 'react-toastify';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
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
  open,
  setOpen,
  handleClose,
  indexProduct,
  paginatedProducts,
  oldCat,
  amountDef,
  compDef,
}) => {
  // const initInput = React.useRef(null);

  // untuk dapetin data product mana yang mau diedit bedasarkan indexproduct
  const produkIndex = paginatedProducts[indexProduct];

  // untuk get compositions dan category
  const categories = useSelector((state) => state.productReducers.categories);
  // const compositions = useSelector(
  //   (state) => state.rawMaterialReducers.rawMaterials
  // );

  // Iniadalah initial value
  const initialInputVal = React.useMemo(() => {
    return {
      productName: '',
      stock: '',
      description: '',
      categories: [],
      compositions: [],
      compositionsAmount: [],
    };
  }, []);

  // untuk menyimpan data yang diedit untuk dikirim ke API
  const [dataUpdate, setdataUpdate] = useState(initialInputVal);
  // const [input, setinput] = useState(initialInputVal);
  const inputHandler = (e) => {
    setdataUpdate({ ...dataUpdate, [e.target.name]: e.target.value });
  };

  // untuk get data categories dan raw material
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProductCategories(), {
      handleFail: (err) =>
        toast.error(err.response.data.message || 'server error'),
    });
    dispatch(getRawMaterials(1, 40), {
      handleFail: (err) =>
        toast.error(err.response.data.message || 'server error'),
    });
    return () => {
      dispatch(resetStateProduct('categories'));
      dispatch(resetStateRawMaterial('rawMaterials'));
    };
  }, [dispatch]);

  // untuk set file gambar
  const [file, setfile] = React.useState(null);
  const fileInput = React.useRef(null);
  const onFileChange = (e) => {
    if (e.target.files[0]) {
      setfile(e.target.files[0]);
    } else {
      setfile(null);
    }
  };

  const onCancelClick = (e) => {
    e.preventDefault();
    setdataUpdate(initialInputVal);
    setOpen(false);
    fileInput.current.files = null;
    setfile(null);
  };

  const onConfirmClick = (e) => {
    e.preventDefault();
    if (dataUpdate.compositions.length !== amountDef.length) {
      alert('Please Select All Compositions');
      return;
    }

    let inputData = {
      ...dataUpdate,
      oldCategories: oldCat,
      id: produkIndex?.id,
    };
    dispatch(
      editProduct(file, inputData, {
        handleSuccess: () => toast.success('successfully edited product'),
        handleFail: (err) =>
          toast.error(err.response.data.message || 'server error'),
      })
    );
    setOpen(false);
  };

  return (
    <div>
      <input
        ref={fileInput}
        type='file'
        className='hidden'
        onChange={onFileChange}
      />
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
            Edit Modal
          </Typography>

          {/*//! inputs */}
          <div className='flex justify-evenly '>
            <div className='flex flex-col items-center '>
              <button
                onClick={() => fileInput.current.click()}
                className='btn bg-third text-white hover:bg-primary-450 transition-colors h-10 my-1 w-32'
              >
                Input Image
              </button>
              {file ? (
                <img
                  className='object-contain h-64 w-96 bg-gray-200 rounded-lg mt-2'
                  src={URL.createObjectURL(file)}
                  alt={file}
                ></img>
              ) : (
                <img
                  className='object-contain h-64 w-96 bg-gray-200 rounded-lg mt-2'
                  src={API_URL + produkIndex?.imagePath}
                  alt={file}
                ></img>
              )}
              <ColorButton
                fullWidth
                variant='contained'
                sx={{ mt: 3.5 }}
                size='large'
                onClick={onCancelClick}
              >
                Cancel
              </ColorButton>
            </div>
            <div className='flex flex-col'>
              <div className='flex mr-1'>
                <CssTextField
                  name='productName'
                  defaultValue={produkIndex?.productName}
                  onChange={inputHandler}
                  label='product name'
                  id='custom-css-outlined-input'
                  sx={{ mt: 1, width: 1 / 2, mr: 1 }}
                />
                <CssTextField
                  name='stock'
                  defaultValue={produkIndex?.stock}
                  onChange={inputHandler}
                  type='number'
                  label='stock'
                  id='custom-css-outlined-input'
                  sx={{ mt: 1, width: 1 / 2 }}
                />
              </div>
              <CssTextField
                name='description'
                defaultValue={produkIndex?.description}
                onChange={inputHandler}
                // type='text'
                multiline
                rows={4}
                label='product description'
                id='custom-css-outlined-input'
                sx={{ mt: 1 }}
              />
              <div>
                <MultipleEdit
                  input={dataUpdate}
                  setinput={setdataUpdate}
                  options={categories}
                  label={'Categories'}
                  oldCat={oldCat}
                />
                <CompositionSelect
                  input={dataUpdate}
                  setinput={setdataUpdate}
                  options={compDef}
                  label={'Compositions'}
                />
              </div>
              <ColorButton
                variant='contained'
                sx={{ mt: 2 }}
                size='large'
                onClick={onConfirmClick}
              >
                Confirm
              </ColorButton>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default EditModal;
