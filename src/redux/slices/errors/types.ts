export type ErrorsState = {
  isLoading: boolean;
  error?: Error;
  errors: ErrorModel[];
  errorsCount: number;
};

export type ErrorsPayload = {
  errors?: ErrorModel[];
  errorsCount?: number;
  error?: Error | string;
};

export type ErrorModel = {
  time: string;
  deviceType: string;
  UUID: string;
  code: string;
  priority: string;
  description: string;
};
