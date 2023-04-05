import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Product, ProductImg } from '../models';
import { v4 as uuid } from 'uuid';

interface productImgAdded {
  index: number;
  imgUrl: string;
}

interface productModel {
  productId?: string;
  categoryId: string;
  name: string;
  description?: string;
  imageList: productImgAdded[];
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
      include: [ProductImg],
      nest: true,
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

    const imageListMapping = imageList.map((imageListItem) => ({
      productId: newProductId,
      imgUrl: imageListItem.imgUrl,
      index: imageListItem.index,
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

// Replace
export const updateOneProductController = async (
  req: Request<{}, {}, productModel>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, categoryId, name, description, imageList, price, discount, unit } = req.body;

    // Check if product with id existing in the system
    const productWithId = await Product.findOne({
      where: {
        id: productId,
      },
    });

    if (!productWithId) {
      throw createError.BadRequest('The product with this id does not exist in the system');
    }

    // Update product info
    await Product.update(
      {
        categoryId,
        productName: name,
        productDescription: description,
        price,
        discount,
        unit,
      },
      {
        where: {
          id: productId,
        },
      }
    );

    // Clear old product img & renew
    await ProductImg.destroy({
      where: {
        productId,
      },
    });

    const imageListMapping = imageList.map((imageListItem) => ({
      productId,
      imgUrl: imageListItem.imgUrl,
      index: imageListItem.index,
    }));

    await ProductImg.bulkCreate(imageListMapping);

    res.status(200).json({
      status: 200,
      message: 'Update product successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteOneProductController = async (
  req: Request<{}, {}, productModel>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      throw createError.BadRequest('Missing params');
    }

    await ProductImg.destroy({
      where: {
        productId,
      },
    });

    await Product.destroy({
      where: {
        id: productId,
      },
    });

    res.status(200).json({
      status: 200,
      message: 'Delete product successfully',
    });
  } catch (err) {
    next(err);
  }
};
