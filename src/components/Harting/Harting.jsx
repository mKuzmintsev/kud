import React, { useState, useEffect } from 'react';
import parser from 'fast-xml-parser';
import { Row, Col, Card, Descriptions, Button } from 'antd';

import switchImg from '../../img/harting9k.jpg';
import styles from './Harting.module.scss';
import { showNotification } from '../../util/showNotification';

function Harting() {
  const [ipConf, setIpConf] = useState([]);
  const [kudIp, setKudIp] = useState('');
  const [loading, setLoading] = useState(false);

  const getIpConf = async () => {
    setLoading(true);

    const res = await fetch('/cgi-bin/get_ip.sh');
    const ip = await res.text();

    setKudIp(ip);

    const addr = ip.trim().split('.').slice(2).join('.');

    const kommutators = [
      {
        name: 'G1',
        ip: '10.241.' + addr,
        friendlyName: 'Коммутатор G1',
        ports: {
          1: { L3: 7 },
          2: 'kud',
          7: { L2: 1 },
        },
      },
      {
        name: 'G2',
        ip: '10.242.' + addr,
        friendlyName: 'Коммутатор G2',
        ports: {
          1: { L3: 7 },
          2: 'kud',
          7: { L2: 1 },
        },
      },
      {
        name: 'L1',
        ip: '10.251.' + addr,
        friendlyName: 'Коммутатор L1',
        ports: {
          1: { L3: 7 },
          2: 'kud',
          7: { L2: 1 },
        },
      },
      {
        name: 'L2',
        ip: '10.252.' + addr,
        friendlyName: 'Коммутатор L2',
        ports: {
          1: { L3: 7 },
          2: 'kud',
          7: { L2: 1 },
        },
      },
      {
        name: 'L3',
        ip: '10.253.' + addr,
        friendlyName: 'Коммутатор L3',
        ports: {
          1: { L3: 7 },
          2: 'kud',
          7: { L2: 1 },
        },
      },
      {
        name: 'K',
        ip: '10.231.' + addr,
        friendlyName: 'Коммутатор K',
        ports: {
          1: { L3: 7 },
          2: 'kud',
          7: { L2: 1 },
        },
      },
    ];

    setIpConf(kommutators);

    setLoading(false);
  };

  useEffect(() => {
    getIpConf();
  }, []);

  const renderCards = () => {
    return ipConf.map((item) => {
      const description = getDescription(item);

      return (
        <Col span={8}>
          <Card
            style={{ height: '100%' }}
            size="small"
            cover={
              <div className={styles.switch}>
                <img src={switchImg} className={styles.switchImg}></img>
              </div>
            }>
            <Card.Meta description={description} />
          </Card>
        </Col>
      );
    });
  };

  const getDescription = (switchData) => {
    return (
      <div className={styles.descriptionWrapper}>
        <Descriptions
          title={switchData.friendlyName}
          bordered
          column={1}
          size="small"
          layout="horizontal">
          <Descriptions.Item label="IP-адрес">{switchData.ip}</Descriptions.Item>
          {Object.keys(switchData.ports).map((port) => {
            if (switchData.ports[port] === 'kud') {
              return (
                <Descriptions.Item label={`Порт №${port}`}>{`Подключен к КУД`}</Descriptions.Item>
              );
            }
            const out = Object.entries(switchData.ports[port])[0];

            const outSwitch = ipConf.find((item) => item.name === out[0]).friendlyName;
            const outPort = out[1];

            return (
              <Descriptions.Item
                label={`Порт №${port}`}>{`Подключен к порту №${outPort} ${outSwitch} `}</Descriptions.Item>
            );
          })}
        </Descriptions>
        {switchData.name !== 'K' ? (
          <>
            <Button
              type="primary"
              loading={loading}
              className={styles.button}
              onClick={() => configureSwitch(switchData)}>
              Настроить
            </Button>
            <Button
              type="primary"
              loading={loading}
              className={styles.button}
              onClick={() => getInfo(switchData)}>
              Сбор информации
            </Button>
          </>
        ) : null}
      </div>
    );
  };

  const configureSwitch = async (switchData) => {
    setLoading(true);

    const res = await fetch(`/cgi-bin/harting_conf_${switchData.name}.sh`, {
      method: 'POST',
      body: switchData.ip,
    });
    const data = await res.text();

    setLoading(false);
    showNotification('warning', data.split('\n'));
  };

  const getInfo = async (switchData) => {
    setLoading(true);

    const res = await fetch(`/cgi-bin/harting_info.sh`, {
      method: 'POST',
      // body: '192.168.0.5',
      body: switchData.ip,
    });
    const data = await res.text();

    console.log(data);

    setLoading(false);
    showNotification('warning', data.split('\n'));
  };
  const checkLan = async () => {
    setLoading(true);

    const res = await fetch(`/cgi-bin/harting_check_LAN.sh`, {
      method: 'GET',
      // body: switchData.ip,
    });
    const data = await res.text();

    console.log(data);

    setLoading(false);
    showNotification('warning', data.split('\n'));
  };

  return (
    <div className={styles.root}>
      <Button type="primary" loading={loading} className={styles.button} onClick={checkLan}>
        Проверка соединений
      </Button>
      <Row align="stretch" gutter={[16, 16]}>
        {renderCards()}
      </Row>
    </div>
  );
}

export default Harting;
