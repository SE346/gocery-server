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
  '/get-product-of-category',
  verifyAccessToken,
  verifyAdminAccessToken,
  getAllProductBelongToCategoryController
);

// [POST] /product/add-one -> Add one product
router.post('/add-one', verifyAccessToken, verifyAdminAccessToken, addOneProductController);

// [POST] /product/update-one -> Update one product
router.post('/update-one', verifyAccessToken, verifyAdminAccessToken, updateOneProductController);

// [DELETE] /product/delete-one -> Delete one product
router.delete('/delete-one', verifyAccessToken, verifyAdminAccessToken, deleteOneProductController);

export default router;
