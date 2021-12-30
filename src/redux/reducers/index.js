//? redux
import { combineReducers } from 'redux';
//? reducers
import { authReducers } from './auth_reducers';
import { rawMaterialReducers } from './rawMaterialReducers';
import { productReducers } from './productReducers';
import { cartReducers } from './cartReducers';
import { orderReducers } from './orderReducers';

const reducers = combineReducers({
  auth: authReducers,
  cart: cartReducers,
  order: orderReducers,
  rawMaterialReducers,
  productReducers,
});

export default reducers;
