import { Router } from 'express';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';
import {
  getAllCouponController,
  getSingleCouponByIdController,
  createCouponController,
  generateCouponController,
  updateCouponController,
  updateSingleCouponItemByIdController,
  removeSingleCouponItemByIdController,
  removeSingleCouponByIdController,
} from '../controllers/coupon.controller';
const router: Router = Router();

// [GET] /coupon -> Get all coupon
router.get('/', verifyAccessToken, getAllCouponController);

// [GET] /coupon/{couponId} -> Get single coupon by id
router.get('/:couponId', verifyAccessToken, getSingleCouponByIdController);

// [POST] /coupon -> Create new coupon
router.post('/', verifyAccessToken, verifyAdminAccessToken, createCouponController);

// [POST] /coupon/generate -> Generate coupon code
router.post('/generate', verifyAccessToken, verifyAdminAccessToken, generateCouponController);

// [PUT] /coupon/{couponId} -> Update coupon
router.put('/:couponId', verifyAccessToken, verifyAdminAccessToken, updateCouponController);

// [PUT] /coupon/item/{couponItemId} -> Update coupon item
router.put(
  '/item/:couponItemId',
  verifyAccessToken,
  verifyAdminAccessToken,
  updateSingleCouponItemByIdController
);

// [DELETE] /coupon/item/{couponItemId} -> Remove single coupon item by id
router.delete(
  '/item/:couponItemId',
  verifyAccessToken,
  verifyAdminAccessToken,
  removeSingleCouponItemByIdController
);

// [DELETE] /coupon/{couponId} -> Remove single coupon by id
router.delete(
  '/:couponId',
  verifyAccessToken,
  verifyAdminAccessToken,
  removeSingleCouponByIdController
);

export default router;
