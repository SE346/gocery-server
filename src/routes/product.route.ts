import { Router } from 'express';
import {
  getAllProductBelongToCategoryController,
  addOneProductController,
  updateOneProductController,
  deleteOneProductController,
} from '../controllers/product.controller';

import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';

const router: Router = Router();

// [GET] /product/get-product-of-category -> Get all product belong to a category
router.get(
  '/get-product-of-category/:categoryId',
  verifyAccessToken,
  verifyAdminAccessToken,
  getAllProductBelongToCategoryController
);

// [POST] /product/add-one -> Add one product
router.post('/add-one', verifyAccessToken, verifyAdminAccessToken, addOneProductController);

// [POST] /product/{productId} -> Update one product
router.post('/:productId', verifyAccessToken, verifyAdminAccessToken, updateOneProductController);

// [DELETE] /product/{productId} -> Delete one product
router.delete('/:productId', verifyAccessToken, verifyAdminAccessToken, deleteOneProductController);

export default router;
