import { Router } from 'express';
import {
  getAllUserController,
  getUserInfoController,
  updateAvatarController,
  updateUserInfoController,
} from '../controllers/user.controller';
import { verifyAccessToken, verifyAdminAccessToken } from '../utils/jwt_service';

const router: Router = Router();

// [GET] /user/get-all -> Get all user
router.get('/get-all', verifyAccessToken, verifyAdminAccessToken, getAllUserController);

// [GET] /user/get-info -> Get user info
router.get('/get-info', verifyAccessToken, getUserInfoController);

// [POST] /user/update-avatar -> Update avatar
router.post('/update-avatar', verifyAccessToken, updateAvatarController);

// [POST] /user/update-info -> Update info
router.post('/update-info', verifyAccessToken, updateUserInfoController);

export default router;
