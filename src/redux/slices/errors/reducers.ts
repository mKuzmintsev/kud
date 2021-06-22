import { ValidateSliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';
import { ActionBase } from 'src/redux/types';
import { ErrorsPayload, ErrorsState } from './types';

const reducers: ValidateSliceCaseReducers<
  ErrorsState,
  Record<string, CaseReducer<ErrorsState, ActionBase<ErrorsPayload>>>
> = {
  onLoadErrors: (state) => {
    state.isLoading = true;
  },
  onLoadErrorsSuccess: (state, { payload }) => {
    state.isLoading = false;
    state.errors = payload.errors!;
  },
  onLoadErrorsCount: (state) => {
    state.isLoading = true;
  },
  onLoadErrorsCountSuccess: (state, { payload }) => {
    state.isLoading = false;
    state.errorsCount = payload.errorsCount!;
  },
  onLoadErrorsFailure: (state) => {
    state.isLoading = false;
  },
};

export default reducers;
