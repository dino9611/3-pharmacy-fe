//? redux
import { combineReducers } from 'redux';
//? reducers
import { authReducers } from './auth_reducers';
import { rawMaterialReducers } from './rawMaterialReducers';
import { productReducers } from './productReducers';
import { cartReducers } from './cartReducers';

const reducers = combineReducers({
  auth: authReducers,
  cart: cartReducers,
  rawMaterialReducers,
  productReducers,
});

export default reducers;
