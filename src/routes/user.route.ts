import { Router } from 'express';
import {
  getAllUserController,
  updateAvatarController,
  updateUserInfoController,
} from '../controllers/user.controller';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';

const router: Router = Router();

// [GET] /user/get-all -> Get all user
router.get('/get-all', verifyAccessToken, verifyAdminAccessToken, getAllUserController);

// [POST] /user/update-avatar -> Update avatar
router.post('/update-avatar', verifyAccessToken, updateAvatarController);

// [POST] /user/update-info -> Update info
router.post('/update-info', verifyAccessToken, updateUserInfoController);

export default router;
