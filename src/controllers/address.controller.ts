import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

export const getAllAddressBelongToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({
      status: 200,
      message: 'Route check',
    });
  } catch (err) {
    next(err);
  }
};
