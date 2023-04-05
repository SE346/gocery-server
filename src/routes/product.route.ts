import { Router } from 'express';
import {
  getAllProductBelongToCategoryController,
  addOneProductController,
  updateOneProductController,
  deleteOneProductController,
} from '../controllers/product.controller';

const router: Router = Router();

// [GET] /product/get-product-of-category -> Get all product belong to a category
router.get('/get-product-of-category', getAllProductBelongToCategoryController);

// [POST] /product/add-one -> Add one product
router.post('/add-one', addOneProductController);

// [POST] /product/update-one -> Update one product
router.post('/update-one', updateOneProductController);

// [DELETE] /product/delete-one -> Delete one product
router.delete('/delete-one', deleteOneProductController);

export default router;
