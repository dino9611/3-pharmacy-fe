import { Alert, Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { API_URL } from '../../constants/api';

const UploadPayment = () => {
  const { order_id } = useParams();

  const [checkout, setCheckout] = useState([]);
  const [file, setFile] = useState(null);

  const hiddenFileInput = useRef(null);

  const handleClick = (e) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    if (!file) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No image uploaded',
        timer: 1500,
        timerProgressBar: true,
      });
    }
    const formData = new FormData();
    formData.append('product', file);
    try {
      await axios.patch(
        `${API_URL}/transaction/paymentproof/${order_id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      Swal.fire({
        icon: 'success',
        title: 'Yay!',
        text: 'Upload image success',
        timer: 1500,
        timerProgressBar: true,
      });
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    const getCheckout = async () => {
      try {
        let res = await axios.get(
          `${API_URL}/transaction/getcheckout/${order_id}`
        );
        setCheckout(res.data);
      } catch (error) {
        alert(error);
      }
    };
    getCheckout();
    setFile(file);
  }, [file]);

  return (
    <div>
      <div className='font-poppins text-center h-screen pt-16 phone:pt-2 phone:px-2 bg-lightblue'>
        <div className='flex w-max mx-auto'>
          <Alert
            icon={false}
            severity='info'
          >{`${checkout[0]?.bank} - ${checkout[0]?.accountNumber}`}</Alert>
        </div>
        <input
          type='file'
          ref={hiddenFileInput}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
        {file ? (
          <>
            <img
              className='object-contain h-64 w-96 phone:h-48 phone:w-full cursor-pointer bg-gray-200 rounded-lg mx-auto my-5 phone:my-2'
              src={URL.createObjectURL(file)}
              alt={file}
              onClick={handleClick}
            ></img>
            <Link to='/order-list'>
              <button
                className='bg-primary1 phone:px-3 phone:text-xs text-white px-5 py-2 rounded mr-4 hover:bg-peach-light'
                onClick={onUpload}
              >
                Upload
              </button>
            </Link>
          </>
        ) : (
          <>
            <div
              className='h-64 w-96  phone:h-48 bg-gray-200 hover:bg-gray-300 cursor-pointer border-dashed border-2 border-primary1 rounded-lg mx-auto my-5 phone:my-2 phone:w-full flex items-center justify-center'
              onClick={handleClick}
            >
              <p className='text-primary1 font-medium text-lg'>No image</p>
            </div>
            <button
              className='bg-primary1 text-white px-5 py-2 phone:px-3 phone:text-xs rounded mr-4 hover:bg-peach-light hover:text-black'
              onClick={onUpload}
            >
              Upload
            </button>
          </>
        )}

        <Link to='/products'>
          <button className='text-primary1 phone:text-xs font-bold'>
            Later
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UploadPayment;
