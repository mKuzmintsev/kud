import React from 'react';
import { Table } from 'antd';
import { getObjectFromXml } from '../../../../utils';

import styles from '../ServiceContent.module.scss';

type SettingsContentProps = {
  serviceInfo: any;
  isLoading: boolean;
};

export const SettingsContent: React.FC<SettingsContentProps> = ({ serviceInfo, isLoading }) => {
  const columns = [
    {
      title: 'Имя',
      dataIndex: 'friendlyName',
      key: 'friendlyName',
    },
    {
      title: 'Значение',
      dataIndex: 'value',
      key: 'value',
      width: '30%',
      render: (value: any) => {
        if (typeof value === 'string' && value.slice(0, 4) === 'http') {
          return <a href={value}>{value}</a>;
        } else {
          return value;
        }
      },
    },
    {
      title: 'Id',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const data: any = serviceInfo.serviceStateTable
    ? getObjectFromXml(serviceInfo.serviceStateTable.stateVariable)
    : null;
  console.log(data);

  return (
    <Table
      rowClassName={styles.row}
      columns={columns}
      dataSource={data}
      pagination={false}
      loading={isLoading}
      size="small"
      bordered
      // expandRowByClick
      // expandable={{}}
    />
  );
};

export default SettingsContent;
