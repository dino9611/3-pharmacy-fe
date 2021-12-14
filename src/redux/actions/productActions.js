// ? action types
import { actionTypes } from '../action-types';
// ? axios
import axios from 'axios';

const setState = (propName, payload) => {
  return {
    type: actionTypes.product.SET_STATE,
    propName,
    payload,
  };
};
export const resetState = (propName) => {
  return {
    type: actionTypes.product.RESET_STATE,
    propName,
  };
};

const DEBOUNCE_DELAY = 100;

// ! CREATE
let addProduct_timeoutID;
export const addProduct = (
  file,
  input,
  { handleSuccess, handleFail, handleFinally }
) => {
  return (dispatch, getState, API_URL) => {
    clearTimeout(addProduct_timeoutID);

    addProduct_timeoutID = setTimeout(async () => {
      const { compositionsAmount } = input;
      input.compositions.forEach((el, i, arr) => {
        arr[i] = [el, compositionsAmount[i]];
      });
      delete input.compositionsAmount;

      const formData = new FormData();
      formData.append('image', file);
      formData.append('data', JSON.stringify(input));
      try {
        await axios.post(API_URL + `/product`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};

// ! READ
let getProduct_timeoutID;
export const getProducts = (page, limit) => {
  return (dispatch, getState, API_URL) => {
    clearTimeout(getProduct_timeoutID);

    getProduct_timeoutID = setTimeout(async () => {
      const { data } = await axios.get(
        API_URL + `/product/?page=${page}&limit=${limit}`
      );
      dispatch(setState('products', data.result));
    }, DEBOUNCE_DELAY);
  };
};

let getProductCategories_timeoutID;
export const getProductCategories = () => {
  return (dispatch, getState, API_URL) => {
    clearTimeout(getProductCategories_timeoutID);

    getProductCategories_timeoutID = setTimeout(async () => {
      const { data } = await axios.get(API_URL + '/product/getcategories');
      dispatch(setState('categories', data));
    }, DEBOUNCE_DELAY);
  };
};

// ! UPDATE
let editProduct_timeoutID;
export const editProduct = (file, input) => {
  return (dispatch, getState, API_URL) => {
    clearTimeout(editProduct_timeoutID);

    editProduct_timeoutID = setTimeout(async () => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('data', JSON.stringify(input));
      await axios.patch(API_URL + '/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }, DEBOUNCE_DELAY);
  };
};
