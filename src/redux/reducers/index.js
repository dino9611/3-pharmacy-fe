//? redux
import { combineReducers } from 'redux';
//? reducers
import { authReducers } from './auth_reducers';
import { rawMaterialReducers } from './rawMaterialReducers';
import { productReducers } from './productReducers';

const reducers = combineReducers({
  auth: authReducers,
  rawMaterialReducers,
  productReducers,
});

export default reducers;
