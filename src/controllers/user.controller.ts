import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { User } from '../models';
import { ResJSON } from '../utils/interface';
import { IPayload } from '../utils/jwt_service';

interface userModel {
  firstName: string;
  lastName: string;
  avatar: string;
  phoneNum: string;
  dateOfBirth: Date;
}

export const getAllUserController = async (
  req: Request,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    const userList = await User.findAll({
      attributes: {
        exclude: ['refreshToken'],
      },
    });

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: userList,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserInfoController = async (
  req: Request,
  res: Response<ResJSON, { payload: IPayload }>,
  next: NextFunction
) => {
  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const userInfo = await User.findByPk(userMail, {
      attributes: {
        exclude: ['userMail', 'password', 'refreshToken', 'createdAt', 'updatedAt'],
      },
    });

    if (!userInfo) {
      throw createError.InternalServerError('Something wrong with database');
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: userInfo,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAvatarController = async (
  req: Request<{}, {}, userModel>,
  res: Response<ResJSON>,
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
      statusCode: 200,
      message: 'Success',
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserInfoController = async (
  req: Request<{}, {}, userModel>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  // Get userMail from previous middleware
  const userMail = res.locals.payload.user.mail;

  const { firstName, lastName, phoneNum, dateOfBirth } = req.body;

  User.update(
    {
      firstName,
      lastName,
      phoneNum,
      dateOfBirth,
    },
    {
      where: {
        mail: userMail,
      },
    }
  );

  try {
    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: {
        email: userMail,
        firstName,
        lastName,
        phoneNum,
        dateOfBirth,
      },
    });
  } catch (err) {
    next(err);
  }
};
