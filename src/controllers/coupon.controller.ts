import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Coupon, CouponItem } from '../models';
import { ResJSON } from '../utils/interface';

export const getAllCouponController = async (
  req: Request,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    const couponList = await Coupon.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: CouponItem,
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
    });

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: couponList,
    });
  } catch (err) {
    next(err);
  }
};
