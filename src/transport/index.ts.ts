import axios, { AxiosResponse } from 'axios';
import { VarModel } from 'src/redux/slices/tests/types';
import { setErrorPage } from 'src/redux/slices/view/slice';
import { ErrorPage } from 'src/redux/slices/view/types';
import { createTestBodyIn, createTestBodyOut } from './utils';

const kudApi = axios.create();

const handleError = (error: any) => {
  let status: ErrorPage = '404';

  if (axios.isAxiosError(error)) {
    if (error.code == 'ECONNABORTED') {
      status = '404';
    }

    if (error.response?.status) {
      status = error.response?.status as unknown as ErrorPage;
    }

    // setErrorPage(status);
  }
  return Promise.reject(status);
};

kudApi.interceptors.response.use((response) => response, handleError);

export const kudTransport = {
  isAlive: async (): Promise<AxiosResponse> => await kudApi.get('/cgi-bin/alive.sh'),

  getTests: async (): Promise<AxiosResponse> => await kudApi.get('/test_list.xml'),

  checkKUEV: async (): Promise<AxiosResponse<string>> =>
    await kudApi.post('/cgi-bin/spo_ucsp.cgi', 'deviceType=SMEC'),

  getTest: async (url: string): Promise<AxiosResponse> => await kudApi.get(`/${url}`),

  startTestInput: async (testVars: VarModel[], uuidKUEV: string): Promise<AxiosResponse> => {
    const body = createTestBodyIn(testVars, uuidKUEV);
    return await kudApi.post('/cgi-bin/spo_ucsp.cgi', body);
  },
  startTestOutput: async (testVars: VarModel[], uuidKUEV: string): Promise<AxiosResponse> => {
    const body = createTestBodyOut(testVars, uuidKUEV);
    return await kudApi.post('/cgi-bin/spo_ucsp.cgi', body);
  },

  getDevs: async (menuKey: string): Promise<AxiosResponse> => {
    const body = `kernel=${menuKey}`;
    const res = await kudApi.post('/cgi-bin/spo_ucsp.cgi', body);

    return res;
  },

  getErrorsCount: async (): Promise<AxiosResponse> => {
    const res = await kudApi.get('/cgi-bin/spo_errors.cgi');

    return res;
  },
  getErrors: async (page: number): Promise<AxiosResponse> => {
    const body = `${(page - 1) * 10}#${page * 10}`;
    const res = await kudApi.post('/cgi-bin/spo_errors.cgi', body);

    return res;
  },

  checkLan: async (addr: string): Promise<AxiosResponse> => {
    const body = `${addr.trim().split('.').slice(2).join('.')}`;

    const res = await kudApi.post('/cgi-bin/harting_check_LAN.sh', body);

    return res;
  },

  getHartingInfo: async (ip: string): Promise<AxiosResponse> => {
    const res = await kudApi.post('/cgi-bin/harting_info.sh', ip);

    return res;
  },
};
