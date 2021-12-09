import { actionTypes } from '../action-types';

const initialState = [];

export const rawMaterialReducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.product.SET:
      return action.payload;
    default:
      return state;
  }
};
