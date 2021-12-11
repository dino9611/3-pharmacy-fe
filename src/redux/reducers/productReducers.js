import { actionTypes } from '../action-types';

const initialState = {
  products: [],
  categories: [],
};

export const productReducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.product.SET:
      return { ...state, products: action.payload };
    case actionTypes.product.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case actionTypes.product.RESET_STATE:
      return { ...state, [action.payload]: initialState[action.payload] };
    default:
      return state;
  }
};
