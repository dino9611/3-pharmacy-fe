import { actionTypes } from '../action-types';

const initialState = {
  rawMaterials: [],
  rawMaterialsRecord: [],
};

export const rawMaterialReducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.rawMaterial.SET_STATE:
      return { ...state, [action.propName]: action.payload };
    case actionTypes.rawMaterial.RESET_STATE:
      return { ...state, [action.propName]: initialState[action.propName] };
    default:
      return state;
  }
};
