import JWT, { JwtPayload } from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models';
import { Request, Response, NextFunction } from 'express';

export interface userPayload extends JwtPayload {
  mail: string;
  // role: string;
}

// Create Access Token
const signAccessToken = async (user: userPayload) => {
  return new Promise((resolve, reject) => {
    // Payload
    const payload = {
      user,
    };

    // Secret
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (secret === undefined) {
      reject(
        createError.InternalServerError('Unable access ACCESS_TOKEN_SECRET variable from .env')
      );
    }

    // Options
    const options = {
      expiresIn: '1d',
    };

    // Sign
    JWT.sign(payload, secret!, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

// Create Refresh Token
const signRefreshToken = async (user: userPayload) => {
  return new Promise((resolve, reject) => {
    // Payload
    const payload = {
      user,
    };

    // Secret
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (secret === undefined) {
      reject(
        createError.InternalServerError('Unable access REFRESH_TOKEN_SECRET variable from .env')
      );
    }

    // Options
    const options = {
      expiresIn: '1y',
    };

    // Sign
    JWT.sign(payload, secret!, options, async (err, token) => {
      if (err) reject(err);

      // Save refresh token to DB
      await User.update(
        {
          refreshToken: token,
        },
        {
          where: {
            mail: user.mail,
          },
        }
      ).catch((err) =>
        reject(createError.InternalServerError(`Unable save refresh token to database: ${err}`))
      );

      resolve(token);
    });
  });
};

const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return next(createError.Unauthorized('Header does not include Authorization field'));
  }

  // Get token from header
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader.split(' ');
  const token = bearerToken[1];

  // start verify token
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, payload) => {
    if (err) {
      if (err.name === 'JsonWebTokenError') {
        return next(createError.Unauthorized(err.message));
      }
      return next(createError.Unauthorized(err.message));
    }

    // Pass payload to next midleware
    res.locals.payload = payload;
    next();
  });
};

const verifyRefreshToken = (refreshToken: string): Promise<userPayload> => {
  return new Promise((resolve, reject) => {
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (err, payload) => {
      if (err) {
        return reject(err);
      }
      if (payload === undefined || typeof payload === 'string') {
        return reject(createError.BadRequest('Missing payload in token'));
      }

      // Get refresh token from db
      const user = await User.findOne({
        where: {
          mail: <userPayload>payload.user.mail,
        },
        raw: true,
        nest: true,
      });

      if (refreshToken !== user?.refreshToken) {
        reject(createError.Unauthorized('Invalid refresh token'));
      }

      resolve(<userPayload>payload);
    });
  });
};

export { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };
