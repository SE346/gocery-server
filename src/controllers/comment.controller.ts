import { Request, Response, NextFunction } from 'express';
import { Product, Comment } from '../models';
import createError from 'http-errors';
import { ResJSON } from '../utils/interface';

export const getAllCommentBelongToProductController = async (
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

export const getSingleCommentByIdController = async (
  req: Request<{ commentId: string }>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  const { commentId: unconvertCommentId } = req.params;
  const commentId: number = +unconvertCommentId;

  const comment = await Comment.findByPk(commentId);

  if (!comment) {
    throw createError.NotFound('Comment with id not found');
  }

  try {
    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: comment,
    });
  } catch (err) {
    next(err);
  }
};
