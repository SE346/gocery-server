import { Router } from 'express';
import {
  getAllProductInCartController,
  addProductToCartController,
} from '../controllers/cart.controller';
import { verifyAccessToken } from '../utils/jwt_service';

const router: Router = Router();

// [GET] /cart/get-all -> Get all product in cart
router.get('/get-all', verifyAccessToken, getAllProductInCartController);

// [POST] /cart/add -> Add product to cart
router.post('/add', verifyAccessToken, addProductToCartController);

export default router;
