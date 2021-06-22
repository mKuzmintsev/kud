import { TestsState } from '.';

export const testReducer = (state: TestsState, { type, payload }: any) => {
  switch (type) {
    case 'update':
      return payload;
    case 'start':
      return { ...state, [payload.number]: { ...state[payload.number], isPerformed: true } };
    case 'stop':
      return { state };
    case 'reset':
      return { state };
    case 'result':
      return {
        ...state,
        [payload.number]: {
          ...state[payload.number],
          isPerformed: false,
          result: payload.result,
        },
      };
    default:
      throw new Error();
  }
};
