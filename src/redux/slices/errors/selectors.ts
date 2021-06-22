import { AppState } from '../../types';
import { ErrorsState } from './types';

export const errorsSelector = (state: AppState): ErrorsState => state.errors;
