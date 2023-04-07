import { Request, Response, NextFunction, raw } from 'express';
import createError from 'http-errors';
import { Address } from '../models';

interface addressModel {
  addressId: number;
  name: string;
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtName: string;
  wardCode: string;
  wardName: string;
  detail: string;
  phoneNum: string;
  setAsPrimary: Boolean;
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
      setAsPrimary,
    } = req.body;

    // Disable all mail if setAsPrimary = true
    if (setAsPrimary) {
      await Address.update(
        {
          active: false,
        },
        {
          where: {
            userMail,
          },
        }
      );
    }

    await Address.create({
      userMail,
      name,
      active: setAsPrimary || false,
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

export const removeAddressController = async (
  req: Request<{}, {}, addressModel>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { addressId } = req.body;

    if (!addressId) {
      throw createError.BadRequest('Missing params');
    }

    // Check if cur address in active status?
    const curAddress = await Address.findOne({
      where: {
        id: addressId,
      },
      raw: true,
    });

    if (!curAddress) {
      throw createError.BadRequest('Address id not exist');
    }

    if (curAddress.active) {
      throw createError.Conflict('This address is in active state, so it cannot be deleted.');
    }

    await Address.destroy({
      where: {
        id: addressId,
      },
    });

    res.status(200).json({
      status: 200,
      message: 'Remove address successfully',
    });
  } catch (err) {
    next(err);
  }
};
