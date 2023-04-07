import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { User } from '../models';

export const getAllUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userList = await User.findAll({
      attributes: {
        exclude: ['refreshToken'],
      },
    });

    res.status(200).json({
      status: 200,
      data: userList,
    });
  } catch (err) {
    next(err);
  }
};
