//? api
// import { api } from './../api';
//? redux
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
//? reducers
import reducers from './reducers';

const store = createStore(
  reducers,
  {}, // * initial state
  // * compose accepts the functions to compose and returns the final function obtained by composing the given functions from right to left.
  applyMiddleware(thunk.withExtraArgument('extra argument')),
  // compose(
  //   // applyMiddleware(thunk.withExtraArgument(api)),

  //   // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  // )
);

export default store;
