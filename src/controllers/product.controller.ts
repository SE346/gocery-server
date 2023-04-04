import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Product, ProductImg } from '../models';
import { v4 as uuid } from 'uuid';

interface productModel {
  productId?: string;
  categoryId: string;
  name: string;
  description?: string;
  imageList: string[];
  price: number;
  discount: number;
  unit: string;
}

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

export const addOneProductController = async (
  req: Request<{}, {}, productModel>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId, name, description, imageList, price, discount, unit } = req.body;

    const newProductId = uuid();

    await Product.create({
      id: newProductId,
      categoryId,
      productName: name,
      productDescription: description,
      price,
      discount,
      unit,
    });

    const imageListMapping = imageList.map((curVal) => ({
      productId: newProductId,
      imgUrl: curVal,
    }));

    await ProductImg.bulkCreate(imageListMapping);

    res.status(200).json({
      status: 200,
      message: 'Add product successfully',
    });
  } catch (err) {
    next(err);
  }
};
