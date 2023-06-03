import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Coupon, CouponItem, Order } from '../models';
import { ResJSON } from '../utils/interface';
import { sequelize } from '../config/sequelize';

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

    const coupon = await Coupon.findOne({
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

export const removeSingleCouponByIdController = async (
  req: Request<{ couponId: string }>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  const t = await sequelize.transaction();

  try {
    // Get id & convert to number
    const { couponId: unconvertCouponId } = req.params;
    const couponId: number = +unconvertCouponId;

    const coupon = await Coupon.findOne({
      where: {
        id: couponId,
      },
      transaction: t,
    });

    if (!coupon) {
      throw createError.BadRequest('Coupon with id not exist');
    }

    const orderWithCoupon = await Order.findAll({
      where: {
        couponItemId: couponId,
      },
      transaction: t,
    });

    if (orderWithCoupon.length >= 1) {
      throw createError.Conflict('Unable to delete this coupon');
    }

    // Delete coupon
    await CouponItem.destroy({
      where: {
        couponId,
      },
      transaction: t,
    });

    await Coupon.destroy({
      where: {
        id: couponId,
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
