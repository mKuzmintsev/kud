import React from 'react';
import { Spin } from 'antd';

import styles from './Loader.module.scss';

function Loader() {
  return (
    <div className={styles.wrapper}>
      <Spin size="large"></Spin>
    </div>
  );
}
export default Loader;
