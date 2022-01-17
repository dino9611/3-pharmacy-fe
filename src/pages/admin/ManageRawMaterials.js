import React from 'react';
// ? forms
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
// ? redux
import { useDispatch, useSelector } from 'react-redux';
import {
  addRawMaterial,
  editRawMaterial,
  getRawMaterials,
  resetState,
} from '../../redux/actions/rawMaterialActions';
// ? components
import AdminTable from '../../components/Tables/AdminTable';

import { toast } from 'react-toastify';
import { useDebounce } from '../../hooks';

export default function RawMaterialsTable() {
  const dispatch = useDispatch();
  // * pagination states
  const rows = useSelector((state) => state.rawMaterialReducers.rawMaterials);
  const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const rowsPerPage = 8;

  const [search, setsearch] = React.useState('');
  const handleSearchChange = useDebounce((e) => setsearch(e.target.value), 500);
  // * modal states
  React.useEffect(() => {
    dispatch(
      getRawMaterials(
        { page: page + 1, limit: rowsPerPage, search },
        {
          handleFail: (err) =>
            toast.error(err.response.data.message || 'server error'),
        }
      )
    );
    return () => dispatch(resetState('rawMaterials'));
  }, [dispatch, page, rowsPerPage, search]);
  const emptyRows = rowsPerPage - rows.length;

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  return (
    <>
      <div className='bg-lightblue flex flex-col h-full lg:w-4/5 px-4 w-full absolute right-0 font-poppins'>
        <div className='flex flex-col h-full justify-between'>
          <div className='flex m-3'>
            <div className='flex border-2 rounded'>
              <input
                type='text'
                className='px-4 py-2 w-80'
                placeholder='Search Raw Materials...'
                onChange={handleSearchChange}
              />
              <div className='flex items-center justify-center px-4 border-l bg-white'>
                <svg
                  className='w-6 h-6 text-gray-600'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z' />
                </svg>
              </div>
            </div>
          </div>

          <AdminTable
            name='Raw Materials'
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
                  `${Math.floor(row.inventory / row.unitPerBottle)} bottles ${(
                    row.inventory % row.unitPerBottle
                  ).toFixed(2)} ${row.unit}`,
              },
              {
                label: 'Unit Per Bottle',
                className: '',
                format: (row) =>
                  `${row.unitPerBottle.toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  })} ${row.unit} per bottle`,
              },
              {
                label: 'Price Per Bottle',
                className: '',
                format: (row) =>
                  `Rp ${(row.priceRpPerUnit * row.unitPerBottle).toLocaleString(
                    'en-US',
                    { maximumFractionDigits: 2 }
                  )}`,
              },
              { label: '' },
            ]}
            rows={rows}
            emptyRows={emptyRows}
            actions={{
              setPage,
            }}
            CreateModal={CreateModal}
            EditModal={EditModal}
          />
        </div>
      </div>
    </>
  );
}

const EditModal = ({ toggleModal, initialValues }) => {
  const dispatch = useDispatch();
  // const rawMaterialReducers = useSelector((state) => state.rawMaterialReducers);

  // const defaultValues = {
  //   materialName: 'Chemical A',
  //   bottleChange: 0,
  //   unitPerBottle: 0,
  //   priceRpPerUnit: 0,
  //   unit: 'mg',
  // };

  React.useEffect(() => {
    delete initialValues.inventory;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const bottles = React.useRef(
    Math.floor(initialValues.inventory / initialValues.unitPerBottle)
  );
  const initialValuesRef = React.useRef({ ...initialValues, bottleChange: 0 });

  return (
    <div className='z-50 bg-white w-auto h-auto rounded-lg flex justify-center items-center p-5'>
      <Formik
        initialValues={initialValuesRef.current}
        onSubmit={(values) => {
          dispatch(
            editRawMaterial(values, {
              handleSuccess: () =>
                toast.success('successfully edited raw material'),
              handleFail: (err) =>
                toast.error(err.response.data.message || 'server error'),
              handleFinally: toggleModal,
            })
          );
        }}
        validationSchema={yup.object({
          materialName: yup.string().required('material name required!'),
          bottleChange: yup
            .number()
            .integer('must be integer')
            .moreThan(-1 * bottles.current - 1),
          unitPerBottle: yup.number().moreThan(0),
          priceRpPerUnit: yup.number().moreThan(0),
        })}
      >
        <Form className='flex flex-col items-center font-poppins'>
          <h1 className=' text-2xl font-bold self-start mb-10'>
            <span className='bg-blue-200'>Ed</span>
            it
          </h1>
          <label
            className='block text-gray-700 text-sm font-bold mb-2 self-start'
            htmlFor='materialName'
          >
            Raw Material Name
          </label>
          <Field
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='materialName'
            name='materialName'
            type='text'
            placeholder='Name of Raw Material'
          />
          <p className='text-red-500 text-sm h-6 self-start'>
            <ErrorMessage name='materialName' />
          </p>

          <label
            className='block text-gray-700 text-sm font-bold mb-2 self-start'
            htmlFor='bottleChange'
          >
            Bottle Change
          </label>
          <Field
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='bottleChange'
            name='bottleChange'
            type='number'
            placeholder='bottle increase/decrease'
          />
          <p className='text-red-500 text-sm h-6 self-start'>
            <ErrorMessage name='bottleChange' />
          </p>

          <label
            className='block text-gray-700 text-sm font-bold mb-2 self-start'
            htmlFor='unitPerBottle'
          >
            Unit Per Bottle
          </label>
          <Field
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='unitPerBottle'
            name='unitPerBottle'
            type='number'
            placeholder='units in one bottle'
          />
          <p className='text-red-500 text-sm h-6 self-start'>
            <ErrorMessage name='unitPerBottle' />
          </p>

          <label
            className='block text-gray-700 text-sm font-bold mb-2 self-start'
            htmlFor='priceRpPerUnit'
          >
            Price Per Unit
          </label>
          <Field
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='priceRpPerUnit'
            name='priceRpPerUnit'
            type='number'
            placeholder='price per unit in Rp'
          />
          <p className='text-red-500 text-sm h-6 self-start'>
            <ErrorMessage name='priceRpPerUnit' />
          </p>

          <label
            className='block text-gray-700 text-sm font-bold mb-2 self-start'
            htmlFor='unit'
          >
            Unit
          </label>
          <Field
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='unit'
            name='unit'
            as='select'
          >
            <option value={'mg'}>mg</option>
            <option value={'ml'}>ml</option>
            <option value={'gr'}>gr</option>
          </Field>
          <p className='text-red-500 text-sm h-6 self-start'>
            <ErrorMessage name='unit' />
          </p>

          <div className='flex justify-between w-96'>
            <button
              type='button'
              onClick={toggleModal}
              className='btn btn-red uppercase w-full mx-1'
            >
              cancel
            </button>
            <button
              type='submit'
              className='btn btn-green uppercase w-full mx-1'
            >
              confirm edit
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

const CreateModal = ({ toggleModal }) => {
  const dispatch = useDispatch();

  return (
    <div className='z-50 bg-white w-auto h-auto rounded-lg flex justify-center items-center p-5'>
      <Formik
        initialValues={{
          materialName: '',
          bottles: 0,
          unitPerBottle: 0,
          priceRpPerUnit: 0,
          unit: 'ml',
        }}
        onSubmit={(values) => {
          console.log(values);
          dispatch(
            addRawMaterial(values, {
              handleSuccess: () =>
                toast.success('successfully created new raw material'),
              handleFail: (err) =>
                toast.error(err.response.data.message || 'server error'),
              handleFinally: toggleModal,
            })
          );
        }}
        validationSchema={yup.object({
          materialName: yup.string().required(),
          bottles: yup
            .number()
            .integer('must be integer')
            .moreThan(0, 'has to be greater than 0')
            .required(),
          unitPerBottle: yup
            .number()
            .moreThan(0, 'has to be greater than 0')
            .required(),
          priceRpPerUnit: yup
            .number()
            .moreThan(0, 'has to be greater than 0')
            .required(),
        })}
      >
        <Form className='flex flex-col items-center font-poppins'>
          <h1 className=' text-2xl font-bold self-start mb-10'>
            <span className='bg-blue-200'>Cr</span>
            eate
          </h1>
          <label
            className='block text-gray-700 text-sm font-bold mb-2 self-start'
            htmlFor='materialName'
          >
            Raw Material Name
          </label>
          <Field
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='materialName'
            name='materialName'
            type='text'
            placeholder='Name of Raw Material'
          />
          <p className='text-red-500 text-sm h-6 self-start'>
            <ErrorMessage name='materialName' />
          </p>

          <label
            className='block text-gray-700 text-sm font-bold mb-2 self-start'
            htmlFor='bottles'
          >
            Bottles
          </label>
          <Field
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='bottles'
            name='bottles'
            type='number'
            placeholder='# of bottles in inventory'
          />
          <p className='text-red-500 text-sm h-6 self-start'>
            <ErrorMessage name='bottles' />
          </p>

          <label
            className='block text-gray-700 text-sm font-bold mb-2 self-start'
            htmlFor='unitPerBottle'
          >
            Unit Per Bottle
          </label>
          <Field
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='unitPerBottle'
            name='unitPerBottle'
            type='number'
            placeholder='units in one bottle'
          />
          <p className='text-red-500 text-sm h-6 self-start'>
            <ErrorMessage name='unitPerBottle' />
          </p>

          <label
            className='block text-gray-700 text-sm font-bold mb-2 self-start'
            htmlFor='priceRpPerUnit'
          >
            Price Per Unit
          </label>
          <Field
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='priceRpPerUnit'
            name='priceRpPerUnit'
            type='number'
            placeholder='price per unit in Rp'
          />
          <p className='text-red-500 text-sm h-6 self-start'>
            <ErrorMessage name='priceRpPerUnit' />
          </p>

          <label
            className='block text-gray-700 text-sm font-bold mb-2 self-start'
            htmlFor='unit'
          >
            Unit
          </label>
          <Field
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='unit'
            name='unit'
            as='select'
          >
            <option value={'mg'}>mg</option>
            <option value={'ml'}>ml</option>
            <option value={'gr'}>gr</option>
          </Field>
          <p className='text-red-500 text-sm h-6 self-start'>
            <ErrorMessage name='unit' />
          </p>

          <div className='flex justify-between w-96'>
            <button
              type='button'
              onClick={toggleModal}
              className='btn btn-red uppercase w-full mx-1'
            >
              cancel
            </button>
            <button
              type='submit'
              className='btn btn-green uppercase w-full mx-1'
            >
              confirm add
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

// const DetailsModal = (toggleModal) => (
//   <div className='z-50 bg-white w-auto h-auto rounded-lg flex justify-center items-center p-5'>
//     <Formik
//       initialValues={{
//         username: '',
//         arrOfObj: [{ id: 2, amountInUnit: 2.1 }],
//         objOfObj: {},
//       }}
//       onSubmit={(values) => console.log(values)}
//       validationSchema={yup.object({
//         username: yup.string().required('username required!'),
//         description: yup.string().required('description required!'),
//         arrOfObj: yup.array().of(
//           yup.object({
//             // amountInUnit: yup.number().moreThan(0),
//             amountInUnit: yup.string().max(2),
//           })
//         ),
//       })}
//     >
//       <Form className='flex flex-col items-center font-poppins'>
//         <h1 className=' text-2xl font-bold self-start mb-10'>
//           <span className='bg-blue-200'>Cr</span>
//           eate
//         </h1>
//         <label
//           className='block text-gray-700 text-sm font-bold mb-2 self-start'
//           htmlFor='username'
//         >
//           Username
//         </label>
//         <Field
//           className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
//           id='username'
//           name='username'
//           type='text'
//           placeholder='Chem1'
//         />
//         <p className='text-red-500 text-sm h-6 self-start'>
//           <ErrorMessage name='username' />
//         </p>
//         <label
//           className='block text-gray-700 text-sm font-bold mb-2 self-start'
//           htmlFor='description'
//         >
//           Description
//         </label>
//         <Field
//           className='resize-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none'
//           as='textarea'
//           id='description'
//           name='description'
//         />
//         <p className='text-red-500 text-sm h-6 self-start'>
//           <ErrorMessage name='description' />
//         </p>

//         <label className='block text-gray-700 text-sm font-bold mb-2 self-start'>
//           Array of Object
//         </label>
//         <FieldArray name='arrOfObj'>
//           {(props) => {
//             const { push, remove, form } = props;
//             const { values } = form;
//             const { arrOfObj } = values;
//             return (
//               <div className='w-full'>
//                 <button type='button' onClick={() => push('')}>
//                   <svg
//                     className='w-6 h-6'
//                     data-darkreader-inline-fill=''
//                     fill='currentColor'
//                     viewBox='0 0 20 20'
//                   >
//                     <path
//                       fillRule='evenodd'
//                       d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
//                       clipRule='evenodd'
//                     />
//                   </svg>
//                 </button>
//                 {arrOfObj.map((obj, i) => (
//                   <div key={i} className='flex'>
//                     <Field
//                       className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
//                       name={`arrOfObj[${i}].amountInUnit`}
//                     />
//                     <ErrorMessage
//                       className='text-red-500 text-sm self-start'
//                       component='p'
//                       name={`arrOfObj[${i}].amountInUnit`}
//                     />
//                     <button
//                       disabled={arrOfObj.length <= 1}
//                       type='button'
//                       onClick={() => remove(i)}
//                     >
//                       <svg
//                         className='w-6 h-6'
//                         data-darkreader-inline-fill=''
//                         fill='currentColor'
//                         viewBox='0 0 20 20'
//                       >
//                         <path
//                           fillRule='evenodd'
//                           d='M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
//                           clipRule='evenodd'
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             );
//           }}
//         </FieldArray>

//         <div className='flex justify-between w-96'>
//           <button
//             type='button'
//             onClick={toggleModal}
//             className='btn btn-red uppercase w-full mx-1'
//           >
//             cancel
//           </button>
//           <button type='submit' className='btn btn-green uppercase w-full mx-1'>
//             edit
//           </button>
//         </div>
//       </Form>
//     </Formik>
//   </div>
// );
