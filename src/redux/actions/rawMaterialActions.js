// ? action types
import { actionTypes } from '../action-types';
// ? axios
import axios from 'axios';

const setState = (propName, payload) => {
  return {
    type: actionTypes.rawMaterial.SET_STATE,
    propName,
    payload,
  };
};
export const resetState = (propName) => {
  return {
    type: actionTypes.rawMaterial.RESET_STATE,
    propName,
  };
};

const DEBOUNCE_DELAY = 100;

// ! CREATE
let addRawMaterial_timeoutID;
export const addRawMaterial = (input, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(addRawMaterial_timeoutID);

    addRawMaterial_timeoutID = setTimeout(async () => {
      try {
        await axios.post(API_URL + '/raw_material', input, {
          headers: {
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
let getRawMaterials_timeoutID;
export const getRawMaterials = (request, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    if (request !== undefined) {
      dispatch(setState('request', request));
    }
    const { page, limit, search } = getState().rawMaterialReducers.request;
    clearTimeout(getRawMaterials_timeoutID);

    getRawMaterials_timeoutID = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          API_URL +
            `/raw_material/?page=${page}&limit=${limit}&search=${search}`,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );
        dispatch(setState('rawMaterials', data.result));
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};

let getRawMaterial_timeoutID;
export const getRawMaterial = (id, index, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const rawMaterials = getState().rawMaterialReducers.rawMaterials;

    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getRawMaterial_timeoutID);

    getRawMaterial_timeoutID = setTimeout(async () => {
      try {
        const { data } = await axios.get(API_URL + `/raw_material/${id}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        rawMaterials[index] = data.result[0];
        dispatch(setState('rawMaterials', [...rawMaterials])); // ! needs to be new array to trigger render
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};

let getRawMaterialsRecord_timeoutID;
export const getRawMaterialsRecord = (page, limit, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getRawMaterialsRecord_timeoutID);

    getRawMaterialsRecord_timeoutID = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          API_URL + `/raw_material/record/?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );
        dispatch(setState('rawMaterialsRecord', data.result));

        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};

// ! UPDATE
let editRawMaterial_timeoutID;
export const editRawMaterial = (input, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(editRawMaterial_timeoutID);

    editRawMaterial_timeoutID = setTimeout(async () => {
      try {
        const { index } = input;
        delete input.index;
        await axios.patch(API_URL + `/raw_material/${input.id}`, input, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        dispatch(getRawMaterial(input.id, index));

        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};
