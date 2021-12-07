//? api
import { API_URL } from '../constants/api';
//? redux
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
//? reducers
import reducers from './reducers';

const store = createStore(
  reducers,
  {}, // * initial state
  applyMiddleware(thunk.withExtraArgument(API_URL))
  // * compose accepts the functions to compose and returns the final function obtained by composing the given functions in order.
  // compose(
  //   // applyMiddleware(thunk.withExtraArgument(api)),
  //   // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  // )
);

export default store;
