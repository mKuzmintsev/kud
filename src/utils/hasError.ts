import { showNotification } from './showNotification';

export const hasError = (data: any) => {
  if (data.scpd && data.scpd.fault) {
    showNotification({
      type: 'warning',
      message: `Код ошибки ${data.scpd.fault.code}`,
      description: data.scpd.fault.detail,
    });
    return;
  }
};
