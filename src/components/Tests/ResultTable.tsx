import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { TestResult } from '.';
import styles from './tests.module.scss';

const columns: ColumnsType<TestResult> = [
  { title: 'Имя переменной', dataIndex: 'frname', key: 'frname' },
  { title: 'Полученное значение', dataIndex: 'receivedValue', key: 'receivedValue' },
  { title: 'Ожидаемое значение', dataIndex: 'expectedValue', key: 'expectedValue' },
];

export type ResultTableProps = {
  data: TestResult[];
};

export const ResultTable: React.FC<ResultTableProps> = ({ data }) => {
  return (
    <Table
      className={styles.table}
      dataSource={data}
      pagination={false}
      columns={columns}
      rowClassName={(record) => {
        return record.expectedValue === record.receivedValue ? styles.successRow : styles.failedRow;
      }}
    />
  );
};
