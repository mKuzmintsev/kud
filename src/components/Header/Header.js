import React from 'react';
import styles from './Header.module.scss';
import Clock from '../Clock/Clock';

import logo from '../../img/logo_full.svg';

function Header() {
  return (
    <header className={styles.root}>
      <div className={styles.logo}>
        <img src={logo} alt="Express" className={styles.img} />
      </div>
      <h1 className={styles.title}>СПО НПЦ "Экспресс"</h1>
      <Clock />
    </header>
  );
}

export default Header;
