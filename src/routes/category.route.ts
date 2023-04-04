import { Router } from 'express';
import {
  getAllCategoryController,
  updateOneCategoryController,
} from '../controllers/category.controlller';

const router: Router = Router();

// [GET] /category/get-all -> Get all category
router.get('/get-all', getAllCategoryController);

// [POST] /category/update-one -> Update one category
router.post('/update-one', updateOneCategoryController);

export default router;
