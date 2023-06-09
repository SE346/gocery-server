import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Cart, Product, ProductImg, User } from '../models';
import { ResJSON } from '../utils/interface';

interface cartModel {
  productId: string;
  quantity: number;
}

export const getAllProductInCartController = async (
  req: Request,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const cartListUser = await User.findOne({
      where: {
        mail: userMail,
      },
      include: [
        {
          model: Product,
          through: {
            as: 'cart',
            attributes: ['quantity'],
          },
          include: [
            {
              model: ProductImg,
              attributes: {
                exclude: ['productId', 'createdAt', 'updatedAt'],
              },
            },
          ],
          attributes: {
            exclude: ['quantity', 'createdAt', 'updatedAt'],
          },
          as: 'cartList',
        },
      ],
    });

    if (!cartListUser) {
      throw createError.InternalServerError('User not found');
    }

    const cartList = cartListUser.cartList;
    const formatedCartList = cartList.map<object>((item) => {
      const { cart, ...restCart } = item.dataValues;
      return { product: restCart, quantity: cart.quantity };
    });

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: formatedCartList,
    });
  } catch (err) {
    next(err);
  }
};

export const addProductToCartController = async (
  req: Request<{}, {}, cartModel>,
  res: Response<ResJSON>,
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
      statusCode: 200,
      message: 'Product added cart',
    });
  } catch (err) {
    next(err);
  }
};

export const removeProductInCartController = async (
  req: Request<{}, {}, cartModel>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      throw createError.BadRequest('Missing params');
    }

    // Check if product is in cart?
    const cartItem = await Cart.findOne({
      where: {
        userMail,
        productId,
      },
    });

    if (!cartItem) {
      throw createError.BadRequest('Product is not in cart');
    }

    if (cartItem.quantity < quantity) {
      throw createError.BadRequest(
        'The number of quantity removed greater than the number available in cart'
      );
    }

    if (cartItem.quantity === quantity) {
      await Cart.destroy({
        where: {
          userMail,
          productId,
        },
      });
    }

    if (cartItem.quantity > quantity) {
      await Cart.update(
        {
          quantity: cartItem.quantity - quantity,
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
      statusCode: 200,
      message: 'Product removed cart',
    });
  } catch (err) {
    next(err);
  }
};
