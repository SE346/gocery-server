import { Request, Response, NextFunction } from 'express';
import { Product, Order, OrderDetail, Address, Cart } from '../models';
import createError from 'http-errors';
import { ResJSON } from '../utils/interface';
import { IPayload } from '../utils/jwt_service';
import { isUuid, isOrderStatus, isPaymentMethod } from '../utils/validate';
import { OrderStatus, PaymentType } from '../utils/type';
import { removeKeys } from '../utils/remove_key';
import { sequelize } from '../config/sequelize';
import { productOrderDetailListSchema } from '../utils/schema';
import {
  calculatePriceOnOrder,
  calculatePriceOnOrderCart,
  checkCartQuantity,
  checkQuantity,
  formattedOrderDetail,
  orderDetailMappingFromCart,
  recalculateQuantityInventory,
  recalculateQuantityInventoryCart,
} from '../services/orderService.service';
import { v4 as uuid } from 'uuid';

export const getAllOrderController = async (
  req: Request,
  res: Response<ResJSON, { payload: IPayload }>,
  next: NextFunction
) => {
  try {
    const orderList = await Order.findAll({
      attributes: {
        exclude: ['addressId', 'userMail', 'createdAt', 'updatedAt'],
      },
      include: [
        {
          model: OrderDetail,
          attributes: ['quantity', 'price'],
          include: [
            {
              model: Product,
              attributes: {
                exclude: ['categoryId', 'quantity', 'createdAt', 'updatedAt'],
              },
            },
          ],
        },
        {
          model: Address,
          attributes: {
            exclude: ['userMail', 'active', 'createdAt', 'updatedAt'],
          },
        },
      ],
    });

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: orderList,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllOrderBelongToUserController = async (
  req: Request,
  res: Response<ResJSON, { payload: IPayload }>,
  next: NextFunction
) => {
  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const orderList = await Order.findAll({
      where: {
        userMail,
      },
      attributes: {
        exclude: ['addressId', 'userMail', 'createdAt', 'updatedAt'],
      },
      include: [
        {
          model: OrderDetail,
          attributes: ['quantity', 'price'],
          include: [
            {
              model: Product,
              attributes: {
                exclude: ['categoryId', 'quantity', 'createdAt', 'updatedAt'],
              },
            },
          ],
        },
        {
          model: Address,
          attributes: {
            exclude: ['userMail', 'active', 'createdAt', 'updatedAt'],
          },
        },
      ],
    });

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: orderList,
    });
  } catch (err) {
    next(err);
  }
};

export const inventoryCheckController = async (
  req: Request<
    {},
    {},
    {
      addressId: string;
      phoneNum: string;
      paymentMethod: PaymentType;
      productList: OrderDetail[];
    }
  >,
  res: Response<ResJSON, { payload: IPayload }>,
  next: NextFunction
) => {
  try {
    const { productList } = req.body;

    // TODO: Validate product list
    await productOrderDetailListSchema.validateAsync(productList);

    const productListExist = await Product.findAll({
      where: {
        id: productList.map((item) => item.id),
      },
      attributes: ['id', 'quantity'],
      raw: true,
    });
    if (productListExist.length < productList.length) {
      throw createError.Conflict('Does not exist an productId in productList body');
    }

    const isAvailable = checkQuantity(productList, productListExist);

    res.status(200).json({
      statusCode: 200,
      message: isAvailable ? 'Product available' : 'Product not available',
      data: productListExist,
    });
  } catch (err) {
    next(err);
  }
};

export const createOrderWithoutCartController = async (
  req: Request<
    {},
    {},
    {
      addressId: string;
      phoneNum: string;
      deliveryDate: Date;
      paymentMethod: PaymentType;
      productList: OrderDetail[];
    }
  >,
  res: Response<ResJSON, { payload: IPayload }>,
  next: NextFunction
) => {
  const t = await sequelize.transaction();

  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const { addressId, phoneNum, deliveryDate, paymentMethod, productList } = req.body;

    if (!addressId || !phoneNum || !deliveryDate || !paymentMethod || !productList) {
      throw createError.BadRequest('Missing params');
    }

    const isPaymentMethodValid = isPaymentMethod(paymentMethod);
    if (!isPaymentMethodValid) {
      throw createError.BadRequest(
        'paymentMethod in body only take 3 values: Momo, Zalopay, Credit'
      );
    }

    const address = await Address.findOne({
      where: {
        id: addressId,
        userMail,
      },
      transaction: t,
    });
    if (!address) {
      throw createError.Conflict('addressId invalid');
    }

    // TODO: Validate product list
    await productOrderDetailListSchema.validateAsync(productList);

    const productListExist = await Product.findAll({
      where: {
        id: productList.map((item) => item.id),
      },
      raw: true,
      transaction: t,
    });
    if (productListExist.length < productList.length) {
      throw createError.Conflict('Does not exist an productId in productList body');
    }

    const isAvailable = checkQuantity(productList, productListExist);
    if (!isAvailable) {
      throw createError.Conflict('Required product quantity greater than available product');
    }

    const totalPrice = calculatePriceOnOrder(productList, productListExist) + 2;

    const createdOrder = await Order.create(
      {
        id: uuid(),
        userMail,
        addressId,
        status: 'In Progress',
        total: totalPrice,
        orderDate: new Date(),
        deliveryDate,
        phoneNum,
        paymentMethod,
        shippingFee: 2,
      },
      {
        transaction: t,
      }
    );

    const orderDetailList = formattedOrderDetail(createdOrder.id, productList, productListExist);

    const createdOrderDetailList = await OrderDetail.bulkCreate(orderDetailList, {
      transaction: t,
    });

    // Update inventory
    for (const productItem of productListExist) {
      const lastQuantity = recalculateQuantityInventory(productItem, productList);
      await Product.update(
        {
          quantity: lastQuantity,
        },
        {
          where: {
            id: productItem.id,
          },
          transaction: t,
        }
      );
    }

    await t.commit();

    res.status(201).json({
      statusCode: 201,
      message: 'Success',
      data: createdOrder,
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

export const createOrderWithCartController = async (
  req: Request<
    {},
    {},
    {
      addressId: string;
      phoneNum: string;
      deliveryDate: Date;
      paymentMethod: PaymentType;
    }
  >,
  res: Response<ResJSON, { payload: IPayload }>,
  next: NextFunction
) => {
  const t = await sequelize.transaction();

  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const { addressId, phoneNum, deliveryDate, paymentMethod } = req.body;

    if (!addressId || !phoneNum || !deliveryDate || !paymentMethod) {
      throw createError.BadRequest('Missing params');
    }

    const isPaymentMethodValid = isPaymentMethod(paymentMethod);
    if (!isPaymentMethodValid) {
      throw createError.BadRequest(
        'paymentMethod in body only take 3 values: Momo, Zalopay, Credit'
      );
    }

    const address = await Address.findOne({
      where: {
        id: addressId,
        userMail,
      },
      transaction: t,
    });
    if (!address) {
      throw createError.Conflict('addressId invalid');
    }

    const cart = await Cart.findAll({
      where: {
        userMail,
      },
      raw: true,
    });

    if (cart.length === 0) {
      throw createError.Conflict('Cart empty');
    }

    const productListExist = await Product.findAll({
      where: {
        id: cart.map((cartItem) => cartItem.productId),
      },
      raw: true,
      transaction: t,
    });
    if (productListExist.length < cart.length) {
      throw createError.InternalServerError('Product with id not exist in inventory');
    }

    const isAvailable = checkCartQuantity(cart, productListExist);
    if (!isAvailable) {
      throw createError.Conflict('Product quantity in cart greater than available product');
    }

    const totalPrice = calculatePriceOnOrderCart(cart, productListExist) + 2;

    const createdOrder = await Order.create(
      {
        id: uuid(),
        userMail,
        addressId,
        status: 'In Progress',
        total: totalPrice,
        orderDate: new Date(),
        deliveryDate,
        phoneNum,
        paymentMethod,
        shippingFee: 2,
      },
      {
        transaction: t,
      }
    );

    const orderDetailList = orderDetailMappingFromCart(createdOrder.id, cart, productListExist);

    const createdOrderDetailList = await OrderDetail.bulkCreate(orderDetailList, {
      transaction: t,
    });

    // Update inventory
    for (const productItem of productListExist) {
      const lastQuantity = recalculateQuantityInventoryCart(productItem, cart);
      await Product.update(
        {
          quantity: lastQuantity,
        },
        {
          where: {
            id: productItem.id,
          },
          transaction: t,
        }
      );
    }

    // Update cart
    await Cart.destroy({
      where: {
        userMail,
      },
    });

    await t.commit();

    res.status(201).json({
      statusCode: 201,
      message: 'Success',
      data: createdOrder,
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

export const getSingleOrderByIdController = async (
  req: Request<{ orderId: string }>,
  res: Response<ResJSON, { payload: IPayload }>,
  next: NextFunction
) => {
  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const { orderId } = req.params;

    const isOrderIdValid = isUuid(orderId);
    if (!isOrderIdValid) {
      throw createError.BadRequest('OrderId invalid');
    }

    const order = await Order.findOne({
      where:
        res.locals.payload.user.role === 'Shopper'
          ? {
              id: orderId,
              userMail,
            }
          : { id: orderId },
      attributes: {
        exclude: ['addressId', 'userMail', 'createdAt', 'updatedAt'],
      },
      include: [
        {
          model: OrderDetail,
          attributes: ['quantity', 'price'],
          include: [
            {
              model: Product,
              attributes: {
                exclude: ['categoryId', 'quantity', 'createdAt', 'updatedAt'],
              },
            },
          ],
        },
        {
          model: Address,
          attributes: {
            exclude: ['userMail', 'active', 'createdAt', 'updatedAt'],
          },
        },
      ],
    });

    if (!order) {
      throw createError.NotFound('Order with id not exists');
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

export const updateStatusOrderByIdController = async (
  req: Request<{ orderId: string }, {}, { newStatus: OrderStatus }>,
  res: Response<ResJSON, { payload: IPayload }>,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params;

    const isOrderIdValid = isUuid(orderId);
    if (!isOrderIdValid) {
      throw createError.BadRequest('OrderId invalid');
    }

    const { newStatus } = req.body;
    if (!newStatus) {
      throw createError.BadRequest('Missing params');
    }

    // Validate "newStatus"
    const isOrderStatusValid = isOrderStatus(newStatus);
    if (!isOrderStatusValid) {
      throw createError.BadRequest(
        'newStatus in body only take 3 values: In Progress, Cancelled, Finished'
      );
    }

    // Check order with id exist
    const order = await Order.findOne({
      where: {
        id: orderId,
      },
      raw: true,
    });

    if (!order) {
      throw createError.NotFound('Order with id not exists');
    }

    const [_, updatedOrder] = await Order.update(
      {
        status: newStatus,
      },
      {
        where: {
          id: orderId,
        },
        returning: true,
      }
    );

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: removeKeys(['userMail', 'updatedAt', 'createdAt'], updatedOrder[0].dataValues),
    });
  } catch (err) {
    next(err);
  }
};

export const deleteOrderByIdController = async (
  req: Request<{ orderId: string }>,
  res: Response<ResJSON, { payload: IPayload }>,
  next: NextFunction
) => {
  const t = await sequelize.transaction();

  try {
    const { orderId } = req.params;

    const isOrderIdValid = isUuid(orderId);
    if (!isOrderIdValid) {
      throw createError.BadRequest('OrderId invalid');
    }

    // Check order with id exist
    const order = await Order.findOne({
      where: {
        id: orderId,
      },
      raw: true,
      transaction: t,
    });

    if (!order) {
      throw createError.NotFound('Order with id not exists');
    }

    await OrderDetail.destroy({
      where: {
        orderId,
      },
      transaction: t,
    });

    await Order.destroy({
      where: {
        id: orderId,
      },
      transaction: t,
    });

    await t.commit();

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
    });
  } catch (err) {
    await t.rollback();

    next(err);
  }
};
