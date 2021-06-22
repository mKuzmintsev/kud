import { ValidateSliceCaseReducers, CaseReducer } from '@reduxjs/toolkit';
import { ActionBase } from 'src/redux/types';
import { TestModel, TestsPayload, TestsState } from './types';

const reducers: ValidateSliceCaseReducers<
  TestsState,
  Record<string, CaseReducer<TestsState, ActionBase<TestsPayload>>>
> = {
  onLoadTests: (state) => {
    state.isLoading = true;
  },
  onLoadTestsSuccess: (state, { payload }) => {
    state.isLoading = false;
    state.testCategories = payload.testCategories!;
  },
  onLoadTestsFailure: (state) => {
    state.isLoading = false;
  },
  onLoadTest: (state) => {
    state.isLoading = true;
  },
  onLoadTestSuccess: (state, { payload }) => {
    state.isLoading = false;
    state.tests = payload.tests!;
  },
  onLoadTestFailure: (state) => {
    state.isLoading = false;
  },
  onCheckKuev: (state, { payload }) => {
    state.kuev = payload.kuev!;
  },
  onStartTest: (state, { payload }) => {
    console.log(payload);
    const newTestList = state.tests?.testList.map((test) => {
      if (test.number === payload.test!.number) {
        return { ...test, isPerformed: true, isPassed: undefined };
      }
      return test;
    }) as TestModel[];
    state.tests!.testList = newTestList;
  },
  onEndTest: (state, { payload }) => {
    const newTestList = state.tests?.testList.map((test) => {
      if (test.number === payload.test!.number) {
        return {
          ...test,
          isPerformed: false,
          isPassed: payload.isPassed,
          testResult: payload.testResult,
          testError: payload.testError,
        };
      }
      return test;
    }) as TestModel[];
    state.tests!.testList = newTestList;
  },
};

export default reducers;
