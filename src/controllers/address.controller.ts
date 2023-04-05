import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Address } from '../models';

interface addressModel {
  name: string;
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtName: string;
  wardCode: string;
  wardName: string;
  detail: string;
  phoneNum: string;
}

export const getAllAddressBelongToUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const addressList = await Address.findAll({
      where: {
        userMail,
      },
      raw: true,
    });

    res.status(200).json({
      status: 200,
      data: addressList,
    });
  } catch (err) {
    next(err);
  }
};

export const addNewAddressController = async (
  req: Request<{}, {}, addressModel>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    const {
      name,
      provinceId,
      provinceName,
      districtId,
      districtName,
      wardCode,
      wardName,
      detail,
      phoneNum,
    } = req.body;

    await Address.create({
      userMail,
      name,
      provinceId,
      provinceName,
      districtId,
      districtName,
      wardCode,
      wardName,
      detail,
      phoneNum,
    });

    res.status(200).json({
      status: 200,
      message: 'Add new address successfully',
    });
  } catch (err) {
    next(err);
  }
};
