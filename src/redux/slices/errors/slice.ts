import { createSlice, CaseReducer, Dispatch } from '@reduxjs/toolkit';
import { ErrorsPayload, ErrorsState } from './types';
import reducers from './reducers';
import { ActionBase } from '../../types';
import { kudTransport } from 'src/transport/index.ts';
import parser from 'fast-xml-parser';
import { v4 as uuidv4 } from 'uuid';

export const initialState: ErrorsState = {
  isLoading: false,
  errorsCount: 0,
  errors: [],
};

export const errorsSlice = createSlice<
  ErrorsState,
  Record<string, CaseReducer<ErrorsState, ActionBase<ErrorsPayload>>>
>({
  name: 'errors',
  initialState,
  reducers,
});

export const {
  onLoadErrorsCount,
  onLoadErrorsCountSuccess,
  onLoadErrorsFailure,
  onLoadErrors,
  onLoadErrorsSuccess,
} = errorsSlice.actions;

export default errorsSlice.reducer;

export const getErrors =
  (page: number) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch(onLoadErrors({}));

    try {
      const res = await kudTransport.getErrors(page);

      const data = parser.parse(res.data, { ignoreAttributes: false, parseTrueNumberOnly: true });

      const errors =
        data &&
        data.root &&
        data.root.error &&
        data.root.error.map((error: any) => ({
          key: uuidv4(),
          time: `${error.describe.date} ${error.describe.time}`,
          deviceType: error.describe.deviceType,
          UUID: error['@_urn'],
          code: error.describe.code,
          priority: error.describe.priority,
          description: error.describe.friendlyName,
        }));
      dispatch(onLoadErrorsSuccess({ errors }));
    } catch (error) {
      console.log(error);
    }
  };

export const getErrorsCount =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch(onLoadErrorsCount({}));

    try {
      const response = await kudTransport.getErrorsCount();
      const errorsCount = parser.parse(response.data).root;

      dispatch(onLoadErrorsCountSuccess({ errorsCount }));
    } catch (error) {
      dispatch(onLoadErrorsFailure({ error }));
    }
  };
