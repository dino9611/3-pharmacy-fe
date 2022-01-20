import { actionTypes } from '../action-types';

const initialState = {
  request: {},
  prescriptions: [],
  prescriptionDetails: {},
};

export const prescriptionReducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.product.SET_STATE:
      return { ...state, [action.propName]: action.payload };
    case actionTypes.product.RESET_STATE:
      return { ...state, [action.propName]: initialState[action.propName] };
    default:
      return state;
  }
};
