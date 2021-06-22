import { Button, Card, Descriptions, List, Modal, Progress, Result, Spin, Table, Tag } from 'antd';
import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { testsSelector } from 'src/redux/slices/tests/selectors';
import { PlayCircleOutlined, PauseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

import styles from './tests.module.scss';
import { viewSelector } from 'src/redux/slices/view/selectors';
import { Test } from './Test';
import { startAllTest, startTest } from 'src/redux/slices/tests/slice';

export type TestState = {
  isPerformed: boolean;
  result: boolean;
  duration: number;
};

export type TestsState = Record<number, TestState>;

export const Tests: React.FC = () => {
  const { kuev, tests } = useSelector(testsSelector);
  const { page, devName } = useSelector(viewSelector);
  const dispatch = useDispatch();

  const testsList = tests && (
    <List
      split
      size="small"
      bordered
      itemLayout="horizontal"
      dataSource={tests.testList}
      renderItem={(item) => {
        return <Test test={item} />;
      }}
    />
  );

  const handleStartAll = () => {
    dispatch(startAllTest(kuev));
  };

  const handleReboot = () => {
    console.log('reset');
  };

  const testPage = (
    <Result
      status="success"
      title={`КУЭВ обнаружен! UUID: ${kuev}`}
      subTitle={
        <>
          <p className={styles.attention}>
            ВНИМАНИЕ: После перехода к тестам будут остановлены все автоматические обработчики
            устройств.
          </p>
          <p className={styles.attention}>
            После окончания тестирования перезагрузите КУД с помощью кнопки ниже.
          </p>
        </>
      }
      extra={[
        <Button type="primary" size="large" key="reboot" onClick={handleReboot}>
          Перезагрузить
        </Button>,
      ]}
    />
  );

  if (kuev && !devName) {
    return testPage;
  }
  return (
    <Card
      style={{ minHeight: '100%' }}
      size="default"
      title={tests?.title}
      extra={
        <Button size="large" icon={<PlayCircleOutlined />} type="primary" onClick={handleStartAll}>
          Запуск всех тестов
        </Button>
      }>
      {testsList}
    </Card>
  );
};
