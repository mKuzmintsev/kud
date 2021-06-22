import React from 'react';
import { Result, Button } from 'antd';

export const ServerNotResponsed: React.FC = () => {
  return (
    <Result
      status="500"
      title="500"
      subTitle="Ошибка ответа от сервера"
      extra={
        <Button
          type="primary"
          onClick={() => {
            window.location.reload();
          }}>
          Обновить страницу
        </Button>
      }
    />
  );
};
