import { TestsState } from './slices/tests/types';
import { ViewState } from './slices/view/types';
import { ErrorsState } from './slices/errors/types';

export type AppState = {
  view: ViewState;
  tests: TestsState;
  errors: ErrorsState;
};

export type ActionBase<P, T extends string = string> = {
  type: T;
  payload: P;
};
