import { Request, Response, NextFunction } from 'express';
import { Rank, Role, User, UserToRank, UserToRole } from '../models';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  userPayload,
} from '../utils/jwt_service';
import { removeKeys } from '../utils/remove_key';
import { ResJSON } from '../utils/interface';

interface registerModel {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  phoneNum: string;
}

interface loginModel {
  email: string;
  password: string;
}

export const registerController = async (
  req: Request<{}, {}, registerModel>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    const { email, password, lastName, firstName, phoneNum } = req.body;

    // Validate some field

    // Check email exist
    const userExist = await User.findOne({
      where: {
        mail: email,
      },
      raw: true,
      nest: true,
    });
    if (userExist) {
      throw createError.Conflict('This email is registered');
    }

    // Create new user
    await User.create({
      mail: email,
      password,
      lastName,
      firstName,
      phoneNum,
    });

    // Add default Shopper role when register
    await UserToRole.create({
      userMail: email,
      roleId: 2, // Shopper role
    });

    // Add default 'Đồng' rank when register
    await UserToRank.create({
      userMail: email,
      rankId: 1, // 'Đồng' rank
    });

    res.status(201).json({
      statusCode: 201,
      message: 'New account registration successful',
    });
  } catch (err) {
    next(err);
  }
};

export const loginController = async (
  req: Request<{}, {}, loginModel>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    // Get body
    const { email, password } = req.body;

    // Check email exist in database
    const user = await User.findOne({
      attributes: {
        exclude: ['refreshToken', 'createdAt', 'updatedAt'],
      },
      include: [
        {
          model: Role,
        },
        {
          model: Rank,
        },
      ],
      where: {
        mail: email,
      },
      raw: true,
      nest: true,
    });
    if (!user) {
      throw createError.Conflict('User not register');
    }

    // Unhash & check password
    const hashPassword = user.password;
    const isMatch = await bcrypt.compare(password, hashPassword);
    if (!isMatch) {
      throw createError.Unauthorized('Wrong password');
    }

    // Create payload for token
    const payload: userPayload = {
      mail: user.mail,
      role: user.role?.roleName,
    };

    // Get information about rank user
    const curRankId = user.rankId;
    const rankDetail = await UserToRank.findOne({
      where: {
        rankId: curRankId,
        userMail: user.mail,
      },
      raw: true,
      nest: true,
    });

    const { rankName, nextRank, rankDescription, transactionTarget, monneyAccTarget } = user?.rank;
    const rank = {
      rankName,
      nextRank,
      rankDescription,
      monneyAccTarget,
      transactionTarget,
      moneyAccCur: rankDetail?.monneyAccCur,
      transactionCur: rankDetail?.transactionCur,
    };

    // Refactor obj
    delete user['role'];
    const newUserObj = {
      ...user,
      rank,
    };

    // Create access token & refresh token
    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    // Store refresh token in cookie
    // res.cookie('refreshToken', refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    //   path: '/',
    //   sameSite: 'strict',
    //   maxAge: 60 * 60 * 24 * 3600 * 1000,
    // });

    res.status(201).json({
      statusCode: 201,
      message: 'Login successfully',
      data: {
        user: removeKeys(['password', 'rankId'], newUserObj),
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logoutController = async (
  req: Request<{}, {}, User>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    // Take refresh token from req.body of user
    const { refreshToken } = req.body;

    // Check refresh token exists
    if (!refreshToken) {
      return next(createError.Unauthorized('No refresh token in body'));
    }

    // Verify refreshToken
    const { user } = await verifyRefreshToken(refreshToken);

    // Remove refreshToken in Database & clear RK in cookies
    await User.update(
      {
        refreshToken: '',
      },
      {
        where: {
          mail: user.mail,
        },
      }
    );
    // .then(() => res.clearCookie('refreshToken'))
    // .catch((err) => next(createError.InternalServerError('Unable update RK in database')));

    res.status(200).json({
      statusCode: 200,
      message: 'Logout successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const refreshTokenController = async (
  req: Request<{}, {}, User>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    // Take refresh token from req.body
    const { refreshToken } = req.body;

    // Check refresh token exists
    if (!refreshToken) {
      return next(createError.Unauthorized('No refresh token in body'));
    }

    // Check proper user
    const { user } = await verifyRefreshToken(refreshToken);

    // Create new access token & refresh token, then send it to user
    const accessToken = await signAccessToken(user);
    const refToken = await signRefreshToken(user);

    // Store refresh token in cookie
    // res.cookie('refreshToken', refToken, {
    //   httpOnly: true,
    //   secure: false,
    //   path: '/',
    //   sameSite: 'strict',
    //   maxAge: 60 * 60 * 24 * 3600 * 1000,
    // });

    res.status(200).json({
      statusCode: 200,
      message: 'Success',
      data: {
        accessToken,
        refreshToken: refToken,
      },
    });
  } catch (err) {
    next(err);
  }
};
