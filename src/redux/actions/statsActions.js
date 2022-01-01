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
// ? revenue
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
            `/stats/revenue?time=monthly&yearMonthStart=${yearMonthStart}&yearMonthEnd=${yearMonthEnd}`,
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
            `/stats/revenue?time=monthly&type=potential&yearMonthStart=${yearMonthStart}&yearMonthEnd=${yearMonthEnd}`,
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

let getRecentRevenue_timeoutID;
export const getRecentRevenue = (handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getRecentRevenue_timeoutID);

    getRecentRevenue_timeoutID = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          API_URL + '/stats/revenue?time=recent',
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );
        dispatch(setState('recentRevenue', data));
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};

// ? sales report
let getCartedItem_timeoutID;
export const getCartedItem = (handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getCartedItem_timeoutID);

    getCartedItem_timeoutID = setTimeout(async () => {
      try {
        const { data } = await axios.get(API_URL + '/stats/carted_item', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        dispatch(setState('cartedItem', data));
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};

let getSalesSuccessRate_timeoutID;
export const getSalesSuccessRate = (handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getSalesSuccessRate_timeoutID);

    getSalesSuccessRate_timeoutID = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          API_URL + '/stats/sales_success_rate',
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );
        let data2 = [];
        let success;
        let fail;
        for (let i = 0; i < data.length; i++) {
          if (data[i].status === 'paymentRej') {
            fail = data[i].count;
          } else {
            success = data[i].count;
          }
          if (success && fail) {
            data2.push({ successRate: success / fail, date: data[i].date });
            success = null;
            fail = null;
          }
        }
        dispatch(setState('salesSuccessRate', data2));
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};

let getRecentNewUsers_timeoutID;
export const getRecentNewUsers = (handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getRecentNewUsers_timeoutID);

    getRecentNewUsers_timeoutID = setTimeout(async () => {
      try {
        const { data } = await axios.get(API_URL + '/stats/new_users', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        dispatch(setState('recentNewUsers', data));
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};
