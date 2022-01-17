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

let getSalesByCategory_timeoutID;
export const getSalesByCategory = (params, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getSalesByCategory_timeoutID);

    getSalesByCategory_timeoutID = setTimeout(async () => {
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
            `/stats/sales_by_category?yearMonthStart=${yearMonthStart}&yearMonthEnd=${yearMonthEnd}`,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );
        dispatch(setState('salesByCategory', data));
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};

// ? get recent
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

let getRecentPotentialRevenue_timeoutID;
export const getRecentPotentialRevenue = (handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getRecentPotentialRevenue_timeoutID);

    getRecentPotentialRevenue_timeoutID = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          API_URL + '/stats/revenue?time=recent&type=potential',
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );
        dispatch(setState('recentPotentialRevenue', data));
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
        const { data } = await axios.get(API_URL + '/stats/recent_new_users', {
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

let getRecentCartedItems_timeoutID;
export const getRecentCartedItems = (handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getRecentCartedItems_timeoutID);

    getRecentCartedItems_timeoutID = setTimeout(async () => {
      try {
        const { data } = await axios.get(
          API_URL + '/stats/recent_carted_items',
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );
        dispatch(setState('recentCartedItems', data));
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      }
      handleFinally !== undefined && handleFinally();
    }, DEBOUNCE_DELAY);
  };
};

let getPieCharts_timeoutID;
export const getPieCharts = (params, handleResult = {}) => {
  return (dispatch, getState, API_URL) => {
    const { handleSuccess, handleFail, handleFinally } = handleResult;
    clearTimeout(getPieCharts_timeoutID);

    getPieCharts_timeoutID = setTimeout(async () => {
      let { yearMonthStart, yearMonthEnd } = params;
      try {
        // add one day
        yearMonthStart.setDate(yearMonthStart.getDate() + 1);
        yearMonthEnd.setDate(yearMonthEnd.getDate() + 1);
        // turn date to ISO string
        yearMonthStart = yearMonthStart.toISOString();
        yearMonthEnd = yearMonthEnd.toISOString();

        const pieCharts = {};
        const sales = await axios.get(
          API_URL +
            `/stats/sales_pie_chart?yearMonthStart=${yearMonthStart}&yearMonthEnd=${yearMonthEnd}`,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );
        const transactions = await axios.get(
          API_URL +
            `/stats/transactions_pie_chart?yearMonthStart=${yearMonthStart}&yearMonthEnd=${yearMonthEnd}`,
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        );

        pieCharts.sales = [sales.data.prescriptionSales, sales.data.orderSales];
        pieCharts.prescriptionTransactions = transactions.data.prescriptions;
        pieCharts.productTransactions = transactions.data.orders;

        dispatch(setState('pieCharts', pieCharts));
        handleSuccess !== undefined && handleSuccess();
      } catch (error) {
        handleFail !== undefined && handleFail(error);
      } finally {
        handleFinally !== undefined && handleFinally();
      }
    }, DEBOUNCE_DELAY);
  };
};
