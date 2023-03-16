import { Router } from 'express';
import {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
} from '../controllers/auth.controller';
import { verifyAccessToken } from '../utils/jwt_service';

const router: Router = Router();

// [POST] /auth/register -> create new user
router.post('/register', registerController);

// [POST] /auth/login -> user login
router.post('/login', loginController);

// [DELETE] /auth/login -> user logout
router.delete('/logout', verifyAccessToken, logoutController);

// [POST] /auth/refresh-token
router.post('/refresh-token', refreshTokenController);

export default router;
