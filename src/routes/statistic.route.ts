import { Router } from 'express';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';
import {
  statisticController,
  statisticDeprecatedController,
} from '../controllers/statistic.controller';

const router: Router = Router();

// [GET] /statictis -> Get statisctic (Deprecated)
router.get('/deprecated', verifyAccessToken, verifyAdminAccessToken, statisticDeprecatedController);

// [GET] /statictis -> Get statisctic
router.post('/', verifyAccessToken, verifyAdminAccessToken, statisticController);

export default router;
