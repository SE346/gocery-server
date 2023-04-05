import { Router } from 'express';
import { getAllProductInCartController } from '../controllers/cart.controller';

const router: Router = Router();

// [GET] /cart/get-all -> Get all product in cart
router.get('/get-all', getAllProductInCartController);

export default router;
