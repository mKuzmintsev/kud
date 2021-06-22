import { AppState } from '../../types';
import { TestsState } from './types';

export const testsSelector = (state: AppState): TestsState => state.tests;
