import React from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import {
  getPrescriptions,
  uploadPrescription,
} from '../../redux/actions/prescriptionActions';

export default function Prescriptions() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.isLogin);

  const fileInput = React.useRef(null);
  const [file, setfile] = React.useState(null);

  return (
    <div className='grid grid-cols-7 grid-rows-1 gap-y-4 font-poppins bg-lightblue'>
      <input
        ref={fileInput}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={(e) => {
          if (e.target.files[0]) {
            setfile(e.target.files[0]);
          } else {
            setfile(null);
          }
        }}
      />
      <div className='col-span-full flex flex-col items-center'>
        <h3 className='text-xl font-semibold text-white bg-primary1 py-1 mb-2 w-full text-center'>
          Upload Prescription
        </h3>
        {file ? (
          <img
            onClick={() => fileInput.current.click()}
            // className='object-contain phone:h-52 phone:w-11/12 border-dashed border-4 border-gray-700 h-96 w-full bg-gray-300 rounded-lg flex justify-center items-center text-gray-600 cursor-pointer'
            className='p-1 object-contain h-96 phone:h-72 w-3/5 phone:w-11/12 border-dashed border-2 border-black rounded-md bg-black flex justify-center items-center text-gray-600 cursor-pointer bg-opacity-20'
            k
            style={{ maxWidth: '600px' }}
            src={URL.createObjectURL(file)}
            alt={file}
          ></img>
        ) : (
          <div
            onClick={() => fileInput.current.click()}
            style={{ maxWidth: '600px' }}
            className='object-contain phone:h-72 w-3/5 phone:w-11/12 border-dashed border-2 border-black rounded-md h-96 bg-black flex justify-center items-center text-gray-600 cursor-pointer bg-opacity-20'
          >
            <svg
              className='w-10 h-10'
              data-darkreader-inline-fill=''
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path d='M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z' />
              <path d='M9 13h2v5a1 1 0 11-2 0v-5z' />
            </svg>
            Drop Image Here
          </div>
        )}
        <div className='mt-2 w-full flex justify-center items-center'>
          {file ? (
            <button
              className='h-10 btn btn-primary flex'
              onClick={() => {
                if (!isLogin) {
                  toast.error('Login to upload prescription');
                  return;
                }
                dispatch(
                  uploadPrescription(file, {
                    handleSuccess: () => {
                      Swal.fire(
                        `Upload Success!`,
                        `Please wait for admins to review the prescription!`,
                        `success`
                      );
                      setfile(null);
                      dispatch(getPrescriptions());
                    },
                    handleFail: (err) =>
                      toast.error(err.response?.data.message),
                  })
                );
              }}
            >
              <svg
                className='w-6 h-6'
                data-darkreader-inline-fill=''
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
              Upload
            </button>
          ) : (
            <div className='h-10' />
          )}
        </div>
        <div className='w-full px-5 mb-10 phone:mb-5 flex justify-center'>
          <p className='w-3/5 phone:w-full px-5 rounded phone:text-sm'>
            1. Upload prescription image
            <br />
            2. Wait for admin to approve your prescription image
            <br />
            3. Upload your payment proof
            <br />
            4. Wait for admin to approve your payment proof
            <br />
            5. Wait for your order to be delivered
            <br />
            6. Confirm your delivery when order is delivered
          </p>
        </div>
      </div>
    </div>
  );
}
