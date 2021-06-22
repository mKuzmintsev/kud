import parser from 'fast-xml-parser';
import { getItemsFromJson } from './getItemsFromJson';

const options = {
  allowBooleanAttributes: true,
  parseNodeValue: true,
  parseAttributeValue: true,
  trimValues: true,
  parseTrueNumberOnly: false,
  arrayMode: false, //"strict"
  stopNodes: ['parse-me-as-string'],
};

export const testJson = () => {
  const xml2 =
    '<scpd urn="CONFIG_502df4177b68:1"><serviceStateTable><stateVariable><name>SOCKETS_LIST</name><friendlyName>сокеты ядер</friendlyName><dataType>list</dataType><list><stateVariable><name>SOCKET_NAME</name><friendlyName>сокет ядра</friendlyName><dataType>string</dataType></stateVariable></list><value hidden="YES"><list><SOCKET_NAME><value>/tmp/kernel-devs/berkly_kernel.s</value></SOCKET_NAME><SOCKET_NAME><value>/tmp/kernel-climat/berkly_kernel.s</value></SOCKET_NAME><SOCKET_NAME><value>/tmp/kernel-car/berkly_kernel.s</value></SOCKET_NAME></list></value></stateVariable></serviceStateTable></scpd>';

  const errorFixture =
    '<scpd urn="fgbdfghfh"><fault><code>301</code><detail>serfdrjty</detail></fault></scpd>';

  console.log(parser.parse(errorFixture));
};

const getChildParams = (item, childValue, childChildren = null) => {
  const name = item.name;
  const friendlyName = item.friendlyName;
  const key = item.name + Math.random();
  const value = childValue && childValue.value;
  const children = childChildren;

  return { name, friendlyName, key, value, children };
};

const getChildrenItems = (item, val) => {
  if (item.dataType === 'list') {
    const child = item[item.dataType].stateVariable;

    return val.list
      ? val.list[child.name].map((childValue) => {
          if (child.dataType === 'list' || child.dataType === 'struct') {
            const children = getChildrenItems(child, childValue);
            return getChildParams(child, null, children);
          }

          return getChildrenItems(child, childValue);
        })
      : null;
  }

  if (item.dataType === 'struct') {
    const childs = item[item.dataType].stateVariable;

    return childs.map((child) => {
      return getChildrenItems(child, val.struct[child.name]);
    });
  }

  return getChildParams(item, val);
};

export const getObjectFromXml = (xml) => {
  const data = getItemsFromJson(xml);
  return data.map((item) => {
    const name = item.name;
    const friendlyName = item.friendlyName;
    let value = item.value;
    const key = item.name;
    let children = null;

    if ((item.dataType === 'struct' || item.dataType === 'list') && item.value) {
      children = getChildrenItems(item, item.value);
      value = null;
    }

    return { name, friendlyName, value, key, children };
  });
};
