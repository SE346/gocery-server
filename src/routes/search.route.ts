import { Router } from 'express';
import { verifyAccessToken } from '../utils/jwt_service';
import { searchForProductController } from '../controllers/search.controller';

const router: Router = Router();

// [GET] /search -> Search for product
router.get('/', verifyAccessToken, searchForProductController);

export default router;
