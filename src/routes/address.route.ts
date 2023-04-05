import { Router } from 'express';
import {
  getAllAddressBelongToUserController,
  addNewAddressController,
} from '../controllers/address.controller';
import { verifyAccessToken } from '../utils/jwt_service';

const router: Router = Router();

// [GET] /address/get-all -> Get all address belong to user
router.get('/get-all', verifyAccessToken, getAllAddressBelongToUserController);

// [POST] /address/add -> Create new address
router.post('/add', verifyAccessToken, addNewAddressController);

export default router;
