import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Cart } from '../models';

interface cartModel {
  productId: string;
  quantity: number;
}

export const getAllProductInCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const cartList = await Cart.findAll({
      attributes: { exclude: ['userMail', 'createdAt', 'updatedAt'] },
      where: {
        userMail,
      },
    });

    res.status(200).json({
      status: 200,
      data: cartList,
    });
  } catch (err) {
    next(err);
  }
};

export const addProductToCartController = async (
  req: Request<{}, {}, cartModel>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      throw createError.BadRequest('Missing params');
    }

    const [cart, created] = await Cart.findOrCreate({
      where: {
        userMail,
        productId,
      },
      defaults: {
        quantity,
      },
      raw: true,
    });

    // Product was existed -> Increase quantity
    if (!created) {
      await Cart.update(
        {
          quantity: cart.quantity + quantity,
        },
        {
          where: {
            userMail,
            productId,
          },
        }
      );
    }

    res.status(200).json({
      status: 200,
      message: 'Product added cart',
    });
  } catch (err) {
    next(err);
  }
};
