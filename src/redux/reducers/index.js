//? redux
import { combineReducers } from 'redux';
//? reducers
import { authReducers } from './auth_reducers';
import { rawMaterialReducers } from './rawMaterialReducers';

const reducers = combineReducers({
  auth: authReducers,
  rawMaterialReducers,
});

export default reducers;
