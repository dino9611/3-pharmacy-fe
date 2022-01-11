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
export const addProduct = (input, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(addProduct_timeoutID);

    addProduct_timeoutID = setTimeout(async () => {
      const formData = new FormData();
      formData.append('image', input.file);
      delete input.file;
      formData.append('data', JSON.stringify(input));
      try {
        await axios.post(API_URL + `/product`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
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
let getProducts_timeoutID;
export const getProducts = (request, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    if (request !== undefined) {
      dispatch(setState('request', request));
    }
    const { page, limit } = getState().productReducers.request;

    clearTimeout(getProducts_timeoutID);

    getProducts_timeoutID = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          API_URL + `/product/?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
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

// * get single product
let getProductDetails_timeoutID;
export const getProductDetails = (id, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getProductDetails_timeoutID);

    getProductDetails_timeoutID = setTimeout(async () => {
      let res;
      try {
        res = await axios.get(API_URL + `/product/${id}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        const { result } = res.data;

        for (const key in result) if (!result[key]) delete result[key];

        try {
          result.compositions = result.compositions.split(',');
          result.compositions.forEach((el, i, arr) => {
            let newEl = {};
            el = el.split(';');
            for (let j = 0; j < el.length; j++) {
              if (!j) {
                newEl.id = parseInt(el[j]);
                continue;
              }
              newEl.amountInUnit = parseFloat(el[j]);
            }
            arr[i] = newEl;
          });

          result.categories = result.categories.split(',');
          result.categories.forEach((el, i, arr) => (arr[i] = parseInt(el)));
        } catch (error) {}

        dispatch(setState('productDetails', res.data.result));
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        // dispatch(setState('productDetails', res.data.result));
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
        const { data } = await axios.get(API_URL + '/product/getcategories', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
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
export const editProduct = (input, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(editProduct_timeoutID);

    editProduct_timeoutID = setTimeout(async () => {
      delete input.createdAt;
      delete input.productPriceRp;
      delete input.updatedAt;

      const formData = new FormData();
      formData.append('image', input.file);
      delete input.file;
      formData.append('data', JSON.stringify(input));
      try {
        await axios.patch(API_URL + '/product', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });

        dispatch(getProducts());
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};

// ! DELETE
let deleteProduct_timeoutID;
export const deleteProduct = (id, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(deleteProduct_timeoutID);

    deleteProduct_timeoutID = setTimeout(async () => {
      try {
        axios.delete(`${API_URL}/product/delete/${id}`, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });

        dispatch(getProducts());
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};
