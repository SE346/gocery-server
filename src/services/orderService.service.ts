import { OrderDetail, Product } from '../models';

export const checkQuantity = (
  productListRequired: OrderDetail[],
  productListInventory: Product[]
): Boolean => {
  let valid = true;

  productListRequired.forEach((requiredItem) => {
    productListInventory.forEach((availableItem) => {
      if (requiredItem.quantity > availableItem.quantity) {
        valid = false;
        return;
      }
    });
  });

  return valid;
};

const findQuantity = (orderDetailList: OrderDetail[], id: string) => {
  return orderDetailList.find((item) => item.id === id)!;
};

export const calculatePriceOnOrder = (
  productListRequired: OrderDetail[],
  productList: Product[]
) => {
  const totalPriceBeforeVAT = productList.reduce((acc, curItem) => {
    return acc + curItem.price * findQuantity(productListRequired, curItem.id).quantity;
  }, 0);

  const totalPriceAfterVAT = Math.round(totalPriceBeforeVAT * 1.1 * 100) / 100;

  return totalPriceAfterVAT;
};

const findPrice = (productList: Product[], id: string) => {
  const productIdentify = productList.find((item) => item.id === id)!;

  return productIdentify.price;
};

export const formattedOrderDetail = (
  orderId: string,
  productListRequired: OrderDetail[],
  productList: Product[]
): any[] => {
  productListRequired.forEach((item) => {
    item.productId = item.id;
    item.price = item.quantity * findPrice(productList, item.id) * 1.1;
    item.orderId = orderId;

    delete item.id;
  });

  return productListRequired;
};
