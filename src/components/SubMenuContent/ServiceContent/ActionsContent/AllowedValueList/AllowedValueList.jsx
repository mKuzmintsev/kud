import React from 'react';
import { Form, Select } from 'antd';

function AllowedValueList({ optionList, label, namePath, serviceName }: any) {
  return (
    <Form.Item name={namePath} label={label} style={{ marginBottom: 5 }}>
      <Select placeholder="" allowClear size="small" style={{ minWidth: 150 }}>
        {optionList.map((option) => (
          <Select.Option key={`${label}-${option.value}`} value={option.value}>
            {option.describe || option.value}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
}

export default AllowedValueList;
