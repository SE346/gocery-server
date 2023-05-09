import { Request, Response, NextFunction } from 'express';
import { Product, Comment } from '../models';
import createError from 'http-errors';
import { ResJSON } from '../utils/interface';

export const getAllCommentBelongToProduct = async (
  req: Request<{ productId: string }>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  const { productId } = req.params;

  // Check missing param
  if (!productId) {
    throw createError.BadRequest('Missing params');
  }

  const commentList = await Comment.findAll({
    where: {
      productId,
    },
  });

  try {
    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: commentList,
    });
  } catch (err) {
    next(err);
  }
};
