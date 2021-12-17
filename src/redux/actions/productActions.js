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
export const addProduct = (file, input, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
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
// * products
let getProduct_timeoutID;
export const getProducts = (page, limit, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getProduct_timeoutID);

    getProduct_timeoutID = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          API_URL + `/product/?page=${page}&limit=${limit}`
        );
        dispatch(setState('products', data.result));
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};

// * categories
let getProductCategories_timeoutID;
export const getProductCategories = (handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getProductCategories_timeoutID);

    getProductCategories_timeoutID = setTimeout(async () => {
      try {
        const { data } = await axios.get(API_URL + '/product/getcategories');
        dispatch(setState('categories', data));
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};

// ! UPDATE
let editProduct_timeoutID;
export const editProduct = (file, input, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(editProduct_timeoutID);

    editProduct_timeoutID = setTimeout(async () => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('data', JSON.stringify(input));
      try {
        await axios.patch(API_URL + '/product', formData, {
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
