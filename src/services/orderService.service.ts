import { Cart, OrderDetail, Product } from '../models';

export const checkQuantity = (
  productListRequired: OrderDetail[],
  productListInventory: Product[]
): Boolean => {
  let valid = true;

  productListInventory.forEach((availableItem) => {
    const requiredQuantity = findQuantity(productListRequired, availableItem.id).quantity;
    if (availableItem.quantity < requiredQuantity) {
      valid = false;
      return;
    }
  });

  return valid;
};

const findQuantity = (orderDetailList: OrderDetail[], id: string) => {
  return orderDetailList.find((item) => item.id === id)!;
};

export const checkCartQuantity = (cartList: Cart[], productListInventory: Product[]): Boolean => {
  let valid = true;

  productListInventory.forEach((availableItem) => {
    const requiredQuantity = findCartQuantity(cartList, availableItem.id).quantity;
    if (availableItem.quantity < requiredQuantity) {
      valid = false;
      return;
    }
  });

  return valid;
};

const findCartQuantity = (cartList: Cart[], id: string) => {
  return cartList.find((item) => item.productId === id)!;
};

export const calculatePriceOnOrderNoVAT = (
  productListRequired: OrderDetail[],
  productList: Product[]
) => {
  const totalPriceBeforeVAT = productList.reduce((acc, curItem) => {
    return (
      acc +
      curItem.price *
        findQuantity(productListRequired, curItem.id).quantity *
        (100 - (curItem.discount || 0)) *
        0.01
    );
  }, 0);

  return totalPriceBeforeVAT;
};

export const calculatePriceOnOrder = (
  productListRequired: OrderDetail[],
  productList: Product[]
) => {
  const totalPriceBeforeVAT = productList.reduce((acc, curItem) => {
    return (
      acc +
      curItem.price *
        findQuantity(productListRequired, curItem.id).quantity *
        (100 - (curItem.discount || 0)) *
        0.01
    );
  }, 0);

  const totalPriceAfterVAT = Math.round(totalPriceBeforeVAT * 1.1 * 100) / 100;

  return totalPriceAfterVAT;
};

export const calculatePriceOnOrderCartNoVAT = (cartList: Cart[], productList: Product[]) => {
  const totalPriceBeforeVAT = productList.reduce((acc, curItem) => {
    return (
      acc +
      curItem.price *
        findCartQuantity(cartList, curItem.id).quantity *
        (100 - (curItem.discount || 0)) *
        0.01
    );
  }, 0);

  return totalPriceBeforeVAT;
};

export const calculatePriceOnOrderCart = (cartList: Cart[], productList: Product[]) => {
  const totalPriceBeforeVAT = productList.reduce((acc, curItem) => {
    return (
      acc +
      curItem.price *
        findCartQuantity(cartList, curItem.id).quantity *
        (100 - (curItem.discount || 0)) *
        0.01
    );
  }, 0);

  const totalPriceAfterVAT = Math.round(totalPriceBeforeVAT * 1.1 * 100) / 100;

  return totalPriceAfterVAT;
};

const findPrice = (productList: Product[], id: string) => {
  const productIdentify = productList.find((item) => item.id === id)!;

  const price = productIdentify.price * (100 - (productIdentify.discount || 0)) * 0.01;

  return price;
};

export const formattedOrderDetail = (
  orderId: string,
  productListRequired: OrderDetail[],
  productList: Product[]
): any[] => {
  productListRequired.forEach((item) => {
    item.productId = item.id;
    item.price = +(item.quantity * findPrice(productList, item.id) * 1.1).toFixed(3);
    item.orderId = orderId;

    delete item.id;
  });

  return productListRequired;
};

export const orderDetailMappingFromCart = (
  orderId: string,
  cartList: Cart[],
  productList: Product[]
): any[] => {
  const orderDetailList = cartList.map((item) => ({
    orderId,
    productId: item.productId,
    quantity: item.quantity,
    price: +(item.quantity * findPrice(productList, item.productId) * 1.1).toFixed(3),
  }));

  return orderDetailList;
};

const findQuantityInRequiredList = (productList: OrderDetail[], id: string): number => {
  return productList.find((item) => item.productId === id)!.quantity;
};

export const recalculateQuantityInventory = (
  product: Product,
  orderDetailList: OrderDetail[]
): number => {
  const quantity = findQuantityInRequiredList(orderDetailList, product.id);
  return product.quantity - quantity;
};

const findQuantityInRequiredListCart = (cartList: Cart[], id: string): number => {
  return cartList.find((item) => item.productId === id)!.quantity;
};

export const recalculateQuantityInventoryCart = (product: Product, cartList: Cart[]): number => {
  const quantity = findQuantityInRequiredListCart(cartList, product.id);
  return product.quantity - quantity;
};

export const formatOrderItem = (orderDetailList: OrderDetail[]) => {
  const orderDetailListFormat = orderDetailList.map((item: OrderDetail) => {
    return {
      ...item.dataValues,
      product: {
        ...item.dataValues.product.dataValues,
        thumbnail: item.dataValues.product.productImgList[0].imgUrl,
        productImgList: undefined,
      },
    };
  });

  return orderDetailListFormat;
};
