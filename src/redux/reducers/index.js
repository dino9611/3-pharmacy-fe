//? redux
import { combineReducers } from 'redux';
//? reducers
import { authReducers } from './authReducers';
import { rawMaterialReducers } from './rawMaterialReducers';
import { productReducers } from './productReducers';
import { revenueReducers } from './revenueReducers';
import { cartReducers } from './cartReducers';

const reducers = combineReducers({
  auth: authReducers,
  cart: cartReducers,
  rawMaterialReducers,
  productReducers,
  revenueReducers,
});

export default reducers;
