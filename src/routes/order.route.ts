import { Router } from 'express';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';
import { getAllOrderBelongToUserController } from '../controllers/order.controller';

const router: Router = Router();

// [GET] /order -> Get all order belong to user
router.get('/', verifyAccessToken, getAllOrderBelongToUserController);

export default router;
