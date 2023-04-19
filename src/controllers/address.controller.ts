import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Address } from '../models';
import { ResJSON } from '../utils/interface';

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
  res: Response<ResJSON>,
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
      statusCode: 200,
      message: 'Success',
      data: addressList,
    });
  } catch (err) {
    next(err);
  }
};

export const addNewAddressController = async (
  req: Request<{}, {}, addressModel>,
  res: Response<ResJSON>,
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

    const newAddress = await Address.create({
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

    res.status(201).json({
      statusCode: 201,
      message: 'Add new address successfully',
      data: newAddress,
    });
  } catch (err) {
    next(err);
  }
};

export const updateAddressController = async (
  req: Request<{ addressId: string }, {}, addressModel>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    // Get userMail from previous middleware
    const userMail = res.locals.payload.user.mail;

    // Get id & convert to number
    const { addressId: unconvertAddrId } = req.params;
    const addressId: number = +unconvertAddrId;

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

    if (!addressId) {
      throw createError.BadRequest('Missing params');
    }

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

    const [_, updatedAddress] = await Address.update(
      {
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
      },
      {
        where: {
          id: addressId,
        },
        returning: true,
      }
    );

    res.status(200).json({
      statusCode: 200,
      message: 'Update address successfully',
      data: updatedAddress,
    });
  } catch (err) {
    next(err);
  }
};

export const removeAddressController = async (
  req: Request<{ addressId: string }, {}, addressModel>,
  res: Response<ResJSON>,
  next: NextFunction
) => {
  try {
    // Get id & convert to number
    const { addressId: unconvertAddrId } = req.params;
    const addressId: number = +unconvertAddrId;

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
      statusCode: 200,
      message: 'Remove address successfully',
    });
  } catch (err) {
    next(err);
  }
};
