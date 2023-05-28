import { Request, Response, NextFunction } from 'express';
import { Product, Comment, Order, OrderDetail, Address } from '../models';
import createError from 'http-errors';
import { ResJSON } from '../utils/interface';
import { IPayload } from '../utils/jwt_service';
import { isUuid, isOrderStatus } from '../utils/validate';
import { OrderStatus } from '../utils/type';
import { removeKeys } from '../utils/remove_key';

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
      where: {
        id: orderId,
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
