import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Address } from '../models';

export const getAllAddressBelongToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const addressList = await Address.findAll({
      where: {
        userMail,
      },
      raw: true,
    });

    res.status(200).json({
      status: 200,
      data: addressList,
    });
  } catch (err) {
    next(err);
  }
};
