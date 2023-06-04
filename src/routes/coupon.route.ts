import { Router } from 'express';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';
import {
  getAllCouponController,
  getSingleCouponByIdController,
  createCouponController,
  generateCouponController,
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

// [DELETE] /coupon/{couponId} -> Remove single coupon by id
router.delete(
  '/:couponId',
  verifyAccessToken,
  verifyAdminAccessToken,
  removeSingleCouponByIdController
);

export default router;
