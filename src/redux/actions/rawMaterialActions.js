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

// ! CREATE
const addRawMaterialDebounce = (async (dispatch, API_URL, input) => {
  await axios.post(API_URL + '/raw_material', input);
  // const { data } = await axios.post(API_URL + '/raw_material', input);
  // console.log(data);
}).debouncify(250);
export const addRawMaterial = (input) => {
  return (dispatch, getState, API_URL) => {
    addRawMaterialDebounce(dispatch, API_URL, input);
  };
};

// ! READ
const getRawMaterialsDebounce = (async (dispatch, API_URL, page, limit) => {
  const { data } = await axios.get(
    API_URL + `/raw_material/?page=${page}&limit=${limit}`
  );
  dispatch(setState('rawMaterials', data.result));
}).debouncify(250);
export const getRawMaterials = (page, limit) => {
  return (dispatch, getState, API_URL) => {
    getRawMaterialsDebounce(dispatch, API_URL, page, limit);
  };
};

const getRawMaterialsRecordDebounce = (async (
  dispatch,
  API_URL,
  page,
  limit
) => {
  const { data } = await axios.get(
    API_URL + `/raw_material/record/?page=${page}&limit=${limit}`
  );
  // console.log(data);
  dispatch(setState('rawMaterialsRecord', data.result));
}).debouncify(250);
export const getRawMaterialsRecord = (page, limit) => {
  return (dispatch, getState, API_URL) => {
    getRawMaterialsRecordDebounce(dispatch, API_URL, page, limit);
  };
};

// ! UPDATE
const editRawMaterialDebounce = (async (dispatch, API_URL, input) => {
  await axios.patch(API_URL + `/raw_material/${input.id}`, input);
}).debouncify(250);
export const editRawMaterial = (input) => {
  return (dispatch, getState, API_URL) => {
    editRawMaterialDebounce(dispatch, API_URL, input);
  };
};
