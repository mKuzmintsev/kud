import { Button, Descriptions, List, Modal, Tag } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

import { TestModel } from 'src/redux/slices/tests/types';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import { ProgressBar } from './ProgressBar';
import { useDispatch, useSelector } from 'react-redux';
import { startTest } from 'src/redux/slices/tests/slice';
import { testsSelector } from 'src/redux/slices/tests/selectors';

import styles from './tests.module.scss';
import { ResultTable } from './ResultTable';

type TestProps = {
  test: TestModel;
};

export const Test: React.FC<TestProps> = ({ test }) => {
  const { kuev } = useSelector(testsSelector);
  const { title, question, number, timeout, isPerformed, isPassed, testResult, testError } = test;
  const dispatch = useDispatch();

  const handleStart = async (test: TestModel) => {
    dispatch(startTest(test, kuev));
  };

  const handleStop = (test: TestModel) => {
    return;
  };

  const showTestResult = (test: TestModel) => {
    if (testResult) {
      Modal.info({
        type: test.isPassed ? 'success' : 'error',
        title: test.isPassed ? 'ТЕСТ ПРОЙДЕН' : 'ТЕСТ НЕ ПРОЙДЕН',
        className: styles.resolvedModal,
        content: <ResultTable data={testResult} />,
        okText: 'ЗАКРЫТЬ',
        okButtonProps: { type: 'primary' },
      });
    }

    if (testError) {
      Modal.info({
        type: 'error',
        title: 'ТЕСТ НЕ ПРОЙДЕН',
        className: styles.faultModal,
        content: (
          <Descriptions bordered className={styles.descriptionFault}>
            <Descriptions.Item span={3} label="Код ошибки">
              {testError.code}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="Описание">
              {testError.detail}
            </Descriptions.Item>
          </Descriptions>
        ),
        okText: 'ЗАКРЫТЬ',
        okButtonProps: { type: 'primary' },
      });
    }
  };

  return (
    <List.Item
      key={number}
      style={{ minHeight: 30 }}
      actions={[
        isPerformed ? (
          <ProgressBar timeout={timeout} key={uuidv4()} />
        ) : (
          <PlayCircleOutlined
            onClick={() => handleStart(test)}
            style={{ fontSize: '50px', color: '#52c41a' }}
            key={uuidv4()}
          />
        ),
        <PauseCircleOutlined
          onClick={() => handleStop(test)}
          style={{ fontSize: '50px', color: 'red' }}
          key={uuidv4()}
        />,
      ]}>
      <List.Item.Meta
        title={
          isPassed !== undefined && (
            <>
              {title}
              <Tag color={test.isPassed ? 'success' : 'error'} onClick={() => showTestResult(test)}>
                {test.isPassed ? 'Тест пройден' : 'Тест не пройден'}
              </Tag>
            </>
          )
        }
        description={question}
      />
    </List.Item>
  );
};
