export type TestsState = {
  isLoading: boolean;
  error?: Error;
  testCategories: Array<TestCategoriesModel>;
  tests?: TestsModel;
  kuev: string;
};

export type TestsPayload = {
  testCategories?: Array<TestCategoriesModel>;
  tests?: TestsModel;
  error?: Error | string;
  kuev?: string;
  test?: TestModel;
  isPassed?: boolean;
  testResult?: TestResultModel;
  testError?: TestErrorModel;
};

export type TestCategoriesModel = {
  title: string;
  fname: string;
};

export type TestModel = {
  title: string;
  number: number;
  question: string;
  inputList: Array<VarModel>;
  outputList: Array<VarModel>;
  timeout: number;
  isPerformed: boolean;
  isPassed?: boolean;
  testResult?: TestResultModel;
  testError?: TestErrorModel;
};

export type VarModel = {
  name: string;
  frname?: string;
  value: string;
  status?: string;
};

export type TestsModel = {
  title: string;
  testList: Array<TestModel>;
};

export type TestResultModel = Array<{
  key: string;
  name: string;
  frname?: string;
  expectedValue: string;
  receivedValue: string;
}>;

export type TestErrorModel = {
  code: string;
  detail: string;
};
