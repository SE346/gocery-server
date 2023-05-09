import { Request, Response, NextFunction } from 'express';
import { Product, Comment } from '../models';
import createError from 'http-errors';
import { ResJSON } from '../utils/interface';
import { IPayload } from '../utils/jwt_service';

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

export const addCommentController = async (
  req: Request<{}, {}, Comment>,
  res: Response<ResJSON, { payload: IPayload }>,
  next: NextFunction
) => {
  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const { productId, content } = req.body;

    if (!productId || !content) {
      throw createError.BadRequest('Missing params');
    }

    // Check product exist
    const product = await Product.findByPk(productId);

    if (!product) {
      throw createError.Conflict('Product with id not exist');
    }

    // Create new comment
    const createdComment = await Comment.create({
      productId,
      userMail,
      content,
    });

    res.status(201).json({
      statusCode: 201,
      message: 'Added successfully',
      data: createdComment,
    });
  } catch (err) {
    next(err);
  }
};
