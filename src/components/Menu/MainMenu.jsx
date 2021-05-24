import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { useHistory } from 'react-router-dom';

import parser from 'fast-xml-parser';
import { getItemsFromJson } from '../../util/getItemsFromJson';
import { getObjectFromXml } from '../../util/getObjectFromXml';

const { SubMenu } = Menu;

const MainMenu = () => {
  const initialMenuItems = {
    car: [],
    climat: [],
    devs: [],
    errors: [],
    harting: [],
    extra: [],
  };

  const [menuItems, setMenuItems] = useState(initialMenuItems);

  const menuItemsKeys = Object.keys(menuItems);

  const getSubMenuItems = async (menuKey) => {
    const body = `kernel=${menuKey}`;
    const res = await fetch('/cgi-bin/spo_ucsp.cgi', {
      method: 'POST',
      body: body,
    });
    const xml = await res.text();

    const data = xml && parser.parse(xml).root.device;
    console.log(data);
    let renderItems = [];

    renderItems = getItemsFromJson(data).map(({ UUID, friendlyName }) => (
      <Menu.Item key={UUID} onClick={() => history.push(`/${menuKey}/${UUID}`)}>
        {friendlyName.toUpperCase()}
      </Menu.Item>
    ));

    return renderItems;
  };

  useEffect(() => {
    const getSubMenus = async () => {
      let carSubMenuItems = await getSubMenuItems('car');
      let devsSubMenuItems = await getSubMenuItems('devs');
      let climatSubMenuItems = await getSubMenuItems('climat');
      setMenuItems({
        ...menuItems,
        climat: climatSubMenuItems,
        car: carSubMenuItems,
        devs: devsSubMenuItems,
      });
    };
    getSubMenus();
  }, []);
  // const [openedItem, setOpenedItem] = useState([]);
  const history = useHistory();

  // const onOpenChange = (openKeys) => {
  //   const latestOpenKey = openKeys.find((key) => openedItem.indexOf(key) === -1);

  //   if (menuItemsKeys.indexOf(latestOpenKey) === -1) {
  //     setOpenedItem(openKeys);
  //     console.log(openKeys);
  //   } else {
  //     setOpenedItem(latestOpenKey ? [latestOpenKey] : []);
  //   }
  // };

  return (
    <Menu
      mode="inline"
      // openKeys={openedItem}
      // onOpenChange={onOpenChange}
      theme="dark"
      inlineIndent={10}
      style={{ height: '100%', fontSize: 16 }}>
      <SubMenu key="car" title="Вагон">
        {menuItems.car}
      </SubMenu>
      <SubMenu key="climat" title="Климат">
        {menuItems.climat}
      </SubMenu>
      <SubMenu key="devs" title="Оборудование">
        {menuItems.devs}
      </SubMenu>

      <Menu.Item id="errorsItem" key="errors" onClick={() => history.push('/errors')}>
        Сведения о неиправностях
      </Menu.Item>

      <Menu.Item key="harting" onClick={() => history.push('/harting')}>
        Коммутаторы
      </Menu.Item>
      <Menu.Item key="extra">Дополнительно</Menu.Item>
    </Menu>
  );
};

export default MainMenu;
