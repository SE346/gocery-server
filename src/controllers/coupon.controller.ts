import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Coupon, CouponItem, Order } from '../models';
import { ResJSON } from '../utils/interface';
import { sequelize } from '../config/sequelize';
import { assertCodeList, mutipleGenerate } from '../services/couponService.service';
import { removeKeys } from '../utils/remove_key';

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

type getSingleCouponByIdRequest = Request<{ couponId: string }>;

export const getSingleCouponByIdController = async (
  req: getSingleCouponByIdRequest,
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

type createCouponRequest = Request<
  unknown,
  unknown,
  Partial<{
    fromDate: Date;
    endDate: Date;
    couponType: CouponType;
    discount: number;
    pricePointAccept: number;
    quantity: number;
    description: string;
    thumbnail: string;
    codeList: string[];
  }>
>;

enum CouponType {
  DISCOUNT_PERCENT = 'DiscountPercent',
  DISCOUNT_VALUE = 'DiscountValue',
  FREESHIP = 'Freeship',
}

export const createCouponController = async (
  req: createCouponRequest,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  const t = await sequelize.transaction();

  try {
    const {
      fromDate,
      endDate,
      couponType,
      description,
      discount,
      pricePointAccept,
      quantity,
      thumbnail,
      codeList,
    } = req.body;

    if (
      !fromDate ||
      !endDate ||
      !couponType ||
      !description ||
      !pricePointAccept ||
      !quantity ||
      !thumbnail
    ) {
      throw createError.BadRequest('Missing params');
    }

    // Check coupon type
    if (!Object.values(CouponType).includes(couponType)) {
      throw createError.BadRequest(
        'CouponType only take 3 values: "DiscountPercent", "DiscountValue", "Freeship"'
      );
    }

    const generatedCodeList = [];
    if (req.body.codeList === undefined) {
      const codeGenerate = mutipleGenerate(quantity);
      generatedCodeList.push(...codeGenerate);
    } else {
      const isCodeValid = assertCodeList(codeList!);
      if (!isCodeValid) {
        throw createError.BadRequest('Code invalid');
      }
      generatedCodeList.push(...codeList!);
    }

    // Check code exists
    const codeValid = await CouponItem.findAll({
      where: {
        code: generatedCodeList,
      },
      raw: true,
    });
    if (codeValid.length > 0) {
      throw createError.BadRequest('Code in codelist exist');
    }

    const createdCoupon = await Coupon.create(
      {
        fromDate,
        endDate,
        couponType,
        discount,
        pricePointAccept,
        quantity,
        description,
        thumbnail,
      },
      {
        raw: true,
        transaction: t,
      }
    );

    const createdCouponItem = await CouponItem.bulkCreate(
      generatedCodeList.map((item) => ({
        couponId: createdCoupon.id,
        code: item,
        isActive: true,
      })),
      { transaction: t, returning: true }
    );

    await t.commit();

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: { ...createdCoupon.dataValues, couponItemList: createdCouponItem },
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

type GenerateCouponRequest = Request<unknown, unknown, Partial<{ quantity: number }>>;
export const generateCouponController = async (
  req: GenerateCouponRequest,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    const quantity = req.body.quantity;
    if (!quantity) {
      throw createError.BadRequest('Quantity field missing body');
    }
    if (quantity < 1) {
      throw createError.BadRequest('Quantity must greater than 0');
    }

    const generatedCodeList = mutipleGenerate(quantity);

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: generatedCodeList,
    });
  } catch (err) {
    next(err);
  }
};

type UpdateCouponRequest = Request<
  { couponId: string },
  unknown,
  Partial<{
    fromDate: Date;
    endDate: Date;
    couponType: CouponType;
    discount: number;
    pricePointAccept: number;
    description: string;
    thumbnail: string;
  }>
>;
export const updateCouponController = async (
  req: UpdateCouponRequest,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    // Get id & convert to number
    const { couponId: unconvertCouponId } = req.params;
    const couponId: number = +unconvertCouponId;

    const { fromDate, endDate, couponType, description, discount, pricePointAccept, thumbnail } =
      req.body;

    if (!fromDate || !endDate || !couponType || !description || !pricePointAccept || !thumbnail) {
      throw createError.BadRequest('Missing params');
    }

    // Check coupon type
    if (!Object.values(CouponType).includes(couponType)) {
      throw createError.BadRequest(
        'CouponType only take 3 values: "DiscountPercent", "DiscountValue", "Freeship"'
      );
    }

    const [_, updatedCoupon] = await Coupon.update(
      {
        fromDate,
        endDate,
        couponType,
        description,
        discount,
        pricePointAccept,
        thumbnail,
      },
      {
        where: {
          id: couponId,
        },
        returning: true,
      }
    );

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: removeKeys(['updatedAt', 'createdAt'], updatedCoupon[0].dataValues),
    });
  } catch (err) {
    next(err);
  }
};

type removeSingleCouponItemByIdRequest = Request<{ couponItemId: string }>;
export const removeSingleCouponItemByIdController = async (
  req: removeSingleCouponItemByIdRequest,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  const t = await sequelize.transaction();

  try {
    // Get id & convert to number
    const { couponItemId: unconvertCouponId } = req.params;
    const couponItemId: number = +unconvertCouponId;

    const coupon = await CouponItem.findOne({
      where: {
        id: couponItemId,
      },
      transaction: t,
    });

    if (!coupon) {
      throw createError.BadRequest('CouponItem with id not exist');
    }

    const orderWithCoupon = await Order.findAll({
      where: {
        couponItemId: couponItemId,
      },
      transaction: t,
    });

    if (orderWithCoupon.length >= 1) {
      throw createError.Conflict('Unable to delete this couponitem');
    }

    // Uodate coupon
    await Coupon.decrement('quantity', {
      by: 1,
      where: {
        id: coupon.couponId,
      },
      transaction: t,
    });

    // Delete coupon
    await CouponItem.destroy({
      where: {
        id: couponItemId,
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

type removeSingleCouponByIdRequest = Request<{ couponId: string }>;
export const removeSingleCouponByIdController = async (
  req: removeSingleCouponByIdRequest,
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
