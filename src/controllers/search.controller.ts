import { Request, Response, NextFunction } from 'express';
import { Category, Product, ProductImg, Rank, Role, User, UserToRank, UserToRole } from '../models';
import createError from 'http-errors';
import { ResJSON } from '../utils/interface';
import { Op } from 'sequelize';
import { sequelize } from '../config/sequelize';

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

type searchInCategoryRequest = Request<
  { categoryId: string },
  unknown,
  unknown,
  {
    limit: string;
    keyword: string;
    page: string;
  }
>;

export const searchInCategoryController = async (
  req: searchInCategoryRequest,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  const t = await sequelize.transaction();

  try {
    const { limit: unconvertLimit, page: unconvertPage, keyword } = req.query;
    const { categoryId: unconvertCateId } = req.params;
    const categoryId: number = +unconvertCateId;

    if (!unconvertLimit || !keyword || !unconvertPage || !categoryId) {
      throw createError.BadRequest('Missing params');
    }

    const limit: number = +unconvertLimit;
    const page: number = +unconvertPage;

    // Check category exist
    const category = await Category.findByPk(categoryId, {
      transaction: t,
    });

    if (!category) {
      throw createError.Conflict('Category with id not exist');
    }

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
        categoryId,
      },
      include: [
        {
          model: ProductImg,
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      limit,
      offset: limit * (page - 1),
      transaction: t,
    });

    await t.commit();

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: productList,
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};
