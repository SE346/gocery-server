import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Order, Product, User, UserToRole } from '../models';
import { ResJSON } from '../utils/interface';
import { IPayload } from '../utils/jwt_service';
import { sequelize } from '../config/sequelize';
import { getOrderByType, getStatistic } from '../services/statisticService.service';

type statisticDeprecatedRequest = Request<
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

export const statisticDeprecatedController = async (
  req: statisticDeprecatedRequest,
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

type statisticRequest = Request<
  unknown,
  unknown,
  {
    startDate: string;
    endDate: string;
  },
  {
    types: statisticTypeQuery;
  }
>;

enum statisticTypeQuery {
  OVERVIEW = 'overview',
  DETAIL = 'detail',
}

interface RangeDate {
  startDate: string;
  endDate: string;
}

export const statisticController = async (
  req: statisticRequest,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  const t = await sequelize.transaction();

  try {
    const { types } = req.query;
    const date: RangeDate = req.body;

    // Check type
    if (!Object.values(statisticTypeQuery).includes(types)) {
      throw createError.BadRequest(
        'types query parameter only take 2 values: "overview", "detail"'
      );
    }

    let startDate, endDate;

    if (types === 'overview') {
      startDate = '2010-01-01T00:00:00.000Z';
      endDate = '2030-01-01T00:00:00.000Z';
    } else {
      if (!date.endDate || !date.startDate) {
        throw createError.BadRequest('Missing params');
      }
      startDate = date.startDate;
      endDate = date.endDate;
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

    const order = await getStatistic(types, t, { startDate, endDate });

    await t.commit();

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data:
        types === 'overview'
          ? { users: countedUser, products: countedProduct, ...order }
          : { ...order },
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
