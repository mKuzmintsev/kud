import React, { useState } from 'react';
import { getArrayFromList } from '../../../../utils';
import { Button } from 'antd';
import { Collapse, Space, Input, Form } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import AllowedValueRange from './AllowedValueRange/AllowedValueRange';
import AllowedValueList from './AllowedValueList/AllowedValueList';
import { useLocation } from 'react-router-dom';
import Loader from '../../../Loader/Loader';
import { getQueryBody } from '../../../../utils';

type ActionsContentProps = {
  serviceInfo: any;
};

export const ActionsContent: React.FC<ActionsContentProps> = ({ serviceInfo }) => {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: any, actionName: any) => {
    setIsLoading(true);
    let body = getQueryBody(pathname);
    body += `$action=${actionName}`;

    const getParamsStringFromValues = (values: any) => {
      const params = '';
    };

    console.log(Object.entries(values));
    setIsLoading(false);
  };

  const renderActions = () => {
    if (!serviceInfo.actionList) {
      return <>Этот сервис не имеет действий</>;
    }
    const actions = getArrayFromList(serviceInfo.actionList.action);

    return <>{actions.map((action) => renderAction(action))}</>;
  };

  const renderAction = (action: any) => {
    console.log(action);

    if (!action.argumentList) {
      return (
        <Collapse key={uuidv4()}>
          <Collapse.Panel header={action.name} key={action.name}>
            <Button type="primary">Выполнить</Button>
          </Collapse.Panel>
        </Collapse>
      );
    } else {
      const actionArguments = getArrayFromList(action.argumentList.argument);

      return (
        <Collapse key={uuidv4()}>
          <Collapse.Panel header={action.name} key={action.name}>
            {isLoading ? (
              <Loader></Loader>
            ) : (
              <Form
                autoComplete="off"
                name={action.name}
                onFinish={(values) => onFinish(values, action.name)}
                size="small">
                {actionArguments.map((actionArgument) =>
                  renderActionArgument(findService(actionArgument.name))
                )}
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Выполнить
                  </Button>
                </Form.Item>
              </Form>
            )}
          </Collapse.Panel>
        </Collapse>
      );
    }
  };

  const findService = (serviceName: any) => {
    let service: any = null;
    const serviceList = getArrayFromList(serviceInfo.serviceStateTable.stateVariable);

    const find = (serviceList: any) => {
      if (service) return;
      for (let i = 0; i < serviceList.length; i++) {
        if (service) break;
        const currentService = serviceList[i];
        if (currentService.name !== serviceName) {
          if (currentService.struct || currentService.list) {
            find(getArrayFromList(currentService[currentService.dataType].stateVariable));
          }
        } else if (currentService.name === serviceName) {
          service = currentService;
          break;
        }
      }
    };

    find(serviceList);

    return service;
  };

  const renderActionArgument = (serviceData: any, namePath: any = []) => {
    const name: any = [...namePath, serviceData.name];

    if (serviceData && serviceData.dataType === 'list') {
      const children = serviceData.list.stateVariable;

      const formList = (
        <Form.List name={name}>
          {(fields, { add, remove }) => {
            return (
              <div className="">
                <Form.Item style={{ marginBottom: 10 }}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add();
                    }}>
                    <PlusOutlined /> Добавить
                  </Button>
                </Form.Item>
                {fields.map((field) => {
                  return (
                    <Space
                      key={field.key}
                      style={{
                        display: 'flex',
                        marginBottom: 8,
                        marginLeft: 20,
                        padding: '0 20px',
                      }}
                      align="start">
                      {renderActionArgument(children, [field.name])}

                      <MinusCircleOutlined
                        style={{ fontSize: 20 }}
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    </Space>
                  );
                })}
              </div>
            );
          }}
        </Form.List>
      );

      return (
        <div className="" key={name}>
          <h3>{`${serviceData.friendlyName} (${serviceData.name})`}</h3>
          {formList}
        </div>
      );
    } else if (serviceData && serviceData.dataType === 'struct') {
      const structChildren = getArrayFromList(serviceData.struct.stateVariable);

      return (
        <Form.Item
          key={uuidv4()}
          style={{ marginBottom: 5 }}
          label={`${serviceData.friendlyName} (${serviceData.name})`}
          labelCol={{ span: 24 }}>
          <div style={{ marginLeft: 15, padding: '0 15px' }}>
            {structChildren.map((item) => renderActionArgument(item, name))}
          </div>
        </Form.Item>
      );
    } else {
      return renderPrimitiveTypeService(serviceData, name);
    }
  };

  const renderPrimitiveTypeService = (serviceData: any, namePath: any = []) => {
    if (serviceData && serviceData.allowedValueRange) {
      const { minimum, maximum, step, min, max } = serviceData.allowedValueRange;

      return (
        <AllowedValueRange
          key={uuidv4()}
          min={minimum || min}
          max={maximum || max}
          step={step}
          label={serviceData.friendlyName}
          namePath={namePath}
          serviceName={serviceData.name}></AllowedValueRange>
      );
    }

    if (serviceData && serviceData.allowedValueList) {
      const optionList = getArrayFromList(serviceData.allowedValueList.allowedValue);

      return (
        <AllowedValueList
          key={uuidv4()}
          namePath={namePath}
          optionList={optionList}
          serviceName={serviceData.name}
          label={serviceData.friendlyName}></AllowedValueList>
      );
    }

    return (
      <Form.Item
        key={uuidv4()}
        style={{ marginBottom: 5 }}
        name={namePath}
        label={`${serviceData.friendlyName} (${serviceData.name})`}>
        <Input style={{ minWidth: 150 }} size="small" />
      </Form.Item>
    );
  };

  // const renderChildrenService = (data, type) => {
  //   if (type === 'struct') {
  //     const paramsList = getArrayFromList(data[type].stateVariable);
  //     node.children = paramsList.map((item) => renderChildrenService(item, item.dataType));

  //     // return paramsList.map((item) => renderChildrenService(item, item.dataType));
  //   }

  //   if (type === 'list') {
  //     const paramValue = data[type].stateVariable;
  //   } else {
  //     node.title = renderPrimitiveTypeService(data);
  //   }

  //   return node;
  // };

  const onSelect = (selectedKeys: any, info: any) => {
    console.log('selected', selectedKeys, info);
  };

  return renderActions();
};

export default ActionsContent;
