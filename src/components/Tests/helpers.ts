import { TestModel } from 'src/redux/slices/tests/types';
import { kudTransport } from 'src/transport/index.ts';
import parser from 'fast-xml-parser';

export const startTestDelay = async (test: TestModel, kuev: string, inputResponse: string) => {
  console.log(inputResponse);

  const isNoAnswer = inputResponse.includes('Нет ответа');
  console.log(isNoAnswer);

  return new Promise((resolve, reject) => {
    const receivedValue = {} as any;
    setTimeout(
      async () => {
        const response = await kudTransport.startTestOutput(test.outputList, kuev);

        const data = parser.parse(response.data, { parseTrueNumberOnly: true }).body;

        if (data.stateVariable) {
          for (const item in data.stateVariable) {
            receivedValue[item] = {
              value: data.stateVariable[item].struct.DATA.value,
              status: data.stateVariable[item].struct.STATUS.value,
            };
          }

          resolve(receivedValue);
        }

        if (data.fault) {
          reject({ code: data.fault.code, detail: data.fault.detail });
        }
      },
      isNoAnswer ? 0 : test.timeout * 1000
    );
  });
};
