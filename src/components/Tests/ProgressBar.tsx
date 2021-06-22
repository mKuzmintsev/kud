import { Progress } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './tests.module.scss';

type ProgressBarProps = {
  timeout: number;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ timeout }) => {
  const [percent, setPercent] = useState<number>(0);

  useEffect(() => {
    if (percent < timeout) {
      setTimeout(() => {
        setPercent(percent + 1);
      }, 1000);
    }
  }, [percent]);

  return (
    <Progress
      width={50}
      strokeWidth={7}
      strokeLinecap="square"
      type="circle"
      percent={(100 / timeout) * percent}
    />
  );
};
