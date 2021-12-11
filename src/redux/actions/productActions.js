// ? action types
import { actionTypes } from '../action-types';
// ? axios
import axios from 'axios';

const setProducts = (payload) => {
  return {
    type: actionTypes.product.SET,
    payload,
  };
};
const setProductCategories = (payload) => {
  return {
    type: actionTypes.product.SET_CATEGORIES,
    payload,
  };
};
export const resetState = (payload) => {
  return {
    type: actionTypes.product.RESET_STATE,
    payload,
  };
};

// ! CREATE
const addProductDebounce = (async (
  dispatch,
  API_URL,
  file,
  input,
  handleSuccess
) => {
  // productName: 'obat hh',
  // stock: 11111,
  // description: 'description',
  // categories: [1, 2, 4], // array of product_category_id
  // compositions: [
  //   [1, 1.3],
  //   [2, 3.1],
  //   [3, 6.9],
  // ], // array of [raw_material_id, amountInUnit]

  const { compositionsAmount } = input;
  input.compositions.forEach((el, i, arr) => {
    arr[i] = [el, compositionsAmount[i]];
  });
  delete input.compositionsAmount;

  console.log(input);

  const formData = new FormData();
  formData.append('image', file);
  formData.append('data', JSON.stringify(input));
  // const { data } = await axios.post(API_URL + `/product`, formData, {
  await axios.post(API_URL + `/product`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  // console.log(data);

  handleSuccess && handleSuccess();
}).debouncify(250);
export const addProduct = (file, input, handleSuccess) => {
  return (dispatch, getState, API_URL) => {
    addProductDebounce(dispatch, API_URL, file, input, handleSuccess);
  };
};

// ! READ
const getProductsDebounce = (async (dispatch, API_URL, page, limit) => {
  const { data } = await axios.get(
    API_URL + `/product/?page=${page}&limit=${limit}`
  );
  dispatch(setProducts(data.result));
}).debouncify(250);
export const getProducts = (page, limit) => {
  return (dispatch, getState, API_URL) => {
    getProductsDebounce(dispatch, API_URL, page, limit);
  };
};
const getProductCategoriesDebounce = (async (dispatch, API_URL) => {
  const { data } = await axios.get(API_URL + '/product/category');
  dispatch(setProductCategories(data.result));
}).debouncify(250);
export const getProductCategories = () => {
  return (dispatch, getState, API_URL) => {
    getProductCategoriesDebounce(dispatch, API_URL);
  };
};

// ! UPDATE
const editProductDebounce = (async (dispatch, API_URL, input) => {
  await axios.patch(API_URL + `/product/${input.id}`, input);
}).debouncify(250);
export const editProduct = (input) => {
  return (dispatch, getState, API_URL) => {
    editProductDebounce(dispatch, API_URL, input);
  };
};
