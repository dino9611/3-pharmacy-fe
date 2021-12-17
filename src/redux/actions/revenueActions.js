// ? action types
import { actionTypes } from '../action-types';
// ? axios
import axios from 'axios';

const setState = (propName, payload) => {
  return {
    type: actionTypes.revenue.SET_STATE,
    propName,
    payload,
  };
};
export const resetState = (propName) => {
  return {
    type: actionTypes.revenue.RESET_STATE,
    propName,
  };
};

const DEBOUNCE_DELAY = 100;

let getRevenue_timeoutID;
export const getRevenue = (handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getRevenue_timeoutID);

    getRevenue_timeoutID = setTimeout(async () => {
      try {
        const [result] = axios.get(API_URL + `/revenue`);
        dispatch(setState('revenue', result));
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};
