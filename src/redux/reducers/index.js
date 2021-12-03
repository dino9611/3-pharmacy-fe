//? redux
import { combineReducers } from 'redux';
//? reducers
import { authReducers } from "./auth_reducers";

const reducers = combineReducers({
  auth: authReducers
});

export default reducers;