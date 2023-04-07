import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { User } from '../models';

interface userModel {
  firstName: string;
  lastName: string;
  avatar: string;
  phoneNum: string;
  dateOfBirth: Date;
}

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

export const updateAvatarController = async (
  req: Request<{}, {}, userModel>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const { avatar } = req.body;

    if (!avatar) {
      throw createError.BadRequest('Missing params');
    }

    User.update(
      {
        avatar,
      },
      {
        where: {
          mail: userMail,
        },
      }
    );

    res.status(200).json({
      status: 200,
      message: 'Update avatar successfully',
    });
  } catch (err) {
    next(err);
  }
};
