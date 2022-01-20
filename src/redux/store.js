//? api
import { API_URL } from '../constants/api';
//? redux
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
//? reducers
import reducers from './reducers';

let store;
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  store = createStore(
    reducers,
    compose(
      applyMiddleware(thunk.withExtraArgument(API_URL)),
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    )
  );
} else {
  store = createStore(
    reducers,
    {}, // * initial state
    applyMiddleware(thunk.withExtraArgument(API_URL))
  );
}

export default store;
