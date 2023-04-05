import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Cart } from '../models';

export const getAllProductInCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw createError.BadRequest('Missing params');
    }

    const cartList = await Cart.findAll({
      attributes: { exclude: ['userMail', 'createdAt', 'updatedAt'] },
      where: {
        userMail: email,
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
