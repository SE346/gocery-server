import { Request, Response, NextFunction } from 'express';
import { Product, Comment, Order, OrderDetail } from '../models';
import createError from 'http-errors';
import { ResJSON } from '../utils/interface';
import { IPayload } from '../utils/jwt_service';

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
        exclude: ['userMail', 'createdAt', 'updatedAt'],
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
