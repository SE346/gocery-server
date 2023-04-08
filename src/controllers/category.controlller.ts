import { Request, Response, NextFunction, raw } from 'express';
import { Category, Product } from '../models';
import createError from 'http-errors';

interface categoryModel {
  id: number;
  categoryName: string;
  categoryImage: string;
}

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

export const addOneCategoryController = async (
  req: Request<{}, {}, categoryModel>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryName, categoryImage } = req.body;

    if (!categoryImage || !categoryName) {
      throw createError.BadRequest('Missing params');
    }

    await Category.create({
      categoryName,
      categoryImage,
    });

    res.json({
      status: 200,
      message: 'Add a category successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const updateOneCategoryController = async (
  req: Request<{}, {}, categoryModel>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, categoryName, categoryImage } = req.body;

    // Check missing param
    if (!id || !categoryName || !categoryImage) {
      throw createError.BadRequest('Missing params');
    }

    await Category.update(
      {
        categoryName,
        categoryImage,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).json({
      status: 200,
      message: 'Update category successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteOneCategoryController = async (
  req: Request<{}, {}, categoryModel>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;

    if (!id) {
      throw createError.BadRequest('Missing params');
    }

    const category = await Category.findOne({
      where: {
        id,
      },
      raw: true,
    });

    if (!category) {
      throw createError.BadRequest('categoryID does not exist');
    }

    const productListBelongToCategory = await Product.findAll({
      where: {
        categoryId: id,
      },
      raw: true,
    });

    if (productListBelongToCategory.length > 0) {
      throw createError.Conflict('Category cannot be deleted because it still contains product');
    }

    await Category.destroy({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: 200,
      message: 'Delete successfully',
    });
  } catch (err) {
    next(err);
  }
};
