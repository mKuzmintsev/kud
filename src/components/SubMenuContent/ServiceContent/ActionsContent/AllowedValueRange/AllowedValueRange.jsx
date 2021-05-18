import React, { useState } from 'react';
import { Form, Slider, InputNumber } from 'antd';

function AllowedValueRange({ min, max, step, label, namePath, serviceName }) {
  const [value, setValue] = useState(10);

  const onChange = (value) => {
    setValue(value);
  };

  return (
    <Form.Item name={namePath} label={`${label} (${serviceName})`} style={{ marginBottom: 5 }}>
      {/* <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}> */}
      {/* <Slider
        min={min}
        max={max}
        marks={{ [min]: min, [max]: max }}
        step={step}
        onChange={onChange}
        value={value}
        style={{ minWidth: 100, flex: 1 }}
      /> */}
      <InputNumber
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        style={{ marginLeft: 16 }}
      />
      {/* </div> */}
    </Form.Item>
  );
}

export default AllowedValueRange;
