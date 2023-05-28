import { Router } from 'express';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';
import {
  getAllOrderBelongToUserController,
  getSingleOrderByIdController,
} from '../controllers/order.controller';

const router: Router = Router();

// [GET] /order -> Get all order belong to user
router.get('/', verifyAccessToken, getAllOrderBelongToUserController);

// [GET] /order/{orderId} -> Get single order by id
router.get('/:orderId', verifyAccessToken, getSingleOrderByIdController);

export default router;
