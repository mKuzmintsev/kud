import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import viewReducer from './slices/view/slice';
import testsReducer from './slices/tests/slice';
import errorsReducer from './slices/errors/slice';

import commonMiddlewares from './middlewares';

const store = configureStore({
  reducer: combineReducers({
    view: viewReducer,
    tests: testsReducer,
    errors: errorsReducer,
  }),
  middleware: commonMiddlewares,
});

export default store;
