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

// ! READ
let getRevenue_timeoutID;
export const getRevenue = (params, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getRevenue_timeoutID);

    getRevenue_timeoutID = setTimeout(async () => {
      let { yearMonthStart, yearMonthEnd } = params;
      try {
        // add one day
        yearMonthStart.setDate(yearMonthStart.getDate() + 1);
        yearMonthEnd.setDate(yearMonthEnd.getDate() + 1);
        // turn date to ISO string
        yearMonthStart = yearMonthStart.toISOString();
        yearMonthEnd = yearMonthEnd.toISOString();
        const { data } = await axios.get(
          API_URL +
            `/stats/revenue?yearMonthStart=${yearMonthStart}&yearMonthEnd=${yearMonthEnd}`,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );
        dispatch(setState('revenue', data));
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};

let getPotentialRevenue_timeoutID;
export const getPotentialRevenue = (params, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getPotentialRevenue_timeoutID);

    getPotentialRevenue_timeoutID = setTimeout(async () => {
      let { yearMonthStart, yearMonthEnd } = params;
      try {
        // yearMonthStart.setHours(0, 0, 0, 0);

        // add one day
        yearMonthStart.setDate(yearMonthStart.getDate() + 1);
        yearMonthEnd.setDate(yearMonthEnd.getDate() + 1);
        // turn date to ISO string
        yearMonthStart = yearMonthStart.toISOString();
        yearMonthEnd = yearMonthEnd.toISOString();
        // console.log(yearMonthStart);
        // console.log(yearMonthEnd);
        const { data } = await axios.get(
          API_URL +
            `/stats/potential_revenue?yearMonthStart=${yearMonthStart}&yearMonthEnd=${yearMonthEnd}`,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );
        dispatch(setState('potentialRevenue', data));
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};
