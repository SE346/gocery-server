import { Router } from 'express';
import { getAllAddressBelongToUser } from '../controllers/address.controller';
import { verifyAccessToken } from '../utils/jwt_service';

const router: Router = Router();

// [GET] /address/get-all -> Get all address belong to user
router.get('/get-all', verifyAccessToken, getAllAddressBelongToUser);

export default router;
