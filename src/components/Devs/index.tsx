import React, { useEffect } from 'react';
import { Collapse, Descriptions, Spin } from 'antd';
import { useState } from 'react';
import { getItemsFromJson } from '../../utils/getItemsFromJson';
import { getQuery } from '../../utils';
import ServiceContent from '../SubMenuContent/ServiceContent';
import { viewSelector } from '../../redux/slices/view/selectors';
import { useSelector } from 'react-redux';
const { Panel } = Collapse;

export const Devs: React.FC = () => {
  const [devInfo, setDevInfo] = useState<any>([]);
  const [serviceInfo, setServiceInfo] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePanel, setActivePanel] = useState('devInfo');
  const { devName, page } = useSelector(viewSelector);

  const getDevInfo = async () => {
    setIsLoading(true);
    setDevInfo(await getQuery(`/${page.toLowerCase()}/${devName}`));
    setIsLoading(false);
  };

  const getServiceInfo = async (serviceUuid: any) => {
    if (!serviceUuid || serviceUuid === 'devInfo') {
      setActivePanel('devInfo');
    } else {
      setActivePanel(serviceUuid);
      setIsLoading(true);
      setServiceInfo(await getQuery(`/${page.toLowerCase()}/${devName}/${serviceUuid}`));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDevInfo();
  }, [devName, page]);

  const getServices = () => {
    return (
      devInfo.serviceList &&
      getItemsFromJson(devInfo.serviceList.service).map((item: any) => {
        return (
          <Panel header={item.serviceType.toUpperCase()} key={item.serviceID}>
            <ServiceContent serviceInfo={serviceInfo} isLoading={isLoading} />
          </Panel>
        );
      })
    );
  };

  const renderDevInfo = () => {
    return Object.keys(devInfo)
      .filter((item: any) => item !== 'serviceList' && item !== 'deviceList')
      .map((item: any) => (
        <Descriptions.Item key={item} label={item}>
          {devInfo[item]}
        </Descriptions.Item>
      ));
  };

  if (!devName) {
    return null;
  }

  return (
    <Spin spinning={isLoading} size="large">
      <Collapse accordion activeKey={activePanel} onChange={getServiceInfo}>
        <Panel header={devInfo.friendlyName} key="devInfo" showArrow={false}>
          <Descriptions bordered column={1} size="small">
            {renderDevInfo()}
          </Descriptions>
        </Panel>
        {getServices()}
      </Collapse>
    </Spin>
  );
};
