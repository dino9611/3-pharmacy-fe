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
const addRawMaterialDebounce = (async (dispatch, API_URL, input) => {
  await axios.post(API_URL + '/raw_material', input);
  // const { data } = await axios.post(API_URL + '/raw_material', input);
  // console.log(data);
}).debouncify(DEBOUNCE_DELAY);
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
}).debouncify(DEBOUNCE_DELAY);
export const getRawMaterials = (page, limit) => {
  return (dispatch, getState, API_URL) => {
    getRawMaterialsDebounce(dispatch, API_URL, page, limit);
  };
};

const getRawMaterialDebounce = (async (dispatch, state, API_URL, id, index) => {
  const { data } = await axios.get(API_URL + `/raw_material/${id}`);
  state[index] = data.result[0];
  dispatch(setState('rawMaterials', [...state])); // ! needs to be new array to trigger
}).debouncify(DEBOUNCE_DELAY);
export const getRawMaterial = (id, index) => {
  return (dispatch, getState, API_URL) => {
    const state = getState().rawMaterialReducers.rawMaterials;
    getRawMaterialDebounce(dispatch, state, API_URL, id, index);
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
}).debouncify(DEBOUNCE_DELAY);
export const getRawMaterialsRecord = (page, limit) => {
  return (dispatch, getState, API_URL) => {
    getRawMaterialsRecordDebounce(dispatch, API_URL, page, limit);
  };
};

// ! UPDATE
const editRawMaterialDebounce = (async (dispatch, API_URL, input) => {
  const { index } = input;
  delete input.index;
  await axios.patch(API_URL + `/raw_material/${input.id}`, input);
  dispatch(getRawMaterial(input.id, index));
}).debouncify(DEBOUNCE_DELAY);
export const editRawMaterial = (input) => {
  return (dispatch, getState, API_URL) => {
    editRawMaterialDebounce(dispatch, API_URL, input);
  };
};
