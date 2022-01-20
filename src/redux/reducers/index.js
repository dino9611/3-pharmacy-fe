//? redux
import { combineReducers } from 'redux';
//? reducers
import { authReducers } from './authReducers';
import { rawMaterialReducers } from './rawMaterialReducers';
import { productReducers } from './productReducers';
import { statsReducers } from './statsReducers';
import { cartReducers } from './cartReducers';
import { orderReducers } from './orderReducers';
import { prescriptionReducers } from './prescriptionReducers';

const reducers = combineReducers({
  auth: authReducers,
  cart: cartReducers,
  order: orderReducers,
  rawMaterialReducers,
  productReducers,
  statsReducers,
  prescriptionReducers,
});

export default reducers;
