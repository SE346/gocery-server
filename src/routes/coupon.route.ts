import { Router } from 'express';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';
import { getAllCouponController } from '../controllers/coupon.controller';
const router: Router = Router();

// [GET] /coupon -> Get all coupon
router.get('/', verifyAccessToken, verifyAdminAccessToken, getAllCouponController);

export default router;
