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

export const getSingleCouponByIdController = async (
  req: Request<{ couponId: string }>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    // Get id & convert to number
    const { couponId: unconvertCouponId } = req.params;
    const couponId: number = +unconvertCouponId;

    const coupon = Coupon.findOne({
      where: {
        id: couponId,
      },
      attributes: {
        exclude: ['updatedAt', 'createdAt'],
      },
      include: [
        {
          model: CouponItem,
          attributes: {
            exclude: ['updatedAt', 'createdAt'],
          },
        },
      ],
    });

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: coupon,
    });
  } catch (err) {
    next(err);
  }
};
