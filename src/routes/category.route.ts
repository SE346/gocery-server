import { Router } from 'express';
import { getAllCategoryController } from '../controllers/category.controlller';

const router: Router = Router();

// [GET] /category/get-all -> Get all category
router.get('/get-all', getAllCategoryController);

export default router;
