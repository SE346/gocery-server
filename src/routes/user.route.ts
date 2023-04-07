import { Router } from 'express';
import { getAllUserController, updateAvatarController } from '../controllers/user.controller';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';

const router: Router = Router();

// [GET] /user/get-all -> Get all user
router.get('/get-all', verifyAccessToken, verifyAdminAccessToken, getAllUserController);

// [GET] /user/update-avatar -> Update avatar
router.post('/update-avatar', verifyAccessToken, updateAvatarController);

export default router;
