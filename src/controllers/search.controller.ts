import { Request, Response, NextFunction } from 'express';
import { Product, Rank, Role, User, UserToRank, UserToRole } from '../models';
import createError from 'http-errors';
import { ResJSON } from '../utils/interface';
import { Op } from 'sequelize';

type SearchForProductRequest = Request<
  unknown,
  unknown,
  unknown,
  {
    limit: string;
    keyword: string;
    page: string;
  }
>;

export const searchForProductController = async (
  req: SearchForProductRequest,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    const { limit: unconvertLimit, page: unconvertPage, keyword } = req.query;

    if (!unconvertLimit || !keyword || !unconvertPage) {
      throw createError.BadRequest('Missing params');
    }

    const limit: number = +unconvertLimit;
    const page: number = +unconvertPage;

    const productList = await Product.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: {
                [Op.any]: [`${keyword}%`, `%${keyword}%`],
              },
            },
          },
          {
            description: {
              [Op.iLike]: {
                [Op.any]: [`${keyword}%`, `%${keyword}%`],
              },
            },
          },
        ],
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      limit,
      offset: limit * (page - 1),
    });

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: productList,
    });
  } catch (err) {
    next(err);
  }
};
