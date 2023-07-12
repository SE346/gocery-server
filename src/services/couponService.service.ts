import { Coupon, CouponItem } from '../models';

export const generateRandomString = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
};

export const mutipleGenerate = (quantity: number): string[] => {
  const generatedCodeList = [];
  for (let i = 0; i < quantity; i++) {
    const generatedCode = generateRandomString();
    generatedCodeList.push(generatedCode);
  }

  return generatedCodeList;
};

export const assertCode = (code: string): boolean => {
  const regex = /^[a-zA-Z0-9]{10}$/;
  return regex.test(code);
};

export const assertCodeList = (codeList: string[]): boolean => {
  for (const codeItem of codeList) {
    const codeValid = assertCode(codeItem);
    if (!codeValid) {
      return false;
    }
  }

  return true;
};

export const assertCouponValidTime = (coupon: Coupon): boolean => {
  const fromDate = new Date(coupon.fromDate);
  const endDate = new Date(coupon.endDate);
  const currentDate = new Date();

  return endDate >= currentDate && currentDate >= fromDate;
};
