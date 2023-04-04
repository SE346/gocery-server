import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Product } from '../models';

export const getAllProductBelongToCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.body;
    if (!categoryId) {
      throw createError.BadRequest('Missing param');
    }

    const productList = await Product.findAll({
      where: {
        categoryId,
      },
      nest: true,
      raw: true,
    });

    res.status(200).json({
      status: 200,
      data: productList,
    });
  } catch (err) {
    next(err);
  }
};
