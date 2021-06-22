import { notification } from 'antd';
import { ArgsProps } from 'antd/lib/notification';

notification.config({
  placement: 'topRight',
  top: 100,
  duration: 0,
});

export const showNotification = ({
  type,
  message,
  description = '',
  duration,
}: ArgsProps): void => {
  notification.open({ type, message, description, duration });
};
