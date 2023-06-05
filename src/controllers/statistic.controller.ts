import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Order, Product, User, UserToRole } from '../models';
import { ResJSON } from '../utils/interface';
import { IPayload } from '../utils/jwt_service';
import { sequelize } from '../config/sequelize';
import { getOrderByType } from '../services/statisticService.service';

type statisticRequest = Request<
  unknown,
  unknown,
  {
    day: number;
    month: number;
    year: number;
  },
  { types: typeQuery }
>;

enum typeQuery {
  ALL = 'all',
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
}

interface DateObject {
  day?: number;
  month?: number;
  year?: number;
}

export const statisticController = async (
  req: statisticRequest,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  const t = await sequelize.transaction();

  try {
    const { types } = req.query;
    const date: DateObject = req.body;

    // Check type
    if (!Object.values(typeQuery).includes(types)) {
      throw createError.BadRequest(
        'types query parameter only take 4 values: "all", "day", "month", "year"'
      );
    }

    if (types === 'day') {
      if (!date.day || !date.month || !date.year) {
        throw createError.BadRequest('types = day, required include day, month, yeah');
      }
    }
    if (types === 'month') {
      if (!date.month || !date.year) {
        throw createError.BadRequest('types = month, required include month, yeah');
      }
    }
    if (types === 'year') {
      if (!date.year) {
        throw createError.BadRequest('types = year, required include yeah');
      }
    }

    // Count for user
    const countedUser = await UserToRole.count({
      where: {
        roleId: 2,
      },
      transaction: t,
    });

    // Count for product
    const countedProduct = await Product.count({ transaction: t });

    const order = await getOrderByType(types, t, date);

    await t.commit();

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: types === 'all' ? { countedUser, countedProduct, ...order } : { ...order },
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
