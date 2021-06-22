import React, { useState, useEffect } from 'react';
import { InfoCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { Row, Col, Card, Button, Spin, Descriptions, Badge, Modal } from 'antd';

import switchImg from '../../img/harting9k.jpg';
import styles from './Harting.module.scss';
import { showNotification } from '../../utils';
import { kudTransport } from 'src/transport/index.ts';

export const Harting = () => {
  const [ipConf, setIpConf] = useState([]);
  const [kudIp, setKudIp] = useState('');
  const [loading, setLoading] = useState(false);

  const getIpConf = async () => {
    setLoading(true);

    const res = await fetch('/cgi-bin/get_ip.sh');
    const ip = await res.text();

    setKudIp(ip);

    const addr = ip.trim().split('.').slice(2).join('.');

    const kommutators: any = [
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
    return ipConf.map((item: any) => {
      return (
        <Col span={8} key={item.name}>
          <Card
            title={item.friendlyName}
            size="small"
            actions={
              item.name !== 'K'
                ? [
                    <SettingOutlined key="setting" onClick={() => configureSwitch(item)} />,
                    <InfoCircleOutlined key="info" onClick={() => getInfo(item)} />,
                  ]
                : undefined
            }>
            <div className={styles.switch}>
              <img src={switchImg} className={styles.switchImg}></img>
            </div>
          </Card>
        </Col>
      );
    });
  };

  // const getDescription = (switchData: any) => {
  //   return (
  //     <div className={styles.descriptionWrapper}>
  //       <Descriptions
  //         title={switchData.friendlyName}
  //         bordered
  //         column={1}
  //         size="small"
  //         layout="horizontal">
  //         <Descriptions.Item label="IP-адрес">{switchData.ip}</Descriptions.Item>
  //         {Object.keys(switchData.ports).map((port) => {
  //           if (switchData.ports[port] === 'kud') {
  //             return (
  //               <Descriptions.Item
  //                 key={port}
  //                 label={`Порт №${port}`}>{`Подключен к КУД`}</Descriptions.Item>
  //             );
  //           }
  //           const out = Object.entries(switchData.ports[port])[0];

  //           const outSwitch = ipConf.find((item) => item.name === out[0]).friendlyName;
  //           const outPort = out[1];

  //           return (
  //             <Descriptions.Item
  //               key={port}
  //               label={`Порт №${port}`}>{`Подключен к порту №${outPort} ${outSwitch} `}</Descriptions.Item>
  //           );
  //         })}
  //       </Descriptions>
  //       {switchData.name !== 'K' ? (
  //         <>
  //           <Button
  //             type="primary"
  //             loading={loading}
  //             className={styles.button}
  //             onClick={() => configureSwitch(switchData)}>
  //             Настроить
  //           </Button>
  //           <Button
  //             type="primary"
  //             loading={loading}
  //             className={styles.button}
  //             onClick={() => getInfo(switchData)}>
  //             Сбор информации
  //           </Button>
  //         </>
  //       ) : null}
  //     </div>
  //   );
  // };

  const configureSwitch = async (switchData: any) => {
    setLoading(true);

    const res = await fetch(`/cgi-bin/harting_conf_${switchData.name}.sh`, {
      method: 'POST',
      body: switchData.ip,
    });
    const data = await res.text();

    setLoading(false);
    showNotification({
      type: 'warning',
      description: data.split('\n'),
      message: `Настройка коммутатора ${switchData.name}`,
    });
  };

  const getInfo = async (switchData: any) => {
    setLoading(true);

    const res = await kudTransport.getHartingInfo(switchData.ip);
    const data = res.data && res.data.split('\n').filter((item: string) => item);

    console.log(data);

    setLoading(false);

    Modal.info({
      // content: (
      //   <Descriptions bordered size="small">
      //     {data
      //       ? data.map((item: string) => {
      //           const check = {
      //             title: item.substr(0, item.length - 4).trim(),
      //             status: item.substr(-4).trim(),
      //           };
      //           return (
      //             <Descriptions.Item label={check.title} span={12}>
      //               {check.status === 'Есть' ? (
      //                 <Badge status="success" text={check.status} />
      //               ) : (
      //                 <Badge status="error" text={check.status} />
      //               )}
      //             </Descriptions.Item>
      //           );
      //         })
      //       : 'Проверка не удалась'}
      //   </Descriptions>
      // ),
      content: res.data,
      title: `Параметры коммутатора ${switchData.name}`,
      centered: true,
      width: 650,
    });
  };

  const checkLan = async () => {
    setLoading(true);

    const res = await kudTransport.checkLan(kudIp);
    const data = res.data && res.data.split('\n').filter((item: string) => item);

    setLoading(false);
    Modal.info({
      content: (
        <Descriptions bordered size="small" style={{ marginTop: 20 }}>
          {data
            ? data.map((item: string) => {
                const check = {
                  title: item.substr(0, item.length - 4).trim(),
                  status: item.substr(-4).trim(),
                };
                return (
                  <Descriptions.Item label={check.title} span={12}>
                    {check.status === 'Есть' ? (
                      <Badge status="success" text={check.status} />
                    ) : (
                      <Badge status="error" text={check.status} />
                    )}
                  </Descriptions.Item>
                );
              })
            : 'Проверка не удалась'}
        </Descriptions>
      ),
      title: `Проверка соединений`,
      centered: true,
      width: 650,
    });
  };

  return (
    <Card
      className={styles.card}
      title="Настройка коммутаторов"
      size="small"
      bodyStyle={{ flex: 1, alignItems: 'center', display: 'flex', justifyContent: 'center' }}
      extra={
        <Button type="primary" disabled={loading} className={styles.button} onClick={checkLan}>
          Проверка соединений
        </Button>
      }>
      {loading ? (
        <Spin size="large" tip="Выполнение..." />
      ) : (
        <Row align="stretch" gutter={[24, 32]}>
          {renderCards()}
        </Row>
      )}
    </Card>
  );
};

export default Harting;
