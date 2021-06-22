import { createSlice, CaseReducer, Dispatch } from '@reduxjs/toolkit';
import { ErrorPage, ViewPayload, ViewState } from './types';
import reducers from './reducers';
import { Pages } from '../../../common/enums';
import { ActionBase } from '../../types';
import { kudTransport } from 'src/transport/index.ts';

export const initialState: ViewState = {
  isLoading: false,
  page: Pages.HARTING,
  isAlive: false,
};

export const viewSlice = createSlice<
  ViewState,
  Record<string, CaseReducer<ViewState, ActionBase<ViewPayload>>>
>({
  name: 'view',
  initialState,
  reducers,
});

export const {
  onLoadService,
  onLoadServiceSuccess,
  onChoosePage,
  onChooseDev,
  onChooseService,
  onLoadDevs,
  onLoadDevsSuccess,
  onLoadDevsFailure,
  onResetErrorPage,
  onSetErrorPage,
  onSetAlive,
} = viewSlice.actions;

export default viewSlice.reducer;

export const setErrorPage =
  (status: ErrorPage) =>
  (dispatch: Dispatch): void => {
    dispatch(onSetErrorPage({ errorPage: status }));
  };

export const checkAlive =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    const isAlive = await kudTransport.isAlive();
    dispatch(onSetAlive({ isAlive: Boolean(isAlive) }));
  };
