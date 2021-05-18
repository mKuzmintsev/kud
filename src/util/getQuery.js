import { getQueryBody } from './getQueryBody';
import parser from 'fast-xml-parser';

export const getQuery = async (url) => {
  const body = getQueryBody(url);
  const params = {
    method: 'POST',
    body,
  };
  const res = await fetch('/cgi-bin/spo_ucsp.cgi', params);
  const xml = await res.text();
  const data = xml && parser.parse(xml);

  if (data.scpd) {
    return data.scpd;
  }

  if (data.root && data.root.device) {
    console.log(data.root.device);
    return data.root.device;
  }
};
