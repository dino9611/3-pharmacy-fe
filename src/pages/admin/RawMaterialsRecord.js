import React from 'react';
// ? redux
import { useDispatch, useSelector } from 'react-redux';
import {
  getRawMaterialsRecord,
  resetState,
} from '../../redux/actions/rawMaterialActions';
// ? components
import AdminTable from '../../components/Tables/AdminTable';
// ? forms
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as yup from 'yup';

import { toast } from 'react-toastify';

export default function RawMaterialsRecordTable() {
  const dispatch = useDispatch();
  // * pagination states
  const rows = useSelector(
    (state) => state.rawMaterialReducers.rawMaterialsRecord
  );
  const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const rowsPerPage = 8;

  // * modal states
  React.useEffect(() => {
    dispatch(
      getRawMaterialsRecord(page + 1, rowsPerPage, {
        handleFail: (err) =>
          toast.error(err.response.data.message || 'server error'),
      })
    );
    return () => dispatch(resetState('rawMaterials'));
  }, [dispatch, page, rowsPerPage]);
  const emptyRows = rowsPerPage - rows.length;

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  return (
    <>
      <div className='bg-secondary1 flex flex-col h-full lg:w-4/5 w-full absolute right-0 font-poppins'>
        <div className='flex flex-col h-full justify-between'>
          <div className='flex m-3'>
            <div className='flex border-2 rounded'>
              <input
                type='text'
                className='px-4 py-2 w-80'
                placeholder='Search Raw Materials...'
              />
              <button className='flex items-center justify-center px-4 border-l bg-white'>
                <svg
                  className='w-6 h-6 text-gray-600'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z' />
                </svg>
              </button>
            </div>
          </div>

          <AdminTable
            name='Raw Materials Record'
            page={page}
            maxPage={5}
            cols={[
              {
                label: 'Raw Material Name',
                className: 'font-semibold',
                format: (row) => row.materialName,
              },
              {
                label: 'Inventory',
                className: '',
                format: (row) =>
                  `${Math.floor(
                    row.inventoryChange / row.unitPerBottle
                  )} bottles ${(
                    row.inventoryChange % row.unitPerBottle
                  ).toFixed(2)} ${row.unit}`,
              },
              {
                label: 'Unit Per Bottle',
                className: '',
                format: (row) => `${row.unitPerBottle} ${row.unit} per bottle`,
              },
              {
                label: 'Datetime',
                className: '',
                format: (row) => row.datetime.slice(0, 19).replace('T', ' '),
              },
              { label: '' },
            ]}
            rows={rows}
            emptyRows={emptyRows}
            actions={{
              setPage,
            }}
            DetailsModal={DetailsModal}
          />
        </div>
      </div>
    </>
  );
}

const DetailsModal = (toggleModal) => (
  <div className='z-50 bg-white w-auto h-auto rounded-lg flex justify-center items-center p-5'>
    <Formik
      initialValues={{
        username: '',
        arrOfObj: [{ id: 2, amountInUnit: 2.1 }],
        objOfObj: {},
      }}
      onSubmit={(values) => console.log(values)}
      validationSchema={yup.object({
        username: yup.string().required('username required!'),
        description: yup.string().required('description required!'),
        arrOfObj: yup.array().of(
          yup.object({
            // amountInUnit: yup.number().moreThan(0),
            amountInUnit: yup.string().max(2),
          })
        ),
      })}
    >
      <Form className='flex flex-col items-center font-poppins'>
        <h1 className=' text-2xl font-bold self-start mb-10'>
          <span className='bg-blue-200'>Cr</span>
          eate
        </h1>
        <label
          className='block text-gray-700 text-sm font-bold mb-2 self-start'
          htmlFor='username'
        >
          Username
        </label>
        <Field
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          id='username'
          name='username'
          type='text'
          placeholder='Chem1'
        />
        <p className='text-red-500 text-sm h-6 self-start'>
          <ErrorMessage name='username' />
        </p>
        <label
          className='block text-gray-700 text-sm font-bold mb-2 self-start'
          htmlFor='description'
        >
          Description
        </label>
        <Field
          className='resize-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
          as='textarea'
          id='description'
          name='description'
        />
        <p className='text-red-500 text-sm h-6 self-start'>
          <ErrorMessage name='description' />
        </p>

        <label className='block text-gray-700 text-sm font-bold mb-2 self-start'>
          Array of Object
        </label>
        <FieldArray name='arrOfObj'>
          {(props) => {
            const { push, remove, form } = props;
            const { values } = form;
            const { arrOfObj } = values;
            return (
              <div className='w-full'>
                <button type='button' onClick={() => push('')}>
                  <svg
                    className='w-6 h-6'
                    data-darkreader-inline-fill=''
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
                {arrOfObj.map((obj, i) => (
                  <div key={i} className='flex'>
                    <Field
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      name={`arrOfObj[${i}].amountInUnit`}
                    />
                    <ErrorMessage
                      className='text-red-500 text-sm self-start'
                      component='p'
                      name={`arrOfObj[${i}].amountInUnit`}
                    />
                    <button
                      disabled={arrOfObj.length <= 1}
                      type='button'
                      onClick={() => remove(i)}
                    >
                      <svg
                        className='w-6 h-6'
                        data-darkreader-inline-fill=''
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            );
          }}
        </FieldArray>

        <div className='flex justify-between w-96'>
          <button
            type='button'
            onClick={toggleModal}
            className='btn btn-red uppercase w-full mx-1'
          >
            cancel
          </button>
          <button type='submit' className='btn btn-green uppercase w-full mx-1'>
            edit
          </button>
        </div>
      </Form>
    </Formik>
  </div>
);
