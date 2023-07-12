import { Router } from 'express';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';
import {
  getAllOrderController,
  getAllOrderBelongToUserController,
  inventoryCheckController,
  createOrderWithoutCartController,
  createOrderWithCartController,
  getSingleOrderByIdController,
  updateStatusOrderByIdController,
  deleteOrderByIdController,
  calculateApplyVoucher,
} from '../controllers/order.controller';

const router: Router = Router();

// [GET] /order/admin -> Get all order
router.get('/admin', verifyAccessToken, verifyAdminAccessToken, getAllOrderController);

// [GET] /order -> Get all order belong to user
router.get('/', verifyAccessToken, getAllOrderBelongToUserController);

// [GET] /pre-order -> Inventory check
router.get('/pre-order', verifyAccessToken, inventoryCheckController);

// [GET] /pre-order-cp -> Caculate after apply coupon
router.get('/pre-order-cp', verifyAccessToken, calculateApplyVoucher);

// [POST] /order -> Create order without cart
router.post('/', verifyAccessToken, createOrderWithoutCartController);

// [POST] /order/cart -> Create order with cart
router.post('/cart', verifyAccessToken, createOrderWithCartController);

// [GET] /order/{orderId} -> Get single order by id
router.get('/:orderId', verifyAccessToken, getSingleOrderByIdController);

// [PUT] /order/{orderId} -> Update status order by id
router.put('/:orderId', verifyAccessToken, verifyAdminAccessToken, updateStatusOrderByIdController);

// [DELETE] /order/{orderId} -> Delete order by id
router.delete('/:orderId', verifyAccessToken, verifyAdminAccessToken, deleteOrderByIdController);

export default router;
