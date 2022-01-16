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
let uploadPrescription_timeoutID;
export const uploadPrescription = (file, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(uploadPrescription_timeoutID);

    uploadPrescription_timeoutID = setTimeout(async () => {
      try {
        const formData = new FormData();
        formData.append('custom', file);
        await axios.post(API_URL + '/custom/upload', formData, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
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

let uploadPayment_timeoutID;
export const uploadPayment = (input, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(uploadPayment_timeoutID);

    uploadPayment_timeoutID = setTimeout(async () => {
      try {
        const formData = new FormData();
        formData.append('proof', input.file);
        let config = {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data',
          },
        };
        await axios.patch(
          `${API_URL}/custom/update/payment/${input.id}`,
          formData,
          config
        );
        let updateStatus = {
          id: input.id,
          nextStatus: 'waitpaymentApproval',
        };
        await axios.patch(`${API_URL}/custom/nextstatus`, updateStatus, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });

        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      } finally {
        handleFinally !== undefined && handleFinally();
      }
    }, DEBOUNCE_DELAY);
  };
};

// ! READ
let getPrescriptions_timeoutID;
export const getPrescriptions = (request, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    if (request !== undefined) {
      dispatch(setState('request', request));
    }
    const { page, limit, filter, sort } =
      getState().prescriptionReducers.request;
    clearTimeout(getPrescriptions_timeoutID);

    getPrescriptions_timeoutID = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/custom/usercustom/?page=${page}&limit=${limit}&filter=${filter}&sort=${sort}`,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );

        dispatch(setState('prescriptions', data));
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};

let getPrescriptionDetails_timeoutID;
export const getPrescriptionDetails = (id, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getPrescriptionDetails_timeoutID);

    getPrescriptionDetails_timeoutID = setTimeout(async () => {
      try {
        const { data } = await axios.get(`${API_URL}/custom/details/${id}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });

        dispatch(setState('prescriptionDetails', data));
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};
