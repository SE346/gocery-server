import { Router } from 'express';
import {
  getAllCategoryController,
  addOneCategoryController,
  updateOneCategoryController,
  deleteOneCategoryController,
} from '../controllers/category.controlller';

import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';

const router: Router = Router();

// [GET] /category/get-all -> Get all category
router.get('/get-all', getAllCategoryController);

// [POST] /category/add -> Add new category
router.post('/add', verifyAccessToken, verifyAdminAccessToken, addOneCategoryController);

// [POST] /category/{categoryId} -> Update one category
router.post('/:categoryId', verifyAccessToken, verifyAdminAccessToken, updateOneCategoryController);

// [DELETE] /category/{categoryId} -> Delete one category
router.delete(
  '/:categoryId',
  verifyAccessToken,
  verifyAdminAccessToken,
  deleteOneCategoryController
);

export default router;
