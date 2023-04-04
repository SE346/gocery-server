import { Router } from 'express';
import {
  getAllProductBelongToCategoryController,
  addOneProductController,
} from '../controllers/product.controller';

const router: Router = Router();

// [GET] /product/get-product-of-category -> Get all product belong to a category
router.get('/get-product-of-category', getAllProductBelongToCategoryController);

// [POST] /product/add-one -> Add one product
router.post('/add-one', addOneProductController);

export default router;
