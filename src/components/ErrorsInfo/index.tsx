import React, { useEffect } from 'react';

import styles from './ErrorsInfo.module.scss';
import { Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getErrorsCount, getErrors } from 'src/redux/slices/errors/slice';
import { errorsSelector } from '../../redux/slices/errors/selectors';

export const ErrorsInfo = () => {
  const dispatch = useDispatch();
  const { errors, errorsCount, isLoading } = useSelector(errorsSelector);

  useEffect(() => {
    dispatch(getErrorsCount());
    dispatch(getErrors(1));
  }, []);

  const columns = [
    {
      title: 'Время неисправности',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Тип устройства',
      dataIndex: 'deviceType',
      key: 'deviceType',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'UUID',
      dataIndex: 'UUID',
      key: 'UUID',
    },
    {
      title: 'Код',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Приоритет',
      dataIndex: 'priority',
      key: 'priority',
    },
  ];

  return (
    <div>
      <Table
        rowClassName={styles.row}
        columns={columns}
        dataSource={errors}
        pagination={{
          size: 'default',
          defaultCurrent: 1,
          defaultPageSize: 10,
          total: errorsCount,
          showSizeChanger: false,
          showTotal: (total, range) => `${range[0]} - ${range[1]} из ${total} ошибок`,
          onChange: (page) => {
            dispatch(getErrors(page));
          },
        }}
        loading={isLoading}
        size="small"
        bordered={false}
      />
    </div>
  );
};

export default ErrorsInfo;
