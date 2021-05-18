import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import parser from 'fast-xml-parser';
import { Descriptions } from 'antd';

function Devs() {
  const [devsInfo, setDevsInfo] = useState({});
  const { devsId } = useParams();
  const devsKeys = Object.keys(devsInfo);
  useEffect(() => {
    const getDevs = async () => {
      const params = {
        method: 'POST',
        body: `kernel=devs&uuid=${devsId}`,
      };
      const res = await fetch('/cgi-bin/spo_ucsp.cgi', params);
      const xml = await res.text();

      const data = xml && parser.parse(xml).root.device;
      console.log(data);

      setDevsInfo(data);
    };

    getDevs();
  }, []);

  const renderDevsInfo = () => {
    return devsKeys
      .filter((item) => item !== 'serviceList')
      .map((item) => <Descriptions.Item label={item}>{devsInfo[item]}</Descriptions.Item>);
  };

  return (
    <Descriptions bordered column={1} size="small" title="Вагон">
      {renderDevsInfo()}
    </Descriptions>
  );
}

export default Devs;
