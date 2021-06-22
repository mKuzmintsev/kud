import parser from 'fast-xml-parser';
import { getItemsFromJson } from '.';

export const getServicesArray = async (menuKey: string) => {
  const body = `kernel=${menuKey}`;
  const res = await fetch('/cgi-bin/spo_ucsp.cgi', {
    method: 'POST',
    body: body,
  });
  const xml = await res.text();

  const data = xml && parser.parse(xml).root.device;

  const renderItems = getItemsFromJson(data);

  return renderItems;
};
