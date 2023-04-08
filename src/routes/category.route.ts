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

// [POST] /category/add-one -> Add one categort
router.post('/add-one', verifyAccessToken, verifyAdminAccessToken, addOneCategoryController);

// [POST] /category/update-one -> Update one category
router.post('/update-one', verifyAccessToken, verifyAdminAccessToken, updateOneCategoryController);

// [DELETE] /category/delete-one -> Delete one category
router.delete(
  '/delete-one',
  verifyAccessToken,
  verifyAdminAccessToken,
  deleteOneCategoryController
);

export default router;
