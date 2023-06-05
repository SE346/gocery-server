import { Router } from 'express';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';
import { statisticController } from '../controllers/statistic.controller';

const router: Router = Router();

// [GET] /statictis -> Get all user
router.get('/', verifyAccessToken, verifyAdminAccessToken, statisticController);

export default router;
