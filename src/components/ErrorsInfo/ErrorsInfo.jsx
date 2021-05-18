import React, { useState, useEffect } from 'react';
import parser from 'fast-xml-parser';
import { useLocation } from 'react-router-dom';

import styles from './ErrorsInfo.module.scss';
import { Table } from 'antd';

function ErrorsInfo() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();

  const getErrors = async () => {
    setLoading(true);

    let res = await fetch('/cgi-bin/spo_errors.cgi');
    let xml = await res.text();
    const errorsNum = xml && parser.parse(xml).root;

    res = await fetch('/cgi-bin/spo_errors.cgi', {
      method: 'POST',
      body: `0#${errorsNum}`,
    });
    xml = await res.text();
    const data = xml && parser.parse(xml, { ignoreAttributes: false, parseTrueNumberOnly: true });

    setErrors(data.root.error || []);
    console.log(data.root.error);

    setLoading(false);
  };

  useEffect(() => {
    getErrors();
  }, []);

  const columns = [
    {
      title: 'Время неисправности',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Тип устройства',
      dataIndex: 'deviceType',
      key: 'deviceType',
      width: '30%',
    },
    {
      title: 'UUID',
      dataIndex: 'UUID',
      key: 'UUID',
    },
    {
      title: 'Код',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Приоритет',
      dataIndex: 'priority',
      key: 'priority',
    },
  ];

  const getDataForTable = () => {
    return errors.map((item, idx) => {
      const key = idx;
      const time = `${item.describe.date} ${item.describe.time}`;
      const deviceType = item.describe.deviceType;
      const UUID = item['@_urn'];
      const code = item.describe.code;
      const priority = item.describe.priority;
      const description = item.describe.friendlyName;

      return { key, time, deviceType, UUID, code, priority, description };
    });
  };

  return (
    <div className={styles.root}>
      <Table
        columns={columns}
        dataSource={getDataForTable()}
        pagination={false}
        loading={loading}
        size="small"
        bordered
        expandable={{
          expandedRowRender: (record) => <p>{record.description}</p>,
        }}
      />
    </div>
  );
}

export default ErrorsInfo;
