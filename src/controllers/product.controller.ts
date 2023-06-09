import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Product, ProductImg } from '../models';
import { v4 as uuid } from 'uuid';
import { ResJSON } from '../utils/interface';

interface productImgAdded {
  index: number;
  imgUrl: string;
}

interface productModel {
  productId?: string;
  categoryId: string;
  name: string;
  quantity: number;
  description?: string;
  imageList: productImgAdded[];
  price: number;
  discount: number;
  unit: string;
}

export const getAllProductBelongToCategoryController = async (
  req: Request<{ categoryId: string }>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    const { categoryId: unconvertCateId } = req.params;
    if (!unconvertCateId) {
      throw createError.BadRequest('Missing param');
    }

    const categoryId: number = +unconvertCateId;

    const productList = await Product.findAll({
      where: {
        categoryId,
      },
      include: [ProductImg],
      nest: true,
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

export const addOneProductController = async (
  req: Request<{}, {}, productModel>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    const { categoryId, name, quantity, description, imageList, price, discount, unit } = req.body;

    const newProductId = uuid();

    const createdProduct = await Product.create({
      id: newProductId,
      categoryId,
      productName: name,
      quantity,
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

    const createdProductImgList = await ProductImg.bulkCreate(imageListMapping);

    res.status(201).json({
      statusCode: 201,
      message: 'Add product successfully',
      data: {
        ...createdProduct.dataValues,
        productImgList: createdProductImgList,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Replace
export const updateOneProductController = async (
  req: Request<{ productId: string }, {}, productModel>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { categoryId, name, quantity, description, imageList, price, discount, unit } = req.body;

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
    const [_, updatedProduct] = await Product.update(
      {
        categoryId,
        productName: name,
        quantity,
        productDescription: description,
        price,
        discount,
        unit,
      },
      {
        where: {
          id: productId,
        },
        returning: true,
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
    const createdProductImgList = await ProductImg.bulkCreate(imageListMapping);

    res.status(200).json({
      statusCode: 200,
      message: 'Update product successfully',
      data: {
        ...updatedProduct[0].dataValues,
        productImgList: createdProductImgList,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteOneProductController = async (
  req: Request<{ productId: string }, {}, productModel>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      throw createError.BadRequest('Missing params');
    }

    const product = await Product.findOne({
      where: {
        id: productId,
      },
      raw: true,
    });

    if (!product) {
      throw createError.Conflict('productId does not exists');
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
      statusCode: 200,
      message: 'Delete product successfully',
    });
  } catch (err) {
    next(err);
  }
};
