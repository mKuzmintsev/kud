import { AppState } from '../../types';
import { ViewState } from './types';

export const viewSelector = (state: AppState): ViewState => state.view;
