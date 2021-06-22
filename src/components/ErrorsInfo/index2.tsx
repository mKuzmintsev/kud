import React, { useEffect } from 'react';

import styles from './ErrorsInfo.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getErrorsCount, getErrors } from 'src/redux/slices/errors/slice';
import { errorsSelector } from '../../redux/slices/errors/selectors';
import { Table as BootstrapTable } from 'react-bootstrap';
import { Table } from 'antd';
import { v4 as uuidv4 } from 'uuid';

export const ErrorsInfo = () => {
  const dispatch = useDispatch();
  const { errors, errorsCount, isLoading } = useSelector(errorsSelector);

  useEffect(() => {
    dispatch(getErrorsCount());
    dispatch(getErrors(1));
  }, []);

  return (
    <BootstrapTable size="sm" bordered>
      <thead>
        <tr>
          <th>Тип устройства</th>
          <th>Описание</th>
          <th>UUID</th>
          <th>Код</th>
          <th>Приоритет</th>
        </tr>
      </thead>
      <tbody>
        {errors &&
          errors.map((error) => {
            return (
              <tr key={uuidv4()}>
                <th>{error.deviceType}</th>
                <th>{error.description}</th>
                <th>{error.UUID}</th>
                <th>{error.code}</th>
                <th>{error.priority}</th>
              </tr>
            );
          })}
      </tbody>
    </BootstrapTable>
  );
};

export default ErrorsInfo;
