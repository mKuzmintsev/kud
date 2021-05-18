import React from 'react';
import { Table } from 'antd';
import { getObjectFromXml } from '../../../../util/getObjectFromXml';

function SettingsContent({ serviceInfo, isLoading }) {
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
    },
    {
      title: 'Id',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  const data = serviceInfo.serviceStateTable
    ? getObjectFromXml(serviceInfo.serviceStateTable.stateVariable)
    : null;

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      loading={isLoading}
      size="small"
      bordered
    />
  );
}

export default SettingsContent;
