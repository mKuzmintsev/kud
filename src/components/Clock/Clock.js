import React, { useState, useEffect } from 'react';

import styles from './clock.module.scss';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  const tick = () => {
    setTime(new Date());
  };

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => {
      clearInterval(timerID);
    };
  }, []);

  return <span className={styles.root}>{time.toLocaleString()}</span>;
};

export default Clock;
