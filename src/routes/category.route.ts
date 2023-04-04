import { Router } from 'express';
import {
  getAllCategoryController,
  updateOneCategoryController,
  deleteOneCategoryController,
} from '../controllers/category.controlller';

const router: Router = Router();

// [GET] /category/get-all -> Get all category
router.get('/get-all', getAllCategoryController);

// [POST] /category/update-one -> Update one category
router.post('/update-one', updateOneCategoryController);

// [DELETE] /category/delete-one -> Delete one category
router.delete('/delete-one', deleteOneCategoryController);

export default router;
