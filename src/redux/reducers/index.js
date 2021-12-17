//? redux
import { combineReducers } from 'redux';
//? reducers
import { authReducers } from './auth_reducers';
import { rawMaterialReducers } from './rawMaterialReducers';
import { productReducers } from './productReducers';
import { revenueReducers } from './revenueReducers';

const reducers = combineReducers({
  auth: authReducers,
  rawMaterialReducers,
  productReducers,
  revenueReducers,
});

export default reducers;
