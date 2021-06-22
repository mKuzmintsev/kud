import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import parser from 'fast-xml-parser';
import { getItemsFromJson } from '../../utils';
import { onChooseDev, onChoosePage, setErrorPage } from '../../redux/slices/view/slice';
import { viewSelector } from '../../redux/slices/view/selectors';
import { testsSelector } from '../../redux/slices/tests/selectors';
import { Pages } from '../../common/enums';
import { useInterval } from '../../hooks/useInterval';
import { GET_SERVICES_INTERVAL } from '../../common/constants';
import { getTests, getTest } from 'src/redux/slices/tests/slice';
import { kudTransport } from 'src/transport/index.ts';

import styles from './Menu.module.scss';

const { SubMenu } = Menu;

export const MainMenu: React.FC = () => {
  const { page, isAlive } = useSelector(viewSelector);
  const { testCategories, kuev } = useSelector(testsSelector);
  const dispatch = useDispatch();

  const initialMenuItems = {
    car: [],
    climat: [],
    devs: [],
    tests: [],
  };
  const [menuItems, setMenuItems] = useState<any>(initialMenuItems);

  useEffect(() => {
    const testsItems = testCategories.map((category) => (
      <Menu.Item
        key={category.fname}
        onClick={() => {
          dispatch(getTest(category.fname));
        }}>
        {category.title}
      </Menu.Item>
    ));
    setMenuItems({ ...menuItems, tests: testsItems });
  }, [testCategories]);

  const getSubMenuItems = async (menuKey: string) => {
    try {
      const res = await kudTransport.getDevs(menuKey);

      const data = parser.parse(res.data, { parseTrueNumberOnly: true }).root.device;

      const renderItems = getItemsFromJson(data).map(({ UUID, friendlyName }: any) => {
        return <Menu.Item key={UUID}>{friendlyName}</Menu.Item>;
      });

      return renderItems;
    } catch (error) {
      dispatch(setErrorPage(error));
    }
  };

  const getSubMenus: any = async () => {
    const carSubMenuItems = await getSubMenuItems('car');
    const devsSubMenuItems = await getSubMenuItems('devs');
    const climatSubMenuItems = await getSubMenuItems('climat');
    dispatch(getTests());

    setMenuItems({
      climat: climatSubMenuItems,
      car: carSubMenuItems,
      devs: devsSubMenuItems,
    });
  };

  useInterval(getSubMenus, isAlive ? GET_SERVICES_INTERVAL : null, true);

  return (
    <Menu
      mode="inline"
      theme="light"
      inlineIndent={16}
      defaultSelectedKeys={[page]}
      onClick={({ keyPath }) => {
        if (keyPath.length === 1) {
          dispatch(onChoosePage({ page: keyPath[0] as string }));
        }
        if (keyPath.length === 2) {
          dispatch(onChooseDev({ page: keyPath[1] as string, devName: keyPath[0] as string }));
        }
      }}
      style={{ fontSize: 16 }}>
      <SubMenu key={Pages.CAR} title="ВАГОН">
        {menuItems.car}
      </SubMenu>
      <SubMenu key={Pages.CLIMAT} title="КЛИМАТ">
        {menuItems.climat}
      </SubMenu>
      <SubMenu key={Pages.DEVS} title="ОБОРУДОВАНИЕ">
        {menuItems.devs}
      </SubMenu>

      <Menu.Item key={Pages.ERRORS}>СВЕДЕНИЯ О НЕИСПРАВНОСТЯХ</Menu.Item>

      <Menu.Item key={Pages.HARTING}>КОММУТАТОРЫ</Menu.Item>
      <SubMenu
        disabled={!kuev}
        key={Pages.TESTS}
        title={
          kuev ? (
            'ТЕСТЫ'
          ) : (
            <>
              ТЕСТЫ <span className={styles.subtitle}>КУЭВ не обнаружен</span>
            </>
          )
        }
        onTitleClick={() => {
          dispatch(onChoosePage({ page: Pages.TESTS }));
        }}>
        {menuItems.tests}
      </SubMenu>
    </Menu>
  );
};

export default MainMenu;
