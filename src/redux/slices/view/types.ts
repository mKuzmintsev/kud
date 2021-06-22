import { Pages } from '../../../common/enums';

export type ViewState = {
  isLoading: boolean;
  error?: Error;
  errorPage?: ErrorPage;
  devName?: string;
  serviceName?: string;
  page: Pages;
  isAlive: boolean;
};

export type ViewPayload = {
  devName?: string;
  serviceName?: string;
  page?: string;
  devs?: any[];
  error?: Error | string;
  errorPage?: ErrorPage;
  isAlive?: boolean;
};

export type ErrorPage = '404' | '500';
