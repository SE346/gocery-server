import { Router } from 'express';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';
import {
  getAllCouponController,
  getSingleCouponByIdController,
  removeSingleCouponByIdController,
} from '../controllers/coupon.controller';
const router: Router = Router();

// [GET] /coupon -> Get all coupon
router.get('/', verifyAccessToken, getAllCouponController);

// [GET] /coupon/{couponId} -> Get single coupon by id
router.get('/:couponId', verifyAccessToken, getSingleCouponByIdController);

// [DELETE] /coupon/{couponId} -> Remove single coupon by id
router.delete(
  '/:couponId',
  verifyAccessToken,
  verifyAdminAccessToken,
  removeSingleCouponByIdController
);

export default router;
