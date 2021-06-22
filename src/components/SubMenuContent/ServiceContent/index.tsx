import React, { useState } from 'react';
import { Menu } from 'antd';
import { SettingOutlined, CaretRightOutlined } from '@ant-design/icons';

import styles from './ServiceContent.module.scss';
import SettingsContent from './SettingsContent';
import ActionsContent from './ActionsContent';

type ServiceContentProps = {
  serviceInfo: string;
  isLoading: boolean;
};

export const ServiceContent: React.FC<ServiceContentProps> = ({ serviceInfo, isLoading }) => {
  const [currentTab, setCurrentTab] = useState<string[]>(['settings']);

  const handleClickTab = (keyPath: string[]) => setCurrentTab(keyPath);

  const tabContent: any = {
    settings: <SettingsContent serviceInfo={serviceInfo} isLoading={isLoading} />,
    actions: <ActionsContent serviceInfo={serviceInfo} />,
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.menu}>
        <Menu
          onClick={({ keyPath }) => {
            handleClickTab(keyPath);
          }}
          selectedKeys={currentTab}
          mode="horizontal"
          theme="dark">
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            Параметры
          </Menu.Item>
          <Menu.Item key="actions" icon={<CaretRightOutlined />}>
            Действия
          </Menu.Item>
        </Menu>
      </div>
      <div className={styles.content}>{tabContent[currentTab[0]]}</div>
    </div>
  );
};

export default ServiceContent;
