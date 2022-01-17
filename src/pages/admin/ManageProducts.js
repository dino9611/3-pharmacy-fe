import React from 'react';
// ? forms
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as yup from 'yup';
// ? redux
import { useDispatch, useSelector } from 'react-redux';
import {
  addProduct,
  deleteProduct,
  editProduct,
  getProductCategories,
  getProductDetails,
  getProducts,
  resetState as resetStateProduct,
} from '../../redux/actions/productActions';
import {
  getRawMaterials,
  resetState as resetStateRawMaterial,
} from '../../redux/actions/rawMaterialActions';
// ? components
import AdminTable from '../../components/Tables/AdminTable';

import { toast } from 'react-toastify';
import { API_URL } from '../../constants/api';
import { useDebounce } from '../../hooks';

export default function RawMaterialsTable() {
  const dispatch = useDispatch();
  // * pagination states
  const rows = useSelector((state) => state.productReducers.products);
  const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const rowsPerPage = 8;

  const [search, setsearch] = React.useState('');
  const handleSearchChange = useDebounce((e) => setsearch(e.target.value), 700);
  // * modal states
  React.useEffect(() => {
    dispatch(
      getProducts(
        { page: page + 1, limit: rowsPerPage, search },
        {
          handleFail: (err) =>
            toast.error(err.response?.data.message || 'server error'),
        }
      )
    );
    return () => dispatch(resetStateProduct('products'));
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
                placeholder='Search Products...'
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
            name='Products'
            page={page}
            maxPage={5}
            cols={[
              {
                label: 'Product Name',
                className: 'font-semibold',
                format: (row) => row.productName,
              },
              {
                label: 'Price',
                className: '',
                format: (row) =>
                  `Rp ${(
                    row.productProfitRp + row.productPriceRp
                  ).toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  })}`,
              },
              {
                label: 'Stock',
                className: '',
                format: (row) => row.stock,
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
            // DetailsModal={DetailsModal}
            DeleteModal={DeleteModal}
          />
        </div>
      </div>
    </>
  );
}
const DeleteModal = ({ toggleModal, initialValues }) => {
  const dispatch = useDispatch();
  return (
    <div className='z-50 bg-white w-auto h-auto rounded-lg p-5 grid grid-cols-2 font-poppins'>
      <h1 className='col-span-full text-center p-7'>
        Are you sure you want to delete the product?
      </h1>
      <button className='btn btn-blue flex m-1' onClick={toggleModal}>
        <svg
          className='w-6 h-6'
          data-darkreader-inline-fill=''
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path
            fillRule='evenodd'
            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
            clipRule='evenodd'
          />
        </svg>
        Cancel Delete
      </button>
      <button
        className='btn btn-red flex m-1'
        onClick={() => {
          dispatch(
            deleteProduct(initialValues.id, {
              handleSuccess: () =>
                toast.success('successfully deleted product'),
              handleFail: (err) =>
                toast.error(err.response?.data.message || 'server error'),
              handleFinally: toggleModal,
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
            d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
            clipRule='evenodd'
          />
        </svg>
        Confirm Delete
      </button>
    </div>
  );
};

const EditModal = ({ toggleModal, initialValues }) => {
  const dispatch = useDispatch();
  const productDetails = useSelector(
    (state) => state.productReducers.productDetails
  );

  const compositionOptions = useSelector(
    (state) => state.rawMaterialReducers.rawMaterials
  );
  const categoryOptions = useSelector(
    (state) => state.productReducers.categories
  );

  React.useEffect(() => {
    dispatch(getProductCategories());
    dispatch(getRawMaterials({ page: 1, limit: 40 }));
    return () => {
      dispatch(resetStateProduct('categories'));
      dispatch(resetStateRawMaterial('rawMaterials'));
    };
  }, [dispatch]);

  const [file, setfile] = React.useState(null);
  const fileInput = React.useRef(null);

  // const [formValues, setformValues] = React.useState()
  React.useEffect(() => {
    dispatch(getProductDetails(initialValues.id));
    return () => dispatch(resetStateProduct('productDetails'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const defaultValues = {
    productName: '',
    productProfitRp: 0,
    stock: 0,
    description: '',
    compositions: [{ id: 1, amountInUnit: 0 }],
    categories: [1],
    file: null,
  };

  return (
    <div className='z-50 bg-white w-10/12 max-h-screen rounded-lg p-5 overflow-y-auto'>
      <Formik
        initialValues={{ ...defaultValues, ...productDetails }}
        enableReinitialize
        onSubmit={(values) => {
          dispatch(
            editProduct(values, {
              handleSuccess: () => toast.success('successfully edited product'),
              handleFail: (err) =>
                toast.error(err.response?.data.message || 'server error'),
              handleFinally: toggleModal,
            })
          );
        }}
        validate={(values) => {
          const errors = {};
          if (!values.compositions.length) errors.compositions = 'required';
          if (
            new Set(values.compositions.map((el) => parseInt(el.id))).size !==
            values.compositions.length
          ) {
            errors.compositions = 'no duplicates allowed';
          }

          if (!values.categories.length) errors.categories = 'required';
          if (
            new Set(values.categories.map((el) => parseInt(el))).size !==
            values.categories.length
          ) {
            errors.categories = 'no duplicates allowed';
          }
          return errors;
        }}
        validationSchema={yup.object({
          productName: yup.string().required(),
          productProfitRp: yup
            .number()
            .integer('must be integer')
            .moreThan(0, 'has to be greater than 0'),
          stock: yup
            .number()
            .integer('must be integer')
            .moreThan(0, 'has to be greater than 0')
            .required(),
          description: yup.string().required(),
          compositions: yup.array().of(
            yup.object({
              // id: yup.number().moreThan(0, 'has to be greater than 0'),
              amountInUnit: yup
                .number()
                .moreThan(0, 'has to be greater than 0')
                .required('required'),
            })
          ),
          file: yup.mixed(),
        })}
      >
        {(props) => {
          const { setFieldValue } = props;
          return (
            <Form className='grid grid-cols-12 tems-center font-poppins gap-2'>
              <h1 className=' text-2xl font-bold self-start mb-10 col-span-full'>
                <span className='bg-blue-200'>Ed</span>
                it Product
              </h1>

              <div className='flex flex-col col-span-3 bg-gray-100 rounded-lg'>
                <label
                  className='block text-gray-700 text-sm font-bold mb-2 self-start'
                  htmlFor='productName'
                >
                  Product Name
                </label>
                <Field
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='productName'
                  name='productName'
                  type='text'
                  placeholder='Name of Product'
                />
                <p className='text-red-500 text-sm h-6 self-start'>
                  <ErrorMessage name='productName' />
                </p>

                <label
                  className='block text-gray-700 text-sm font-bold mb-2 self-start'
                  htmlFor='productProfitRp'
                >
                  Profit
                </label>
                <Field
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='productProfitRp'
                  name='productProfitRp'
                  type='number'
                  placeholder='profit of product in Rupiah'
                />
                <p className='text-red-500 text-sm h-6 self-start'>
                  <ErrorMessage name='productProfitRp' />
                </p>

                <label
                  className='block text-gray-700 text-sm font-bold mb-2 self-start'
                  htmlFor='stock'
                >
                  Stock
                </label>
                <Field
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='stock'
                  name='stock'
                  type='number'
                  placeholder='# of products in stock'
                />
                <p className='text-red-500 text-sm h-6 self-start'>
                  <ErrorMessage name='stock' />
                </p>

                <label
                  className='block text-gray-700 text-sm font-bold mb-2 self-start'
                  htmlFor='description'
                >
                  Description
                </label>
                <Field
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none'
                  id='description'
                  name='description'
                  type='text'
                  as='textarea'
                  rows='5'
                  placeholder='product description'
                />
                <p className='text-red-500 text-sm h-6 self-start'>
                  <ErrorMessage name='description' />
                </p>
              </div>

              <FieldArray name='compositions'>
                {(props) => {
                  const { push, remove, form } = props;
                  const { values, errors } = form;
                  const { compositions } = values;

                  const renderErr = () => {
                    if (errors.compositions === undefined) return '';
                    if (!Array.isArray(errors.compositions))
                      return errors.compositions;
                    for (let i = 0; i < errors.compositions.length; i++) {
                      if (errors.compositions[i]?.amountInUnit === undefined)
                        continue;
                      return errors.compositions[i]?.amountInUnit;
                    }
                    return '';
                  };
                  return (
                    <div className='flex flex-col justify-start col-span-3 bg-gray-100 rounded-lg'>
                      <div className='flex mb-1'>
                        <label className='text-gray-700 text-sm font-bold w-1/2'>
                          Compositions
                        </label>
                        <button
                          type='button'
                          onClick={() => {
                            let id;
                            for (
                              let i = 0;
                              i < compositionOptions.length;
                              i++
                            ) {
                              const el = compositionOptions[i];
                              if (
                                !compositions.some(
                                  (el2) => el.id === parseInt(el2.id)
                                )
                              ) {
                                id = el.id;
                                break;
                              }
                            }
                            if (id === undefined) id = compositionOptions[0].id;
                            push({ id, amountInUnit: 0 });
                          }}
                          className='w-1/2'
                        >
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
                      </div>
                      <p className='text-red-500 text-sm self-start'>
                        {renderErr()}
                      </p>

                      {compositions.map((_, i) => (
                        <div key={i} className='flex'>
                          <Field
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            type='number'
                            name={`compositions[${i}].amountInUnit`}
                          />
                          <Field
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            as='select'
                            name={`compositions[${i}].id`}
                          >
                            {compositionOptions.map((el) => (
                              <option key={el.id} value={el.id}>
                                {el.materialName}
                              </option>
                            ))}
                          </Field>
                          <button
                            disabled={compositions.length <= 1}
                            type='button'
                            onClick={() => remove(i)}
                            className='mx-1'
                          >
                            <svg
                              className='w-4 h-4'
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

              <FieldArray name='categories'>
                {(props) => {
                  const { push, remove, form } = props;
                  const { values, errors } = form;
                  const { categories } = values;

                  const renderErr = () => {
                    if (errors.categories === undefined) return '';
                    if (!Array.isArray(errors.categories))
                      return errors.categories;
                    return '';
                  };

                  return (
                    <div className='flex flex-col justify-start col-span-2 bg-gray-100 rounded-lg'>
                      <div className='flex mb-1'>
                        <label className='text-gray-700 text-sm font-bold w-1/2'>
                          Categories
                        </label>
                        <button
                          type='button'
                          onClick={() => {
                            let val;
                            for (let i = 0; i < categoryOptions.length; i++) {
                              const el = categoryOptions[i];
                              if (
                                !categories.some(
                                  (el2) => el.id === parseInt(el2)
                                )
                              ) {
                                val = el.id;
                                break;
                              }
                            }
                            if (val === undefined) val = categoryOptions[0].id;
                            push(val);
                          }}
                          className='w-1/2'
                        >
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
                      </div>
                      <p className='text-red-500 text-sm self-start'>
                        {renderErr()}
                      </p>

                      {categories.map((_, i) => (
                        <div key={i} className='flex'>
                          <Field
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            as='select'
                            name={`categories[${i}]`}
                          >
                            {categoryOptions.map((el) => (
                              <option key={el.id} value={el.id}>
                                {el.categoryName}
                              </option>
                            ))}
                          </Field>
                          <button
                            disabled={categories.length <= 1}
                            type='button'
                            onClick={() => remove(i)}
                            className='mx-1'
                          >
                            <svg
                              className='w-4 h-4'
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

              <input
                ref={fileInput}
                type='file'
                className='hidden'
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setfile(e.target.files[0]);
                    setFieldValue('file', e.target.files[0]);
                  } else {
                    setfile(null);
                    setFieldValue('file', null);
                  }
                }}
              />
              <img
                onClick={() => fileInput.current.click()}
                className='object-contain h-96 w-full col-span-4 bg-gray-300 rounded-lg flex justify-center items-center text-gray-600 cursor-pointer'
                src={
                  file
                    ? URL.createObjectURL(file)
                    : API_URL + productDetails.imagePath
                }
                alt={file}
              />

              <div className='flex justify-between col-span-full'>
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
          );
        }}
      </Formik>
    </div>
  );
};

const CreateModal = ({ toggleModal }) => {
  const dispatch = useDispatch();
  const compositionOptions = useSelector(
    (state) => state.rawMaterialReducers.rawMaterials
  );
  const categoryOptions = useSelector(
    (state) => state.productReducers.categories
  );

  React.useEffect(() => {
    dispatch(getProductCategories());
    dispatch(getRawMaterials({ page: 1, limit: 40 }));
    return () => {
      dispatch(resetStateProduct('categories'));
      dispatch(resetStateRawMaterial('rawMaterials'));
    };
  }, [dispatch]);

  const [file, setfile] = React.useState(null);
  const fileInput = React.useRef(null);

  return (
    <div className='z-50 bg-white w-10/12 max-h-screen rounded-lg p-5 overflow-y-auto'>
      <Formik
        initialValues={{
          productName: '',
          productProfitRp: '',
          stock: 0,
          description: '',
          compositions: [],
          categories: [],
          file: null,
        }}
        onSubmit={(values) => {
          dispatch(
            addProduct(values, {
              handleSuccess: () =>
                toast.success('successfully created new product'),
              handleFail: (err) =>
                toast.error(err.response?.data.message || 'server error'),
              handleFinally: toggleModal,
            })
          );
        }}
        validate={(values) => {
          const errors = {};
          if (!values.compositions.length) errors.compositions = 'required';
          if (
            new Set(values.compositions.map((el) => parseInt(el.id))).size !==
            values.compositions.length
          ) {
            errors.compositions = 'no duplicates allowed';
          }

          if (!values.categories.length) errors.categories = 'required';
          if (
            new Set(values.categories.map((el) => parseInt(el))).size !==
            values.categories.length
          ) {
            errors.categories = 'no duplicates allowed';
          }
          return errors;
        }}
        validationSchema={yup.object({
          productName: yup.string().required(),
          productProfitRp: yup
            .number()
            .integer('must be integer')
            .moreThan(0, 'has to be greater than 0'),
          stock: yup
            .number()
            .integer('must be integer')
            .moreThan(0, 'has to be greater than 0')
            .required(),
          description: yup.string().required(),
          compositions: yup.array().of(
            yup.object({
              // id: yup.number().moreThan(0, 'has to be greater than 0'),
              amountInUnit: yup
                .number()
                .moreThan(0, 'has to be greater than 0')
                .required('required'),
            })
          ),
          file: yup.mixed().required('image required'),
        })}
      >
        {(props) => {
          const { setFieldValue } = props;
          return (
            <Form className='grid grid-cols-12 tems-center font-poppins gap-2'>
              <h1 className=' text-2xl font-bold self-start mb-10 col-span-full'>
                <span className='bg-blue-200'>Cr</span>
                eate New Product
              </h1>

              <div className='flex flex-col col-span-3 bg-gray-100 rounded-lg'>
                <label
                  className='block text-gray-700 text-sm font-bold mb-2 self-start'
                  htmlFor='productName'
                >
                  Product Name
                </label>
                <Field
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='productName'
                  name='productName'
                  type='text'
                  placeholder='Name of Product'
                />
                <p className='text-red-500 text-sm h-6 self-start'>
                  <ErrorMessage name='productName' />
                </p>

                <label
                  className='block text-gray-700 text-sm font-bold mb-2 self-start'
                  htmlFor='productProfitRp'
                >
                  Profit
                </label>
                <Field
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='productProfitRp'
                  name='productProfitRp'
                  type='number'
                  placeholder='profit of product in Rupiah'
                />
                <p className='text-red-500 text-sm h-6 self-start'>
                  <ErrorMessage name='productprofitrp' />
                </p>

                <label
                  className='block text-gray-700 text-sm font-bold mb-2 self-start'
                  htmlFor='stock'
                >
                  Stock
                </label>
                <Field
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                  id='stock'
                  name='stock'
                  type='number'
                  placeholder='# of products in stock'
                />
                <p className='text-red-500 text-sm h-6 self-start'>
                  <ErrorMessage name='stock' />
                </p>

                <label
                  className='block text-gray-700 text-sm font-bold mb-2 self-start'
                  htmlFor='description'
                >
                  Description
                </label>
                <Field
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline resize-none'
                  id='description'
                  name='description'
                  rows='3'
                  as='textarea'
                  placeholder='product description'
                />
                <p className='text-red-500 text-sm h-6 self-start'>
                  <ErrorMessage name='description' />
                </p>
              </div>

              <FieldArray name='compositions'>
                {(props) => {
                  const { push, remove, form } = props;
                  const { values, errors } = form;
                  const { compositions } = values;

                  const renderErr = () => {
                    if (errors.compositions === undefined) return '';
                    if (!Array.isArray(errors.compositions))
                      return errors.compositions;
                    for (let i = 0; i < errors.compositions.length; i++) {
                      if (errors.compositions[i]?.amountInUnit === undefined)
                        continue;
                      return errors.compositions[i]?.amountInUnit;
                    }
                    return '';
                  };
                  return (
                    <div className='flex flex-col justify-start col-span-3 bg-gray-100 rounded-lg'>
                      <div className='flex mb-1'>
                        <label className='text-gray-700 text-sm font-bold w-1/2'>
                          Compositions
                        </label>
                        <button
                          type='button'
                          onClick={() => {
                            let id;
                            for (
                              let i = 0;
                              i < compositionOptions.length;
                              i++
                            ) {
                              const el = compositionOptions[i];
                              if (
                                !compositions.some(
                                  (el2) => el.id === parseInt(el2.id)
                                )
                              ) {
                                id = el.id;
                                break;
                              }
                            }
                            if (id === undefined) id = compositionOptions[0].id;
                            push({ id, amountInUnit: 0 });
                          }}
                          className='w-1/2'
                        >
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
                      </div>
                      <p className='text-red-500 text-sm self-start'>
                        {renderErr()}
                      </p>

                      {compositions.map((_, i) => (
                        <div key={i} className='flex'>
                          <Field
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            type='number'
                            name={`compositions[${i}].amountInUnit`}
                          />
                          <Field
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            as='select'
                            name={`compositions[${i}].id`}
                          >
                            {compositionOptions.map((el) => (
                              <option key={el.id} value={el.id}>
                                {`${el.materialName} (${el.unit})`}
                              </option>
                            ))}
                          </Field>
                          <button
                            disabled={compositions.length <= 1}
                            type='button'
                            onClick={() => remove(i)}
                            className='mx-1'
                          >
                            <svg
                              className='w-4 h-4'
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

              <FieldArray name='categories'>
                {(props) => {
                  const { push, remove, form } = props;
                  const { values, errors } = form;
                  const { categories } = values;

                  const renderErr = () => {
                    if (errors.categories === undefined) return '';
                    if (!Array.isArray(errors.categories))
                      return errors.categories;
                    return '';
                  };

                  return (
                    <div className='flex flex-col justify-start col-span-2 bg-gray-100 rounded-lg'>
                      <div className='flex mb-1'>
                        <label className='text-gray-700 text-sm font-bold w-1/2'>
                          Categories
                        </label>
                        <button
                          type='button'
                          onClick={() => {
                            let val;
                            for (let i = 0; i < categoryOptions.length; i++) {
                              const el = categoryOptions[i];
                              if (
                                !categories.some(
                                  (el2) => el.id === parseInt(el2)
                                )
                              ) {
                                val = el.id;
                                break;
                              }
                            }
                            if (val === undefined) val = categoryOptions[0].id;
                            push(val);
                          }}
                          className='w-1/2'
                        >
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
                      </div>
                      <p className='text-red-500 text-sm self-start'>
                        {renderErr()}
                      </p>

                      {categories.map((_, i) => (
                        <div key={i} className='flex'>
                          <Field
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            as='select'
                            name={`categories[${i}]`}
                          >
                            {categoryOptions.map((el) => (
                              <option key={el.id} value={el.id}>
                                {el.categoryName}
                              </option>
                            ))}
                          </Field>
                          <button
                            disabled={categories.length <= 1}
                            type='button'
                            onClick={() => remove(i)}
                            className='mx-1'
                          >
                            <svg
                              className='w-4 h-4'
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

              <input
                ref={fileInput}
                type='file'
                className='hidden'
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setfile(e.target.files[0]);
                    setFieldValue('file', e.target.files[0]);
                  } else {
                    setfile(null);
                    setFieldValue('file', null);
                  }
                }}
              />
              {file ? (
                <img
                  onClick={() => fileInput.current.click()}
                  className='object-contain h-96 w-full col-span-4 bg-gray-300 rounded-lg flex justify-center items-center text-gray-600 cursor-pointer'
                  src={URL.createObjectURL(file)}
                  alt={file}
                ></img>
              ) : (
                <div className='h-96 w-full col-span-4 bg-gray-300 rounded-lg flex justify-center items-center text-gray-600'>
                  <ErrorMessage
                    className='text-red-500 text-sm self-start absolute'
                    component='p'
                    name='file'
                  />
                  <svg
                    onClick={() => fileInput.current.click()}
                    className='w-10 h-10 cursor-pointer'
                    data-darkreader-inline-fill=''
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              )}

              <div className='flex justify-between col-span-full'>
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
          );
        }}
      </Formik>
    </div>
  );
};
