import React, { useState } from 'react';
import { Menu } from 'antd';
import { SettingOutlined, CaretRightOutlined } from '@ant-design/icons';

import styles from './ServiceContent.module.scss';
import SettingsContent from './SettingsContent/SettingsContent';
import ActionsContent from './ActionsContent/ActionsContent';

function ServiceContent({ serviceInfo, isLoading }) {
  const [currentTab, setCurrentTab] = useState('settings');

  const handleClickTab = (key) => setCurrentTab(key);

  return (
    <div className={styles.wrapper}>
      <div className={styles.menu}>
        <Menu
          onClick={({ key }) => handleClickTab(key)}
          selectedKeys={currentTab}
          mode="horizontal">
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            Параметры
          </Menu.Item>
          <Menu.Item key="actions" icon={<CaretRightOutlined />}>
            Действия
          </Menu.Item>
        </Menu>
      </div>
      <div className={styles.content}>
        {currentTab === 'settings' ? (
          <SettingsContent serviceInfo={serviceInfo} isLoading={isLoading}></SettingsContent>
        ) : (
          <ActionsContent serviceInfo={serviceInfo}></ActionsContent>
        )}
      </div>
    </div>
  );
}

export default ServiceContent;
