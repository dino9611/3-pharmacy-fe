// ? action types
import { actionTypes } from '../action-types';
// ? axios
import axios from 'axios';

const setProducts = (payload) => {
  return {
    type: actionTypes.product.SET,
    payload,
  };
};

// ! CREATE
const addProductDebounce = (async (dispatch, API_URL, input) => {
  // console.log(input);
  await axios.post(API_URL + '/product', input);
  // const { data } = await axios.post(API_URL + '/raw_material', input);
  // console.log(data);
}).debouncify(250);
export const addRawMaterial = (input) => {
  return (dispatch, getState, API_URL) => {
    addProductDebounce(dispatch, API_URL, input);
  };
};

// ! READ
const getRawMaterialsDebounce = (async (dispatch, API_URL, page, limit) => {
  const { data } = await axios.get(
    API_URL + `/raw_material/?page=${page}&limit=${limit}`
  );
  dispatch(setProducts(data.result));
}).debouncify(250);
export const getRawMaterials = (page, limit) => {
  return (dispatch, getState, API_URL) => {
    getRawMaterialsDebounce(dispatch, API_URL, page, limit);
  };
};

// ! UPDATE
const editRawMaterialDebounce = (async (dispatch, API_URL, input) => {
  await axios.patch(API_URL + `/raw_material/${input.id}`, input);
}).debouncify(250);
export const editRawMaterial = (input) => {
  return (dispatch, getState, API_URL) => {
    console.log(input);
    editRawMaterialDebounce(dispatch, API_URL, input);
  };
};
