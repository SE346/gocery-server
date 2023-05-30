export const isUuid = (uuid: string): Boolean => {
  const isUuidValid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);

  return isUuidValid;
};

export const isOrderStatus = (status: string): Boolean => {
  const orderStatusList: string[] = ['In Progress', 'Cancelled', 'Finished'];

  return orderStatusList.includes(status);
};

export const isPaymentMethod = (method: string): Boolean => {
  const paymentMethodList: string[] = ['Momo', 'Zalopay', 'Credit'];

  return paymentMethodList.includes(method);
};
