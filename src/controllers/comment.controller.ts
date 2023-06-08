import { Request, Response, NextFunction } from 'express';
import { Product, Comment } from '../models';
import createError from 'http-errors';
import { ResJSON } from '../utils/interface';
import { IPayload } from '../utils/jwt_service';
import { sequelize } from '../config/sequelize';

export const getAllCommentBelongToProductController = async (
  req: Request<{ productId: string }>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
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

    const ratingAverage = +(
      commentList.reduce((acc, curItem) => acc + curItem.rating, 0) / commentList.length
    ).toFixed(1);

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: { commentList, ratingAverage },
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
  try {
    const { commentId: unconvertCommentId } = req.params;
    const commentId: number = +unconvertCommentId;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      throw createError.NotFound('Comment with id not found');
    }

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
  const t = await sequelize.transaction();

  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const { productId, content, rating, image } = req.body;

    if (!productId || !content || !rating) {
      throw createError.BadRequest('Missing params');
    }

    // Check product exist
    const product = await Product.findByPk(productId, { transaction: t });

    if (!product) {
      throw createError.Conflict('Product with id not exist');
    }

    // Create new comment
    const createdComment = await Comment.create(
      {
        productId,
        userMail,
        content,
        rating,
        image,
      },
      {
        transaction: t,
      }
    );

    await t.commit();

    res.status(201).json({
      statusCode: 201,
      message: 'Added successfully',
      data: createdComment,
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

export const updateCommentController = async (
  req: Request<{ commentId: string }, {}, Comment>,
  res: Response<ResJSON, { payload: IPayload }>,
  next: NextFunction
) => {
  const t = await sequelize.transaction();

  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const { commentId: unconvertCommentId } = req.params;
    const commentId: number = +unconvertCommentId;

    const { content, rating, image } = req.body;

    const comment = await Comment.findByPk(commentId, {
      transaction: t,
    });

    if (!comment) {
      throw createError.Conflict('Comment with id not exist');
    }

    if (comment.userMail !== userMail) {
      throw createError.Unauthorized('Unable to edit this comment');
    }

    const [_, updatedComment] = await Comment.update(
      {
        content,
        rating,
        image,
      },
      {
        where: {
          id: commentId,
        },
        transaction: t,
        returning: true,
      }
    );

    await t.commit();

    res.status(200).json({
      statusCode: 200,
      message: 'Updated successfully',
      data: updatedComment[0].dataValues,
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

export const removeCommentController = async (
  req: Request<{ commentId: string }>,
  res: Response<ResJSON, { payload: IPayload }>,
  next: NextFunction
) => {
  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const { commentId: unconvertCommentId } = req.params;
    const commentId: number = +unconvertCommentId;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      throw createError.Conflict('Comment with id not exist');
    }

    if (comment.userMail !== userMail) {
      throw createError.Unauthorized('Unable to delete this comment');
    }

    await Comment.destroy({
      where: {
        id: commentId,
      },
    });

    res.status(200).json({
      statusCode: 200,
      message: 'Deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
