import { getDefaultMiddleware } from '@reduxjs/toolkit';

const defaultMiddleware = getDefaultMiddleware();

const commonMiddlewares = [...defaultMiddleware];

export default commonMiddlewares;
