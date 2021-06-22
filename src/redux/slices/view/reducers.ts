import { ValidateSliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';
import { ViewState } from './types';

const reducers: ValidateSliceCaseReducers<ViewState, Record<string, CaseReducer<ViewState>>> = {
  onLoadService: (state) => {
    state.isLoading = true;
  },
  onLoadServiceSuccess: (state) => {
    state.isLoading = false;
  },
  onLoadDevs: (state) => {
    state.isLoading = true;
  },
  onLoadDevsSuccess: (state, { payload }) => {
    state.isLoading = false;
  },
  onLoadDevsFailure: (state) => {
    state.isLoading = false;
  },
  onChoosePage: (state, { payload }) => {
    state.serviceName = undefined;
    state.devName = undefined;
    state.page = payload.page;
  },
  onChooseDev: (state, { payload }) => {
    state.serviceName = undefined;
    state.devName = payload.devName;
    state.page = payload.page;
  },
  onChooseService: (state, { payload }) => {
    state.serviceName = payload.serviceName;
  },
  onResetErrorPage: (state, { payload }) => {
    state.errorPage = undefined;
  },
  onSetErrorPage: (state, { payload }) => {
    state.errorPage = payload.errorPage;
  },
  onSetAlive: (state, { payload }) => {
    state.isAlive = payload.isAlive;
  },
};

export default reducers;
