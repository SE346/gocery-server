import { Request, Response, NextFunction } from 'express';
import { Product, Comment, Order, OrderDetail, Address } from '../models';
import createError from 'http-errors';
import { ResJSON } from '../utils/interface';
import { IPayload } from '../utils/jwt_service';
import { isUuid } from '../utils/validate';

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
