import { Router } from 'express';
import { verifyAccessToken } from '../utils/jwt_service';
import {
  searchForProductController,
  searchInCategoryController,
} from '../controllers/search.controller';

const router: Router = Router();

// [GET] /search -> Search for product
router.get('/', verifyAccessToken, searchForProductController);

// [GET] /search/{categoryId} -> Search in category
router.get('/:categoryId', verifyAccessToken, searchInCategoryController);

export default router;
