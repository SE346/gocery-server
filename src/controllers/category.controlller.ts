import { Request, Response, NextFunction } from 'express';
import { Category } from '../models';

export const getAllCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryList = await Category.findAll({});

    res.status(200).json({
      status: 200,
      data: {
        categoryList,
      },
    });
  } catch (err) {
    next(err);
  }
};
