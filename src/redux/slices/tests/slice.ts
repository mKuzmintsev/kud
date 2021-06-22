import { createSlice, CaseReducer, Dispatch } from '@reduxjs/toolkit';
import {
  TestsPayload,
  TestsState,
  TestsModel,
  TestModel,
  VarModel,
  TestResultModel,
} from './types';
import reducers from './reducers';
import { ActionBase, AppState } from '../../types';
import { kudTransport } from 'src/transport/index.ts';
import parser from 'fast-xml-parser';
import { getItemsFromJson } from 'src/utils';
import { onChoosePage } from '../view/slice';
import { Pages } from 'src/common/enums';
import { startTestDelay } from 'src/components/Tests/helpers';
import Item from 'antd/lib/list/Item';
import { asyncForEach } from 'src/utils/asyncForEach';

export const initialState: TestsState = {
  isLoading: false,
  testCategories: [],
  kuev: '',
};

export const testsSlice = createSlice<
  TestsState,
  Record<string, CaseReducer<TestsState, ActionBase<TestsPayload>>>
>({
  name: 'tests',
  initialState,
  reducers,
});

export const {
  onLoadTests,
  onLoadTestsSuccess,
  onLoadTestsFailure,
  onLoadTest,
  onLoadTestSuccess,
  onLoadTestFailure,
  onCheckKuev,
  onStartTest,
  onStopTest,
  onResetTest,
  onEndTest,
} = testsSlice.actions;

export default testsSlice.reducer;

export const getTests =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch(onLoadTests({}));

    try {
      const response = await kudTransport.getTests();
      const data = parser.parse(response.data, { parseTrueNumberOnly: true });

      let testCategories: any;

      if (data && data.test_list && data.test_list.test) {
        const testList = data.test_list.test;
        testCategories = getItemsFromJson(data.test_list && testList);
      }

      const kuev = await kudTransport.checkKUEV();
      dispatch(onCheckKuev({ kuev: kuev.data ? kuev.data.split(' ')[1] : '' }));

      dispatch(onLoadTestsSuccess({ testCategories }));
    } catch (error) {
      dispatch(onLoadTestsFailure({ error }));
    }
  };

export const getTest =
  (url: string) =>
  async (dispatch: Dispatch): Promise<void> => {
    dispatch(onLoadTest({}));

    try {
      const response = await kudTransport.getTest(url);
      const data = parser.parse(response.data, { parseTrueNumberOnly: true });

      const testList: TestModel =
        data.testlist &&
        getItemsFromJson(data.testlist && data.testlist.test).map((item: any) => ({
          title: item.title,
          number: item.number,
          question: item.question,
          timeout: item.timeout,
          inputList: getItemsFromJson(item.input_list && item.input_list.var).map(
            (variable) =>
              ({
                name: variable.NAME,
                frname: variable.FRNAME,
                value: variable.VALUE,
                status: variable.STATUS,
              } as VarModel)
          ),

          outputList: getItemsFromJson(item.output_list && item.output_list.var).map(
            (variable) =>
              ({
                name: variable.NAME,
                frname: variable.FRNAME,
                value: variable.VALUE,
                status: variable.STATUS,
              } as VarModel)
          ),
          isPerformed: false,
        }));

      const tests: TestsModel = data.testlist && {
        title: data.testlist.head && data.testlist.head.title,
        testList,
      };

      dispatch(onLoadTestSuccess({ tests }));
    } catch (error) {
      dispatch(onLoadTestFailure({ error }));
    }
  };

export const startTest =
  (test: TestModel, kuev: string) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch(onStartTest({ test }));
      const inputResponse = await kudTransport.startTestInput(test.inputList, kuev);

      const receivedValue: any = await startTestDelay(test, kuev, inputResponse.data);

      const testResult = test.outputList.reduce((acc, outVar) => {
        acc.push({
          key: outVar.name,
          name: outVar.name,
          frname: outVar.frname,
          expectedValue: outVar.value,
          receivedValue: receivedValue[outVar.name].value,
        });
        return acc;
      }, [] as TestResultModel);

      const isPassed = testResult.every((item) => item.expectedValue === item.receivedValue);
      console.log(isPassed);

      dispatch(onEndTest({ test, isPassed, testResult }));
    } catch (error) {
      console.log(error);
      dispatch(onEndTest({ test, isPassed: false, testError: error }));
    }
  };

export const startAllTest =
  (kuev: string) =>
  async (dispatch: Dispatch, getState: () => AppState): Promise<void> => {
    try {
      console.log(getState());
      const { tests } = getState();

      await asyncForEach(tests!.tests!.testList, async (test: TestModel) => {
        try {
          dispatch(onStartTest({ test }));
          const inputResponse = await kudTransport.startTestInput(test.inputList, kuev);

          const receivedValue: any = await startTestDelay(test, kuev, inputResponse.data);

          const testResult = test.outputList.reduce((acc, outVar) => {
            acc.push({
              key: outVar.name,
              name: outVar.name,
              frname: outVar.frname,
              expectedValue: outVar.value,
              receivedValue: receivedValue[outVar.name].value,
            });
            return acc;
          }, [] as TestResultModel);

          const isPassed = testResult.every((item) => item.expectedValue === item.receivedValue);
          console.log(isPassed);

          dispatch(onEndTest({ test, isPassed, testResult }));
        } catch (error) {
          console.log(error);
          dispatch(onEndTest({ test, isPassed: false, testError: error }));
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
