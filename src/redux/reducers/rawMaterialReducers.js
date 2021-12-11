import { actionTypes } from '../action-types';

const initialState = {
  rawMaterials: [],
};

export const rawMaterialReducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.rawMaterial.SET:
      return { ...state, rawMaterials: action.payload };
    case actionTypes.rawMaterial.RESET_STATE:
      return { ...state, [action.payload]: initialState[action.payload] };
    default:
      return state;
  }
};
