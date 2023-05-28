import { Router } from 'express';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';
import {
  getAllOrderBelongToUserController,
  getSingleOrderByIdController,
  updateStatusOrderByIdController,
} from '../controllers/order.controller';

const router: Router = Router();

// [GET] /order -> Get all order belong to user
router.get('/', verifyAccessToken, getAllOrderBelongToUserController);

// [GET] /order/{orderId} -> Get single order by id
router.get('/:orderId', verifyAccessToken, getSingleOrderByIdController);

// [PUT] /order/{orderId} -> Update status order by id
router.put('/:orderId', verifyAccessToken, verifyAdminAccessToken, updateStatusOrderByIdController);

export default router;
