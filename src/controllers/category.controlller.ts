import { Request, Response, NextFunction, raw } from 'express';
import { Category, Product } from '../models';
import createError from 'http-errors';
import { ResJSON } from '../utils/interface';

interface categoryModel {
  id: number;
  categoryName: string;
  categoryImage: string;
}

export const getAllCategoryController = async (
  req: Request,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    const categoryList = await Category.findAll({});

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: categoryList,
    });
  } catch (err) {
    next(err);
  }
};

export const addOneCategoryController = async (
  req: Request<{}, {}, categoryModel>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    const { categoryName, categoryImage } = req.body;

    if (!categoryImage || !categoryName) {
      throw createError.BadRequest('Missing params');
    }

    const newCategory = await Category.create({
      categoryName,
      categoryImage,
    });

    res.status(201).json({
      statusCode: 201,
      message: 'Add a category successfully',
      data: newCategory,
    });
  } catch (err) {
    next(err);
  }
};

export const updateOneCategoryController = async (
  req: Request<{ categoryId: string }, {}, categoryModel>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    const { categoryId: unconvertCateId } = req.params;
    const categoryId: number = +unconvertCateId;

    const { categoryName, categoryImage } = req.body;

    // Check missing param
    if (!categoryId || !categoryName || !categoryImage) {
      throw createError.BadRequest('Missing params');
    }

    const [_, updatedCategory] = await Category.update(
      {
        categoryName,
        categoryImage,
      },
      {
        where: {
          id: categoryId,
        },
        returning: true,
      }
    );

    res.status(200).json({
      statusCode: 200,
      message: 'Update category successfully',
      data: updatedCategory,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteOneCategoryController = async (
  req: Request<{ categoryId: string }>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    const { categoryId: unconvertCateId } = req.params;
    const categoryId: number = +unconvertCateId;

    if (!categoryId) {
      throw createError.BadRequest('Missing params');
    }

    const category = await Category.findOne({
      where: {
        id: categoryId,
      },
      raw: true,
    });

    if (!category) {
      throw createError.BadRequest('categoryID does not exist');
    }

    const productListBelongToCategory = await Product.findAll({
      where: {
        categoryId,
      },
      raw: true,
    });

    if (productListBelongToCategory.length > 0) {
      throw createError.Conflict('Category cannot be deleted because it still contains product');
    }

    await Category.destroy({
      where: {
        id: categoryId,
      },
    });

    res.status(200).json({
      statusCode: 200,
      message: 'Delete successfully',
    });
  } catch (err) {
    next(err);
  }
};
