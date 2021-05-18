import React, { useEffect, useState } from 'react';
import { Switch, Route, useHistory, useRouteMatch, useLocation } from 'react-router-dom';

import { Descriptions, Spin, Tabs, Menu } from 'antd';
import { getQueryBody } from '../../util/getQueryBody';

import styles from './SubMenuContent.module.scss';
import { getItemsFromJson } from '../../util/getItemsFromJson';
import ServiceContent from './ServiceContent/ServiceContent';
import { getQuery } from '../../util/getQuery';
import Loader from '../Loader/Loader';

function SubMenuContent() {
  const [subMenuInfo, setSubMenuInfo] = useState({});
  const [serviceInfo, setServiceInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { path, url } = useRouteMatch();
  const { pathname } = useLocation();
  const history = useHistory();
  const subMenuKeys = subMenuInfo && Object.keys(subMenuInfo);
  const [selectedSubMenuItem, setSelectedSubMenuItem] = useState([]);

  const getInfo = async () => {
    setIsLoading(true);
    if (getQueryBody(pathname).split('&').length === 2) {
      setSubMenuInfo(await getQuery(pathname));
    }
    if (getQueryBody(pathname).split('&').length === 3) {
      setServiceInfo(await getQuery(pathname));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getInfo();
  }, [pathname]);

  const renderSubMenuInfo = () => {
    return subMenuKeys
      .filter((item) => item !== 'serviceList' && item !== 'deviceList')
      .map((item) => (
        <Descriptions.Item key={item} label={item}>
          {subMenuInfo[item]}
        </Descriptions.Item>
      ));
  };

  console.log(subMenuInfo);

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.serviceList}>
        <Menu
          mode="inline"
          style={{ width: '100%' }}
          theme="light"
          selectedKeys={selectedSubMenuItem}
          onSelect={(item) => setSelectedSubMenuItem(item.selectedKeys)}>
          {subMenuInfo.serviceList &&
            getItemsFromJson(subMenuInfo.serviceList.service).map((item) => {
              return (
                <Menu.Item
                  key={item.serviceID}
                  onClick={() => {
                    getInfo();
                    history.push(`${url}/${item.serviceID}`);
                  }}>
                  {item.serviceType.toUpperCase()}
                </Menu.Item>
              );
            })}
        </Menu>
      </div>
      <div className={styles.serviceContent}>
        <Switch>
          <Route exact path={path}>
            {isLoading ? (
              <Loader></Loader>
            ) : (
              <Descriptions bordered column={1} size="small" title={subMenuInfo.friendlyName}>
                {renderSubMenuInfo()}
              </Descriptions>
            )}
          </Route>
          <Route path="/climat/:climatId/:sid">
            <ServiceContent serviceInfo={serviceInfo} isLoading={isLoading}></ServiceContent>
          </Route>
          <Route path="/devs/:devsId/:sid">
            <ServiceContent serviceInfo={serviceInfo} isLoading={isLoading}></ServiceContent>
          </Route>
          <Route path="/car/:carId/:sid">
            <ServiceContent serviceInfo={serviceInfo} isLoading={isLoading}></ServiceContent>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default SubMenuContent;
