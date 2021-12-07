// ? action types
import { actionTypes } from '../action-types';
// ? axios
import axios from 'axios';

const setRawMaterials = (payload) => {
  return {
    type: actionTypes.rawMaterial.SET,
    payload,
  };
};

const getRawMaterialsDebounce = (async (dispatch, API_URL, page, limit) => {
  const { data } = await axios.get(
    API_URL + `/raw_material/?page=${page}&limit=${limit}`
  );
  dispatch(setRawMaterials(data));
}).debouncify(1000);
export const getRawMaterials = (page, limit) => {
  return (dispatch, getState, API_URL) => {
    getRawMaterialsDebounce(dispatch, API_URL, page, limit);
  };
};
