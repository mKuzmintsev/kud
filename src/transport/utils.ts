import { VarModel } from 'src/redux/slices/tests/types';

export const createTestBodyIn = (vars: VarModel[], uuidKUEV: string) => {
  let queryBody = `kernel=devs&uuid=${uuidKUEV}&sid=2&action=setData&DATA_LIST=list_start`;

  queryBody = vars.reduce(
    (acc, testVar) =>
      `${acc}&DATA=struct_start&NAME=${testVar.name}&VALUE=${testVar.value}&DATA=struct_end`,
    queryBody
  );

  queryBody = `${queryBody}&DATA_LIST=list_end`;

  return queryBody;
};
export const createTestBodyOut = (vars: VarModel[], uuidKUEV: string) => {
  let queryBody = `kernel=devs&uuid=${uuidKUEV}&sid=2`;

  queryBody = vars.reduce((acc, testVar) => `${acc}&${testVar.name}=`, queryBody);

  return queryBody;
};
