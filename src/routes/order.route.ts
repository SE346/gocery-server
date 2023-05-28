import { Router } from 'express';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';
import {
  getAllOrderController,
  getAllOrderBelongToUserController,
  getSingleOrderByIdController,
  updateStatusOrderByIdController,
  deleteOrderByIdController,
} from '../controllers/order.controller';

const router: Router = Router();

// [GET] /order/admin -> Get all order
router.get('/admin', verifyAccessToken, verifyAdminAccessToken, getAllOrderController);

// [GET] /order -> Get all order belong to user
router.get('/', verifyAccessToken, getAllOrderBelongToUserController);

// [GET] /order/{orderId} -> Get single order by id
router.get('/:orderId', verifyAccessToken, getSingleOrderByIdController);

// [PUT] /order/{orderId} -> Update status order by id
router.put('/:orderId', verifyAccessToken, verifyAdminAccessToken, updateStatusOrderByIdController);

// [DELETE] /order/{orderId} -> Delete order by id
router.delete('/:orderId', verifyAccessToken, verifyAdminAccessToken, deleteOrderByIdController);

export default router;
