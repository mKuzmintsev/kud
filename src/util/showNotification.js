import { notification } from 'antd';

notification.config({
  placement: 'topRight',
  top: 100,
  duration: 0,
});

export const showNotification = (type, message) => {
  notification.open({ type, message });
};
