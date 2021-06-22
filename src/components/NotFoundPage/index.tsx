import React from 'react';
import { Result, Button } from 'antd';

export const NotFoundPage: React.FC = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Файл не найден"
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
