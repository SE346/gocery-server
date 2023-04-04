import { Router } from 'express';
import { getAllProductBelongToCategoryController } from '../controllers/product.controller';

const router: Router = Router();

// [GET] /product/get-product-of-category -> Get all product belong to a category
router.get('/get-product-of-category', getAllProductBelongToCategoryController);

export default router;
