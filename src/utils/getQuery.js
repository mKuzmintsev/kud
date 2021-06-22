import parser from 'fast-xml-parser';
import { hasError, showNotification, getQueryBody } from './';

export const getQuery = async (url) => {
  const body = getQueryBody(url);
  const params = {
    method: 'POST',
    body,
  };

  try {
    const res = await fetch('/cgi-bin/spo_ucsp.cgi', params);
    const xml = await res.text();
    const data = xml && parser.parse(xml);

    hasError(data);

    if (data.scpd) {
      return data.scpd;
    }

    if (data.root && data.root.device) {
      return data.root.device;
    }
  } catch (err) {
    showNotification({ type: 'error', message: 'Ошибка сети' });
  }
};
