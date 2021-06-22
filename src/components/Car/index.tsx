import React from 'react';
import { Collapse } from 'antd';
import { useState } from 'react';
import { GET_SERVICES_INTERVAL } from '../../common/constants';
import { useInterval } from '../../hooks/useInterval';
import { getServicesArray } from '../../utils';
const { Panel } = Collapse;

export const Car: React.FC = () => {
  const [services, setServices] = useState<any>();

  const getServices = async () => {
    const services = await getServicesArray('car');
    setServices(services);
  };

  useInterval(getServices, GET_SERVICES_INTERVAL, true);

  return (
    <Collapse accordion defaultActiveKey={1} bordered={false}>
      <Panel header="Вагон" key="1"></Panel>
      {services
        ? services.map((service: any, key: any) => {
            const { UUID, friendlyName } = service;
            return <Panel header={friendlyName} key={UUID}></Panel>;
          })
        : null}
    </Collapse>
  );
};
