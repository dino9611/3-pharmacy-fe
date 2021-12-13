import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
// ? redux
import { useDispatch, useSelector } from 'react-redux';
import {
  getProductCategories,
  addProduct,
  resetState as resetStateProduct,
} from '../redux/actions/productActions';
import {
  getRawMaterials,
  resetState as resetStateRawMaterial,
} from '../redux/actions/rawMaterialActions';
// ? components
import CategorySelect from './ProductCategorySelect';
import CompositionSelect from './ProductCompSelect';

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

const CreateModal = ({ title, open, handleClose, setOpen }) => {
  const categories = useSelector((state) => state.productReducers.categories);
  const compositions = useSelector(
    (state) => state.rawMaterialReducers.rawMaterials
  );

  const dispatch = useDispatch();
  const [file, setfile] = useState(null);
  const fileInput = React.useRef(null);

  React.useEffect(() => {
    dispatch(getProductCategories());
    dispatch(getRawMaterials(1, 40));
    return () => {
      dispatch(resetStateProduct('categories'));
      dispatch(resetStateRawMaterial('rawMaterials'));
    };
  }, [dispatch]);

  const onFileChange = (e) => {
    if (e.target.files[0]) {
      setfile(e.target.files[0]);
    } else {
      setfile(null);
    }
  };

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
  const [input, setinput] = useState(initialInputVal);

  const onCancelClick = (e) => {
    e.preventDefault();
    setOpen(false);
    setinput(initialInputVal);
    fileInput.current.files = null;
    setfile(null);
  };
  const onConfirmClick = (e) => {
    e.preventDefault();
    setOpen(false);

    const handleSuccess = () => {
      setinput(initialInputVal);
      setfile(null);
    };
    dispatch(addProduct(file, input, handleSuccess, handleSuccess));
    // window.location.reload(false);
  };
  const inputHandler = (e) =>
    setinput({ ...input, [e.target.name]: e.target.value });

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
            {title}
          </Typography>

          {/*//! inputs */}
          <div className='flex justify-between'>
            <div className='flex flex-col'>
              {/* <div className='flex w-1/2 mr-1'> */}
              <div className='flex mr-1'>
                <CssTextField
                  name='productName'
                  value={input.productName}
                  onChange={inputHandler}
                  label='product name'
                  id='custom-css-outlined-input'
                  sx={{ mt: 1, width: 1 / 2, mr: 1 }}
                />
                <CssTextField
                  name='stock'
                  value={input.stock}
                  onChange={inputHandler}
                  type='number'
                  label='stock'
                  id='custom-css-outlined-input'
                  sx={{ mt: 1, width: 1 / 2 }}
                />
              </div>
              <CssTextField
                name='description'
                value={input.description}
                onChange={inputHandler}
                // type='text'
                multiline
                rows={4}
                label='product description'
                id='custom-css-outlined-input'
                sx={{ mt: 1 }}
              />
              <div>
                <CategorySelect
                  input={input}
                  setinput={setinput}
                  options={categories}
                  label={'Categories'}
                />
                <CompositionSelect
                  input={input}
                  setinput={setinput}
                  options={compositions}
                  label={'Compositions'}
                />
              </div>

              <div className='flex'>
                <ColorButton
                  variant='contained'
                  sx={{ mt: 2 }}
                  size='large'
                  onClick={onCancelClick}
                >
                  Cancel
                </ColorButton>
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

            <div className='flex flex-col items-center'>
              <button
                onClick={() => fileInput.current.click()}
                className='btn bg-third text-white hover:bg-primary-450 transition-colors h-10 my-1 w-32'
              >
                input image
              </button>
              {file ? (
                <img
                  className='object-contain h-64 w-96 bg-gray-200 rounded-lg'
                  src={URL.createObjectURL(file)}
                  alt={file}
                ></img>
              ) : (
                <div className='h-64 w-96 bg-gray-200 rounded-lg' />
              )}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateModal;
