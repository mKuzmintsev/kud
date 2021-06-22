import React from 'react';
import styles from './Header.module.scss';
import Clock from '../Clock/Clock';
import { Layout } from 'antd';
const { Header: AntHeader } = Layout;

import logo from '../../img/logo_full.svg';

function Header() {
  return (
    <AntHeader className={styles.root}>
      <div className={styles.logo}>
        <img src={logo} alt="Express" className={styles.img} />
      </div>
      <h1 className={styles.title}>СПО НПЦ &quot;Экспресс&quot;</h1>
      <Clock />
    </AntHeader>
  );
}

export default Header;
